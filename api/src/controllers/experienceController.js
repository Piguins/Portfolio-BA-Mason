// Experience controller
import { experienceService } from '../services/experienceService.js'
import { asyncHandler } from '../middleware/errorHandler.js'

export const experienceController = {
  /**
   * Get all work experience
   * OPTIMIZED: Supports pagination, backward compatible with old format
   */
  getAll: asyncHandler(async (req, res) => {
    const filters = {
      current: req.query.current === 'true' ? true : req.query.current === 'false' ? false : undefined,
      company: req.query.company,
      limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset) : undefined,
    }
    
    const startTime = Date.now()
    const result = await experienceService.getAll(filters)
    const queryTime = Date.now() - startTime
    
    // Add cache headers for GET requests (5 minutes cache)
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60')
    
    // Add performance header
    res.setHeader('X-Query-Time', `${queryTime}ms`)
    
    // Backward compatible: return array if no pagination requested, otherwise return object
    if (result.pagination) {
      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      })
    } else {
      // Old format: return array directly for backward compatibility
      res.json(result.data)
    }
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
