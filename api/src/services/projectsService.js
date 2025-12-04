// Projects service - OPTIMIZED VERSION
// Performance improvements:
// 1. Replaced subqueries with JOINs (eliminates N+1 problem)
// 2. Added pagination support
// 3. Batch inserts for tags

import client from '../db.js'

export const projectsService = {
  /**
   * Get all projects (for CMS - includes unpublished)
   * OPTIMIZED: Using JOINs instead of subqueries to eliminate N+1 problem
   * @param {Object} filters - Optional filters (published, category, limit, offset)
   */
  async getAll(filters = {}) {
    const {
      published,
      limit = 100,
      offset = 0,
    } = filters

    // OPTIMIZED: Use JOINs instead of subqueries
    let query = `
      SELECT
        p.id,
        p.slug,
        p.title,
        p.subtitle,
        p.summary,
        p.content,
        p.hero_image_url,
        p.case_study_url,
        p.external_url,
        p.order_index,
        p.is_published,
        p.created_at,
        p.updated_at,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'id', pt.id,
            'name', pt.name,
            'color', pt.color
          )) FILTER (WHERE pt.id IS NOT NULL),
          '[]'
        ) AS tags
      FROM public.projects p
      LEFT JOIN public.project_tags_map ptm ON ptm.project_id = p.id
      LEFT JOIN public.project_tags pt ON pt.id = ptm.tag_id
      WHERE 1=1
    `
    const params = []
    let paramIndex = 1

    if (published !== undefined) {
      query += ` AND p.is_published = $${paramIndex}`
      params.push(published)
      paramIndex++
    }

    query += `
      GROUP BY p.id, p.slug, p.title, p.subtitle, p.summary, p.content,
               p.hero_image_url, p.case_study_url, p.external_url,
               p.order_index, p.is_published, p.created_at, p.updated_at
      ORDER BY p.order_index ASC, p.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `
    params.push(limit, offset)
    
    const result = await client.query(query, params)
    
    // Get total count for pagination
    let totalCount = null
    if (limit < 1000) {
      let countQuery = 'SELECT COUNT(*) as total FROM public.projects WHERE 1=1'
      const countParams = []
      if (published !== undefined) {
        countQuery += ` AND is_published = $1`
        countParams.push(published)
      }
      
      const countResult = await client.query(countQuery, countParams)
      totalCount = parseInt(countResult.rows[0].total)
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
   * Get project by slug (public)
   * OPTIMIZED: Using JOINs instead of subquery
   */
  async getBySlug(slug) {
    const result = await client.query(`
      SELECT
        p.id,
        p.slug,
        p.title,
        p.subtitle,
        p.summary,
        p.content,
        p.hero_image_url,
        p.case_study_url,
        p.external_url,
        p.order_index,
        p.is_published,
        p.created_at,
        p.updated_at,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'id', pt.id,
            'name', pt.name,
            'color', pt.color
          )) FILTER (WHERE pt.id IS NOT NULL),
          '[]'
        ) AS tags
      FROM public.projects p
      LEFT JOIN public.project_tags_map ptm ON ptm.project_id = p.id
      LEFT JOIN public.project_tags pt ON pt.id = ptm.tag_id
      WHERE p.slug = $1 AND p.is_published = TRUE
      GROUP BY p.id, p.slug, p.title, p.subtitle, p.summary, p.content,
               p.hero_image_url, p.case_study_url, p.external_url,
               p.order_index, p.is_published, p.created_at, p.updated_at
    `, [slug])
    return result.rows[0] || null
  },

  /**
   * Get project by ID (for CMS)
   * OPTIMIZED: Using JOINs instead of subquery
   */
  async getById(id) {
    const result = await client.query(`
      SELECT
        p.id,
        p.slug,
        p.title,
        p.subtitle,
        p.summary,
        p.content,
        p.hero_image_url,
        p.case_study_url,
        p.external_url,
        p.order_index,
        p.is_published,
        p.created_at,
        p.updated_at,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'id', pt.id,
            'name', pt.name,
            'color', pt.color
          )) FILTER (WHERE pt.id IS NOT NULL),
          '[]'
        ) AS tags
      FROM public.projects p
      LEFT JOIN public.project_tags_map ptm ON ptm.project_id = p.id
      LEFT JOIN public.project_tags pt ON pt.id = ptm.tag_id
      WHERE p.id = $1
      GROUP BY p.id, p.slug, p.title, p.subtitle, p.summary, p.content,
               p.hero_image_url, p.case_study_url, p.external_url,
               p.order_index, p.is_published, p.created_at, p.updated_at
    `, [id])
    return result.rows[0] || null
  },

  /**
   * Create new project
   * OPTIMIZED: Batch insert for tags
   */
  async create(data) {
    const {
      title,
      slug,
      subtitle,
      summary,
      content,
      hero_image_url,
      case_study_url,
      external_url,
      is_published = false,
      order_index = 0,
      tag_ids = [],
    } = data

    try {
      await client.query('BEGIN')

      // Insert project
      const projectResult = await client.query(
        `INSERT INTO public.projects 
         (title, slug, subtitle, summary, content, hero_image_url, case_study_url, external_url, is_published, order_index)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [title, slug, subtitle || null, summary || null, content || null, hero_image_url || null, case_study_url || null, external_url || null, is_published, order_index]
      )
      const project = projectResult.rows[0]

      // OPTIMIZED: Batch insert tags
      if (tag_ids && tag_ids.length > 0) {
        const values = tag_ids.map((_, i) => `($1, $${i + 2})`).join(', ')
        const params = [project.id, ...tag_ids]
        
        await client.query(
          `INSERT INTO public.project_tags_map (project_id, tag_id)
           VALUES ${values}
           ON CONFLICT DO NOTHING`,
          params
        )
      }

      await client.query('COMMIT')
      return await this.getById(project.id)
    } catch (error) {
      await client.query('ROLLBACK')
      console.error('ProjectsService.create error:', error)
      if (error.code === '23505') {
        throw new Error(`Project with slug "${slug}" already exists`)
      }
      if (error.code === '23503') {
        throw new Error(`Invalid tag_id in tag_ids array`)
      }
      throw error
    }
  },

  /**
   * Update project
   * OPTIMIZED: Batch insert for tags
   */
  async update(id, data) {
    const {
      title,
      slug,
      subtitle,
      summary,
      content,
      hero_image_url,
      case_study_url,
      external_url,
      is_published,
      order_index,
      tag_ids = [],
    } = data

    try {
      await client.query('BEGIN')

      // Update project
      await client.query(
        `UPDATE public.projects 
         SET title = $1, slug = $2, subtitle = $3, summary = $4, content = $5, 
             hero_image_url = $6, case_study_url = $7, external_url = $8, 
             is_published = $9, order_index = $10, updated_at = NOW()
         WHERE id = $11`,
        [title, slug, subtitle || null, summary || null, content || null, hero_image_url || null, case_study_url || null, external_url || null, is_published, order_index, id]
      )

      // Delete existing tags
      await client.query('DELETE FROM public.project_tags_map WHERE project_id = $1', [id])

      // OPTIMIZED: Batch insert new tags
      if (tag_ids && tag_ids.length > 0) {
        const values = tag_ids.map((_, i) => `($1, $${i + 2})`).join(', ')
        const params = [id, ...tag_ids]
        
        await client.query(
          `INSERT INTO public.project_tags_map (project_id, tag_id)
           VALUES ${values}
           ON CONFLICT DO NOTHING`,
          params
        )
      }

      await client.query('COMMIT')
      return await this.getById(id)
    } catch (error) {
      await client.query('ROLLBACK')
      console.error('ProjectsService.update error:', error)
      if (error.code === '23505') {
        throw new Error(`Project with slug "${slug}" already exists`)
      }
      if (error.code === '23503') {
        throw new Error(`Invalid tag_id in tag_ids array`)
      }
      throw error
    }
  },

  /**
   * Delete project
   */
  async delete(id) {
    try {
      await client.query('BEGIN')
      
      // Delete related records first
      await client.query('DELETE FROM public.project_tags_map WHERE project_id = $1', [id])
      
      // Delete project
      const result = await client.query('DELETE FROM public.projects WHERE id = $1 RETURNING *', [id])
      
      await client.query('COMMIT')
      return result.rows[0] || null
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    }
  },
}
