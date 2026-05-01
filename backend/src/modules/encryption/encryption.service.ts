import { createEncryptionSecret, findEncryptionSecretByUserId } from './encryption.repository.js';
import { decryptWithSecret, encryptWithSecret } from './crypto.util.js';

async function getOrCreateEncryptionSecret(userId: string): Promise<string> {
  const existingSecret = await findEncryptionSecretByUserId(userId);
  if (existingSecret) {
    return existingSecret;
  }

  return createEncryptionSecret(userId);
}

export async function encryptKeyForUser(userId: string, apiKey: string): Promise<string> {
  const secret = await getOrCreateEncryptionSecret(userId);
  return encryptWithSecret(secret, apiKey);
}

export async function decryptKeyForUser(userId: string, encryptedKey: string): Promise<string> {
  const secret = await findEncryptionSecretByUserId(userId);
  if (!secret) {
    throw new Error('Encryption key not found for user');
  }

  return decryptWithSecret(secret, encryptedKey);
}
