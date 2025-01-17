/*
  Warnings:

  - You are about to drop the column `userId` on the `AIProofingSettings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `AIProofingSettings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `AIProofingSettings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AIProofingSettings" DROP CONSTRAINT "AIProofingSettings_userId_fkey";

-- DropIndex
DROP INDEX "AIProofingSettings_userId_key";

-- AlterTable
ALTER TABLE "AIProofingSettings" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AIProofingSettings_user_id_key" ON "AIProofingSettings"("user_id");

-- CreateIndex
CREATE INDEX "AIProofingSettings_userId_idx" ON "AIProofingSettings"("user_id");

-- AddForeignKey
ALTER TABLE "AIProofingSettings" ADD CONSTRAINT "AIProofingSettings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
