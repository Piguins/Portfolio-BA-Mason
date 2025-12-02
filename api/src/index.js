// Simple Express API skeleton for Mason Portfolio
// Tech stack: Node.js + Express + PostgreSQL (pg)
// This file just bootstraps the server and exposes a health-check route.

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

// PostgreSQL connection pool (placeholder config)
// You should set DATABASE_URL in your .env, for example:
// DATABASE_URL=postgresql://user:password@localhost:5432/portfolio
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

// Placeholder route namespace for future modules (projects, skills, posts, etc.)
app.get('/', (req, res) => {
  res.json({
    message: 'Mason Portfolio API',
    docs: 'Coming soon: /api/v1/* endpoints for projects, skills, and CMS content',
  })
})

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`)
})


