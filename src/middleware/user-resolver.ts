import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs';
import { resolveUserId } from '@/lib/utils/user-resolver';
import { logger } from '@/lib/utils/logger';

export async function withUser(
  handler: (userId: string) => Promise<NextResponse>
) {
  try {
    const { userId: clerkUserId } = auth();
    const user = await currentUser();

    if (!clerkUserId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const dbUserId = await resolveUserId(
      clerkUserId, 
      user.emailAddresses[0].emailAddress
    );

    return await handler(dbUserId);
  } catch (error) {
    logger.error('UserResolver', error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Error",
      { status: 500 }
    );
  }
} 