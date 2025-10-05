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

// Helper to validate key schema
const keySchemaValidation = async (key: unknown, partial = false) => {
  const schema = partial ? ApiKeySchema.partial() : ApiKeySchema;
  const parsed = await schema.safeParseAsync(key);
  if (!parsed.success) {
    const errTree = z.treeifyError(parsed.error);
    throw new ValidationError("Validation failed", errTree);
  }
  return parsed.data;
};

// Helper to map Auth ID → Profile ID
const getProfileId = async (authId: string) => {
  const profile = await prisma.profile.findUnique({
    where: { authId },
    select: { id: true },
  });

  if (!profile) throw new Error("Profile not found for this user");
  return profile.id;
};


// CONTROLLERS------------------------------------------------------------------------------------------------------------------------


const getKeys = async (req: Request, res: Response) => {
  try {
    const authId = (req.user as any)?.sub;
    if (!authId) return res.status(401).json({ error: "Unauthorized" });

    const profileId = await getProfileId(authId);

    const keys = await prisma.apiKey.findMany({
      where: { userId: profileId },
      select: KEY_SELECT,
    });

    return res.status(200).json(keys);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message ?? "Server error" });
  }
};

const addKey = async (req: Request, res: Response) => {
  try {
    const validatedInput = await keySchemaValidation(req.body);
    const authId = (req.user as any)?.sub;
    if (!authId) return res.status(401).json({ error: "Unauthorized" });

    const profileId = await getProfileId(authId);

    const key = await prisma.apiKey.create({
      data: { userId: profileId, ...validatedInput },
      select: KEY_SELECT,
    });

    return res.status(201).json(key);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message ?? "Server error" });
  }
};

const updateKey = async (req: Request, res: Response) => {
  try {
    const authId = (req.user as any)?.sub;
    if (!authId) return res.status(401).json({ error: "Unauthorized" });

    const profileId = await getProfileId(authId);
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Missing key id" });

    const existing = await prisma.apiKey.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing || existing.userId !== profileId)
      return res.status(404).json({ error: "Key not found" });

    const validatedInput = await keySchemaValidation(req.body, true);

    const key = await prisma.apiKey.update({
      where: { id },
      data: validatedInput,
      select: KEY_SELECT,
    });

    return res.status(200).json(key);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message ?? "Server error" });
  }
};

const deleteKey = async (req: Request, res: Response) => {
  try {
    const authId = (req.user as any)?.sub;
    if (!authId) return res.status(401).json({ error: "Unauthorized" });

    const profileId = await getProfileId(authId);
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Missing key id" });

    const existing = await prisma.apiKey.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing || existing.userId !== profileId)
      return res.status(404).json({ error: "Key not found" });

    await prisma.apiKey.delete({ where: { id } });

    return res.status(204).send();
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message ?? "Server error" });
  }
};

export { getKeys, addKey, updateKey, deleteKey };
