/*
  Warnings:

  - You are about to drop the column `busyUntil` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `customMessage` on the `User` table. All the data in the column will be lost.
  - The `status` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `AutoResponse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BusySchedule` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AutoResponse" DROP CONSTRAINT "AutoResponse_userId_fkey";

-- DropForeignKey
ALTER TABLE "BusySchedule" DROP CONSTRAINT "BusySchedule_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "busyUntil",
DROP COLUMN "customMessage",
ADD COLUMN     "statusMessage" TEXT,
ADD COLUMN     "useAIResponse" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT,
ALTER COLUMN "lastActivity" DROP NOT NULL,
ALTER COLUMN "lastActivity" DROP DEFAULT;

-- DropTable
DROP TABLE "AutoResponse";

-- DropTable
DROP TABLE "BusySchedule";

-- DropEnum
DROP TYPE "UserStatus";
