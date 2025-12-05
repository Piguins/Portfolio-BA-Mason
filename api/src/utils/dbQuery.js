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
  const startTime = Date.now()
  
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
    const duration = Date.now() - startTime
    
    // Log slow queries (>1s)
    if (duration > 1000) {
      console.log(`⚠️  Slow query (${duration}ms): ${text.substring(0, 100)}...`)
    }
    
    return result
  } catch (error) {
    const duration = Date.now() - startTime
    
    // Log timeout errors with more context
    if (error.message && error.message.includes('timeout')) {
      console.error(`⚠️  Database query timeout after ${duration}ms: ${text.substring(0, 100)}...`)
      console.error(`   Query params:`, params.length > 0 ? '[...]' : 'none')
    } else {
      // Log other database errors
      console.error(`❌ Database query error (${duration}ms):`, {
        message: error.message,
        code: error.code,
        query: text.substring(0, 100),
      })
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

