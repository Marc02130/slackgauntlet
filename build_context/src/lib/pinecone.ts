import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';

if (!process.env.PINECONE_API_KEY) {
  throw new Error('Missing Pinecone API key');
}

if (!process.env.PINECONE_ENVIRONMENT) {
  throw new Error('Missing Pinecone environment');
}

if (!process.env.PINECONE_INDEX_NAME) {
  throw new Error('Missing Pinecone index name');
}

if (!process.env.OPENAI_KEY) {
  throw new Error('Missing OpenAI API key');
}

// Initialize Pinecone client
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});

// Initialize OpenAI embeddings
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_KEY,
  modelName: "text-embedding-3-large"
});

// Get Pinecone index
const index = pinecone.index(process.env.PINECONE_INDEX_NAME);

export { pinecone, embeddings, index }; 