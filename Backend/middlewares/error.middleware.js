import {
  isJsonParseError,
  logger,
  sanitizeJsonParseError,
  sanitizeUrl,
} from "../config/logger.js";

export class ApiError extends Error {
  constructor(statusCode, message = "Something went wrong", errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    this.errors = errors;
  }
}

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export function notFoundHandler(req, _res, next) {
  const safeUrl = sanitizeUrl(req.originalUrl || req.url || "");
  next(new ApiError(404, `Route not found: ${req.method} ${safeUrl}`));
}

export function errorHandler(err, req, res, _next) {
  const isProduction = process.env.NODE_ENV === "production";
  const isApiError = err instanceof ApiError;

  let statusCode = 500;
  let message = "Internal server error";
  let errors = [];

  if (isApiError) {
    statusCode = err.statusCode || 400;
    message = err.message || "Something went wrong";
    errors = Array.isArray(err.errors) ? err.errors : [];
  } else if (err?.type === "entity.parse.failed" || (err instanceof SyntaxError && "body" in err)) {
    statusCode = 400;
    message = "Invalid JSON payload";
  } else if (err?.message === "Not allowed by CORS") {
    statusCode = 403;
    message = "Not allowed by CORS";
  } else if (err?.code === "23505") {
    statusCode = 409;
    message = "A record with this value already exists";
  } else if (err?.code === "ECONNREFUSED" || err?.code === "57P01") {
    statusCode = 503;
    message = "Database service is temporarily unavailable";
  } else {
    // Non-ApiError fallback
    statusCode =
      typeof err?.statusCode === "number" && err.statusCode >= 400 && err.statusCode < 600
        ? err.statusCode
        : 500;

    if (statusCode >= 500) {
      message = "Internal server error";
    } else {
      message = isProduction ? "Request could not be processed" : (err?.message || "Something went wrong");
    }
  }

  const isJsonError = isJsonParseError(err);
  const logErr = isJsonError ? sanitizeJsonParseError(err) : err;
  const logMessage = isJsonError
    ? (logErr.message || "Invalid JSON payload")
    : (err?.message || message);

  const rawUrl = req?.originalUrl || req?.url || "";
  const safeUrl = sanitizeUrl(rawUrl);

  logger.error(
    {
      err: logErr,
      method: req?.method,
      url: safeUrl,
      statusCode,
      errCode: err?.code,
    },
    logMessage,
  );

  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}
