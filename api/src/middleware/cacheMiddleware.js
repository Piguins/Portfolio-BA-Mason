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
      // Default strategy: 1 min browser cache, 10 min CDN cache
      res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=600')
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

