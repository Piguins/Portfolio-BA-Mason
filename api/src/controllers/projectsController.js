// Projects controller
import { projectsService } from '../services/projectsService.js'
import { asyncHandler } from '../middleware/errorHandler.js'

export const projectsController = {
  /**
   * Get all published projects
   */
  getAll: asyncHandler(async (req, res) => {
    const projects = await projectsService.getAll()
    res.json(projects)
  }),
  
  /**
   * Get project by slug
   */
  getBySlug: asyncHandler(async (req, res) => {
    const { slug } = req.params
    const project = await projectsService.getBySlug(slug)
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }
    
    res.json(project)
  }),
}

