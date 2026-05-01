import { z } from 'zod';
import { Prisma } from '../../generated/prisma/client.js';
import { NotFoundError, ValidationError } from '../../shared/errors/app-error.js';
import { decryptKeyForUser, encryptKeyForUser } from '../encryption/encryption.service.js';
import { getProfileIdOrThrow } from '../profile/profile.service.js';
import {
  createKeyRecord,
  deleteKeyRecord,
  findKeyById,
  findKeyOwnerById,
  findKeysByUserId,
  KEY_PAGE_LIMIT,
  searchKeysByUserId,
  updateKeyRecord,
} from './key.repository.js';
import { ApiKeySchema, type ApiKeyInput } from './key.schemas.js';

async function validateKeyInput(input: unknown, partial = false): Promise<Partial<ApiKeyInput>> {
  const schema = partial ? ApiKeySchema.partial() : ApiKeySchema;
  const parsed = await schema.safeParseAsync(input);

  if (!parsed.success) {
    throw new ValidationError('Validation failed', z.treeifyError(parsed.error));
  }

  return parsed.data as Partial<ApiKeyInput>;
}

function toPaginatedResponse<T extends { id: string }>(items: T[]) {
  const hasMore = items.length > KEY_PAGE_LIMIT;
  const data = items.slice(0, KEY_PAGE_LIMIT);
  const nextCursor = hasMore ? data[data.length - 1]?.id ?? null : null;

  return {
    data,
    nextCursor,
    hasMore,
  };
}

function toNullableJson(value: unknown) {
  if (value === undefined) {
    return undefined;
  }

  return value === null ? Prisma.JsonNull : value;
}

async function assertOwnedKey(profileId: string, keyId: string) {
  const existing = await findKeyOwnerById(keyId);
  if (!existing || existing.userId !== profileId) {
    throw new NotFoundError('Key not found');
  }
}

export async function getKeysDetails(authId: string, cursor?: string) {
  const profileId = await getProfileIdOrThrow(authId);
  const keys = await findKeysByUserId(profileId, cursor);
  return toPaginatedResponse(keys);
}

export async function searchKeys(authId: string, rawQuery: string, cursor?: string) {
  const profileId = await getProfileIdOrThrow(authId);
  const query = rawQuery.trim();

  if (!query) {
    throw new ValidationError('Missing search query');
  }

  const keys = await searchKeysByUserId(profileId, query, cursor);
  return toPaginatedResponse(keys);
}

export async function fetchKey(authId: string, keyId?: string) {
  if (!keyId) {
    throw new ValidationError('Missing key id');
  }

  const profileId = await getProfileIdOrThrow(authId);
  const key = await findKeyById(keyId);

  if (!key || key.userId !== profileId) {
    throw new NotFoundError('Key not found');
  }

  const decryptedKey = await decryptKeyForUser(profileId, key.key);
  return { key: decryptedKey };
}

export async function addKey(authId: string, payload: unknown) {
  const validatedInput = (await validateKeyInput(payload)) as ApiKeyInput;
  const profileId = await getProfileIdOrThrow(authId);
  const { key, reqSample, resSample, ...rest } = validatedInput;

  const encryptedKey = await encryptKeyForUser(profileId, key);

  return createKeyRecord({
    userId: profileId,
    key: encryptedKey,
    ...rest,
    reqSample: toNullableJson(reqSample),
    resSample: toNullableJson(resSample),
  });
}

export async function updateKey(authId: string, keyId: string | undefined, payload: unknown) {
  if (!keyId) {
    throw new ValidationError('Missing key id');
  }

  const profileId = await getProfileIdOrThrow(authId);
  await assertOwnedKey(profileId, keyId);

  const validatedInput = await validateKeyInput(payload, true);
  if (Object.keys(validatedInput).length === 0) {
    throw new ValidationError('No update fields provided');
  }

  const { key, reqSample, resSample, ...rest } = validatedInput;
  const updateData: {
    name?: string;
    service?: string;
    key?: string;
    reqSample?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
    resSample?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
    description?: string;
    isActive?: boolean;
  } = {
    ...rest,
    reqSample: toNullableJson(reqSample),
    resSample: toNullableJson(resSample),
  };

  if (key) {
    updateData.key = await encryptKeyForUser(profileId, key);
  }

  return updateKeyRecord(keyId, updateData);
}

export async function deleteKey(authId: string, keyId?: string) {
  if (!keyId) {
    throw new ValidationError('Missing key id');
  }

  const profileId = await getProfileIdOrThrow(authId);
  await assertOwnedKey(profileId, keyId);
  await deleteKeyRecord(keyId);
}
