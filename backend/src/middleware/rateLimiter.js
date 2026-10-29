import rateLimit from 'express-rate-limit';

/**
 * Factory to create rate-limiting middleware for sensitive authentication endpoints.
 *
 * @param {Object} [customOptions] - Custom configuration overrides
 * @returns {Function} Express rate limit middleware
 */
export const createAuthLimiter = (customOptions = {}) => {
  const windowMs =
    customOptions.windowMs ||
    (process.env.AUTH_RATE_LIMIT_WINDOW_MS
      ? parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS, 10)
      : 15 * 60 * 1000); // Default 15 minutes

  const limit =
    customOptions.limit !== undefined
      ? customOptions.limit
      : process.env.AUTH_RATE_LIMIT_MAX
      ? parseInt(process.env.AUTH_RATE_LIMIT_MAX, 10)
      : 10; // Default 10 requests per window

  return rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    statusCode: 429,
    validate: { xForwardedForHeader: false, default: true },
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        error: 'Too Many Requests',
        message: 'Too many authentication attempts from this IP address. Please try again after 15 minutes.',
      });
    },
    ...customOptions,
  });
};

/**
 * Standard rate limiter for public authentication endpoints (register and login).
 */
export const authLimiter = createAuthLimiter();

export default authLimiter;
