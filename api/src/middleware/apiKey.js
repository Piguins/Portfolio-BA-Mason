// API Key authentication middleware
// Simple API key protection for API endpoints

/**
 * API Key middleware
 * Validates X-API-Key header or api_key query parameter
 */
export const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key
  const validApiKey = process.env.API_KEY

  // If no API key is configured, allow all requests (development mode)
  if (!validApiKey) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('⚠️  API_KEY not set in production! API is unprotected.')
    }
    return next()
  }

  // Check if API key is provided and valid
  if (!apiKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'API key required. Provide X-API-Key header or api_key query parameter.',
    })
  }

  if (apiKey !== validApiKey) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid API key',
    })
  }

  // API key is valid, continue
  next()
}

