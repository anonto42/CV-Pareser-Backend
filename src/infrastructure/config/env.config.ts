import dotenv from 'dotenv';

dotenv.config();

const envConfig = {
  port: Number(process.env.PORT),
  node_env: process.env.NODE_ENV,
  host: process.env.HOST?.toString() || 'localhost',
};

export default envConfig;