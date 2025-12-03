// Application configuration
import dotenv from 'dotenv'

dotenv.config()

// Extract environment variables to avoid BinaryExpression in object literal
const envPort = process.env.PORT
const envNodeEnv = process.env.NODE_ENV
const envApiUrl = process.env.API_URL
const envVercel = process.env.VERCEL
const envDatabaseUrl = process.env.DATABASE_URL
const envVercelUrl = process.env.VERCEL_URL

// Set defaults using ternary operators (Vercel-compatible)
const port = envPort ? parseInt(envPort, 10) : 4000
const nodeEnv = envNodeEnv ? envNodeEnv : 'development'
const apiBaseUrl = envApiUrl ? envApiUrl : 'http://localhost:4000'
const isVercel = envVercel === '1'

export const config = {
  port: port,
  nodeEnv: nodeEnv,
  isVercel: isVercel,
  
  database: {
    url: envDatabaseUrl,
  },
  
  api: {
    baseUrl: apiBaseUrl,
  },
  
  vercel: {
    url: envVercelUrl,
  },
}

// Validate required config (only in non-Vercel environments or if explicitly checking)
// In Vercel, env vars are set at deployment time, so we don't throw during module load
if (!isVercel && !envDatabaseUrl) {
  throw new Error('DATABASE_URL is required in environment variables')
}

