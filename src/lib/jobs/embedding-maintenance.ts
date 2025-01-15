import { embeddingsManager } from '../embeddings-manager';
import { db } from '../db';

export async function runEmbeddingMaintenance() {
  try {
    // Get all users
    const users = await db.user.findMany();

    for (const user of users) {
      // Update style embeddings
      await embeddingsManager.updateUserStyleEmbeddings(user.id);

      // Cleanup old embeddings (older than 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      await embeddingsManager.cleanupOldEmbeddings({
        olderThan: thirtyDaysAgo,
        userId: user.id,
        type: 'message'
      });
    }
  } catch (error) {
    console.error('Error in embedding maintenance:', error);
  }
} 