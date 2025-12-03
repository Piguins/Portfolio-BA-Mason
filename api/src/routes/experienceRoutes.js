// Experience routes
import express from 'express'
import { experienceController } from '../controllers/experienceController.js'

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
 *             examples:
 *               success:
 *                 summary: Successful response
 *                 value:
 *                   - id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                     company: "ABC Company"
 *                     role: "Senior Business Analyst"
 *                     bullets:
 *                       - id: 1
 *                         text: "Analyzed business requirements"
 *                     skills_used:
 *                       - id: 1
 *                         name: "SQL"
 *       500:
 *         description: Failed to fetch experience
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/api/experience', experienceController.getAll)

export default router

