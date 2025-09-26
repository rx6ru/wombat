import type { Request } from "express";

declare module "express" {
  interface Request {
    user?: {
      sub: string;          // Supabase JWT subject (user id)
    };
  }
}
