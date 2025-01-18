import { db } from "@/lib/db";

export async function validateAvatarRequest(
  avatarId: string,
  userId: string
) {
  // Verify avatar exists and has documents
  const avatar = await db.avatar.findUnique({
    where: { id: avatarId },
    include: { documents: true }
  });

  if (!avatar) {
    throw new Error('Avatar not found');
  }

  if (avatar.documents.length === 0) {
    throw new Error('Avatar has no knowledge base documents');
  }

  // Verify user has access to avatar
  if (avatar.userId !== userId) {
    throw new Error('Unauthorized access to avatar');
  }

  return avatar;
} 