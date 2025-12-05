// Global Database Connection Pool - Singleton Pattern
// OPTIMIZED: Pool creation is non-blocking - created synchronously but connection is lazy
// This prevents blocking serverless function cold starts
import pkg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pkg

// Singleton instance - created immediately but connection is lazy
let poolInstance = null

function createPool() {
  if (poolInstance) {
    return poolInstance
  }

  let connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured in environment variables')
  }

  // Use connection pooler for better performance (port 6543)
  if (connectionString.includes(':5432/')) {
    connectionString = connectionString.replace(':5432/', ':6543/')
  }

  // Optimized pool configuration for serverless (Vercel)
  // max: 1 is correct for serverless - each function instance uses 1 connection to pooler
  poolInstance = new Pool({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false },
    max: 1, // Serverless: 1 connection per function instance
    min: 0, // Don't pre-create connections
    idleTimeoutMillis: 30000, // 30s for better reuse
    connectionTimeoutMillis: 3000, // Reduced to 3s for faster failure
    allowExitOnIdle: true,
  })

  // Error handling
  poolInstance.on('error', (err, client) => {
    console.error('Database pool error:', err)
    // Don't exit in serverless - let Vercel handle it
    if (process.env.VERCEL !== '1') {
      process.exit(-1)
    }
  })

  return poolInstance
}

// Create pool immediately but connection is lazy (non-blocking)
const pool = createPool()

// Export as both 'pool' and 'client' for compatibility
// Services use: import client from '../db.js' (default import)
export { pool }
export { pool as client }
// Default export is the pool instance (services import as 'client')
export default pool
