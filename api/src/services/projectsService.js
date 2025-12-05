// Projects service - SIMPLIFIED VERSION
// Simple CRUD, no complex mappings, no order_index
// Tags are simple text array (tags_text)

import client from '../db.js'

export const projectsService = {
  /**
   * Get all projects
   */
  async getAll() {
    const result = await client.query(`
      SELECT
        id,
        title,
        summary,
        hero_image_url,
        case_study_url,
        tags_text,
        created_at,
        updated_at
      FROM public.projects
      ORDER BY created_at DESC
    `)
    return result.rows
  },

  /**
   * Get project by ID
   */
  async getById(id) {
    const result = await client.query(`
      SELECT
        id,
        title,
        summary,
        hero_image_url,
        case_study_url,
        tags_text,
        created_at,
        updated_at
      FROM public.projects
      WHERE id = $1
    `, [id])
    return result.rows[0] || null
  },

  /**
   * Create new project
   */
  async create(data) {
    const {
      title,
      summary,
      hero_image_url,
      case_study_url,
      tags_text = [],
    } = data

    const result = await client.query(`
      INSERT INTO public.projects (title, summary, hero_image_url, case_study_url, tags_text)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [
      title,
      summary || null,
      hero_image_url || null,
      case_study_url || null,
      Array.isArray(tags_text) ? tags_text : [],
    ])
    
    return result.rows[0]
  },

  /**
   * Update project
   */
  async update(id, data) {
    const {
      title,
      summary,
      hero_image_url,
      case_study_url,
      tags_text = [],
    } = data

    const result = await client.query(`
      UPDATE public.projects
      SET title = $1, summary = $2, hero_image_url = $3, 
          case_study_url = $4, tags_text = $5, updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `, [
      title,
      summary || null,
      hero_image_url || null,
      case_study_url || null,
      Array.isArray(tags_text) ? tags_text : [],
      id,
    ])
    
    return result.rows[0] || null
  },

  /**
   * Delete project
   */
  async delete(id) {
    const result = await client.query(`
      DELETE FROM public.projects
      WHERE id = $1
      RETURNING *
    `, [id])
    
    return result.rows[0] || null
  },
}
