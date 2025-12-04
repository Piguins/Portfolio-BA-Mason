// Projects controller
import { projectsService } from '../services/projectsService.js'
import { asyncHandler } from '../middleware/errorHandler.js'

export const projectsController = {
  /**
   * Get all projects (CMS: all, Public: published only)
   * OPTIMIZED: Supports pagination, backward compatible
   */
  getAll: asyncHandler(async (req, res) => {
    const filters = {
      published: req.query.published === 'true' ? true : req.query.published === 'false' ? false : undefined,
      limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset) : undefined,
    }
    
    // If no published filter, default to published=true for public API
    if (filters.published === undefined) {
      filters.published = true
    }
    
    const result = await projectsService.getAll(filters)
    
    // Add cache headers for GET requests
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60')
    
    // Backward compatible: return array if no pagination requested, otherwise return object
    if (result.pagination) {
      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      })
    } else {
      res.json(result.data)
    }
  }),
  
  /**
   * Get project by slug (public)
   */
  getBySlug: asyncHandler(async (req, res) => {
    const { slug } = req.params
    const project = await projectsService.getBySlug(slug)
    
    if (!project) {
      return res.status(404).json({ 
        success: false,
        error: 'Project not found' 
      })
    }
    
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60')
    res.json(project)
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
    if (!req.body.title || !req.body.slug) {
      return res.status(400).json({
        success: false,
        error: 'Title and slug are required',
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

