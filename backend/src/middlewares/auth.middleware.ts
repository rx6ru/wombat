import { jwtVerify, createRemoteJWKSet, errors } from "jose";
import type { Request, Response, NextFunction } from "express";
import { config } from "../config/env.config.js";

const JWKS = createRemoteJWKSet(new URL(config.supabase.jwksUrl));

export async function protectRoute(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Invalid token format" });

    const { payload } = await jwtVerify(token, JWKS, { algorithms: ["ES256"] });

    req.user = { sub: payload.sub as string };
    console.log(`AUTH: ${req.user.sub} authenticated`);
    next();
  } catch (err) {
    if (err instanceof errors.JWTExpired) {
      return res.status(401).json({ error: "Token expired", code: "TOKEN_EXPIRED" });
    }
    return res.status(401).json({ error: "Unauthorized", details: err instanceof Error ? err.message : 'Unknown error' });
  }
}
