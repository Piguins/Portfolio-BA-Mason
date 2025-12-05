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

app.use(helmetMiddleware)
app.use(corsMiddleware)
app.use(hppMiddleware)
app.use(apiLimiter)

app.use((req, res, next) => {
  const startTime = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - startTime
    res.setHeader('X-Response-Time', `${duration}ms`)
  })
  next()
})

app.use(compression())
app.use(securityHeaders)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

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
