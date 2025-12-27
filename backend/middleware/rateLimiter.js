const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for authenticated TGE endpoints
 * Limits requests per wallet address to prevent abuse
 */
const tgeRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 10, // 10 requests per minute per IP
  message: {
    success: false,
    error: 'Too many requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Use wallet address from authenticated user as key if available
  keyGenerator: (req) => {
    return req.user?.wallet || req.ip;
  }
});

/**
 * Stricter rate limiter for high-value operations (execute, claim)
 */
const strictRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 3, // 3 requests per minute
  message: {
    success: false,
    error: 'Too many requests for this operation. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user?.wallet || req.ip;
  }
});

/**
 * Public endpoint rate limiter
 */
const publicRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 100, // 100 requests per minute per IP
  message: {
    success: false,
    error: 'Too many requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  tgeRateLimiter,
  strictRateLimiter,
  publicRateLimiter
};
