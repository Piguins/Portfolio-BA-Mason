// Global caching middleware for GET requests
// Automatically applies Cache-Control headers to improve performance

export const cacheMiddleware = (req, res, next) => {
  // Only apply caching to GET requests
  if (req.method === 'GET') {
    // Skip caching for auth endpoints and dynamic content
    const noCachePaths = [
      '/api/auth',
      '/api-docs',
      '/health',
    ]
    
    const shouldCache = !noCachePaths.some(path => req.path.startsWith(path))
    
    if (shouldCache) {
      // Public GET requests: Cache at Vercel Edge Network CDN
      // s-maxage=60: Cache for 60s at CDN (Vercel Edge)
      // stale-while-revalidate=300: Serve stale content for 300s while revalidating
      // This reduces load on serverless functions for frequently accessed data
      res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60, stale-while-revalidate=300')
    } else {
      // No cache for auth and dynamic endpoints
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
    }
  }
  
  // For POST/PUT/DELETE, ensure no caching
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
  }
  
  next()
}

