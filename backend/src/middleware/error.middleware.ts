import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../shared/errors/app-error.js';

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: 'Not found' });
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: err.message,
      details: err.details,
    });
  }

  console.error('UNHANDLED_ERROR:', err);
  return res.status(500).json({ error: 'Server error' });
}
