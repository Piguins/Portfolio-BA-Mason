// Mason Portfolio API
// Tech stack: Node.js + Express + PostgreSQL (Supabase)
// SECURITY: Hardened with Helmet, Rate Limiting, CORS, HPP protection

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
import { swaggerAuth } from './middleware/swaggerAuth.js'

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
// SECURITY MIDDLEWARE (Order matters!)
// ============================================

// 1. Helmet - Secure HTTP headers (must be first)
app.use(helmetMiddleware)

// 2. CORS - Strict origin checking
app.use(corsMiddleware)

// 3. HPP - HTTP Parameter Pollution protection
app.use(hppMiddleware)

// 4. Rate Limiting - DDoS and brute-force protection
app.use(apiLimiter)

// 5. Performance: Add response time header for monitoring
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

// 6. Compression middleware for faster responses (reduces response size by 60-80%)
app.use(compression())

// 7. Additional security headers (complement to Helmet)
app.use(securityHeaders)

// 8. Body parsing (after security middleware)
app.use(express.json({ limit: '10mb' })) // Limit body size to prevent DoS
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ============================================
// ROUTES
// ============================================

// Health check (no rate limiting, no auth)
app.use('/', healthRoutes)

// Authentication routes (stricter rate limiting)
app.use('/api/auth', authLimiter)
app.use('/', authRoutes)

// Protected API routes
app.use('/', heroRoutes)
app.use('/', specializationsRoutes)
app.use('/', projectsRoutes)
app.use('/', skillsRoutes)
app.use('/', experienceRoutes)

// Swagger documentation (protected with Basic Auth)
// Note: swaggerAuth middleware is applied to routes in swaggerRoutes.js
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
