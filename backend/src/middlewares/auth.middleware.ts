// import { expressjwtSecret } from "express-jwt";
import { jwtVerify, createRemoteJWKSet } from "jose";
import type { Request, Response, NextFunction } from "express";
import {config} from "../config/env.config.js";

const JWKS_URL = config.supabase.jwks_url;
const JWKS = createRemoteJWKSet(new URL(JWKS_URL));

interface AuthRequest extends Request {
  user?: any;
}

export async function protectRoute(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Invalid token format" });

    const { payload } = await jwtVerify(token, JWKS, {
      algorithms: ["ES256"]
    });

    req.user = payload;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: "Unauthorized", details: err });
  }
}
