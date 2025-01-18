import { NextResponse } from 'next/server';
import { rateLimiter } from '@/lib/utils/rate-limiter';
import { auth } from '@clerk/nextjs';

const RATE_LIMITS = {
  'avatar:message': { limit: 50, window: 3600 },  // 50 messages per hour
  'avatar:create': { limit: 5, window: 86400 },   // 5 avatars per day
  'avatar:update': { limit: 20, window: 3600 },   // 20 updates per hour
};

export async function rateLimit(
  req: Request,
  action: keyof typeof RATE_LIMITS
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const config = RATE_LIMITS[action];
    const isLimited = await rateLimiter.isRateLimited({
      userId,
      action,
      ...config
    });

    if (isLimited) {
      return new NextResponse(
        JSON.stringify({
          error: "Rate limit exceeded",
          retryAfter: config.window
        }),
        { 
          status: 429,
          headers: {
            'Retry-After': config.window.toString()
          }
        }
      );
    }

    // Record the action
    await rateLimiter.recordAction({ userId, action });
    return null;

  } catch (error) {
    console.error('Rate limit error:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 