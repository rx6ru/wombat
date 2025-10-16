import { ApiKeySchema } from "../models/apiKey.model.js";
import type { Request, Response } from "express";
import prisma from "../config/prisma.config.js";
import { z } from "zod";
import { Prisma } from "../generated/prisma/client.js";

type ApiKeyValidatedData = z.infer<typeof ApiKeySchema>;

const KEY_SELECT = {
  id: true,
  name: true,
  service: true,
  key: true,
  reqSample: true,
  resSample: true,
  description: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

class ValidationError extends Error {
  status = 400;
  details?: any;

  constructor(message: string, details?: any) {
    super(message);
    this.details = details;
  }
}

async function keySchemaValidation(
  key: unknown,
  partial = false
): Promise<Partial<ApiKeyValidatedData>> {
  const schema = partial ? ApiKeySchema.partial() : ApiKeySchema;

  const parsed = await schema.safeParseAsync(key);
  if (!parsed.success) {
    const errTree = z.treeifyError(parsed.error);
    throw new ValidationError("Validation failed", errTree);
  }

  return parsed.data as Partial<ApiKeyValidatedData>;
}

async function getProfileId(authId: string) {
  const profile = await prisma.profile.findUnique({
    where: { authId },
    select: { id: true },
  });

  if (!profile) throw new ValidationError("Profile not found for this user");
  return profile.id;
}


export const getKeys = async (req: Request, res: Response) => {
  try {
    const authId = req.user?.sub;
    if (!authId) return res.status(401).json({ error: "Unauthorized" });

    const profileId = await getProfileId(authId);
    const keys = await prisma.apiKey.findMany({
      where: { userId: profileId },
      select: KEY_SELECT,
    });

    return res.status(200).json(keys);
  } catch (err: any) {
    console.error("GET_KEYS_ERROR:", err);
    return res
      .status(err.status ?? 500)
      .json({ error: err.message ?? "Server error", details: err.details });
  }
};

export const addKey = async (req: Request, res: Response) => {
  try {
    const validatedInput = (await keySchemaValidation(
      req.body
    )) as ApiKeyValidatedData;

    const authId = req.user?.sub;
    if (!authId) return res.status(401).json({ error: "Unauthorized" });

    const profileId = await getProfileId(authId);
    const { reqSample, resSample, ...rest } = validatedInput;

    const key = await prisma.apiKey.create({
      data: {
        userId: profileId,
        ...rest,
        reqSample:
          reqSample === undefined
            ? undefined
            : reqSample === null
            ? Prisma.JsonNull
            : reqSample,
        resSample:
          resSample === undefined
            ? undefined
            : resSample === null
            ? Prisma.JsonNull
            : resSample,
      },
      select: KEY_SELECT,
    });

    return res.status(201).json(key);
  } catch (err: any) {
    console.error("ADD_KEY_ERROR:", err);
    return res
      .status(err.status ?? 500)
      .json({ error: err.message ?? "Server error", details: err.details });
  }
};

export const updateKey = async (req: Request, res: Response) => {
  try {
    const authId = req.user?.sub;
    if (!authId) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Missing key id" });

    const profileId = await getProfileId(authId);
    const existing = await prisma.apiKey.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing || existing.userId !== profileId)
      return res.status(404).json({ error: "Key not found" });

    const validatedInput = await keySchemaValidation(req.body, true);
    if (Object.keys(validatedInput).length === 0)
      throw new ValidationError("No update fields provided");

    const { reqSample, resSample, ...rest } = validatedInput;

    const updateData = {
      ...rest,
      reqSample:
        reqSample === undefined
          ? undefined
          : reqSample === null
          ? Prisma.JsonNull
          : reqSample,
      resSample:
        resSample === undefined
          ? undefined
          : resSample === null
          ? Prisma.JsonNull
          : resSample,
    };

    const key = await prisma.apiKey.update({
      where: { id },
      data: updateData,
      select: KEY_SELECT,
    });

    return res.status(200).json(key);
  } catch (err: any) {
    console.error("UPDATE_KEY_ERROR:", err);
    return res
      .status(err.status ?? 500)
      .json({ error: err.message ?? "Server error", details: err.details });
  }
};

export const deleteKey = async (req: Request, res: Response) => {
  try {
    const authId = req.user?.sub;
    if (!authId) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Missing key id" });

    const profileId = await getProfileId(authId);
    const existing = await prisma.apiKey.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing || existing.userId !== profileId)
      return res.status(404).json({ error: "Key not found" });

    await prisma.apiKey.delete({ where: { id } });
    return res.status(204).json({
      message: "Key deleted successfully",
    });
  } catch (err: any) {
    console.error("DELETE_KEY_ERROR:", err);
    return res
      .status(err.status ?? 500)
      .json({ error: err.message ?? "Server error", details: err.details });
  }
};
