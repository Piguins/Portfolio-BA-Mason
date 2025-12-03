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

// Serve Swagger JSON spec
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.send(swaggerSpec)
})

// Custom Swagger UI HTML for Vercel serverless (using CDN)
app.get('/api-docs', (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Mason Portfolio API Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui.css" />
  <style>
    .swagger-ui .topbar { display: none; }
    body { margin: 0; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const spec = ${JSON.stringify(swaggerSpec)};
      window.ui = SwaggerUIBundle({
        spec: spec,
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        tryItOutEnabled: true,
        requestInterceptor: (request) => {
          // Enable CORS for all requests
          return request;
        },
        docExpansion: 'list',
        defaultModelsExpandDepth: 2,
        defaultModelExpandDepth: 2,
        supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
        validatorUrl: null, // Disable validator to avoid external requests
        onComplete: function() {
          // Force enable Try it out for all operations
          setTimeout(function() {
            const tryItOutButtons = document.querySelectorAll('.try-out__btn');
            tryItOutButtons.forEach(function(btn) {
              if (btn && !btn.classList.contains('cancel')) {
                btn.click();
              }
            });
          }, 500);
        }
      });
    };
  </script>
</body>
</html>
  `
  res.send(html)
})

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
 *             examples:
 *               success:
 *                 summary: Healthy API
 *                 value:
 *                   status: "ok"
 *                   service: "portfolio-api"
 *                   database: "connected"
 *       500:
 *         description: Database connection failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Database connection failed"
 *             examples:
 *               error:
 *                 summary: Database error
 *                 value:
 *                   status: "error"
 *                   message: "Database connection failed"
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
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Maximum number of projects to return
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by tag name
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
 *                     example: "d185db63-609f-4472-afb4-9b9fffbb8adf"
 *                   slug:
 *                     type: string
 *                     example: "ba-portfolio-redesign"
 *                   title:
 *                     type: string
 *                     example: "Re-Design For Business Analyst Portfolio"
 *                   subtitle:
 *                     type: string
 *                     example: "Improving clarity and storytelling for BA case studies"
 *                   summary:
 *                     type: string
 *                     example: "A redesign of my Business Analyst portfolio focusing on clarity, structure, and measurable outcomes."
 *                   content:
 *                     type: string
 *                     example: "In this case study, I restructured my portfolio..."
 *                   hero_image_url:
 *                     type: string
 *                     nullable: true
 *                     example: "https://example.com/image.jpg"
 *                   case_study_url:
 *                     type: string
 *                     nullable: true
 *                     example: "https://example.com/case-study"
 *                   external_url:
 *                     type: string
 *                     nullable: true
 *                     example: "https://example.com"
 *                   order_index:
 *                     type: integer
 *                     example: 1
 *                   is_published:
 *                     type: boolean
 *                     example: true
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-12-02T10:10:06.348Z"
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-12-02T10:10:06.348Z"
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: "Business Analysis"
 *                         color:
 *                           type: string
 *                           example: "blue"
 *             examples:
 *               success:
 *                 summary: Successful response
 *                 value:
 *                   - id: "d185db63-609f-4472-afb4-9b9fffbb8adf"
 *                     slug: "ba-portfolio-redesign"
 *                     title: "Re-Design For Business Analyst Portfolio"
 *                     subtitle: "Improving clarity and storytelling for BA case studies"
 *                     summary: "A redesign of my Business Analyst portfolio..."
 *                     tags:
 *                       - id: 1
 *                         name: "Business Analysis"
 *                         color: "blue"
 *       500:
 *         description: Failed to fetch projects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch projects"
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
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [technical, soft, tool]
 *         description: Filter skills by category
 *       - in: query
 *         name: highlight
 *         schema:
 *           type: boolean
 *         description: Filter only highlighted skills
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
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "SQL"
 *                   slug:
 *                     type: string
 *                     example: "sql"
 *                   category:
 *                     type: string
 *                     example: "technical"
 *                   level:
 *                     type: integer
 *                     minimum: 1
 *                     maximum: 5
 *                     example: 5
 *                   icon_url:
 *                     type: string
 *                     nullable: true
 *                     example: "/images/sql-logo.png"
 *                   description:
 *                     type: string
 *                     example: "Querying relational databases, joins, aggregations."
 *                   order_index:
 *                     type: integer
 *                     example: 1
 *                   is_highlight:
 *                     type: boolean
 *                     example: true
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-12-02T10:10:06.348Z"
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-12-02T10:10:06.348Z"
 *             examples:
 *               success:
 *                 summary: Successful response
 *                 value:
 *                   - id: 1
 *                     name: "SQL"
 *                     slug: "sql"
 *                     category: "technical"
 *                     level: 5
 *                     description: "Querying relational databases, joins, aggregations."
 *                     is_highlight: true
 *                   - id: 2
 *                     name: "Excel"
 *                     slug: "excel"
 *                     category: "technical"
 *                     level: 5
 *                     description: "Data cleaning, formulas, pivot tables, dashboards."
 *                     is_highlight: true
 *       500:
 *         description: Failed to fetch skills
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch skills"
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
 *     parameters:
 *       - in: query
 *         name: current
 *         schema:
 *           type: boolean
 *         description: Filter only current positions
 *       - in: query
 *         name: company
 *         schema:
 *           type: string
 *         description: Filter by company name
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
 *                     example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                   company:
 *                     type: string
 *                     example: "ABC Company"
 *                   role:
 *                     type: string
 *                     example: "Senior Business Analyst"
 *                   location:
 *                     type: string
 *                     nullable: true
 *                     example: "Ho Chi Minh City, Vietnam"
 *                   start_date:
 *                     type: string
 *                     format: date
 *                     example: "2023-01-01"
 *                   end_date:
 *                     type: string
 *                     format: date
 *                     nullable: true
 *                     example: "2024-12-31"
 *                   is_current:
 *                     type: boolean
 *                     example: false
 *                   description:
 *                     type: string
 *                     nullable: true
 *                     example: "Led business analysis initiatives..."
 *                   order_index:
 *                     type: integer
 *                     example: 1
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-12-02T10:10:06.348Z"
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-12-02T10:10:06.348Z"
 *                   bullets:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         text:
 *                           type: string
 *                           example: "Analyzed business requirements and created detailed specifications"
 *                         order_index:
 *                           type: integer
 *                           example: 1
 *                   skills_used:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: "SQL"
 *                         slug:
 *                           type: string
 *                           example: "sql"
 *                         icon_url:
 *                           type: string
 *                           nullable: true
 *                           example: "/images/sql-logo.png"
 *             examples:
 *               success:
 *                 summary: Successful response
 *                 value:
 *                   - id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                     company: "ABC Company"
 *                     role: "Senior Business Analyst"
 *                     location: "Ho Chi Minh City, Vietnam"
 *                     start_date: "2023-01-01"
 *                     end_date: "2024-12-31"
 *                     is_current: false
 *                     bullets:
 *                       - id: 1
 *                         text: "Analyzed business requirements"
 *                         order_index: 1
 *                     skills_used:
 *                       - id: 1
 *                         name: "SQL"
 *                         slug: "sql"
 *       500:
 *         description: Failed to fetch experience
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch experience"
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


