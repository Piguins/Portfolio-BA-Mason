// Skills routes
import express from 'express'
import { skillsController } from '../controllers/skillsController.js'
import { authMiddleware } from '../middleware/auth.js'

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
// GET routes are public (no authentication required)
router.get('/api/skills', skillsController.getAll)

/**
 * @swagger
 * /api/skills/{id}:
 *   get:
 *     summary: Get skill by ID
 *     tags: [Skills]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Skill ID
 *     responses:
 *       200:
 *         description: Skill details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Skill'
 *       404:
 *         description: Skill not found
 */
router.get('/api/skills/:id', skillsController.getById)

/**
 * @swagger
 * /api/skills:
 *   post:
 *     summary: Create new skill
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [technical, soft, tool]
 *               level:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               icon_url:
 *                 type: string
 *               description:
 *                 type: string
 *               order_index:
 *                 type: integer
 *               is_highlight:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Skill created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/api/skills', authMiddleware, skillsController.create)

/**
 * @swagger
 * /api/skills/{id}:
 *   put:
 *     summary: Update skill
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Skill ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [technical, soft, tool]
 *               level:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               icon_url:
 *                 type: string
 *               description:
 *                 type: string
 *               order_index:
 *                 type: integer
 *               is_highlight:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Skill updated successfully
 *       404:
 *         description: Skill not found
 */
router.put('/api/skills/:id', authMiddleware, skillsController.update)

/**
 * @swagger
 * /api/skills/{id}:
 *   delete:
 *     summary: Delete skill
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Skill ID
 *     responses:
 *       200:
 *         description: Skill deleted successfully
 *       404:
 *         description: Skill not found
 */
router.delete('/api/skills/:id', authMiddleware, skillsController.delete)

export default router

