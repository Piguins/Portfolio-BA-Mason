// Hero routes
import express from 'express'
import { heroController } from '../controllers/heroController.js'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Hero
 *   description: Hero section content management (singleton)
 */

/**
 * @swagger
 * /api/hero:
 *   get:
 *     summary: Get hero content
 *     tags: [Hero]
 *     description: Retrieve hero section content (singleton - only 1 record)
 *     responses:
 *       200:
 *         description: Hero content
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 greeting:
 *                   type: string
 *                 greeting_part2:
 *                   type: string
 *                 name:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 linkedin_url:
 *                   type: string
 *                 github_url:
 *                   type: string
 *                 email_url:
 *                   type: string
 *                 profile_image_url:
 *                   type: string
 */
router.get('/api/hero', heroController.get)

/**
 * @swagger
 * /api/hero:
 *   put:
 *     summary: Update hero content
 *     tags: [Hero]
 *     description: Update hero section content (singleton - always updates id = 1)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               greeting:
 *                 type: string
 *               greeting_part2:
 *                 type: string
 *               name:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               linkedin_url:
 *                 type: string
 *               github_url:
 *                 type: string
 *               email_url:
 *                 type: string
 *               profile_image_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Hero content updated successfully
 */
router.put('/api/hero', heroController.update)

export default router

