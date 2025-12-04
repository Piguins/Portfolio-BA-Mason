// Mason Portfolio API
// Tech stack: Node.js + Express + PostgreSQL (Supabase)

import express from 'express'
import cors from 'cors'
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
