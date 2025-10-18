
// import type { Request, Response, NextFunction } from "express";
// import rateLimit from "express-rate-limit";
// import type { RateLimitRequestHandler } from "express-rate-limit";

// export const fetchKeyLimiter: RateLimitRequestHandler = rateLimit({
//   windowMs: 60 * 1000, // 1 minute
//   max: 5, // max 5 requests per window per user
//   standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
//   legacyHeaders: false, // Disable `X-RateLimit-*` headers

//   keyGenerator: (req: Request) => {
//     if (req.user?.sub) return req.user.sub;
//     if (req.ip) return req.ip;
//     return "anonymous"; // fallback
//   },

//   handler: (req: Request, res: Response) => {
//     console.warn(`Rate limit exceeded for ${req.user?.sub || req.ip}`);
//     res.status(429).json({
//       error: "Too many requests. Please try again later.",
//     });
//   },

// });
