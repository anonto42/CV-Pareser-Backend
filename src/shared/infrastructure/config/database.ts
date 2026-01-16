import { Pool, PoolClient } from 'pg';
import config from './index';

let pool: Pool | null = null;

export async function initializeDatabase(): Promise<Pool | null> {
  if (!config.postgres.url) {
    console.warn('⚠️ POSTGRES_URL not configured. Using in-memory storage.');
    return null;
  }

  try {
    pool = new Pool({
      connectionString: config.postgres.url,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });

    // Test connection
    const client = await pool.connect();
    console.log('✅ Database connection successful');
    client.release();

    // Initialize database schema
    await initializeSchema(pool);

    return pool;
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    throw error;
  }
}

export async function initializeSchema(dbPool: Pool): Promise<void> {
  try {
    // Create processed_cvs table if it doesn't exist
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS processed_cvs (
        id VARCHAR(255) PRIMARY KEY,
        cv JSONB NOT NULL,
        vectors JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_processed_cvs_created_at ON processed_cvs(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_processed_cvs_updated_at ON processed_cvs(updated_at DESC);
    `);

    console.log('✅ Database schema initialized');
  } catch (error) {
    console.error('❌ Failed to initialize schema:', error);
    throw error;
  }
}

export function getPool(): Pool | null {
  return pool;
}

export async function closeDatabase(): Promise<void> {
  if (pool) {
    await pool.end();
    console.log('✅ Database connection closed');
  }
}

export async function executeQuery(query: string, params?: any[]): Promise<any> {
  if (!pool) {
    throw new Error('Database pool not initialized');
  }
  return pool.query(query, params);
}

export async function withConnection<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  if (!pool) {
    throw new Error('Database pool not initialized');
  }

  const client = await pool.connect();
  try {
    return await callback(client);
  } finally {
    client.release();
  }
}
