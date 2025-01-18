import { db } from '../db';

export async function resolveUserId(clerkUserId: string, email: string) {
  // Try to find user by Clerk ID or email
  const dbUser = await db.user.findFirst({
    where: {
      OR: [
        { id: clerkUserId },
        { email }
      ]
    },
    select: {
      id: true
    }
  });

  if (!dbUser) {
    throw new Error('User not found in database');
  }

  return dbUser.id;
}

export async function validateChannelMembership(userId: string, channelId: string) {
  const membership = await db.channelUser.findFirst({
    where: {
      userId,
      channelId
    }
  });

  if (!membership) {
    throw new Error('User is not a channel member');
  }

  return true;
} 