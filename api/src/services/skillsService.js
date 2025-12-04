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

  /**
   * Get skill by ID
   */
  async getById(id) {
    const result = await client.query('SELECT * FROM public.skills WHERE id = $1', [id])
    return result.rows[0] || null
  },

  /**
   * Create new skill
   */
  async create(data) {
    const {
      name,
      slug,
      category = 'technical',
      level = 1,
      icon_url,
      is_highlight = false,
      order_index = 0,
    } = data

    const result = await client.query(
      `INSERT INTO public.skills 
       (name, slug, category, level, icon_url, is_highlight, order_index)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, slug, category, level, icon_url || null, is_highlight, order_index]
    )
    return result.rows[0]
  },

  /**
   * Update skill
   */
  async update(id, data) {
    const {
      name,
      slug,
      category,
      level,
      icon_url,
      is_highlight,
      order_index,
    } = data

    const result = await client.query(
      `UPDATE public.skills 
       SET name = $1, slug = $2, category = $3, level = $4, 
           icon_url = $5, is_highlight = $6, order_index = $7, updated_at = NOW()
       WHERE id = $8
       RETURNING *`,
      [name, slug, category, level, icon_url || null, is_highlight, order_index, id]
    )
    return result.rows[0] || null
  },

  /**
   * Delete skill
   */
  async delete(id) {
    // Check if skill is used in experiences
    const usageCheck = await client.query(
      'SELECT COUNT(*) as count FROM public.experience_skills WHERE skill_id = $1',
      [id]
    )
    
    if (parseInt(usageCheck.rows[0].count) > 0) {
      throw new Error('Cannot delete skill: it is being used in experiences')
    }

    const result = await client.query('DELETE FROM public.skills WHERE id = $1 RETURNING *', [id])
    return result.rows[0] || null
  },
}

