// Authentication middleware with in-memory caching for JWT verification
// Performance: Reduces redundant Supabase API calls by caching verified tokens

import { createClient } from '@supabase/supabase-js'
import { getConfig } from '../config/index.js'

const config = getConfig()

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY


const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

// In-memory cache for verified tokens
// Structure: { token: { user, expiresAt, cachedAt } }
const tokenCache = new Map()

// Cache TTL: 5 minutes (tokens typically expire in 1 hour, but we refresh cache more frequently)
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes
const MAX_CACHE_SIZE = 1000 // Prevent memory leaks

/**
 * Clean expired entries from cache periodically
 */
const cleanCache = () => {
  const now = Date.now()
  for (const [token, data] of tokenCache.entries()) {
    if (now > data.expiresAt) {
      tokenCache.delete(token)
    }
  }
  
  // If cache is too large, remove oldest entries
  if (tokenCache.size > MAX_CACHE_SIZE) {
    const entries = Array.from(tokenCache.entries())
    entries.sort((a, b) => a[1].cachedAt - b[1].cachedAt)
    const toRemove = entries.slice(0, Math.floor(MAX_CACHE_SIZE * 0.2)) // Remove 20% oldest
    toRemove.forEach(([token]) => tokenCache.delete(token))
  }
}

// Clean cache every 2 minutes
setInterval(cleanCache, 2 * 60 * 1000)

/**
 * Extract token from Authorization header
 */
const extractToken = (req) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return null
  
  // Support both "Bearer <token>" and just "<token>"
  const parts = authHeader.split(' ')
  return parts.length === 2 ? parts[1] : parts[0]
}

/**
 * Verify JWT token with Supabase (with caching)
 */
const verifyToken = async (token) => {
  // Check cache first
  const cached = tokenCache.get(token)
  if (cached && Date.now() < cached.expiresAt) {
    return { user: cached.user, fromCache: true }
  }
  
  // Cache miss or expired - verify with Supabase
  if (!supabase) {
    return { user: null, error: 'Supabase client not configured' }
  }
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return { user: null, error: error?.message || 'Invalid token' }
    }
    
    // Cache the verified token
    // Use token expiration if available, otherwise use cache TTL
    const expiresAt = user.exp ? user.exp * 1000 : Date.now() + CACHE_TTL_MS
    tokenCache.set(token, {
      user,
      expiresAt,
      cachedAt: Date.now(),
    })
    
    return { user, fromCache: false }
  } catch (error) {
    console.error('Token verification error:', error)
    return { user: null, error: error.message }
  }
}

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header and attaches user to request
 * 
 * Usage:
 *   router.get('/api/protected', authMiddleware, controller.handler)
 *   OR
 *   app.use('/api/admin', authMiddleware)
 */
export const authMiddleware = async (req, res, next) => {
  const token = extractToken(req)
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authorization token required',
    })
  }
  
  const { user, error, fromCache } = await verifyToken(token)
  
  if (!user) {
    return res.status(401).json({
      success: false,
      error: error || 'Invalid or expired token',
    })
  }
  
  // Attach user to request for use in controllers
  req.user = user
  
  // Optional: Add cache hit/miss header for monitoring
  if (process.env.NODE_ENV === 'development') {
    res.setHeader('X-Auth-Cache', fromCache ? 'HIT' : 'MISS')
  }
  
  next()
}

/**
 * Optional authentication middleware
 * Doesn't fail if token is missing, but attaches user if token is valid
 * Useful for endpoints that work both with and without auth
 */
export const optionalAuthMiddleware = async (req, res, next) => {
  const token = extractToken(req)
  
  if (token) {
    const { user } = await verifyToken(token)
    if (user) {
      req.user = user
    }
  }
  
  next()
}

/**
 * Clear token from cache (useful for logout)
 */
export const clearTokenCache = (token) => {
  tokenCache.delete(token)
}

/**
 * Clear all cache (useful for testing or forced refresh)
 */
export const clearAllCache = () => {
  tokenCache.clear()
}

