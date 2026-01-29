import rateLimit from "express-rate-limit";

export const gameHistoryLimiter = rateLimit({
  windowMs: 10 * 1000,
  max: 5, // max 5 requests per window per IP
  message: {error: "Too many requests, please slow down" },
  standardHeaders: true, // adds RateLimit-* headers 
  legacyHeaders: false
});