import { PrismaClient } from "@prisma/client";
import { config } from "./env.config.js";

export const prisma = new PrismaClient({
  datasources: { db: { url: config.supabase.db_url } },
});

export default prisma;