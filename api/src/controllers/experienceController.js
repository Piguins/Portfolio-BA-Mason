// Experience controller
import { experienceService } from '../services/experienceService.js'
import { asyncHandler } from '../middleware/errorHandler.js'

export const experienceController = {
  /**
   * Get all work experience
   */
  getAll: asyncHandler(async (req, res) => {
    const filters = {
      current: req.query.current === 'true' ? true : req.query.current === 'false' ? false : undefined,
      company: req.query.company,
    }
    
    const experience = await experienceService.getAll(filters)
    res.json(experience)
  }),

  /**
   * Get experience by ID
   */
  getById: asyncHandler(async (req, res) => {
    const { id } = req.params
    const experience = await experienceService.getById(id)
    
    if (!experience) {
      return res.status(404).json({
        success: false,
        error: 'Experience not found',
      })
    }
    
    res.json(experience)
  }),

  /**
   * Create new experience
   */
  create: asyncHandler(async (req, res) => {
    const experience = await experienceService.create(req.body)
    res.status(201).json({
      success: true,
      data: experience,
    })
  }),

  /**
   * Update experience
   */
  update: asyncHandler(async (req, res) => {
    const { id } = req.params
    const experience = await experienceService.update(id, req.body)
    
    if (!experience) {
      return res.status(404).json({
        success: false,
        error: 'Experience not found',
      })
    }
    
    res.json({
      success: true,
      data: experience,
    })
  }),

  /**
   * Delete experience
   */
  delete: asyncHandler(async (req, res) => {
    const { id } = req.params
    const experience = await experienceService.delete(id)
    
    if (!experience) {
      return res.status(404).json({
        success: false,
        error: 'Experience not found',
      })
    }
    
    res.json({
      success: true,
      message: 'Experience deleted successfully',
    })
  }),
}
