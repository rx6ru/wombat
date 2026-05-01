import { PrismaClient } from '../../generated/prisma/client.js';
import { config } from '../config/env.js';

export const prisma = new PrismaClient({
  datasources: { db: { url: config.supabase.dbUrl } },
});

export default prisma;
