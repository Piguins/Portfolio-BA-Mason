// Swagger documentation routes
import express from 'express'
import { swaggerSpec } from '../swagger.js'
import { generateSwaggerHtml } from '../utils/swaggerHtml.js'
import { getBaseUrl } from '../utils/urlHelper.js'

const router = express.Router()

// Serve Swagger JSON spec
router.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.send(swaggerSpec)
})

// Serve Swagger UI
router.get('/api-docs', (req, res) => {
  const baseUrl = getBaseUrl(req)
  const html = generateSwaggerHtml(baseUrl)
  res.send(html)
})

export default router

