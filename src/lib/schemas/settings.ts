import { z } from 'zod';

export const AIProofingSettingsSchema = z.object({
  proofBeforeSend: z.boolean(),
  proofAfterSend: z.boolean(),
  autoAcceptChanges: z.boolean(),
  checkGrammar: z.boolean(),
  checkTone: z.boolean(),
  checkClarity: z.boolean(),
  checkSensitivity: z.boolean(),
  preferredTone: z.string().optional(),
  formality: z.number().min(1).max(10)
}); 