import dotenv from 'dotenv';

dotenv.config();

export default {
  server: {
    port: Number(process.env.PORT),
    node_env: process.env.NODE_ENV,
    host: process.env.HOST?.toString() || 'localhost',
  },

  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    embeddingModel: 'text-embedding-3-small',
    completionModel: 'gpt-4-turbo-preview',
  },

  storage: {
    uploadPath: process.env.UPLOAD_PATH || './uploads',
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },

  vector: {
    dimension: 1536, // OpenAI embedding dimension
    collection: 'cv_embeddings',
  },
};