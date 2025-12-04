// Work Skills routes (separate from Skills section)
import express from 'express'
import { workSkillsController } from '../controllers/workSkillsController.js'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Work Skills
 *   description: Work Skills management (skills used in Experience - separate from Skills section)
 */

/**
 * @swagger
 * /api/work-skills:
 *   get:
 *     summary: Get all work skills
 *     tags: [Work Skills]
 *     description: Retrieve all work skills (used in Experience section, separate from Skills section)
 *     responses:
 *       200:
 *         description: List of work skills
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   slug:
 *                     type: string
 *                   category:
 *                     type: string
 */
router.get('/api/work-skills', workSkillsController.getAll)
router.get('/api/work-skills/:id', workSkillsController.getById)
router.post('/api/work-skills', workSkillsController.create)
router.put('/api/work-skills/:id', workSkillsController.update)
router.delete('/api/work-skills/:id', workSkillsController.delete)

export default router

