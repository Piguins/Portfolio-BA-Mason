// Application configuration
import dotenv from 'dotenv'

dotenv.config()

// Get config values with defaults - Vercel-compatible (no object literal with expressions)
export const getConfig = () => {
  // Read env vars directly in function (not in object literal)
  const envPort = process.env.PORT
  const envNodeEnv = process.env.NODE_ENV
  const envVercel = process.env.VERCEL
  const envDatabaseUrl = process.env.DATABASE_URL
  const envApiUrl = process.env.API_URL
  const envVercelUrl = process.env.VERCEL_URL
  
  // Build config object with defaults
  const port = envPort ? parseInt(envPort, 10) : 4000
  const nodeEnv = envNodeEnv || 'development'
  const isVercel = envVercel === '1'
  const apiBaseUrl = envApiUrl || 'http://localhost:4000'
  
  // Validate required config (only in non-Vercel environments)
  if (!isVercel && !envDatabaseUrl) {
    throw new Error('DATABASE_URL is required in environment variables')
  }
  
  // Return config object
  return {
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
}

