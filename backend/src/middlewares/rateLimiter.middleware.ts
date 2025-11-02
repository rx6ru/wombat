import { Ratelimit, type Duration } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { Request, Response, NextFunction } from "express";
import { config } from "../config/env.config.js";

const redis = new Redis({
  url: config.redis.restUrl,
  token: config.redis.restToken,
});

export function createRateLimiter(limit: number, window: Duration) {
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, window),
    analytics: true,
  });

  return async function rateLimiter(req: Request, res: Response, next: NextFunction) {
    try {
      const identifier = (req.user?.sub ?? req.ip ?? "anonymous").toString();

      const { success, reset, remaining } = await limiter.limit(identifier);

      res.setHeader("X-RateLimit-Limit", limit.toString());
      res.setHeader("X-RateLimit-Remaining", remaining.toString());
      res.setHeader("X-RateLimit-Reset", reset.toString());

      if (!success) {
        return res.status(429).json({
          error: "Too many requests. Please wait before trying again.",
        });
      }

      next();
    } catch (err) {
      console.error("RATE_LIMIT_ERROR:", err);
      res.status(500).json({ error: "Internal rate limiter error" });
    }
  };
}
