// Application configuration
import dotenv from 'dotenv'

dotenv.config()

// Simple config object - Vercel-compatible (no expressions in object literal)
export const config = {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  isVercel: process.env.VERCEL === '1',
  
  database: {
    url: process.env.DATABASE_URL,
  },
  
  api: {
    baseUrl: process.env.API_URL,
  },
  
  vercel: {
    url: process.env.VERCEL_URL,
  },
}

// Get config values with defaults (called when needed, not at module load)
export const getConfig = () => {
  return {
    port: config.port ? parseInt(config.port, 10) : 4000,
    nodeEnv: config.nodeEnv || 'development',
    isVercel: config.isVercel,
    database: {
      url: config.database.url,
    },
    api: {
      baseUrl: config.api.baseUrl || 'http://localhost:4000',
    },
    vercel: {
      url: config.vercel.url,
    },
  }
}

// Validate required config (only in non-Vercel environments)
if (!config.isVercel && !config.database.url) {
  throw new Error('DATABASE_URL is required in environment variables')
}

