import { ApiKeySchema } from "../models/apiKey.model.js";
import type { Request, Response } from "express";
import prisma from "../config/prisma.config.js";
import { z } from "zod";

const KEY_SELECT = {
    id: true,
    name: true,
    service: true,
    key: true,
    reqSample: true,
    resSample: true,
    description: true,
} as const;

class ValidationError extends Error {
    status = 400;
    details: any;
    constructor(message: string, details?: any) {
        super(message);
        this.details = details;
    }
}

const keySchemaValidation = async (key: unknown, partial = false) => {
    const schema = partial ? ApiKeySchema.partial() : ApiKeySchema;
    const parsed = await schema.safeParseAsync(key);
    if (!parsed.success) {
        const errTree = z.treeifyError(parsed.error);
        throw new ValidationError("Validation failed", errTree);
    }
    return parsed.data;
};

const getKeys = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)?.sub;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const keys = await prisma.apiKey.findMany({
            where: { userId },
            select: KEY_SELECT,
        });

        return res.status(200).json(keys);

    } catch (err) {
        if (err instanceof ValidationError) {
            return res.status(err.status).json({ error: err.message, details: err.details });
        }
        console.error(err);
        // Using 'err as any' to safely access message property, a common pattern
        return res.status(500).json({ error: "Server error", details: (err as any).message ?? undefined });
    }
};

const addKey = async (req: Request, res: Response) => {
    try {
        const validatedInput = await keySchemaValidation(req.body);
        const userId = (req.user as any)?.sub;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const key = await prisma.apiKey.create({
            data: { userId, ...validatedInput },
            select: KEY_SELECT,
        });

        return res.status(201).json(key);

    } catch (err) {
        if (err instanceof ValidationError) {
            return res.status(err.status).json({ error: err.message, details: err.details });
        }
        console.error(err);
        return res.status(500).json({ error: "Server error", details: (err as any).message ?? undefined });
    }
};

const updateKey = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)?.sub;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const { id } = req.params;
        if (!id) return res.status(400).json({ error: "Missing key id" });

        const existing = await prisma.apiKey.findUnique({
            where: { id },
            select: { userId: true },
        });

        if (!existing || existing.userId !== userId)
            return res.status(404).json({ error: "Key not found" });

        const validatedInput = await keySchemaValidation(req.body, true);

        const key = await prisma.apiKey.update({
            where: { id },
            data: validatedInput,
            select: KEY_SELECT,
        });

        return res.status(200).json(key);

    } catch (err) {
        if (err instanceof ValidationError) {
            return res.status(err.status).json({ error: err.message, details: err.details });
        }
        console.error(err);
        return res.status(500).json({ error: "Server error", details: (err as any).message ?? undefined });
    }
};

const deleteKey = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)?.sub;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const { id } = req.params;
        if (!id) return res.status(400).json({ error: "Missing key id" });

        const existing = await prisma.apiKey.findUnique({
            where: { id },
            select: { userId: true },
        });

        if (!existing || existing.userId !== userId)
            return res.status(404).json({ error: "Key not found" });

        await prisma.apiKey.delete({ where: { id } });

        return res.status(204).send();

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to delete API key", details: (err as any).message ?? undefined });
    }
};

export { getKeys, addKey, updateKey, deleteKey };