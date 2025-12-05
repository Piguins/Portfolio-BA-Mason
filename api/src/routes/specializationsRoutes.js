// Specializations routes
import express from 'express'
import { specializationsController } from '../controllers/specializationsController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Specializations
 *   description: Specializations section management (3 cards - "I specialize in")
 */

/**
 * @swagger
 * /api/specializations:
 *   get:
 *     summary: Get all specializations
 *     tags: [Specializations]
 *     description: Retrieve all specializations ordered by order_index
 *     responses:
 *       200:
 *         description: List of specializations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   number:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   order_index:
 *                     type: integer
 */
// GET routes are public (no authentication required)
router.get('/api/specializations', specializationsController.getAll)
router.get('/api/specializations/:id', specializationsController.getById)

// POST/PUT/DELETE routes require Access Token (JWT)
router.post('/api/specializations', authMiddleware, specializationsController.create)
router.put('/api/specializations/:id', authMiddleware, specializationsController.update)
router.delete('/api/specializations/:id', authMiddleware, specializationsController.delete)

export default router

