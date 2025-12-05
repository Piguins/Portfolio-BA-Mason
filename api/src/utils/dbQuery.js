// Database query wrapper with timeout protection
// Prevents queries from hanging indefinitely

import client from '../db.js'

/**
 * Execute a database query with timeout protection
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @param {number} timeoutMs - Timeout in milliseconds (default: 10000 = 10s)
 * @returns {Promise} Query result
 */
export async function queryWithTimeout(text, params = [], timeoutMs = 10000) {
  const queryPromise = client.query(text, params)
  
  // Create timeout promise
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Database query timeout after ${timeoutMs}ms`))
    }, timeoutMs)
  })
  
  try {
    // Race between query and timeout
    const result = await Promise.race([queryPromise, timeoutPromise])
    return result
  } catch (error) {
    // Log timeout errors
    if (error.message && error.message.includes('timeout')) {
      console.error(`⚠️  Database query timeout: ${text.substring(0, 50)}...`)
    }
    throw error
  }
}

/**
 * Test database connection
 * @returns {Promise<boolean>} True if connected, false otherwise
 */
export async function testConnection() {
  try {
    await queryWithTimeout('SELECT 1', [], 3000)
    return true
  } catch (error) {
    console.error('Database connection test failed:', error.message)
    return false
  }
}

