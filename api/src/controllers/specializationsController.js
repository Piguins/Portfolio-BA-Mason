// Specializations controller
import { specializationsService } from '../services/specializationsService.js'
import { asyncHandler } from '../middleware/errorHandler.js'

export const specializationsController = {
  /**
   * Get all specializations
   */
  getAll: asyncHandler(async (req, res) => {
    const specializations = await specializationsService.getAll()
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60')
    res.json(specializations)
  }),

  /**
   * Get specialization by ID
   */
  getById: asyncHandler(async (req, res) => {
    const { id } = req.params
    const specialization = await specializationsService.getById(id)
    
    if (!specialization) {
      return res.status(404).json({
        success: false,
        error: 'Specialization not found',
      })
    }
    
    res.json(specialization)
  }),

  /**
   * Create new specialization
   */
  create: asyncHandler(async (req, res) => {
    // Basic validation
    if (!req.body.number || !req.body.title) {
      return res.status(400).json({
        success: false,
        error: 'Number and title are required',
      })
    }

    const specialization = await specializationsService.create(req.body)
    res.status(201).json({
      success: true,
      data: specialization,
    })
  }),

  /**
   * Update specialization
   */
  update: asyncHandler(async (req, res) => {
    const { id } = req.params
    const specialization = await specializationsService.update(id, req.body)
    
    if (!specialization) {
      return res.status(404).json({
        success: false,
        error: 'Specialization not found',
      })
    }
    
    res.json({
      success: true,
      data: specialization,
    })
  }),

  /**
   * Delete specialization
   */
  delete: asyncHandler(async (req, res) => {
    const { id } = req.params
    const specialization = await specializationsService.delete(id)
    
    if (!specialization) {
      return res.status(404).json({
        success: false,
        error: 'Specialization not found',
      })
    }
    
    res.json({
      success: true,
      message: 'Specialization deleted successfully',
    })
  }),
}

