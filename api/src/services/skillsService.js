// Skills service - OPTIMIZED VERSION
// Performance improvements:
// 1. Replaced SELECT * with explicit column names
// 2. Added pagination support

import client from '../db.js'

export const skillsService = {
  /**
   * Get all skills
   * OPTIMIZED: Explicit column selection instead of SELECT *
   * @param {Object} filters - Optional filters (category, highlight, limit, offset)
   */
  async getAll(filters = {}) {
    const {
      category,
      highlight,
      limit = 1000, // Skills are usually small dataset
      offset = 0,
    } = filters

    // OPTIMIZED: Explicit column selection (faster, more secure)
    let query = `
      SELECT
        id,
        name,
        slug,
        category,
        level,
        icon_url,
        description,
        order_index,
        is_highlight,
        created_at,
        updated_at
      FROM public.skills
      WHERE 1=1
    `
    const params = []
    let paramIndex = 1
    
    if (category) {
      query += ` AND category = $${paramIndex}`
      params.push(category)
      paramIndex++
    }
    
    if (highlight !== undefined) {
      query += ` AND is_highlight = $${paramIndex}`
      params.push(highlight)
      paramIndex++
    }
    
    query += ` ORDER BY category ASC, order_index ASC, id ASC`
    
    // Only add LIMIT/OFFSET if reasonable limit
    if (limit < 10000) {
      query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
      params.push(limit, offset)
    }
    
    // OPTIMIZED: Parallelize main query and count query (if needed)
    const queries = [client.query(query, params)]
    
    // Get total count for pagination (only if limit used and first page)
    let totalCount = null
    if (limit < 10000 && offset === 0) {
      let countQuery = 'SELECT COUNT(*) as total FROM public.skills WHERE 1=1'
      const countParams = []
      if (category) {
        countQuery += ` AND category = $1`
        countParams.push(category)
      }
      if (highlight !== undefined) {
        countQuery += ` AND is_highlight = $${category ? '2' : '1'}`
        countParams.push(highlight)
      }
      
      queries.push(client.query(countQuery, countParams))
    }
    
    // Execute queries in parallel
    const results = await Promise.all(queries)
    const result = results[0]
    
    if (results.length > 1) {
      totalCount = parseInt(results[1].rows[0].total)
    }
    
    return {
      data: result.rows,
      pagination: totalCount !== null ? {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      } : null,
    }
  },

  /**
   * Get skill by ID
   * OPTIMIZED: Explicit column selection
   */
  async getById(id) {
    const result = await client.query(`
      SELECT
        id,
        name,
        slug,
        category,
        level,
        icon_url,
        description,
        order_index,
        is_highlight,
        created_at,
        updated_at
      FROM public.skills
      WHERE id = $1
    `, [id])
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
      description,
      is_highlight = false,
      order_index = 0,
    } = data

    try {
      const result = await client.query(
        `INSERT INTO public.skills 
         (name, slug, category, level, icon_url, description, is_highlight, order_index)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [name, slug, category, level, icon_url || null, description || null, is_highlight, order_index]
      )
      return result.rows[0]
    } catch (error) {
      console.error('SkillsService.create error:', error)
      if (error.code === '23505') {
        throw new Error(`Skill with slug "${slug}" already exists`)
      }
      throw error
    }
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
      description,
      is_highlight,
      order_index,
    } = data

    try {
      const result = await client.query(
        `UPDATE public.skills 
         SET name = $1, slug = $2, category = $3, level = $4, 
             icon_url = $5, description = $6, is_highlight = $7, order_index = $8, updated_at = NOW()
         WHERE id = $9
         RETURNING *`,
        [name, slug, category, level, icon_url || null, description || null, is_highlight, order_index, id]
      )
      return result.rows[0] || null
    } catch (error) {
      console.error('SkillsService.update error:', error)
      if (error.code === '23505') {
        throw new Error(`Skill with slug "${slug}" already exists`)
      }
      throw error
    }
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
