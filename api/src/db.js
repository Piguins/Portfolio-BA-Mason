// Database connection using pg library with Connection Pooling
// IMPORTANT: Use Supabase Connection Pooler (port 6543) for serverless environments
// Direct connection (port 5432) is slow for serverless - use pooler instead!
import pkg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pkg

let connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not configured in .env file')
}

// CRITICAL: Convert direct connection to pooler connection for better performance
// Supabase pooler uses port 6543 (Session Mode) or 6543 (Transaction Mode)
// Direct connection (port 5432) is 3-5x slower for serverless functions
if (connectionString.includes(':5432/')) {
  // Replace port 5432 with 6543 (Session Mode Pooler)
  connectionString = connectionString.replace(':5432/', ':6543/')
  console.log('⚠️ Using direct connection (port 5432). Consider using pooler (port 6543) for better performance.')
  console.log('💡 Update DATABASE_URL to use port 6543 for Supabase Connection Pooler')
} else if (connectionString.includes(':6543/')) {
  console.log('✅ Using Supabase Connection Pooler (port 6543) - optimal for serverless')
}

// Connection Pool Configuration
// Optimized for Vercel serverless functions with Supabase Pooler
const pool = new Pool({
  connectionString: connectionString,
  // SSL config for Supabase (required for pooler)
  ssl: { rejectUnauthorized: false },
  // Pool settings optimized for serverless (smaller pool for pooler)
  max: 1, // IMPORTANT: Pooler handles pooling, so we only need 1 connection per function
  min: 0, // No minimum for serverless
  idleTimeoutMillis: 10000, // Close idle clients quickly (10 seconds)
  connectionTimeoutMillis: 3000, // Fast timeout (3 seconds)
  // For serverless: connections are managed by Supabase pooler
  allowExitOnIdle: true, // Allow pool to close when idle (pooler handles persistence)
})

// Handle pool errors
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

// Test connection on startup (only in non-Vercel environments)
if (process.env.VERCEL !== '1') {
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('❌ Database connection test failed:', err.message)
    } else {
      console.log('✅ Database pool connected successfully')
    }
  })
}

export default pool

