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
      url: req.url,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
});

export { logger, httpLogger };

