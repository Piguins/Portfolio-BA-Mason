// Experience service - Database operations for work experience
import client from '../db.js'

export const experienceService = {
  /**
   * Get all work experience with bullets and skills
   * @param {Object} filters - Optional filters (current, company)
   */
  async getAll(filters = {}) {
    let query = `
      SELECT
        e.*,
        COALESCE(
          (SELECT json_agg(json_build_object('id', eb.id, 'text', eb.text, 'order_index', eb.order_index))
           FROM public.experience_bullets eb
           WHERE eb.experience_id = e.id
           ORDER BY eb.order_index ASC),
          '[]'
        ) AS bullets,
        COALESCE(
          (SELECT json_agg(json_build_object('id', s.id, 'name', s.name, 'slug', s.slug, 'icon_url', s.icon_url))
           FROM public.experience_skills es
           JOIN public.skills s ON es.skill_id = s.id
           WHERE es.experience_id = e.id
           ORDER BY s.order_index ASC),
          '[]'
        ) AS skills_used
      FROM public.experience e
      WHERE 1=1
    `
    const params = []
    let paramIndex = 1
    
    if (filters.current !== undefined) {
      query += ` AND e.is_current = $${paramIndex}`
      params.push(filters.current)
      paramIndex++
    }
    
    if (filters.company) {
      query += ` AND e.company ILIKE $${paramIndex}`
      params.push(`%${filters.company}%`)
      paramIndex++
    }
    
    query += ' ORDER BY e.order_index ASC, e.start_date DESC'
    
    const result = await client.query(query, params)
    return result.rows
  },
}

