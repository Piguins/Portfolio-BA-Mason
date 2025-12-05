// API Key authentication middleware
// Simple API key protection for API endpoints

/**
 * API Key middleware
 * Validates X-API-Key header or api_key query parameter
 */
export const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key
  const validApiKey = process.env.API_KEY

  if (!validApiKey) {
    return next()
  }
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

  next()
}

