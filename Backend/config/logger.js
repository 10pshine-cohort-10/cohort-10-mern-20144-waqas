import crypto from "node:crypto";
import pino from "pino";
import pinoHttp from "pino-http";

const env = process.env.NODE_ENV || "development";
const isProduction = env === "production";
const isTest = env === "test";

const transport =
  !isProduction && !isTest
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      }
    : undefined;

const redactPaths = [
  "req.headers.authorization",
  "req.headers.cookie",
  "res.headers[\"set-cookie\"]",
  "password",
  "confirmPassword",
  "token",
  "accessToken",
  "refreshToken",
  "*.password",
  "*.confirmPassword",
  "*.token",
  "*.accessToken",
  "*.refreshToken",
  "*.content",
  "err.body",
];

/**
 * @typedef {Error & {
 *   type?: string;
 *   body?: string;
 *   status?: number;
 *   statusCode?: number;
 *   [key: string]: unknown;
 * }} JsonParseErrorLike
 */

/**
 * Detects whether an error represents a JSON parsing failure.
 *
 * @param {unknown} err - Error object to inspect.
 * @returns {err is JsonParseErrorLike} True if error is from JSON parser.
 */
export function isJsonParseError(err) {
  if (!err || typeof err !== "object") return false;
  const candidate = /** @type {Record<string, unknown>} */ (err);
  return Boolean(
    candidate.type === "entity.parse.failed" ||
    (err instanceof SyntaxError && (
      "body" in candidate ||
      candidate.status === 400 ||
      candidate.statusCode === 400
    )) ||
    (err instanceof SyntaxError && typeof err.message === "string" && (
      err.message.includes("JSON") ||
      err.message.includes("Unexpected token")
    ))
  );
}

/**
 * Sanitizes JSON parser errors by redacting any raw JSON source text
 * that Node 20+ V8 JSON.parse may embed in `err.message` and `err.stack`.
 * Does not mutate the original error object.
 *
 * @param {JsonParseErrorLike | Error} err - Original JSON parse error.
 * @returns {JsonParseErrorLike | Error} Sanitized error safe for logging.
 */
