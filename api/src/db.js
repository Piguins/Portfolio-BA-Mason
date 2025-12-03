// Database connection using pg library
import pkg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Client } = pkg

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not configured in .env file')
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  // SSL config for Supabase (required for pooler)
  ssl: { rejectUnauthorized: false },
})

// Connect to database (lazy connection - will connect on first query)
// For Vercel serverless, connections are reused across invocations
let isConnected = false
let connectionPromise = null

async function ensureConnected() {
  if (isConnected) {
    return
  }
  
  if (connectionPromise) {
    return connectionPromise
  }
  
  connectionPromise = (async () => {
    try {
      await client.connect()
      isConnected = true
      console.log('✅ Database connected')
    } catch (err) {
      console.error('❌ Database connection error:', err.message)
      connectionPromise = null
      throw err
    }
  })()
  
  return connectionPromise
}

// Auto-connect on first query
const originalQuery = client.query.bind(client)
client.query = async function(...args) {
  try {
    await ensureConnected()
    return originalQuery(...args)
  } catch (err) {
    // Reset connection state on error
    isConnected = false
    connectionPromise = null
    throw err
  }
}

export default client

