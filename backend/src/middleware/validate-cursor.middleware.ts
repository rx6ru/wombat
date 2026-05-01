import { z } from 'zod';
import type { NextFunction, Request, Response } from 'express';

const cursorSchema = z.object({
  cursor: z.string().optional().nullable(),
});

export function validateCursor(req: Request, res: Response, next: NextFunction) {
  try {
    cursorSchema.parse(req.query);
    next();
  } catch {
    return res.status(400).json({ error: 'Invalid cursor' });
  }
}
