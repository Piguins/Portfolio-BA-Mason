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

/**
 * @swagger
 * /api/specializations/{id}:
 *   get:
 *     summary: Get specialization by ID
 *     tags: [Specializations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Specialization ID
 *     responses:
 *       200:
 *         description: Specialization details
 *       404:
 *         description: Specialization not found
 */
router.get('/api/specializations/:id', specializationsController.getById)

/**
 * @swagger
 * /api/specializations:
 *   post:
 *     summary: Create new specialization
 *     tags: [Specializations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - number
 *               - title
 *             properties:
 *               number:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               order_index:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Specialization created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/api/specializations', authMiddleware, specializationsController.create)

/**
 * @swagger
 * /api/specializations/{id}:
 *   put:
 *     summary: Update specialization
 *     tags: [Specializations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Specialization ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               number:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               order_index:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Specialization updated successfully
 *       404:
 *         description: Specialization not found
 */
router.put('/api/specializations/:id', authMiddleware, specializationsController.update)

/**
 * @swagger
 * /api/specializations/{id}:
 *   delete:
 *     summary: Delete specialization
 *     tags: [Specializations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Specialization ID
 *     responses:
 *       200:
 *         description: Specialization deleted successfully
 *       404:
 *         description: Specialization not found
 */
router.delete('/api/specializations/:id', authMiddleware, specializationsController.delete)

export default router

