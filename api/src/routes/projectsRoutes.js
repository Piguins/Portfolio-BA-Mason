// Projects routes
import express from 'express'
import { projectsController } from '../controllers/projectsController.js'

const router = express.Router()

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all published projects
 *     tags: [Projects]
 *     description: Retrieve all published portfolio projects with their tags
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Maximum number of projects to return
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by tag name
 *     responses:
 *       200:
 *         description: List of published projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *             examples:
 *               success:
 *                 summary: Successful response
 *                 value:
 *                   - id: "d185db63-609f-4472-afb4-9b9fffbb8adf"
 *                     slug: "ba-portfolio-redesign"
 *                     title: "Re-Design For Business Analyst Portfolio"
 *                     tags:
 *                       - id: 1
 *                         name: "Business Analysis"
 *                         color: "blue"
 *       500:
 *         description: Failed to fetch projects
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// IMPORTANT: Route order matters! More specific routes first
router.get('/api/projects', projectsController.getAll)
router.get('/api/projects/id/:id', projectsController.getById) // Must come before :slug
router.post('/api/projects', projectsController.create)
router.put('/api/projects/:id', projectsController.update)
router.delete('/api/projects/:id', projectsController.delete)
router.get('/api/projects/:slug', projectsController.getBySlug) // Must be last (catch-all for slugs)

export default router

