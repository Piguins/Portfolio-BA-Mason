// Work Skills service - Database operations for work skills (used in Experience)
// SEPARATE from Skills section - completely independent
import client from '../db.js'

export const workSkillsService = {
  /**
   * Get all work skills
   */
  async getAll() {
    const result = await client.query(`
      SELECT * FROM public.work_skills
      ORDER BY category ASC, name ASC
    `)
    return result.rows
  },

  /**
   * Get work skill by ID
   */
  async getById(id) {
    const result = await client.query(`
      SELECT * FROM public.work_skills
      WHERE id = $1
    `, [id])
    return result.rows[0] || null
  },

  /**
   * Create new work skill
   */
  async create(data) {
    const {
      name,
      slug,
      category = 'technical',
    } = data

    try {
      const result = await client.query(`
        INSERT INTO public.work_skills (name, slug, category)
        VALUES ($1, $2, $3)
        RETURNING *
      `, [name, slug, category])
      return result.rows[0]
    } catch (error) {
      console.error('WorkSkillsService.create error:', error)
      if (error.code === '23505') { // Unique violation
        throw new Error(`Work skill with slug "${slug}" already exists`)
      }
      throw error
    }
  },

  /**
   * Update work skill
   */
  async update(id, data) {
    const {
      name,
      slug,
      category,
    } = data

    try {
      const result = await client.query(`
        UPDATE public.work_skills
        SET name = $1, slug = $2, category = $3, updated_at = NOW()
        WHERE id = $4
        RETURNING *
      `, [name, slug, category, id])
      return result.rows[0] || null
    } catch (error) {
      console.error('WorkSkillsService.update error:', error)
      if (error.code === '23505') { // Unique violation
        throw new Error(`Work skill with slug "${slug}" already exists`)
      }
      throw error
    }
  },

  /**
   * Delete work skill
   */
  async delete(id) {
    const result = await client.query(`
      DELETE FROM public.work_skills
      WHERE id = $1
      RETURNING *
    `, [id])
    return result.rows[0] || null
  },
}

