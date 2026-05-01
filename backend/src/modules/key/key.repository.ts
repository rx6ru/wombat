import { Prisma } from '../../generated/prisma/client.js';
import prisma from '../../infrastructure/prisma/prisma.client.js';

export const KEY_METADATA_SELECT = {
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

export const KEY_ONLY_SELECT = {
  key: true,
  userId: true,
} as const;

export const KEY_OWNER_SELECT = {
  userId: true,
} as const;

export const KEY_PAGE_LIMIT = 10;

export function findKeysByUserId(userId: string, cursor?: string) {
  return prisma.apiKey.findMany({
    where: { userId },
    take: KEY_PAGE_LIMIT + 1,
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : 0,
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    select: KEY_METADATA_SELECT,
  });
}

export function searchKeysByUserId(userId: string, query: string, cursor?: string) {
  return prisma.apiKey.findMany({
    where: {
      userId,
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { service: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    },
    take: KEY_PAGE_LIMIT + 1,
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : 0,
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    select: KEY_METADATA_SELECT,
  });
}

export function findKeyById(id: string) {
  return prisma.apiKey.findUnique({
    where: { id },
    select: KEY_ONLY_SELECT,
  });
}

export function findKeyOwnerById(id: string) {
  return prisma.apiKey.findUnique({
    where: { id },
    select: KEY_OWNER_SELECT,
  });
}

export function createKeyRecord(data: {
  userId: string;
  name: string;
  service?: string;
  key: string;
  reqSample?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
  resSample?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
  description?: string;
  isActive?: boolean;
}) {
  return prisma.apiKey.create({
    data,
    select: KEY_METADATA_SELECT,
  });
}

export function updateKeyRecord(
  id: string,
  data: {
    name?: string;
    service?: string;
    key?: string;
    reqSample?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
    resSample?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
    description?: string;
    isActive?: boolean;
  },
) {
  return prisma.apiKey.update({
    where: { id },
    data,
    select: KEY_METADATA_SELECT,
  });
}

export function deleteKeyRecord(id: string) {
  return prisma.apiKey.delete({ where: { id } });
}
