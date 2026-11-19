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
];

const logger = pino({
  level: isTest ? "silent" : process.env.LOG_LEVEL || (isProduction ? "info" : "debug"),
  redact: {
    paths: redactPaths,
    censor: "[REDACTED]",
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

