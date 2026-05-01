import crypto from 'crypto';
import prisma from '../../infrastructure/prisma/prisma.client.js';

export async function findEncryptionSecretByUserId(userId: string): Promise<string | null> {
  const encryptionKey = await prisma.encryptionKey.findUnique({
    where: { userId },
    select: { encryptionKey: true },
  });

  return encryptionKey?.encryptionKey ?? null;
}

export async function createEncryptionSecret(userId: string): Promise<string> {
  const encryptionKey = crypto.randomBytes(32).toString('base64');
  await prisma.encryptionKey.create({
    data: {
      userId,
      encryptionKey,
    },
  });

  return encryptionKey;
}
