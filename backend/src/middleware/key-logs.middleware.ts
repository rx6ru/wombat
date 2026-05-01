import type { NextFunction, Request, Response } from 'express';
import { findProfileByAuthId } from '../modules/profile/profile.repository.js';

async function logKeyAction(action: string, req: Request) {
  try {
    const authId = req.user?.sub;
    if (!authId) {
      console.log(`KEY_LOG: Anonymous user Attempted to ${action} a key`);
      return;
    }

    const profile = await findProfileByAuthId(authId);
    const identifier = profile?.email ?? `user with id ${authId}`;
    console.log(`KEY_LOG: ${identifier} Attempted to ${action} a key`);
  } catch (error) {
    console.error('Error in key logging middleware:', error);
    if (req.user?.sub) {
      console.log(`KEY_LOG: user with id ${req.user.sub} Attempted to ${action} a key`);
    }
  }
}

export async function keyOnlyFetchLog(req: Request, res: Response, next: NextFunction) {
  await logKeyAction('Fetch Only', req);
  next();
}

export async function keyAddedLog(req: Request, res: Response, next: NextFunction) {
  await logKeyAction('ADD', req);
  next();
}

export async function keyUpdatedLog(req: Request, res: Response, next: NextFunction) {
  await logKeyAction('UPDATE', req);
  next();
}

export async function keyDeletedLog(req: Request, res: Response, next: NextFunction) {
  await logKeyAction('DELETE', req);
  next();
}
