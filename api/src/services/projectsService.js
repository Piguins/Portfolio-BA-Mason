// Projects service - Database operations for projects
import client from '../db.js'

export const projectsService = {
  /**
   * Get all projects (for CMS - includes unpublished)
   * @param {Object} filters - Optional filters (published, category)
   */
  async getAll(filters = {}) {
    let query = `
      SELECT
        p.*,
        COALESCE(
          (SELECT json_agg(json_build_object('id', pt.id, 'name', pt.name, 'color', pt.color))
           FROM public.project_tags_map ptm
           JOIN public.project_tags pt ON ptm.tag_id = pt.id
           WHERE ptm.project_id = p.id),
          '[]'
        ) AS tags
      FROM public.projects p
      WHERE 1=1
    `
    const params = []
    let paramIndex = 1

    // For CMS: if published filter not specified, return all
    // For public API: only return published
    if (filters.published !== undefined) {
      query += ` AND p.is_published = $${paramIndex}`
      params.push(filters.published)
      paramIndex++
    }

    query += ' ORDER BY p.order_index ASC, p.created_at DESC'
    
    const result = await client.query(query, params)
    return result.rows
  },
  
  /**
   * Get project by slug (public)
   */
  async getBySlug(slug) {
    const result = await client.query(`
      SELECT
        p.*,
        COALESCE(
          (SELECT json_agg(json_build_object('id', pt.id, 'name', pt.name, 'color', pt.color))
           FROM public.project_tags_map ptm
           JOIN public.project_tags pt ON ptm.tag_id = pt.id
           WHERE ptm.project_id = p.id),
          '[]'
        ) AS tags
      FROM public.projects p
      WHERE p.slug = $1 AND p.is_published = TRUE
    `, [slug])
    return result.rows[0] || null
  },

  /**
   * Get project by ID (for CMS)
   */
  async getById(id) {
    const result = await client.query(`
      SELECT
        p.*,
        COALESCE(
          (SELECT json_agg(json_build_object('id', pt.id, 'name', pt.name, 'color', pt.color))
           FROM public.project_tags_map ptm
           JOIN public.project_tags pt ON ptm.tag_id = pt.id
           WHERE ptm.project_id = p.id),
          '[]'
        ) AS tags
      FROM public.projects p
      WHERE p.id = $1
    `, [id])
    return result.rows[0] || null
  },

  /**
   * Create new project
   */
  async create(data) {
    const {
      title,
      slug,
      description,
      content,
      thumbnail_url,
      demo_url,
      github_url,
      is_published = false,
      order_index = 0,
      tag_ids = [],
    } = data

    try {
      await client.query('BEGIN')

      // Insert project
      const projectResult = await client.query(
        `INSERT INTO public.projects 
         (title, slug, description, content, thumbnail_url, demo_url, github_url, is_published, order_index)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [title, slug, description || null, content || null, thumbnail_url || null, demo_url || null, github_url || null, is_published, order_index]
      )
      const project = projectResult.rows[0]

      // Insert tags
      if (tag_ids && tag_ids.length > 0) {
        for (const tagId of tag_ids) {
          await client.query(
            `INSERT INTO public.project_tags_map (project_id, tag_id)
             VALUES ($1, $2)
             ON CONFLICT DO NOTHING`,
            [project.id, tagId]
          )
        }
      }

      await client.query('COMMIT')
      return await this.getById(project.id)
    } catch (error) {
      await client.query('ROLLBACK')
      console.error('ProjectsService.create error:', error)
      // Re-throw with more context
      if (error.code === '23505') { // Unique violation
        throw new Error(`Project with slug "${slug}" already exists`)
      }
      if (error.code === '23503') { // Foreign key violation
        throw new Error(`Invalid tag_id in tag_ids array`)
      }
      throw error
    }
  },

  /**
   * Update project
   */
  async update(id, data) {
    const {
      title,
      slug,
      description,
      content,
      thumbnail_url,
      demo_url,
      github_url,
      is_published,
      order_index,
      tag_ids = [],
    } = data

    try {
      await client.query('BEGIN')

      // Update project
      await client.query(
        `UPDATE public.projects 
         SET title = $1, slug = $2, description = $3, content = $4, 
             thumbnail_url = $5, demo_url = $6, github_url = $7, 
             is_published = $8, order_index = $9, updated_at = NOW()
         WHERE id = $10`,
        [title, slug, description || null, content || null, thumbnail_url || null, demo_url || null, github_url || null, is_published, order_index, id]
      )

      // Delete existing tags
      await client.query('DELETE FROM public.project_tags_map WHERE project_id = $1', [id])

      // Insert new tags
      if (tag_ids && tag_ids.length > 0) {
        for (const tagId of tag_ids) {
          await client.query(
            `INSERT INTO public.project_tags_map (project_id, tag_id)
             VALUES ($1, $2)
             ON CONFLICT DO NOTHING`,
            [id, tagId]
          )
        }
      }

      await client.query('COMMIT')
      return await this.getById(id)
    } catch (error) {
      await client.query('ROLLBACK')
      console.error('ProjectsService.update error:', error)
      // Re-throw with more context
      if (error.code === '23505') { // Unique violation
        throw new Error(`Project with slug "${slug}" already exists`)
      }
      if (error.code === '23503') { // Foreign key violation
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

