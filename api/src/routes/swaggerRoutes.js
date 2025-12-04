// Swagger documentation routes
import express from 'express'
import { swaggerSpec } from '../swagger.js'
import { generateSwaggerHtml } from '../utils/swaggerHtml.js'
import { getBaseUrl } from '../utils/urlHelper.js'
import { swaggerAuth } from '../middleware/swaggerAuth.js'

const router = express.Router()

// Protect Swagger routes with Basic Authentication
router.use('/api-docs', swaggerAuth)
router.use('/api-docs.json', swaggerAuth)

// Serve Swagger JSON spec
router.get('/api-docs.json', (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json')
    // CORS is handled by corsMiddleware in index.js
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.json(swaggerSpec)
  } catch (error) {
    console.error('Error serving Swagger spec:', error)
    res.status(500).json({ error: 'Failed to generate Swagger spec' })
  }
})

// Serve Swagger UI
router.get('/api-docs', (req, res) => {
  try {
    const baseUrl = getBaseUrl(req)
    const html = generateSwaggerHtml(baseUrl)
    res.setHeader('Content-Type', 'text/html')
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.send(html)
  } catch (error) {
    console.error('Error serving Swagger UI:', error)
    res.status(500).send('<h1>Error loading Swagger UI</h1><p>' + error.message + '</p>')
  }
})

export default router

