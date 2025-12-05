// Health check controller
import client from '../db.js'
import { asyncHandler } from '../middleware/errorHandler.js'

export const healthController = {
  /**
   * Health check endpoint - fast response without blocking
   */
  check: (req, res) => {
    // Return immediately - don't block on database check
    // Database health can be checked separately if needed
    res.json({
      status: 'ok',
      service: 'portfolio-api',
      timestamp: new Date().toISOString(),
    })
  },
  
  /**
   * Database health check endpoint (separate, can be slow)
   */
  dbCheck: asyncHandler(async (req, res) => {
    // Check database connection with timeout (3 seconds)
    const dbCheckPromise = client.query('SELECT 1')
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database connection timeout')), 3000)
    })
    
    try {
      await Promise.race([dbCheckPromise, timeoutPromise])
      res.json({
        status: 'ok',
        service: 'portfolio-api',
        database: 'connected',
        timestamp: new Date().toISOString(),
      })
    } catch (err) {
      console.error('Database health check error:', err)
      res.status(500).json({
        status: 'error',
        service: 'portfolio-api',
        database: 'disconnected',
        message: err.message || 'Database connection failed',
        timestamp: new Date().toISOString(),
      })
    }
  }),
  
  /**
   * API root endpoint
   */
  root: (req, res) => {
    res.json({
      message: 'Mason Portfolio API',
      docs: 'Available endpoints: /health, /api/projects, /api/skills, /api/experience',
      swagger: '/api-docs',
    })
  },
}

