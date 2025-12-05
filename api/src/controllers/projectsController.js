// Projects controller
import { projectsService } from '../services/projectsService.js'
import { asyncHandler } from '../middleware/errorHandler.js'

export const projectsController = {
  /**
   * Get all projects
   */
  getAll: asyncHandler(async (req, res) => {
    const projects = await projectsService.getAll()
    
    // Add cache headers for GET requests
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60')
    
    res.json(projects)
  }),

  /**
   * Get project by ID (CMS)
   */
  getById: asyncHandler(async (req, res) => {
    const { id } = req.params
    const project = await projectsService.getById(id)
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      })
    }
    
    res.json(project)
  }),

  /**
   * Create new project
   */
  create: asyncHandler(async (req, res) => {
    // Basic validation
    if (!req.body.title) {
      return res.status(400).json({
        success: false,
        error: 'Title is required',
      })
    }

    const project = await projectsService.create(req.body)
    res.status(201).json({
      success: true,
      data: project,
    })
  }),

  /**
   * Update project
   */
  update: asyncHandler(async (req, res) => {
    const { id } = req.params
    const project = await projectsService.update(id, req.body)
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      })
    }
    
    res.json({
      success: true,
      data: project,
    })
  }),

  /**
   * Delete project
   */
  delete: asyncHandler(async (req, res) => {
    const { id } = req.params
    const project = await projectsService.delete(id)
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      })
    }
    
    res.json({
      success: true,
      message: 'Project deleted successfully',
    })
  }),
}

