// Global error handling middleware
// SECURITY: Never expose stack traces or sensitive information in production

export const errorHandler = (err, req, res, next) => {
  // Log error details (server-side only)
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip || req.headers['x-forwarded-for'],
    timestamp: new Date().toISOString(),
  })
  
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  // Database errors
  if (err.code && err.code.startsWith('P')) {
    return res.status(500).json({
      error: 'Database error',
      ...(isDevelopment && { message: err.message }),
    })
  }
  
  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      ...(isDevelopment && { message: err.message }),
    })
  }
  
  // CORS errors
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Origin not allowed',
      ...(isDevelopment && {
        hint: 'Check CORS_ORIGINS environment variable. See api/README.md for setup instructions.',
      }),
    })
  }
  
  // Rate limit errors (handled by express-rate-limit, but catch here too)
  if (err.status === 429) {
    return res.status(429).json({
      error: 'Too many requests',
      message: 'Please try again later',
    })
  }
  
  // Default error - SECURITY: Never expose stack traces in production
  const statusCode = err.status || err.statusCode || 500
  const errorResponse = {
    error: statusCode === 500 ? 'Internal server error' : (err.message || 'An error occurred'),
  }
  
  // Only include detailed error info in development
  if (isDevelopment) {
    errorResponse.message = err.message
    errorResponse.stack = err.stack
    if (err.code) {
      errorResponse.code = err.code
    }
  }
  
  res.status(statusCode).json(errorResponse)
}

// Async error wrapper
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

