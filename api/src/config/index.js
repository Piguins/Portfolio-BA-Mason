// Application configuration
import dotenv from 'dotenv'

dotenv.config()

export const config = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isVercel: process.env.VERCEL === '1',
  
  database: {
    url: process.env.DATABASE_URL,
  },
  
  api: {
    baseUrl: process.env.API_URL || 'http://localhost:4000',
  },
  
  vercel: {
    url: process.env.VERCEL_URL,
  },
}

// Validate required config (only in non-Vercel environments or if explicitly checking)
// In Vercel, env vars are set at deployment time, so we don't throw during module load
if (!config.isVercel && !config.database.url) {
  throw new Error('DATABASE_URL is required in environment variables')
}

