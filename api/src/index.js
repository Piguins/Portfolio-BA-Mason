// Mason Portfolio API
// Tech stack: Node.js + Express + PostgreSQL (Supabase via pg)

import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import path from 'path'
import { fileURLToPath } from 'url'
import client from './db.js'
import { swaggerSpec } from './swagger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// Swagger UI - Setup for Vercel serverless
const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Mason Portfolio API Documentation',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: true,
    docExpansion: 'list',
  },
}

// Serve Swagger JSON spec
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

// Setup Swagger UI - MUST be before static files
app.use('/api-docs', swaggerUi.serve)
app.get('/api-docs', (req, res) => {
  const html = swaggerUi.generateHTML(swaggerSpec, swaggerOptions)
  res.send(html)
})

// Serve Swagger UI static files (CSS, JS) - MUST be after main route
app.use('/api-docs', express.static(path.join(__dirname, '../node_modules/swagger-ui-dist'), {
  index: false, // Don't serve index.html, we handle it above
}))

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     description: Check API and database connection status
 *     responses:
 *       200:
 *         description: API is healthy and database is connected
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 service:
 *                   type: string
 *                   example: portfolio-api
 *                 database:
 *                   type: string
 *                   example: connected
 *       500:
 *         description: Database connection failed
 */
app.get('/health', async (req, res) => {
  try {
    // Simple DB ping
    await client.query('SELECT 1')
    res.json({
      status: 'ok',
      service: 'portfolio-api',
      database: 'connected',
    })
  } catch (err) {
    console.error('Health check error:', err)
    res.status(500).json({ status: 'error', message: 'Database connection failed' })
  }
})

/**
 * @swagger
 * /:
 *   get:
 *     summary: API root endpoint
 *     tags: [Health]
 *     description: Get API information and available endpoints
 *     responses:
 *       200:
 *         description: API information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Mason Portfolio API
 *                 docs:
 *                   type: string
 *                   example: "Available endpoints: /health, /api/projects, /api/skills, /api/experience"
 *                 swagger:
 *                   type: string
 *                   example: /api-docs
 */
app.get('/', (req, res) => {
  res.json({
    message: 'Mason Portfolio API',
    docs: 'Available endpoints: /health, /api/projects, /api/skills, /api/experience',
    swagger: '/api-docs',
  })
})

// === Public read-only endpoints for FE & CMS ===

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all published projects
 *     tags: [Projects]
 *     description: Retrieve all published portfolio projects with their tags
 *     responses:
 *       200:
 *         description: List of published projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   slug:
 *                     type: string
 *                   title:
 *                     type: string
 *                   subtitle:
 *                     type: string
 *                   summary:
 *                     type: string
 *                   content:
 *                     type: string
 *                   hero_image_url:
 *                     type: string
 *                   case_study_url:
 *                     type: string
 *                   external_url:
 *                     type: string
 *                   order_index:
 *                     type: integer
 *                   is_published:
 *                     type: boolean
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                         color:
 *                           type: string
 *       500:
 *         description: Failed to fetch projects
 */
app.get('/api/projects', async (req, res) => {
  try {
    const result = await client.query(`
      SELECT
        p.*,
        COALESCE(
          (SELECT json_agg(json_build_object('id', pt.id, 'name', pt.name, 'color', pt.color))
           FROM public.project_tags_map ptm
           JOIN public.project_tags pt ON ptm.tag_id = pt.id
           WHERE ptm.project_id = p.id),
          '[]'
        ) AS tags
      FROM public.projects p
      WHERE p.is_published = TRUE
      ORDER BY p.order_index ASC, p.created_at DESC
    `)
    res.json(result.rows)
  } catch (err) {
    console.error('GET /api/projects error:', err)
    res.status(500).json({ error: 'Failed to fetch projects' })
  }
})

/**
 * @swagger
 * /api/skills:
 *   get:
 *     summary: Get all skills
 *     tags: [Skills]
 *     description: Retrieve all skills/tools used in the portfolio
 *     responses:
 *       200:
 *         description: List of skills
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   slug:
 *                     type: string
 *                   category:
 *                     type: string
 *                   level:
 *                     type: integer
 *                     minimum: 1
 *                     maximum: 5
 *                   icon_url:
 *                     type: string
 *                   description:
 *                     type: string
 *                   order_index:
 *                     type: integer
 *                   is_highlight:
 *                     type: boolean
 *       500:
 *         description: Failed to fetch skills
 */
app.get('/api/skills', async (req, res) => {
  try {
    const result = await client.query(`
      SELECT *
      FROM public.skills
      ORDER BY category ASC, order_index ASC, id ASC
    `)
    res.json(result.rows)
  } catch (err) {
    console.error('GET /api/skills error:', err)
    res.status(500).json({ error: 'Failed to fetch skills' })
  }
})

/**
 * @swagger
 * /api/experience:
 *   get:
 *     summary: Get all work experience
 *     tags: [Experience]
 *     description: Retrieve all work experience entries with bullets and skills used
 *     responses:
 *       200:
 *         description: List of work experience
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   company:
 *                     type: string
 *                   role:
 *                     type: string
 *                   location:
 *                     type: string
 *                   start_date:
 *                     type: string
 *                     format: date
 *                   end_date:
 *                     type: string
 *                     format: date
 *                   is_current:
 *                     type: boolean
 *                   description:
 *                     type: string
 *                   bullets:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         text:
 *                           type: string
 *                         order_index:
 *                           type: integer
 *                   skills_used:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                         slug:
 *                           type: string
 *                         icon_url:
 *                           type: string
 *       500:
 *         description: Failed to fetch experience
 */
app.get('/api/experience', async (req, res) => {
  try {
    const result = await client.query(`
      SELECT
        e.*,
        COALESCE(
          (SELECT json_agg(json_build_object('id', eb.id, 'text', eb.text, 'order_index', eb.order_index))
           FROM public.experience_bullets eb
           WHERE eb.experience_id = e.id
           ORDER BY eb.order_index ASC),
          '[]'
        ) AS bullets,
        COALESCE(
          (SELECT json_agg(json_build_object('id', s.id, 'name', s.name, 'slug', s.slug, 'icon_url', s.icon_url))
           FROM public.experience_skills es
           JOIN public.skills s ON es.skill_id = s.id
           WHERE es.experience_id = e.id
           ORDER BY s.order_index ASC),
          '[]'
        ) AS skills_used
      FROM public.experience e
      ORDER BY e.order_index ASC, e.start_date DESC
    `)
    res.json(result.rows)
  } catch (err) {
    console.error('GET /api/experience error:', err)
    res.status(500).json({ error: 'Failed to fetch experience' })
  }
})

// Export for Vercel serverless
export default app

// Start server only if not in Vercel environment
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 API server running on http://localhost:${PORT}`)
    console.log(`📚 Swagger docs available at http://localhost:${PORT}/api-docs`)
  })
}


