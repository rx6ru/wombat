import { ApiKeySchema } from "../models/apiKey.model.js";
import type { Request, Response } from "express";
import prisma from "../config/prisma.config.js";
import { z } from "zod";
import { Prisma } from "../generated/prisma/client.js";

type ApiKeyValidatedData = z.infer<typeof ApiKeySchema>;

const KEY_METADATA_SELECT = {
  id: true,
  name: true,
  service: true,
  reqSample: true,
  resSample: true,
  description: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

const KEY_ONLY_SELECT = {
  key: true,
  userId: true,
} as const;

const LIMIT = 10;

/* -------------------------------------------------------------------------- */
/*                                Error Classes                               */
/* -------------------------------------------------------------------------- */

class AppError extends Error {
  status: number;
  details?: any;
  constructor(message: string, status = 500, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, details);
  }
}

class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}

class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 401);
  }
}

/* -------------------------------------------------------------------------- */
/*                            Helper: Validation Logic                        */
/* -------------------------------------------------------------------------- */

async function keySchemaValidation(
  key: unknown,
  partial = false
): Promise<Partial<ApiKeyValidatedData>> {
  const schema = partial ? ApiKeySchema.partial() : ApiKeySchema;

  try {
    const parsed = await schema.safeParseAsync(key);

    if (!parsed.success) {
      const errTree = z.treeifyError(parsed.error);
      throw new ValidationError("Validation failed", errTree);
    }

    return parsed.data as Partial<ApiKeyValidatedData>;
  } catch (err: any) {
    if (err instanceof ValidationError) throw err;
    console.error("KEY_VALIDATION_RUNTIME_ERROR:", err);
    throw new ValidationError("Unexpected error during validation", {
      originalError: err.message ?? err,
    });
  }
}

/* -------------------------------------------------------------------------- */
/*                             Helper: Profile Fetch                          */
/* -------------------------------------------------------------------------- */

async function getProfileId(authId: string) {
  const profile = await prisma.profile.findUnique({
    where: { authId },
    select: { id: true },
  });

  if (!profile) throw new NotFoundError("Profile not found for this user");
  return profile.id;
}

/* -------------------------------------------------------------------------- */
/*                               Controllers                                  */
/* -------------------------------------------------------------------------- */

export const getKeysDetails = async (req: Request, res: Response) => {
  try {
    const authId = req.user?.sub;
    if (!authId) throw new UnauthorizedError("Unauthorized");

    const profileId = await getProfileId(authId);
    const cursor = req.query.cursor as string | undefined;

    const keys = await prisma.apiKey.findMany({
      where: { userId: profileId },
      take: LIMIT + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      select: KEY_METADATA_SELECT,
    });

    const hasMore = keys.length > LIMIT;
    const keysToReturn = keys.slice(0, LIMIT);
    const nextCursor = hasMore
      ? keysToReturn[keysToReturn.length - 1]?.id ?? null
      : null;

    return res.status(200).json({
      data: keysToReturn,
      nextCursor,
      hasMore,
    });
  } catch (err: any) {
    console.error("GET_KEYS_ERROR:", err);
    return res
      .status(err.status ?? 500)
      .json({ error: err.message ?? "Server error", details: err.details });
  }
};

// --------------------------------------------------------------------------

export const searchKeys = async (req: Request, res: Response) => {
  try {
    const authId = req.user?.sub;
    if (!authId) throw new UnauthorizedError("Unauthorized");

    const profileId = await getProfileId(authId);
    const query = (req.query.q as string || "").trim();
    const cursor = req.query.cursor as string | undefined;

    if (!query) throw new ValidationError("Missing search query");

    const keys = await prisma.apiKey.findMany({
      where: {
        userId: profileId,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { service: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: LIMIT + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      select: KEY_METADATA_SELECT,
    });

    const hasMore = keys.length > LIMIT;
    const keysToReturn = keys.slice(0, LIMIT);
    const nextCursor = hasMore
      ? keysToReturn[keysToReturn.length - 1]?.id ?? null
      : null;

    return res.status(200).json({
      data: keysToReturn,
      nextCursor,
      hasMore,
    });
  } catch (err: any) {
    console.error("SEARCH_KEYS_ERROR:", err);
    return res
      .status(err.status ?? 500)
      .json({ error: err.message ?? "Server error", details: err.details });
  }
};

// --------------------------------------------------------------------------

export const fetchKey = async (req: Request, res: Response) => {
  try {
    const authId = req.user?.sub;
    if (!authId) throw new UnauthorizedError("Unauthorized");

    const { id } = req.params;
    if (!id) throw new ValidationError("Missing key id");

    const profileId = await getProfileId(authId);

    const key = await prisma.apiKey.findUnique({
      where: { id },
      select: KEY_ONLY_SELECT,
    });

    if (!key || key.userId !== profileId)
      throw new NotFoundError("Key not found");

    return res.status(200).json({ key: key.key });
  } catch (err: any) {
    console.error("FETCH_KEY_ERROR:", err);
    return res
      .status(err.status ?? 500)
      .json({ error: err.message ?? "Server error", details: err.details });
  }
};

// --------------------------------------------------------------------------

export const addKey = async (req: Request, res: Response) => {
  try {
    const validatedInput = (await keySchemaValidation(
      req.body
    )) as ApiKeyValidatedData;

    const authId = req.user?.sub;
    if (!authId) throw new UnauthorizedError("Unauthorized");

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
      select: KEY_METADATA_SELECT,
    });

    return res.status(201).json(key);
  } catch (err: any) {
    console.error("ADD_KEY_ERROR:", err);
    return res
      .status(err.status ?? 500)
      .json({ error: err.message ?? "Server error", details: err.details });
  }
};

// --------------------------------------------------------------------------

export const updateKey = async (req: Request, res: Response) => {
  try {
    const authId = req.user?.sub;
    if (!authId) throw new UnauthorizedError("Unauthorized");

    const { id } = req.params;
    if (!id) throw new ValidationError("Missing key id");

    const profileId = await getProfileId(authId);
    const existing = await prisma.apiKey.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing || existing.userId !== profileId)
      throw new NotFoundError("Key not found");

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
      select: KEY_METADATA_SELECT,
    });

    return res.status(200).json(key);
  } catch (err: any) {
    console.error("UPDATE_KEY_ERROR:", err);
    return res
      .status(err.status ?? 500)
      .json({ error: err.message ?? "Server error", details: err.details });
  }
};

// --------------------------------------------------------------------------

export const deleteKey = async (req: Request, res: Response) => {
  try {
    const authId = req.user?.sub;
    if (!authId) throw new UnauthorizedError("Unauthorized");

    const { id } = req.params;
    if (!id) throw new ValidationError("Missing key id");

    const profileId = await getProfileId(authId);
    const existing = await prisma.apiKey.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing || existing.userId !== profileId)
      throw new NotFoundError("Key not found");

    await prisma.apiKey.delete({ where: { id } });

    return res.sendStatus(204); 
    
  } catch (err: any) {
    console.error("DELETE_KEY_ERROR:", err);
    return res
      .status(err.status ?? 500)
      .json({ error: err.message ?? "Server error", details: err.details });
  }
};
