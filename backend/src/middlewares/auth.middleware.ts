import { jwtVerify, createRemoteJWKSet } from "jose";
import type { Request, Response, NextFunction } from "express";
import {config} from "../config/env.config.js";

const JWKS_URL = config.supabase.jwks_url;
const JWKS = createRemoteJWKSet(new URL(JWKS_URL));


export async function protectRoute(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Invalid token format" });

    const { payload } = await jwtVerify(token, JWKS, {
      algorithms: ["ES256"]
    });

    req.user = {
      sub: payload.sub as string
    };
    
    console.log(`AUTH: ${JSON.stringify(req.user)} Authenticated`);

    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: "Unauthorized", details: err });
  }
}
