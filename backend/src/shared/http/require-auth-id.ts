import type { Request } from 'express';
import { UnauthorizedError } from '../errors/app-error.js';

export function requireAuthId(req: Request): string {
  const authId = req.user?.sub;
  if (!authId) {
    throw new UnauthorizedError('Unauthorized');
  }
  return authId;
}
