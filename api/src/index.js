// Mason Portfolio API
// Tech stack: Node.js + Express + PostgreSQL (Supabase)

import express from 'express'
import cors from 'cors'
import compression from 'compression'
import { getConfig } from './config/index.js'
import { errorHandler } from './middleware/errorHandler.js'
import { securityHeaders } from './middleware/securityHeaders.js'

const config = getConfig()

// Routes
import healthRoutes from './routes/healthRoutes.js'
import authRoutes from './routes/authRoutes.js'
import projectsRoutes from './routes/projectsRoutes.js'
import skillsRoutes from './routes/skillsRoutes.js'
import experienceRoutes from './routes/experienceRoutes.js'
import swaggerRoutes from './routes/swaggerRoutes.js'

const app = express()

// Middleware
// Performance: Add response time header for monitoring
app.use((req, res, next) => {
  const startTime = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - startTime
    res.setHeader('X-Response-Time', `${duration}ms`)
    // Log slow requests (threshold lowered for better monitoring)
    if (duration > 300) {
      console.warn(`⚠️ Slow request: ${req.method} ${req.path} - ${duration}ms`)
    }
  })
  next()
})

// Compression middleware for faster responses (reduces response size by 60-80%)
app.use(compression())

app.use(securityHeaders)
app.use(cors())
app.use(express.json())

// Routes
app.use('/', healthRoutes)
app.use('/', authRoutes)
app.use('/', projectsRoutes)
app.use('/', skillsRoutes)
app.use('/', experienceRoutes)
app.use('/', swaggerRoutes)

// Error handling (must be last)
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
