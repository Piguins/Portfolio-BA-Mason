// Specializations routes
import express from 'express'
import { specializationsController } from '../controllers/specializationsController.js'

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
router.get('/api/specializations', specializationsController.getAll)
router.get('/api/specializations/:id', specializationsController.getById)
router.post('/api/specializations', specializationsController.create)
router.put('/api/specializations/:id', specializationsController.update)
router.delete('/api/specializations/:id', specializationsController.delete)

export default router

