/*
  Warnings:

  - The `embedding` column on the `AvatarDocument` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "AvatarDocument" DROP COLUMN "embedding",
ADD COLUMN     "embedding" JSONB;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "embedding" JSONB;
