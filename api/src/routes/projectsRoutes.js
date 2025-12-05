// Projects routes
import express from 'express'
import { projectsController } from '../controllers/projectsController.js'
import { authMiddleware } from '../middleware/auth.js'

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
// GET routes are public (no authentication required)
router.get('/api/projects', projectsController.getAll)

/**
 * @swagger
 * /api/projects/id/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Project ID (UUID)
 *     responses:
 *       200:
 *         description: Project details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 */
router.get('/api/projects/:id', projectsController.getById)

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - slug
 *             properties:
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               description:
 *                 type: string
 *               content:
 *                 type: string
 *               thumbnail_url:
 *                 type: string
 *               demo_url:
 *                 type: string
 *               github_url:
 *                 type: string
 *               is_published:
 *                 type: boolean
 *               order_index:
 *                 type: integer
 *               tag_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/api/projects', authMiddleware, projectsController.create)

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               description:
 *                 type: string
 *               content:
 *                 type: string
 *               thumbnail_url:
 *                 type: string
 *               demo_url:
 *                 type: string
 *               github_url:
 *                 type: string
 *               is_published:
 *                 type: boolean
 *               order_index:
 *                 type: integer
 *               tag_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       404:
 *         description: Project not found
 */
router.put('/api/projects/:id', authMiddleware, projectsController.update)

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       404:
 *         description: Project not found
 */
router.delete('/api/projects/:id', authMiddleware, projectsController.delete)

export default router

