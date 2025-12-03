// Application configuration
import dotenv from 'dotenv'

dotenv.config()

// Get environment variables with defaults
const getPort = () => {
  const port = process.env.PORT
  return port ? parseInt(port, 10) : 4000
}

const getNodeEnv = () => {
  return process.env.NODE_ENV || 'development'
}

const getApiUrl = () => {
  return process.env.API_URL || 'http://localhost:4000'
}

export const config = {
  port: getPort(),
  nodeEnv: getNodeEnv(),
  isVercel: process.env.VERCEL === '1',
  
  database: {
    url: process.env.DATABASE_URL,
  },
  
  api: {
    baseUrl: getApiUrl(),
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

