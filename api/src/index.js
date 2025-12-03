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
  // Get the base URL (protocol + host)
  // In Vercel, check X-Forwarded-Proto header for HTTPS
  const protocol = req.get('x-forwarded-proto') || req.protocol || 'https'
  const host = req.get('host') || req.get('x-forwarded-host') || 'api.mason.id.vn'
  // Always use HTTPS for production, or match the request protocol
  const finalProtocol = protocol === 'https' || host.includes('vercel.app') || host.includes('mason.id.vn') ? 'https' : protocol
  const baseUrl = `${finalProtocol}://${host}`
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mason Portfolio API Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui.css" />
  <style>
    .swagger-ui .topbar { display: none; }
    body { margin: 0; }
    /* Remove any blocking styles */
    * { box-sizing: border-box; }
    .swagger-ui * { pointer-events: auto !important; }
    /* Ensure Try it out buttons are visible and clickable */
    .swagger-ui .try-out__btn,
    .swagger-ui .btn.try-out__btn {
      cursor: pointer !important;
      pointer-events: auto !important;
      opacity: 1 !important;
      display: inline-block !important;
      visibility: visible !important;
    }
    .swagger-ui .opblock.opblock-get .opblock-summary,
    .swagger-ui .opblock.opblock-post .opblock-summary,
    .swagger-ui .opblock.opblock-put .opblock-summary,
    .swagger-ui .opblock.opblock-delete .opblock-summary,
    .swagger-ui .opblock.opblock-patch .opblock-summary {
      cursor: pointer !important;
      pointer-events: auto !important;
    }
    /* Ensure operations are expandable */
    .swagger-ui .opblock {
      margin-bottom: 10px;
      pointer-events: auto !important;
    }
    .swagger-ui .opblock-summary {
      cursor: pointer !important;
      pointer-events: auto !important;
    }
    .swagger-ui .opblock-summary:hover {
      background-color: rgba(0,0,0,0.05);
    }
    /* Ensure all buttons are clickable */
    .swagger-ui button,
    .swagger-ui .btn {
      cursor: pointer !important;
      pointer-events: auto !important;
    }
    .swagger-ui .execute {
      cursor: pointer !important;
      pointer-events: auto !important;
    }
    /* Ensure expand/collapse works */
    .swagger-ui .opblock-tag {
      cursor: pointer !important;
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-standalone-preset.js"></script>
  <script>
    (function() {
      'use strict';
      
      // Wait for DOM and Swagger UI to be ready
      function initSwagger() {
        if (typeof SwaggerUIBundle === 'undefined') {
          console.error('SwaggerUIBundle not loaded');
          setTimeout(initSwagger, 100);
          return;
        }
        
        const specUrl = '${baseUrl}/api-docs.json';
        console.log('Loading Swagger spec from:', specUrl);
        
        try {
          window.ui = SwaggerUIBundle({
            url: specUrl,
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
            requestInterceptor: function(request) {
              console.log('Request:', request.method, request.url);
              return request;
            },
            responseInterceptor: function(response) {
              console.log('Response:', response.status);
              return response;
            },
            docExpansion: 'list',
            defaultModelsExpandDepth: 2,
            defaultModelExpandDepth: 2,
            supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'],
            validatorUrl: null,
            onComplete: function() {
              console.log('✅ Swagger UI loaded successfully');
              
              // Force enable all interactions
              setTimeout(function enableInteractions() {
                console.log('🔧 Enabling interactions...');
                
                // Enable all opblock summaries (expand/collapse)
                const opblockSummaries = document.querySelectorAll('.opblock-summary');
                console.log('Found', opblockSummaries.length, 'opblock summaries');
                opblockSummaries.forEach(function(summary, index) {
                  summary.style.cursor = 'pointer';
                  summary.style.pointerEvents = 'auto';
                  summary.setAttribute('tabindex', '0');
                  
                  // Remove any event blockers
                  summary.onclick = null;
                  
                  // Re-enable click events
                  summary.addEventListener('click', function(e) {
                    console.log('Opblock clicked:', index);
                    // Let Swagger UI handle it
                  }, true);
                });
                
                // Enable Try it out buttons
                const tryItOutButtons = document.querySelectorAll('.try-out__btn, .btn.try-out__btn');
                console.log('Found', tryItOutButtons.length, 'Try it out buttons');
                tryItOutButtons.forEach(function(btn, index) {
                  btn.style.pointerEvents = 'auto';
                  btn.style.cursor = 'pointer';
                  btn.style.opacity = '1';
                  btn.style.display = 'inline-block';
                  btn.style.visibility = 'visible';
                  btn.disabled = false;
                  btn.removeAttribute('disabled');
                  
                  btn.addEventListener('click', function(e) {
                    console.log('Try it out clicked:', index);
                    e.stopPropagation();
                  }, true);
                });
                
                // Enable Execute buttons
                const executeButtons = document.querySelectorAll('.execute, .btn.execute');
                console.log('Found', executeButtons.length, 'Execute buttons');
                executeButtons.forEach(function(btn, index) {
                  btn.style.pointerEvents = 'auto';
                  btn.style.cursor = 'pointer';
                  btn.disabled = false;
                  btn.removeAttribute('disabled');
                });
                
                // Enable tag expansion
                const tags = document.querySelectorAll('.opblock-tag');
                console.log('Found', tags.length, 'tags');
                tags.forEach(function(tag) {
                  tag.style.cursor = 'pointer';
                  tag.style.pointerEvents = 'auto';
                });
                
                console.log('✅ All interactions enabled');
              }, 2000);
            },
            onFailure: function(data) {
              console.error('❌ Swagger UI failed to load:', data);
              document.getElementById('swagger-ui').innerHTML = 
                '<div style="padding: 20px; color: red;">' +
                '<h2>Failed to load API definition</h2>' +
                '<pre>' + JSON.stringify(data, null, 2) + '</pre>' +
                '</div>';
            }
          });
        } catch (error) {
          console.error('❌ Error initializing Swagger UI:', error);
          document.getElementById('swagger-ui').innerHTML = 
            '<div style="padding: 20px; color: red;">' +
            '<h2>Error initializing Swagger UI</h2>' +
            '<pre>' + error.toString() + '</pre>' +
            '</div>';
        }
      }
      
      // Start initialization
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSwagger);
      } else {
        initSwagger();
      }
    })();
  </script>
</body>
</html>`
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


