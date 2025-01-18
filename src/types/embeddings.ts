export interface EmbeddingData {
  id?: string;
  content: string;
  embedding?: number[];
  score: number;
}

export interface EmbeddingResult {
  relevantMessages: EmbeddingData[];
  relevantDocuments: EmbeddingData[];
  messageEmbedding: number[];
} 