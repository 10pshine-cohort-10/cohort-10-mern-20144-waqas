import { logger } from "../config/logger.js";

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
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(err, req, res, _next) {
  let statusCode = err?.statusCode || 500;
  let message = err?.message || "Something went wrong";
  const errors = Array.isArray(err?.errors) ? err.errors : [];

  if (err?.type === "entity.parse.failed" || (err instanceof SyntaxError && "body" in err)) {
    statusCode = 400;
    message = "Invalid JSON payload";
  } else if (message === "Not allowed by CORS") {
    statusCode = 403;
  } else if (err?.code === "23505") {
    statusCode = 409;
    message = "A record with this value already exists";
  } else if (err?.code === "ECONNREFUSED" || err?.code === "57P01") {
    statusCode = 503;
    message = "Database service is temporarily unavailable";
  }

  logger.error(
    {
      method: req?.method,
      url: req?.originalUrl,
      statusCode,
      errCode: err?.code,
    },
    message,
  );

  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}
