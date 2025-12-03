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

// Validate required config
if (!config.database.url) {
  throw new Error('DATABASE_URL is required in environment variables')
}

