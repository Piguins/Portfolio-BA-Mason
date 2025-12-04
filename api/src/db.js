// Database connection using pg library with Connection Pooling
// IMPORTANT: Use Pool instead of Client for better performance in serverless environments
import pkg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pkg

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not configured in .env file')
}

// Connection Pool Configuration
// Optimized for Vercel serverless functions
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // SSL config for Supabase (required for pooler)
  ssl: { rejectUnauthorized: false },
  // Pool settings for optimal performance
  max: 20, // Maximum number of clients in the pool
  min: 2, // Minimum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 5000, // Return an error after 5 seconds if connection cannot be established
  // For serverless: allow connections to be reused across invocations
  allowExitOnIdle: false, // Keep pool alive even when idle
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

