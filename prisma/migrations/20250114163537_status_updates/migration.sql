-- AlterTable
ALTER TABLE "User" ADD COLUMN     "statusMessage" TEXT,
ADD COLUMN     "useAIResponse" BOOLEAN NOT NULL DEFAULT false;
