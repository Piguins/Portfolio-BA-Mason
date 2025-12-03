// Projects service - Database operations for projects
import client from '../db.js'

export const projectsService = {
  /**
   * Get all published projects with their tags
   */
  async getAll() {
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
      WHERE p.is_published = TRUE
      ORDER BY p.order_index ASC, p.created_at DESC
    `)
    return result.rows
  },
  
  /**
   * Get project by slug
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
}

