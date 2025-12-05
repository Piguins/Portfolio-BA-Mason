// Global Database Connection Pool - Singleton Pattern
// OPTIMIZED for Vercel Serverless Functions:
// - Uses global variable to cache pool across invocations
// - Prevents creating new pool on every request
// - Connection is lazy (non-blocking cold start)
import pkg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pkg

// CRITICAL: Use global variable to cache pool across Vercel function invocations
// In Vercel serverless, the container can be reused, so we cache the pool here
// This prevents creating a new connection pool on every request
const globalForDb = globalThis

// Singleton instance - cached in global scope for Vercel serverless reuse
let poolInstance = globalForDb.poolInstance || null

function createPool() {
  // Return cached instance if exists (reused across invocations in Vercel)
  if (poolInstance) {
    return poolInstance
  }

  let connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured in environment variables')
  }

  // For serverless (Vercel), prefer transaction mode pooler (port 6543)
  // Transaction mode requires pgbouncer=true to disable prepared statements
  // For local development, session mode (port 5432) may work better
  const isServerless = process.env.VERCEL === '1'
  const isTransactionMode = connectionString.includes(':6543')
  const isSessionMode = connectionString.includes('pooler.supabase.com') && connectionString.includes(':5432')
  
  // Only auto-convert to transaction mode if:
  // 1. Running on Vercel (serverless)
  // 2. AND not already using session mode (port 5432)
  // 3. AND not already using transaction mode (port 6543)
  if (isServerless && !isSessionMode && !isTransactionMode) {
    // Force transaction mode for serverless (Vercel)
    if (connectionString.includes(':5432/')) {
      connectionString = connectionString.replace(':5432/', ':6543/')
    }
    
    // Add pgbouncer=true for transaction mode (required to disable prepared statements)
    if (!connectionString.includes('pgbouncer=true')) {
      const separator = connectionString.includes('?') ? '&' : '?'
      connectionString = `${connectionString}${separator}pgbouncer=true`
    }
  } else if (isTransactionMode && !connectionString.includes('pgbouncer=true')) {
    // If using transaction mode, ensure pgbouncer=true is present
    const separator = connectionString.includes('?') ? '&' : '?'
    connectionString = `${connectionString}${separator}pgbouncer=true`
  }
  
  // Session mode (port 5432) - no pgbouncer=true needed, supports prepared statements

  // Optimized pool configuration for serverless (Vercel)
  // CRITICAL: max: 1 because Transaction Mode on Supabase handles pooling
  // Vercel serverless functions should NOT open multiple connections per instance
  poolInstance = new Pool({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false },
    max: 1, // CRITICAL: 1 connection per function instance (Supavisor handles pooling)
    min: 0, // Don't pre-create connections (lazy connection)
    idleTimeoutMillis: 30000, // 30s for better reuse across invocations
    connectionTimeoutMillis: 3000, // 3s timeout - fail fast if connection hangs
    allowExitOnIdle: true, // Allow process to exit when idle (serverless-friendly)
  })
  
  // Cache pool instance in global scope for Vercel serverless reuse
  globalForDb.poolInstance = poolInstance
  
  // Log connection info (only in development)
  if (process.env.NODE_ENV !== 'production') {
    const connectionInfo = connectionString.replace(/:[^:@]+@/, ':****@') // Hide password
    console.log(`📊 Database pool created: ${isServerless ? 'Serverless' : 'Standard'} mode`)
    if (isTransactionMode) {
      console.log(`   Using Supavisor pooler (transaction mode - port 6543)`)
    } else if (isSessionMode) {
      console.log(`   Using Supavisor pooler (session mode - port 5432)`)
    }
  }

  // Error handling
  poolInstance.on('error', (err, client) => {
    console.error('❌ Database pool error:', {
      message: err.message,
      code: err.code,
      severity: err.severity,
    })
    // Don't exit in serverless - let Vercel handle it
    if (process.env.VERCEL !== '1') {
      console.error('⚠️  Exiting process due to database pool error')
      process.exit(-1)
    }
  })
  
  // Connection event handlers for debugging (only in development)
  if (process.env.NODE_ENV !== 'production') {
    poolInstance.on('connect', () => {
      console.log('✅ Database client connected')
    })

    poolInstance.on('acquire', () => {
      console.log('📥 Database client acquired from pool')
    })

    poolInstance.on('remove', () => {
      console.log('📤 Database client removed from pool')
    })
  }

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
