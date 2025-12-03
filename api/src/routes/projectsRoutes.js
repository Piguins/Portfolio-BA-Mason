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
router.get('/api/projects', projectsController.getAll)

/**
 * @swagger
 * /api/projects/{slug}:
 *   get:
 *     summary: Get project by slug
 *     tags: [Projects]
 *     description: Retrieve a specific project by its slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Project slug
 *     responses:
 *       200:
 *         description: Project details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/api/projects/:slug', projectsController.getBySlug)

export default router

