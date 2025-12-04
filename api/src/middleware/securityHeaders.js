// Security headers middleware
export function securityHeaders(req, res, next) {
  // Prevent information disclosure
  res.removeHeader('X-Powered-By')
  
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Content Security Policy
  // Allow Swagger UI resources from unpkg.com
  if (req.path.startsWith('/api-docs')) {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com; style-src 'self' 'unsafe-inline' https://unpkg.com; font-src 'self' https://unpkg.com; img-src 'self' data: https://unpkg.com;"
    )
  } else {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;"
    )
  }
  
  // Prevent caching of sensitive endpoints
  if (req.path.startsWith('/api/auth')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')
  }
  
  next()
}

