-- AlterTable
ALTER TABLE "AIProofingSettings" 
DROP COLUMN IF EXISTS "proofBeforeSend",
DROP COLUMN IF EXISTS "proofAfterSend",
ADD COLUMN "proofingMode" TEXT NOT NULL DEFAULT 'none';

-- Update existing records
UPDATE "AIProofingSettings"
SET "proofingMode" = 'none'
WHERE "proofingMode" IS NULL; 