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
let isConnected = false

async function ensureConnected() {
  if (!isConnected) {
    try {
      await client.connect()
      isConnected = true
      console.log('✅ Database connected')
    } catch (err) {
      console.error('❌ Database connection error:', err.message)
      throw err
    }
  }
}

// Auto-connect on first query
const originalQuery = client.query.bind(client)
client.query = async function(...args) {
  await ensureConnected()
  return originalQuery(...args)
}

export default client

