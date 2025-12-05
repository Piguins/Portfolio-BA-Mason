// Security utilities for sanitizing and protecting sensitive data

/**
 * Sanitize user data - remove sensitive fields before sending to client
 */
export function sanitizeUser(user: any) {
  if (!user) return null

  return {
    email: user.email,
    name: user.user_metadata?.name || user.email?.split('@')[0],
    // Explicitly exclude sensitive fields:
    // - id (UUID can be used for enumeration)
    // - tokens (access_token, refresh_token)
    // - timestamps (created_at, updated_at, last_sign_in_at)
    // - metadata (app_metadata, user_metadata may contain sensitive info)
    // - confirmation tokens
  }
}

/**
 * Sanitize error messages to prevent information disclosure
 */
export function sanitizeError(error: any): string {
  if (!error) {
    return 'An error occurred'
  }

  const errorMessage = error.message || error.toString()

  // Don't expose internal errors, stack traces, or sensitive info
  if (
    errorMessage.includes('password') ||
    errorMessage.includes('token') ||
    errorMessage.includes('secret') ||
    errorMessage.includes('key') ||
    errorMessage.includes('database') ||
    errorMessage.includes('connection')
  ) {
    return 'An error occurred. Please try again later.'
  }

  // For known safe errors, return generic message
  if (errorMessage.includes('not found') || errorMessage.includes('invalid')) {
    return 'Invalid request'
  }

  return 'An error occurred'
}

/**
 * Check if response contains sensitive data
 */
export function containsSensitiveData(data: any): boolean {
  if (!data || typeof data !== 'object') return false

  const sensitiveKeys = [
    'password',
    'token',
    'secret',
    'key',
    'access_token',
    'refresh_token',
    'api_key',
    'private_key',
    'session',
    'cookie',
  ]

  const checkObject = (obj: any): boolean => {
    for (const key in obj) {
      const lowerKey = key.toLowerCase()
      if (sensitiveKeys.some((sk) => lowerKey.includes(sk))) {
        return true
      }
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        if (checkObject(obj[key])) return true
      }
    }
    return false
  }

  return checkObject(data)
}
