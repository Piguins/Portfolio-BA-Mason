// Swagger UI Basic Authentication middleware
// Protects API documentation from unauthorized access

import basicAuth from 'express-basic-auth'

// Get credentials from environment variables
const swaggerUsername = process.env.SWAGGER_USERNAME || 'admin'
const swaggerPassword = process.env.SWAGGER_PASSWORD

if (!swaggerPassword) {
  console.warn('⚠️  SWAGGER_PASSWORD not set. Swagger UI will be unprotected!')
  console.warn('   Set SWAGGER_PASSWORD in .env to protect API documentation.')
}

/**
 * Basic Authentication for Swagger UI
 * Protects /api-docs and /api-docs.json routes
 */
export const swaggerAuth = basicAuth({
  users: {
    [swaggerUsername]: swaggerPassword || 'changeme',
  },
  challenge: true, // Show login prompt
  realm: 'Mason Portfolio API Documentation',
  // Custom unauthorized response
  unauthorizedResponse: (req) => {
    return req.auth
      ? { error: 'Invalid credentials for API documentation' }
      : { error: 'Authentication required to access API documentation' }
  },
})

