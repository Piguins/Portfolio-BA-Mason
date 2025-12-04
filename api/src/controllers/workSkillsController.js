// Work Skills controller
import { workSkillsService } from '../services/workSkillsService.js'
import { asyncHandler } from '../middleware/errorHandler.js'

export const workSkillsController = {
  /**
   * Get all work skills
   */
  getAll: asyncHandler(async (req, res) => {
    const workSkills = await workSkillsService.getAll()
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60')
    res.json(workSkills)
  }),

  /**
   * Get work skill by ID
   */
  getById: asyncHandler(async (req, res) => {
    const { id } = req.params
    const workSkill = await workSkillsService.getById(id)
    
    if (!workSkill) {
      return res.status(404).json({
        success: false,
        error: 'Work skill not found',
      })
    }
    
    res.json(workSkill)
  }),

  /**
   * Create new work skill
   */
  create: asyncHandler(async (req, res) => {
    // Basic validation
    if (!req.body.name || !req.body.slug) {
      return res.status(400).json({
        success: false,
        error: 'Name and slug are required',
      })
    }

    const workSkill = await workSkillsService.create(req.body)
    res.status(201).json({
      success: true,
      data: workSkill,
    })
  }),

  /**
   * Update work skill
   */
  update: asyncHandler(async (req, res) => {
    const { id } = req.params
    const workSkill = await workSkillsService.update(id, req.body)
    
    if (!workSkill) {
      return res.status(404).json({
        success: false,
        error: 'Work skill not found',
      })
    }
    
    res.json({
      success: true,
      data: workSkill,
    })
  }),

  /**
   * Delete work skill
   */
  delete: asyncHandler(async (req, res) => {
    const { id } = req.params
    const workSkill = await workSkillsService.delete(id)
    
    if (!workSkill) {
      return res.status(404).json({
        success: false,
        error: 'Work skill not found',
      })
    }
    
    res.json({
      success: true,
      message: 'Work skill deleted successfully',
    })
  }),
}

