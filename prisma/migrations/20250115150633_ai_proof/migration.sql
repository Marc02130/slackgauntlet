-- CreateTable
CREATE TABLE "AIProofingSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "proofBeforeSend" BOOLEAN NOT NULL DEFAULT false,
    "proofAfterSend" BOOLEAN NOT NULL DEFAULT false,
    "autoAcceptChanges" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "checkGrammar" BOOLEAN NOT NULL DEFAULT true,
    "checkTone" BOOLEAN NOT NULL DEFAULT true,
    "checkClarity" BOOLEAN NOT NULL DEFAULT true,
    "checkSensitivity" BOOLEAN NOT NULL DEFAULT true,
    "preferredTone" TEXT,
    "formality" INTEGER NOT NULL DEFAULT 5,

    CONSTRAINT "AIProofingSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AIProofingSettings_userId_key" ON "AIProofingSettings"("userId");

-- AddForeignKey
ALTER TABLE "AIProofingSettings" ADD CONSTRAINT "AIProofingSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
