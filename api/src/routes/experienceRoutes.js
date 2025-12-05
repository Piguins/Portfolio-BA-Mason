// Experience routes
import express from 'express'
import { experienceController } from '../controllers/experienceController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

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
 *                 $ref: '#/components/schemas/Experience'
 */
router.get('/api/experience', experienceController.getAll)

/**
 * @swagger
 * /api/experience/{id}:
 *   get:
 *     summary: Get experience by ID
 *     tags: [Experience]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Experience ID
 *     responses:
 *       200:
 *         description: Experience details
 *       404:
 *         description: Experience not found
 */
router.get('/api/experience/:id', experienceController.getById)

/**
 * @swagger
 * /api/experience:
 *   post:
 *     summary: Create new experience
 *     tags: [Experience]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - company
 *               - role
 *               - start_date
 *             properties:
 *               company:
 *                 type: string
 *               role:
 *                 type: string
 *               location:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               is_current:
 *                 type: boolean
 *               description:
 *                 type: string
 *               order_index:
 *                 type: integer
 *               bullets:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *                     order_index:
 *                       type: integer
 *               skill_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Experience created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/api/experience', authMiddleware, experienceController.create)

/**
 * @swagger
 * /api/experience/{id}:
 *   put:
 *     summary: Update experience
 *     tags: [Experience]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company:
 *                 type: string
 *               role:
 *                 type: string
 *               location:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               is_current:
 *                 type: boolean
 *               description:
 *                 type: string
 *               order_index:
 *                 type: integer
 *               bullets:
 *                 type: array
 *               skill_ids:
 *                 type: array
 *     responses:
 *       200:
 *         description: Experience updated successfully
 *       404:
 *         description: Experience not found
 */
router.put('/api/experience/:id', authMiddleware, experienceController.update)

/**
 * @swagger
 * /api/experience/{id}:
 *   delete:
 *     summary: Delete experience
 *     tags: [Experience]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Experience deleted successfully
 *       404:
 *         description: Experience not found
 */
router.delete('/api/experience/:id', authMiddleware, experienceController.delete)

export default router
