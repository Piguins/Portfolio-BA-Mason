// Health check controller
import client from '../db.js'
import { asyncHandler } from '../middleware/errorHandler.js'

export const healthController = {
  /**
   * Health check endpoint
   */
  check: asyncHandler(async (req, res) => {
    try {
      await client.query('SELECT 1')
      res.json({
        status: 'ok',
        service: 'portfolio-api',
        database: 'connected',
      })
    } catch (err) {
      console.error('Health check error:', err)
      res.status(500).json({
        status: 'error',
        message: 'Database connection failed',
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

