import { LRUCache } from 'lru-cache';
import { db } from './db';

interface CacheOptions {
  max: number;        // Maximum number of items
  ttl: number;        // Time to live in milliseconds
}

interface CachedResponse {
  content: string;
  context: any;
  timestamp: number;
  avatarId: string;
  userId: string;
}

export class CacheManager {
  private cache: LRUCache<string, CachedResponse>;
  
  constructor(options: CacheOptions) {
    this.cache = new LRUCache({
      max: options.max,
      ttl: options.ttl,
      updateAgeOnGet: true,
      updateAgeOnHas: true
    });
  }

  private generateKey(avatarId: string, messageHash: string): string {
    return `${avatarId}:${messageHash}`;
  }

  async get(avatarId: string, messageHash: string): Promise<CachedResponse | null> {
    // Check in-memory cache first
    const key = this.generateKey(avatarId, messageHash);
    const cached = this.cache.get(key);
    
    if (cached) {
      return cached;
    }

    // Check database cache
    const dbCache = await db.avatarConversation.findFirst({
      where: {
        avatarId,
        messageId: messageHash,
      }
    });

    if (dbCache) {
      const cachedResponse = {
        content: dbCache.response,
        context: dbCache.context,
        timestamp: dbCache.createdAt.getTime(),
        avatarId: dbCache.avatarId,
        userId: dbCache.userId
      };
      
      // Update in-memory cache
      this.cache.set(key, cachedResponse);
      return cachedResponse;
    }

    return null;
  }

  async set(
    avatarId: string, 
    messageHash: string, 
    userId: string,
    response: CachedResponse
  ): Promise<void> {
    const key = this.generateKey(avatarId, messageHash);
    
    // Update in-memory cache
    this.cache.set(key, response);

    // Persist to database
    await db.avatarConversation.create({
      data: {
        avatarId,
        userId,
        messageId: messageHash,
        response: response.content,
        context: response.context
      }
    });
  }

  async invalidate(avatarId: string): Promise<void> {
    // Clear in-memory cache for this avatar
    for (const key of this.cache.keys()) {
      if (key.startsWith(`${avatarId}:`)) {
        this.cache.delete(key);
      }
    }

    // Clear database cache
    await db.avatarConversation.deleteMany({
      where: { avatarId }
    });
  }
}

// Create singleton instance
export const cacheManager = new CacheManager({
  max: 1000,  // Store up to 1000 responses in memory
  ttl: 1000 * 60 * 60 * 24  // Cache for 24 hours
}); 