// Mason Portfolio API
// Tech stack: Node.js + Express + PostgreSQL (Supabase via pg)

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import pkg from 'pg'

dotenv.config()

const { Pool } = pkg

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// PostgreSQL connection pool.
// For Supabase, set DATABASE_URL in api/.env, ví dụ:
// DATABASE_URL=postgresql://<user>:<password>@<host>:5432/postgres
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// Health check
app.get('/health', async (req, res) => {
  try {
    // Simple DB ping (optional, will be skipped if no DATABASE_URL)
    if (process.env.DATABASE_URL) {
      await pool.query('SELECT 1')
    }
    res.json({
      status: 'ok',
      service: 'portfolio-api',
      database: !!process.env.DATABASE_URL ? 'connected' : 'not_configured',
    })
  } catch (err) {
    console.error('Health check error:', err)
    res.status(500).json({ status: 'error', message: 'Database connection failed' })
  }
})

// Simple helpers
async function query(text, params = []) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured')
  }
  const result = await pool.query(text, params)
  return result.rows
}

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
    const rows = await query(
      `select
         p.*,
         coalesce(
           json_agg(
             json_build_object('id', t.id, 'name', t.name, 'color', t.color)
           ) filter (where t.id is not null),
           '[]'
         ) as tags
       from public.projects p
       left join public.project_tags_map ptm on ptm.project_id = p.id
       left join public.project_tags t on t.id = ptm.tag_id
       where p.is_published = true
       group by p.id
       order by p.order_index asc, p.created_at desc`,
    )
    res.json(rows)
  } catch (err) {
    console.error('GET /api/projects error:', err)
    res.status(500).json({ error: 'Failed to fetch projects' })
  }
})

// Skills (for skills section + tools orbit)
app.get('/api/skills', async (req, res) => {
  try {
    const rows = await query(
      `select *
       from public.skills
       order by category asc, order_index asc, id asc`,
    )
    res.json(rows)
  } catch (err) {
    console.error('GET /api/skills error:', err)
    res.status(500).json({ error: 'Failed to fetch skills' })
  }
})

// Experience timeline
app.get('/api/experience', async (req, res) => {
  try {
    const rows = await query(
      `select
         e.*,
         coalesce(
           json_agg(
             json_build_object(
               'id', b.id,
               'text', b.text,
               'order_index', b.order_index
             ) order by b.order_index
           ) filter (where b.id is not null),
           '[]'
         ) as bullets
       from public.experience e
       left join public.experience_bullets b on b.experience_id = e.id
       group by e.id
       order by e.order_index asc, e.start_date desc`,
    )
    res.json(rows)
  } catch (err) {
    console.error('GET /api/experience error:', err)
    res.status(500).json({ error: 'Failed to fetch experience' })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`)
})


