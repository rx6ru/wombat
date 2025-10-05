/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ApiKey" DROP CONSTRAINT "ApiKey_userId_fkey";

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "public"."Profile" (
    "id" UUID NOT NULL,
    "authId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_authId_key" ON "public"."Profile"("authId");

-- AddForeignKey
ALTER TABLE "public"."ApiKey" ADD CONSTRAINT "ApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
