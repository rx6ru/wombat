import type { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma.config.js";

// A helper function to safely get user email and log the action
const logKeyAction = async (action: string, req: Request) => {
  try {
    const authId = req.user?.sub;
    if (!authId) {
      console.log(`KEY_LOG: Anonymous user Attempted to ${action} a key`);
      return;
    }

    const profile = await prisma.profile.findUnique({
      where: { authId },
      select: { email: true },
    });

    const identifier = profile?.email ?? `user with id ${authId}`;
    console.log(`KEY_LOG: ${identifier} Attempted to ${action} a key`);

  } catch (error) {
    console.error("Error in key logging middleware:", error);
    // Log with the user ID if the DB query fails
    if (req.user?.sub) {
      console.log(`KEY_LOG: user with id ${req.user.sub} Attempted to ${action} a key`);
    }
  }
};

const keyAddedLog = async (req: Request, res: Response, next: NextFunction) => {
    await logKeyAction("ADD", req);
    next();
}

const keyUpdatedLog = async (req: Request, res: Response, next: NextFunction) => {
    await logKeyAction("UPDATE", req);
    next();
}

const keyDeletedLog = async (req: Request, res: Response, next: NextFunction) => {
    await logKeyAction("DELETE", req);
    next();
}

export { keyAddedLog, keyUpdatedLog, keyDeletedLog };