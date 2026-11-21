import { ApiError } from "./error.middleware.js";

export function securityHeaders(_req, res, next) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-XSS-Protection", "0");
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");

  if (process.env.NODE_ENV === "production") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=15552000; includeSubDomains",
    );
  }

  next();
}

export function createAuthRateLimiter({
  windowMs = 15 * 60 * 1000,
  max = 25,
  skipInTest = true,
} = {}) {
  const hits = new Map();

  const sweepTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of hits) {
      if (now > record.resetTime) {
        hits.delete(key);
      }
    }
  }, windowMs);
  sweepTimer.unref();

  return (req, res, next) => {
    if (skipInTest && process.env.NODE_ENV === "test") {
      return next();
    }

    const key = req.ip || req.socket?.remoteAddress || "unknown";
    const now = Date.now();
    const record = hits.get(key);

    if (!record || now > record.resetTime) {
      hits.set(key, { count: 1, resetTime: now + windowMs });
      res.setHeader("RateLimit-Limit", String(max));
      res.setHeader("RateLimit-Remaining", String(Math.max(0, max - 1)));
      return next();
    }

    record.count += 1;
    const remaining = Math.max(0, max - record.count);
    res.setHeader("RateLimit-Limit", String(max));
    res.setHeader("RateLimit-Remaining", String(remaining));

    if (record.count > max) {
      const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader("Retry-After", String(Math.max(1, retryAfterSeconds)));
      return next(
        new ApiError(
          429,
          "Too many authentication requests. Please try again later.",
        ),
      );
    }

    return next();
  };
}
