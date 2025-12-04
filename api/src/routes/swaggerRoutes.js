// Swagger documentation routes
import express from 'express'
import { swaggerSpec } from '../swagger.js'
import { generateSwaggerHtml } from '../utils/swaggerHtml.js'
import { getBaseUrl } from '../utils/urlHelper.js'

const router = express.Router()

// Serve Swagger JSON spec
router.get('/api-docs.json', (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
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

