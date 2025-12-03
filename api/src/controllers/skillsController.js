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
    res.json(skills)
  }),
}

