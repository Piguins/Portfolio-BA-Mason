// HTTP Parameter Pollution (HPP) protection middleware
// Prevents parameter override attacks

import hpp from 'hpp'

/**
 * HPP middleware configuration
 * Removes duplicate query parameters and prevents parameter pollution attacks
 */
export const hppMiddleware = hpp({
  // Whitelist parameters that are allowed to have multiple values
  whitelist: [
    'tags', // Allow multiple tags in query
    'categories', // Allow multiple categories
  ],
  // Check query string, body, and params
  checkQuery: true,
  checkBody: true,
  checkBodyOnlyForContentType: ['application/json', 'application/x-www-form-urlencoded'],
})

