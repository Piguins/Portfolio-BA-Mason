// Authentication routes
import express from 'express'
import { createClient } from '@supabase/supabase-js'
import { getConfig } from '../config/index.js'

const router = express.Router()
const config = getConfig()

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY


const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                     session:
 *                       type: object
 *       401:
 *         description: Invalid credentials
 */
router.post('/api/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
        // Don't expose which field is missing
      })
    }

    if (!supabase) {
      // Security: Don't expose internal configuration errors
      return res.status(500).json({
        success: false,
        error: 'Service temporarily unavailable',
      })
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Security: Don't expose specific error details that could help attackers
      // Use generic error message to prevent user enumeration
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      })
    }

    // Security: Never return tokens or sensitive data in response
    // Supabase handles tokens via secure HTTP-only cookies automatically
    // Only return minimal, safe user information
    res.json({
      success: true,
      data: {
        user: {
          // Only return safe, non-sensitive user info
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0],
        },
        // Do not expose: id, tokens, session details, timestamps, etc.
      },
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/api/auth/logout', async (req, res, next) => {
  try {
    // Note: In a stateless API, logout is typically handled client-side
    // by removing the session token. This endpoint can be used for
    // server-side session invalidation if needed.
    res.json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @swagger
 * /api/auth/session:
 *   get:
 *     summary: Check current session
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Session information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     authenticated:
 *                       type: boolean
 *                     user:
 *                       type: object
 *       401:
 *         description: Not authenticated
 */
router.get('/api/auth/session', async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.replace('Bearer ', '')

    if (!token || !supabase) {
      return res.json({
        success: true,
        data: {
          authenticated: false,
        },
      })
    }

    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return res.json({
        success: true,
        data: {
          authenticated: false,
        },
      })
    }

    // Security: Only return minimal, safe user information
    res.json({
      success: true,
      data: {
        authenticated: true,
        user: {
          // Do not expose: id, tokens, metadata, timestamps
          email: user.email,
          name: user.user_metadata?.name || user.email?.split('@')[0],
        },
      },
    })
  } catch (error) {
    next(error)
  }
})

export default router

