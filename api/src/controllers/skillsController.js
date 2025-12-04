// Skills controller
import { skillsService } from '../services/skillsService.js'
import { asyncHandler } from '../middleware/errorHandler.js'

export const skillsController = {
  /**
   * Get all skills
   */
  getAll: asyncHandler(async (req, res) => {
    const filters = {
      category: req.query.category,
      highlight: req.query.highlight === 'true' ? true : req.query.highlight === 'false' ? false : undefined,
    }
    
    const skills = await skillsService.getAll(filters)
    
    // Add cache headers
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60')
    
    res.json(skills)
  }),

  /**
   * Get skill by ID
   */
  getById: asyncHandler(async (req, res) => {
    const { id } = req.params
    const skill = await skillsService.getById(id)
    
    if (!skill) {
      return res.status(404).json({
        success: false,
        error: 'Skill not found',
      })
    }
    
    res.json(skill)
  }),

  /**
   * Create new skill
   */
  create: asyncHandler(async (req, res) => {
    const skill = await skillsService.create(req.body)
    res.status(201).json({
      success: true,
      data: skill,
    })
  }),

  /**
   * Update skill
   */
  update: asyncHandler(async (req, res) => {
    const { id } = req.params
    const skill = await skillsService.update(id, req.body)
    
    if (!skill) {
      return res.status(404).json({
        success: false,
        error: 'Skill not found',
      })
    }
    
    res.json({
      success: true,
      data: skill,
    })
  }),

  /**
   * Delete skill
   */
  delete: asyncHandler(async (req, res) => {
    const { id } = req.params
    const skill = await skillsService.delete(id)
    
    if (!skill) {
      return res.status(404).json({
        success: false,
        error: 'Skill not found',
      })
    }
    
    res.json({
      success: true,
      message: 'Skill deleted successfully',
    })
  }),
}

