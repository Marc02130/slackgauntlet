/*
  Warnings:

  - You are about to drop the column `lastActivity` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `statusMessage` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `useAIResponse` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "lastActivity",
DROP COLUMN "statusMessage",
DROP COLUMN "useAIResponse";
