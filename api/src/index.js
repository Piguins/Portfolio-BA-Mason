// Mason Portfolio API
// Tech stack: Node.js + Express + PostgreSQL (Supabase via pg)

import express from 'express'
import cors from 'cors'
import client from './db.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// Health check
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

// Root
app.get('/', (req, res) => {
  res.json({
    message: 'Mason Portfolio API',
    docs: 'Available endpoints: /health, /api/projects, /api/skills, /api/experience',
  })
})

// === Public read-only endpoints for FE & CMS ===

// Projects (portfolio items)
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

// Skills (for skills section + tools orbit)
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

// Experience timeline
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

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`)
})


