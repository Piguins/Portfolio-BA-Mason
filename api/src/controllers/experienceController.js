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
}

