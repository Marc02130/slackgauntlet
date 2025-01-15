/*
  Warnings:

  - You are about to drop the column `embedded` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "embedded",
ADD COLUMN     "isAIResponse" BOOLEAN NOT NULL DEFAULT false;
