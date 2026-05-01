import prisma from '../../infrastructure/prisma/prisma.client.js';

export const profileSelect = {
  id: true,
  username: true,
  email: true,
  authId: true,
  updatedAt: true,
} as const;

export function findProfileByAuthId(authId: string) {
  return prisma.profile.findUnique({
    where: { authId },
    select: profileSelect,
  });
}

export function findProfileIdByAuthId(authId: string) {
  return prisma.profile.findUnique({
    where: { authId },
    select: { id: true },
  });
}

export function createProfile(data: { authId: string; username: string; email: string }) {
  return prisma.profile.create({ data });
}

export function updateProfileUsername(authId: string, username: string) {
  return prisma.profile.update({
    where: { authId },
    data: { username },
    select: { id: true, username: true, email: true, updatedAt: true },
  });
}
