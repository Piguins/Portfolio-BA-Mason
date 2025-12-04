// CORS configuration middleware
// Strict CORS policy - only allows requests from specified origins

import cors from 'cors'

// Get allowed origins from environment variable
// Format: "https://domain1.com,https://domain2.com" (comma-separated, no spaces)
// Supports wildcards: "https://*.vercel.app" for Vercel preview URLs
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
 * Check if origin matches allowed pattern
 * Supports exact match and wildcard patterns (e.g., https://*.vercel.app)
 */
const isOriginAllowed = (origin) => {
  if (!origin) return false
  
  // Exact match
  if (allowedOrigins.includes(origin)) {
    return true
  }
  
  // Wildcard pattern matching (for Vercel preview URLs, etc.)
  for (const pattern of allowedOrigins) {
    if (pattern.includes('*')) {
      // Convert wildcard pattern to regex
      // e.g., "https://*.vercel.app" -> /^https:\/\/.*\.vercel\.app$/
      const regexPattern = pattern
        .replace(/\./g, '\\.') // Escape dots
        .replace(/\*/g, '.*')   // Convert * to .*
      const regex = new RegExp(`^${regexPattern}$`)
      
      if (regex.test(origin)) {
        return true
      }
    }
  }
  
  return false
}

/**
 * Get API base URL for self-referencing origin check
 */
const getApiBaseUrl = () => {
  // Check Vercel URL first (production)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  // Check custom API URL
  if (process.env.API_URL) {
    return process.env.API_URL
  }
  // Development fallback
  return 'http://localhost:4000'
}

const apiBaseUrl = getApiBaseUrl()

/**
 * CORS configuration
 * Only allows requests from origins specified in CORS_ORIGINS env variable
 * Allows direct API access (no origin) and self-referencing requests
 */
export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (direct API access, Postman, curl, mobile apps, etc.)
    // This is safe because CORS only applies to browser cross-origin requests
    if (!origin) {
      return callback(null, true)
    }
    
    // Allow self-referencing requests (API calling itself)
    // Extract base URL from origin (remove path if any)
    try {
      const originUrl = new URL(origin)
      const originBase = `${originUrl.protocol}//${originUrl.host}`
      const apiBase = new URL(apiBaseUrl)
      const apiBaseHost = `${apiBase.protocol}//${apiBase.host}`
      
      if (originBase === apiBaseHost) {
        return callback(null, true)
      }
    } catch (e) {
      // Invalid URL, continue with normal check
    }
    
    // Check if origin is allowed
    if (isOriginAllowed(origin)) {
      callback(null, true)
    } else {
      // Origin not allowed - always log for debugging
      console.warn(`⚠️  CORS blocked origin: ${origin}`)
      
      if (allowedOrigins.length === 0) {
        console.error('❌ CORS_ORIGINS environment variable is not set!')
        console.error('   Set CORS_ORIGINS in Vercel: Settings → Environment Variables')
      } else {
        // In development, show allowed origins
        if (process.env.NODE_ENV === 'development') {
          console.warn(`   Allowed origins: ${allowedOrigins.join(', ')}`)
        } else {
          // In production, just show count (security)
          console.warn(`   Configured ${allowedOrigins.length} allowed origin(s)`)
          console.warn('   Check CORS_SETUP.md for troubleshooting')
        }
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

