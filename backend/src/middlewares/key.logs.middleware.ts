
import type { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  user?: any;
}

const keyAddedLog = async (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log(`KEY_LOG: ${req.user.email} Attempted to ADD a key`);
    next();
}

const keyUpdatedLog = async (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log(`KEY_LOG: ${req.user.email} Attempted to UPDATE a key`);
    next();
}

const keyDeletedLog = async (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log(`KEY_LOG: ${req.user.email} Attempted to DELETE a key`);
    next();
}

export { keyAddedLog, keyUpdatedLog, keyDeletedLog };