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
  // max: 1 is correct for serverless - each function instance uses 1 connection to pooler
  poolInstance = new Pool({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false },
    max: 1, // Serverless: 1 connection per function instance
    min: 0, // Don't pre-create connections
    idleTimeoutMillis: 30000, // 30s for better reuse
    connectionTimeoutMillis: 5000, // 5s timeout for connection attempts
    allowExitOnIdle: true,
  })
  
  // Log connection info (without sensitive data)
  const connectionInfo = connectionString.replace(/:[^:@]+@/, ':****@') // Hide password
  console.log(`📊 Database pool created: ${isServerless ? 'Serverless' : 'Standard'} mode`)
  if (isTransactionMode) {
    console.log(`   Using Supavisor pooler (transaction mode - port 6543)`)
  } else if (isSessionMode) {
    console.log(`   Using Supavisor pooler (session mode - port 5432)`)
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
  
  // Connection event handlers for debugging
  poolInstance.on('connect', (client) => {
    console.log('✅ Database client connected')
  })
  
  poolInstance.on('acquire', (client) => {
    console.log('📥 Database client acquired from pool')
  })
  
  poolInstance.on('remove', (client) => {
    console.log('📤 Database client removed from pool')
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