export function sanitizeJsonParseError(err) {
  if (!isJsonParseError(err)) return err;

  const rawMessage = typeof err.message === "string" ? err.message : "Invalid JSON payload";

  // Redact token content if present: `Unexpected token '...'`
  let safeMessage = rawMessage.replace(/Unexpected token (?:'[^']*'|"[^"]*"|[^,]+),\s*/gis, "Unexpected token '[REDACTED]', ");

  // Redact any JSON source snippet in Node 20+ error messages before "is not valid JSON",
  // including multiline, leading-truncated (..."), trailing-truncated ("...), or both (... "...).
  safeMessage = safeMessage.replace(/(?:\.\.\.)?(?:".*"|'.*')(?:\.\.\.)?\s+is not valid JSON/gis, '"[REDACTED]" is not valid JSON');

  if (safeMessage.includes("is not valid JSON") && !safeMessage.includes('"[REDACTED]" is not valid JSON')) {
    safeMessage = safeMessage.replace(/.*?\s+is not valid JSON/gis, '"[REDACTED]" is not valid JSON');
  }

  // Redact raw request body if attached to error or present in message
  if (typeof err.body === "string" && err.body.length > 0) {
    safeMessage = safeMessage.replaceAll(err.body, "[REDACTED]");
  }

  let safeStack = undefined;
  if (typeof err.stack === "string") {
    const atIndex = err.stack.indexOf("\n    at ");
    if (atIndex !== -1) {
      safeStack = `${err.name || "SyntaxError"}: ${safeMessage}${err.stack.slice(atIndex)}`;
    } else {
      safeStack = `${err.name || "SyntaxError"}: ${safeMessage}`;
    }

    safeStack = safeStack.replace(/Unexpected token (?:'[^']*'|"[^"]*"|[^,]+),\s*/gis, "Unexpected token '[REDACTED]', ");
    safeStack = safeStack.replace(/(?:\.\.\.)?(?:".*"|'.*')(?:\.\.\.)?\s+is not valid JSON/gis, '"[REDACTED]" is not valid JSON');
    if (safeStack.includes("is not valid JSON") && !safeStack.includes('"[REDACTED]" is not valid JSON')) {
      safeStack = safeStack.replace(/.*?\s+is not valid JSON/gis, '"[REDACTED]" is not valid JSON');
    }
    if (typeof err.body === "string" && err.body.length > 0) {
      safeStack = safeStack.replaceAll(err.body, "[REDACTED]");
    }
  }

  const sanitized = Object.create(Object.getPrototypeOf(err));
  Object.assign(sanitized, err);
  sanitized.message = safeMessage;
  if (safeStack !== undefined) {
    sanitized.stack = safeStack;
  }

  return sanitized;
}

const logger = pino({
  level: isTest ? "silent" : process.env.LOG_LEVEL || (isProduction ? "info" : "debug"),
  redact: {
    paths: redactPaths,
    censor: "[REDACTED]",
  },
  serializers: {
    /**
     * @param {unknown} err - The error object to serialize.
     * @returns {import("pino").SerializedError} Serialized error representation.
     */
    err: (err) => {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      const target = isJsonParseError(errorObj) ? sanitizeJsonParseError(errorObj) : errorObj;
      return pino.stdSerializers.err(target);
    },
  },
  ...(transport ? { transport } : {}),
});

/**
 * Sanitizes URLs to prevent exposure of sensitive tokens in path segments and query parameters.
 *
 * @param {string} rawUrl - Raw URL or path from incoming HTTP request.
 * @returns {string} Sanitized URL safe for logging.
 */
export function sanitizeUrl(rawUrl) {
  if (typeof rawUrl !== "string" || !rawUrl.trim()) return rawUrl;

  try {
    const dummyBase = "http://localhost";
    const parsed = new URL(rawUrl, dummyBase);

    // 1. Redact token-bearing path segments
    parsed.pathname = parsed.pathname.replace(
      /(\/(?:verify-reset-token|reset-password|verify-email|confirm-email)\/)[^/?#]+/gi,
      (match, prefix) => prefix + "[REDACTED]",
    );

    // 2. Redact sensitive query parameters
    const sensitiveParamPattern =
      /^(token|reset_?token|verification_?token|access_?token|refresh_?token|secret|password)$/i;

    for (const key of Array.from(parsed.searchParams.keys())) {
      if (sensitiveParamPattern.test(key)) {
        parsed.searchParams.set(key, "[REDACTED]");
      }
    }

    const search = parsed.search
      ? parsed.search.replace(/%5BREDACTED%5D/g, "[REDACTED]")
      : "";
    const hash = parsed.hash || "";

    if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
      return `${parsed.origin}${parsed.pathname}${search}${hash}`;
    }
    return `${parsed.pathname}${search}${hash}`;
  } catch {
    return rawUrl
      .replace(
        /(\/(?:verify-reset-token|reset-password|verify-email|confirm-email)\/)[^/?#]+/gi,
        (match, prefix) => prefix + "[REDACTED]",
      )
      .replace(
        /([?&](?:token|reset_?token|verification_?token|access_?token|refresh_?token|secret|password)=)[^&#]*/gi,
        "$1[REDACTED]",
      );
  }
}

const httpLogger = pinoHttp({
  logger,
  genReqId: (req) => req.headers["x-request-id"] || crypto.randomUUID(),
  customLogLevel: (_req, res, err) => {
    if (err || res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  customProps: (req) => ({
    userId: req.user?.id || null,
  }),
  serializers: {
    req: (req) => ({
      id: req.id,
      method: req.method,
      url: sanitizeUrl(req.url),
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
});

export { logger, httpLogger };
