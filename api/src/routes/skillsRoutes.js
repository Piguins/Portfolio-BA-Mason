// Skills routes
import express from 'express'
import { skillsController } from '../controllers/skillsController.js'

const router = express.Router()

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
 *                 $ref: '#/components/schemas/Skill'
 *             examples:
 *               success:
 *                 summary: Successful response
 *                 value:
 *                   - id: 1
 *                     name: "SQL"
 *                     slug: "sql"
 *                     category: "technical"
 *                     level: 5
 *                     is_highlight: true
 *       500:
 *         description: Failed to fetch skills
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/api/skills', skillsController.getAll)

export default router

