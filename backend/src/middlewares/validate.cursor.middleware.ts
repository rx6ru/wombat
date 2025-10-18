import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

export const validateCursor = (req: Request, res: Response, next: NextFunction) => {
  const schema = z.object({
    cursor: z.string().optional().nullable(),
  });

  try {
    schema.parse(req.query);
    next();
  } catch (err: any) {
    return res.status(400).json({ error: "Invalid cursor" });
  }
};
