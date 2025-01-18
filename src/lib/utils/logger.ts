export const logger = {
  error: (context: string, error: unknown, metadata?: object) => {
    console.error(`[${context}]`, {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      ...metadata
    });
  },
  
  info: (context: string, message: string, metadata?: object) => {
    console.log(`[${context}]`, message, metadata);
  }
}; 