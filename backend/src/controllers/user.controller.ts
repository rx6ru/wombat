import type { Request, Response } from "express";
import { generateRandomName } from "../utils/genrandom.username.js";
import prisma from "../config/prisma.config.js";


// Placeholder functions for completeness
const getUserInfo = async (req: Request, res: Response) => {
    console.log("getUserInfo");
    try {
        const user = req.body.user;
        

    } catch (error) {
        
    }
};

const updateUserInfo = async (req: Request, res: Response) => {
    console.log("updateUserInfo");
    res.status(200).json({ message: "updateUserInfo endpoint" });
};

export { getUserInfo, updateUserInfo };
