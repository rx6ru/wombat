-- CreateTable
CREATE TABLE "public"."EncryptingKey" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "encryptionKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EncryptingKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EncryptingKey_userId_key" ON "public"."EncryptingKey"("userId");

-- AddForeignKey
ALTER TABLE "public"."EncryptingKey" ADD CONSTRAINT "EncryptingKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
