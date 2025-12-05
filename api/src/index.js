import express from 'express'
import compression from 'compression'
import { getConfig } from './config/index.js'
import { errorHandler } from './middleware/errorHandler.js'
import { securityHeaders } from './middleware/securityHeaders.js'

// Security middleware
import { helmetMiddleware } from './middleware/helmet.js'
import { corsMiddleware } from './middleware/cors.js'
import { hppMiddleware } from './middleware/hpp.js'
import { apiLimiter, authLimiter } from './middleware/rateLimiter.js'

// Performance middleware
import { performanceLogger } from './middleware/performanceLogger.js'
import { cacheMiddleware } from './middleware/cacheMiddleware.js'
import { requestTimeout } from './middleware/requestTimeout.js'

// Database connection pool - lazy loaded (non-blocking)
// Import is side-effect only - pool creation doesn't block
import './db.js'

const config = getConfig()

// Routes
import healthRoutes from './routes/healthRoutes.js'
import authRoutes from './routes/authRoutes.js'
import heroRoutes from './routes/heroRoutes.js'
import specializationsRoutes from './routes/specializationsRoutes.js'
import projectsRoutes from './routes/projectsRoutes.js'
import skillsRoutes from './routes/skillsRoutes.js'
import experienceRoutes from './routes/experienceRoutes.js'
import swaggerRoutes from './routes/swaggerRoutes.js'

const app = express()

// ============================================
// OPTIMIZED MIDDLEWARE STACK
// ============================================

// CRITICAL: Root endpoint FIRST - before all middleware
// This ensures instant response without any middleware overhead
app.get('/', (req, res) => {
  res.json({
    message: 'Mason Portfolio API',
    docs: 'Available endpoints: /health, /api/projects, /api/skills, /api/experience',
    swagger: '/api-docs',
  })
})

// 1. Security middleware (after root endpoint)
app.use(helmetMiddleware)
app.use(corsMiddleware)
app.use(hppMiddleware)
app.use(apiLimiter)

// 2. Request timeout (skip for root - already handled above)
app.use(requestTimeout(30000))

// 3. Performance logging
app.use(performanceLogger)

// 4. Compression
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false
    }
    return compression.filter(req, res)
  },
}))

// 5. Security headers
app.use(securityHeaders)

// 6. Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// 7. Caching middleware
app.use(cacheMiddleware)

// Routes
app.use('/', healthRoutes)
app.use('/', swaggerRoutes)
app.use('/api/auth', authLimiter)
app.use('/', authRoutes)
app.use('/', heroRoutes)
app.use('/', specializationsRoutes)
app.use('/', projectsRoutes)
app.use('/', skillsRoutes)
app.use('/', experienceRoutes)
app.use(errorHandler)

// Export for Vercel serverless
export default app

// Start server only if not in Vercel environment
if (!config.isVercel) {
  app.listen(config.port, () => {
    console.log(`🚀 API server running on http://localhost:${config.port}`)
    console.log(`📚 Swagger docs available at http://localhost:${config.port}/api-docs`)
  })
}
