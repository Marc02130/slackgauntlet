-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "isProofed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "originalContent" TEXT,
ADD COLUMN     "proofingState" TEXT DEFAULT 'pending',
ADD COLUMN     "proofingType" TEXT,
ADD COLUMN     "suggestedContent" TEXT;

-- CreateTable
CREATE TABLE "MessageChange" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "original" TEXT NOT NULL,
    "suggestion" TEXT NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessageChange_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MessageChange" ADD CONSTRAINT "MessageChange_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
