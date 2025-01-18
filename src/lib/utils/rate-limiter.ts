import { db } from '../db';

interface RateLimitConfig {
  userId: string;
  action: string;
  limit: number;  // Max requests
  window: number; // Time window in seconds
}

export class RateLimiter {
  async isRateLimited({ userId, action, limit, window }: RateLimitConfig): Promise<boolean> {
    const now = new Date();
    const windowStart = new Date(now.getTime() - window * 1000);

    // Count recent actions
    const count = await db.userAction.count({
      where: {
        userId,
        action,
        createdAt: {
          gte: windowStart
        }
      }
    });

    return count >= limit;
  }

  async recordAction({ userId, action }: { userId: string; action: string }): Promise<void> {
    await db.userAction.create({
      data: {
        userId,
        action,
        createdAt: new Date()
      }
    });
  }
}

export const rateLimiter = new RateLimiter(); 