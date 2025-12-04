// CORS configuration middleware
// Strict CORS policy - only allows requests from specified origins

import cors from 'cors'

// Get allowed origins from environment variable
// Format: "https://domain1.com,https://domain2.com" (comma-separated, no spaces)
const getAllowedOrigins = () => {
  const originsEnv = process.env.CORS_ORIGINS
  
  if (!originsEnv) {
    // Development fallback - allow localhost
    if (process.env.NODE_ENV === 'development') {
      return ['http://localhost:3000', 'http://localhost:3001']
    }
    // Production: if not set, deny all (fail secure)
    console.warn('⚠️  CORS_ORIGINS not set. CORS will be restrictive.')
    return []
  }
  
  // Split by comma and trim whitespace
  return originsEnv.split(',').map(origin => origin.trim()).filter(Boolean)
}

const allowedOrigins = getAllowedOrigins()

/**
 * CORS configuration
 * Only allows requests from origins specified in CORS_ORIGINS env variable
 */
export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.) in development only
    if (!origin && process.env.NODE_ENV === 'development') {
      return callback(null, true)
    }
    
    // Check if origin is in allowed list
    if (origin && allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      // Origin not allowed
      if (process.env.NODE_ENV === 'development') {
        console.warn(`⚠️  CORS blocked origin: ${origin}`)
        console.warn(`   Allowed origins: ${allowedOrigins.join(', ')}`)
      }
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true, // Allow cookies/credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Response-Time', 'X-Query-Time'],
  maxAge: 86400, // Cache preflight requests for 24 hours
  optionsSuccessStatus: 200, // Some legacy browsers (IE11) choke on 204
})

