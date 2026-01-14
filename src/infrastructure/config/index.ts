import dotenv from 'dotenv';

dotenv.config();

export default {
  port: Number(process.env.PORT),
  node_env: process.env.NODE_ENV,
  host: process.env.HOST?.toString() || 'localhost',
};