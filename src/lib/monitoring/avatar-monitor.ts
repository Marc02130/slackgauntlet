import { db } from '../db';
import { logger } from '../utils/logger';

interface ResponseMetrics {
  latency: number;
  tokensUsed: number;
  cacheHit: boolean;
  status: 'success' | 'error';
  errorType?: string;
}

interface UsageMetrics {
  avatarId: string;
  userId: string;
  messageLength: number;
  responseLength: number;
  timestamp: Date;
}

export class AvatarMonitor {
  private static instance: AvatarMonitor;
  private metricsBuffer: Array<UsageMetrics> = [];
  private readonly BUFFER_SIZE = 100;
  private readonly FLUSH_INTERVAL = 1000 * 60 * 5; // 5 minutes

  private constructor() {
    this.setupPeriodicFlush();
  }

  static getInstance(): AvatarMonitor {
    if (!AvatarMonitor.instance) {
      AvatarMonitor.instance = new AvatarMonitor();
    }
    return AvatarMonitor.instance;
  }

  private setupPeriodicFlush() {
    setInterval(() => {
      this.flushMetrics();
    }, this.FLUSH_INTERVAL);
  }

  private async flushMetrics() {
    if (this.metricsBuffer.length === 0) return;

    try {
      // Batch insert metrics
      await db.$transaction(
        this.metricsBuffer.map(metric =>
          db.avatarMetrics.create({
            data: {
              avatarId: metric.avatarId,
              userId: metric.userId,
              messageLength: metric.messageLength,
              responseLength: metric.responseLength,
              timestamp: metric.timestamp
            }
          })
        )
      );

      this.metricsBuffer = [];
    } catch (error) {
      logger.error('AvatarMonitor', 'Failed to flush metrics', { error });
    }
  }

  async trackResponse(params: {
    avatarId: string;
    userId: string;
    message: string;
    response: string;
    metrics: ResponseMetrics;
  }) {
    const { avatarId, userId, message, response, metrics } = params;

    try {
      // Track usage metrics
      this.metricsBuffer.push({
        avatarId,
        userId,
        messageLength: message.length,
        responseLength: response.length,
        timestamp: new Date()
      });

      // Flush if buffer is full
      if (this.metricsBuffer.length >= this.BUFFER_SIZE) {
        await this.flushMetrics();
      }

      // Track performance metrics immediately
      await db.avatarPerformance.create({
        data: {
          avatarId,
          latencyMs: BigInt(Math.floor(metrics.latency)),
          tokensUsed: metrics.tokensUsed,
          cacheHit: metrics.cacheHit,
          status: metrics.status,
          errorType: metrics.errorType,
          timestamp: new Date()
        }
      });

    } catch (error) {
      logger.error('AvatarMonitor', 'Failed to track response', { error });
    }
  }

  async getAvatarStats(avatarId: string) {
    try {
      const [performance, usage] = await Promise.all([
        // Get average performance metrics
        db.avatarPerformance.aggregate({
          where: { avatarId },
          _avg: {
            latencyMs: true,
            tokensUsed: true
          },
          _count: {
            status: true
          }
        }),
        // Get usage patterns
        db.avatarMetrics.aggregate({
          where: { avatarId },
          _avg: {
            messageLength: true,
            responseLength: true
          },
          _count: {
            avatarId: true
          }
        })
      ]);

      return {
        performance: {
          avgLatency: performance._avg.latencyMs,
          avgTokens: performance._avg.tokensUsed,
          totalRequests: performance._count.status
        },
        usage: {
          avgMessageLength: usage._avg.messageLength,
          avgResponseLength: usage._avg.responseLength,
          totalInteractions: usage._count.avatarId
        }
      };
    } catch (error) {
      logger.error('AvatarMonitor', 'Failed to get avatar stats', { error });
      throw error;
    }
  }
}

export const avatarMonitor = AvatarMonitor.getInstance(); 