/*
  Warnings:

  - You are about to drop the `EncryptingKey` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."EncryptingKey" DROP CONSTRAINT "EncryptingKey_userId_fkey";

-- DropTable
DROP TABLE "public"."EncryptingKey";

-- CreateTable
CREATE TABLE "public"."EncryptionKey" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "encryptionKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EncryptionKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EncryptionKey_userId_key" ON "public"."EncryptionKey"("userId");

-- AddForeignKey
ALTER TABLE "public"."EncryptionKey" ADD CONSTRAINT "EncryptionKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
