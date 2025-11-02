import crypto from "crypto";
import prisma from "../config/prisma.config.js";

const ALGORITHM = "aes-256-gcm"; // Authenticated encryption
const IV_LENGTH = 12; // Recommended IV size

/* -------------------------------------------------------------------------- */
/*                            Helper: Key Derivation                          */
/* -------------------------------------------------------------------------- */
function deriveKey(secret: string): Buffer {
  return crypto.createHash("sha256").update(secret).digest(); // derive 32-byte AES key
}

/* -------------------------------------------------------------------------- */
/*                       Function 1: Encrypt or Create Key                    */
/* -------------------------------------------------------------------------- */
export async function encryptKey(userId: string, apiKey: string): Promise<string> {
  // 1️⃣ Check if the user already has an encryption key
  let userKey = await prisma.encryptionKey.findUnique({
    where: { userId },
    select: { encryptionKey: true },
  });

  // 2️⃣ If not found, generate a new encryption key and store it
  if (!userKey) {
    const newEncryptionKey = crypto.randomBytes(32).toString("base64"); // generate 256-bit random key
    await prisma.encryptionKey.create({
      data: {
        userId,
        encryptionKey: newEncryptionKey,
      },
    });
    userKey = { encryptionKey: newEncryptionKey };
  }

  // 3️⃣ Derive AES key and perform encryption
  const key = deriveKey(userKey.encryptionKey);
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(apiKey, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // 4️⃣ Combine iv + authTag + ciphertext → Base64 encode
  return Buffer.concat([iv, authTag, encrypted]).toString("base64");
}

/* -------------------------------------------------------------------------- */
/*                       Function 2: Decrypt using DB Key                     */
/* -------------------------------------------------------------------------- */
export async function decryptKey(userId: string, encryptedKey: string): Promise<string> {
  const userKey = await prisma.encryptionKey.findUnique({
    where: { userId },
    select: { encryptionKey: true },
  });

  if (!userKey) throw new Error("Encryption key not found for user");

  const key = deriveKey(userKey.encryptionKey);
  const data = Buffer.from(encryptedKey, "base64");

  const iv = data.subarray(0, IV_LENGTH);
  const authTag = data.subarray(IV_LENGTH, IV_LENGTH + 16);
  const ciphertext = data.subarray(IV_LENGTH + 16);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted.toString("utf8");
}
