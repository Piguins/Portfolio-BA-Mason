// Health check routes
import express from 'express'
import { healthController } from '../controllers/healthController.js'

const router = express.Router()

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     description: Check API and database connection status
 *     responses:
 *       200:
 *         description: API is healthy and database is connected
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 service:
 *                   type: string
 *                   example: portfolio-api
 *                 database:
 *                   type: string
 *                   example: connected
 *             examples:
 *               success:
 *                 summary: Healthy API
 *                 value:
 *                   status: "ok"
 *                   service: "portfolio-api"
 *                   database: "connected"
 *       500:
 *         description: Database connection failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Database connection failed"
 */
router.get('/health', healthController.check)

/**
 * @swagger
 * /:
 *   get:
 *     summary: API root endpoint
 *     tags: [Health]
 *     description: Get API information and available endpoints
 *     responses:
 *       200:
 *         description: API information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Mason Portfolio API
 *                 docs:
 *                   type: string
 *                   example: "Available endpoints: /health, /api/projects, /api/skills, /api/experience"
 *                 swagger:
 *                   type: string
 *                   example: /api-docs
 */
// Root endpoint is handled directly in index.js for better performance
// router.get('/', healthController.root)

export default router

