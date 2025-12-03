// Skills service - Database operations for skills
import client from '../db.js'

export const skillsService = {
  /**
   * Get all skills
   * @param {Object} filters - Optional filters (category, highlight)
   */
  async getAll(filters = {}) {
    let query = 'SELECT * FROM public.skills WHERE 1=1'
    const params = []
    let paramIndex = 1
    
    if (filters.category) {
      query += ` AND category = $${paramIndex}`
      params.push(filters.category)
      paramIndex++
    }
    
    if (filters.highlight !== undefined) {
      query += ` AND is_highlight = $${paramIndex}`
      params.push(filters.highlight)
      paramIndex++
    }
    
    query += ' ORDER BY category ASC, order_index ASC, id ASC'
    
    const result = await client.query(query, params)
    return result.rows
  },
}

