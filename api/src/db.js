// Global Database Connection Pool - Singleton Pattern
// CRITICAL: This pool is initialized ONCE at server startup and reused across all requests
import pkg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pkg

// Singleton instance - initialized once, reused everywhere
let poolInstance = null

function createPool() {
  if (poolInstance) {
    return poolInstance
  }

  let connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured in .env file')
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
    min: 0,
    idleTimeoutMillis: 30000, // Increased to 30s for better reuse
    connectionTimeoutMillis: 5000, // 5s timeout
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

// Export singleton pool instance
const pool = createPool()

// Export as both 'pool' and 'client' for compatibility
// Services use: import client from '../db.js' (default import)
export { pool }
export { pool as client }
// Default export is the pool instance (services import as 'client')
export default pool

