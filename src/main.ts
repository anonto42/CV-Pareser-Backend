import { createApp } from './app';
import config from './shared/infrastructure/config';
import { initializeDatabase, closeDatabase } from './shared/infrastructure/config/database';
import { ensureCollection } from './shared/infrastructure/config/qdrant';

async function main() {
  try {
    // Initialize PostgreSQL database
    await initializeDatabase();
    
    // Initialize Qdrant collection
    await ensureCollection(config.vector.dimension);
    
    const server = createApp();
    
    server.listen(
      config.server.port,
      config.server.host,
      () => console.log(`🚀 Server is running on http://${config.server.host}:${config.server.port}`)
    );

    // Handle graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received, shutting down gracefully');
      await closeDatabase();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('SIGINT received, shutting down gracefully');
      await closeDatabase();
      process.exit(0);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();
