// Hero controller
import { heroService } from '../services/heroService.js'
import { asyncHandler } from '../middleware/errorHandler.js'

export const heroController = {
  /**
   * Get hero content (singleton)
   */
  get: asyncHandler(async (req, res) => {
    const hero = await heroService.get()
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60')
    res.json(hero)
  }),

  /**
   * Update hero content (singleton)
   */
  update: asyncHandler(async (req, res) => {
    const hero = await heroService.update(req.body)
    res.json({
      success: true,
      data: hero,
    })
  }),
}

