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

  /**
   * Get experience by ID
   */
  async getById(id) {
    const result = await client.query(`
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
          (SELECT json_agg(json_build_object('id', s.id, 'name', s.name, 'slug', s.slug))
           FROM public.experience_skills es
           JOIN public.skills s ON es.skill_id = s.id
           WHERE es.experience_id = e.id
           ORDER BY s.order_index ASC),
          '[]'
        ) AS skills_used
      FROM public.experience e
      WHERE e.id = $1
    `, [id])
    return result.rows[0] || null
  },

  /**
   * Create new experience entry
   */
  async create(data) {
    const {
      company,
      role,
      location,
      start_date,
      end_date,
      is_current,
      description,
      order_index,
      bullets = [],
      skill_ids = [],
    } = data

    try {
      // Start transaction
      await client.query('BEGIN')

      // Insert experience
      const expResult = await client.query(
        `INSERT INTO public.experience 
         (company, role, location, start_date, end_date, is_current, description, order_index)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [company, role, location, start_date, end_date || null, is_current || false, description || null, order_index || 0]
      )
      const experience = expResult.rows[0]

      // Insert bullets
      if (bullets.length > 0) {
        for (let i = 0; i < bullets.length; i++) {
          await client.query(
            `INSERT INTO public.experience_bullets (experience_id, text, order_index)
             VALUES ($1, $2, $3)`,
            [experience.id, bullets[i].text, bullets[i].order_index || i]
          )
        }
      }

      // Insert skills
      if (skill_ids.length > 0) {
        for (const skillId of skill_ids) {
          await client.query(
            `INSERT INTO public.experience_skills (experience_id, skill_id)
             VALUES ($1, $2)
             ON CONFLICT DO NOTHING`,
            [experience.id, skillId]
          )
        }
      }

      await client.query('COMMIT')
      return await this.getById(experience.id)
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    }
  },

  /**
   * Update experience entry
   */
  async update(id, data) {
    const {
      company,
      role,
      location,
      start_date,
      end_date,
      is_current,
      description,
      order_index,
      bullets = [],
      skill_ids = [],
    } = data

    try {
      await client.query('BEGIN')

      // Update experience
      await client.query(
        `UPDATE public.experience 
         SET company = $1, role = $2, location = $3, start_date = $4, 
             end_date = $5, is_current = $6, description = $7, order_index = $8,
             updated_at = NOW()
         WHERE id = $9`,
        [company, role, location, start_date, end_date || null, is_current || false, description || null, order_index || 0, id]
      )

      // Delete existing bullets
      await client.query('DELETE FROM public.experience_bullets WHERE experience_id = $1', [id])

      // Insert new bullets
      if (bullets.length > 0) {
        for (let i = 0; i < bullets.length; i++) {
          await client.query(
            `INSERT INTO public.experience_bullets (experience_id, text, order_index)
             VALUES ($1, $2, $3)`,
            [id, bullets[i].text, bullets[i].order_index || i]
          )
        }
      }

      // Delete existing skills
      await client.query('DELETE FROM public.experience_skills WHERE experience_id = $1', [id])

      // Insert new skills
      if (skill_ids.length > 0) {
        for (const skillId of skill_ids) {
          await client.query(
            `INSERT INTO public.experience_skills (experience_id, skill_id)
             VALUES ($1, $2)
             ON CONFLICT DO NOTHING`,
            [id, skillId]
          )
        }
      }

      await client.query('COMMIT')
      return await this.getById(id)
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    }
  },

  /**
   * Delete experience entry
   */
  async delete(id) {
    try {
      await client.query('BEGIN')
      
      // Delete related records first
      await client.query('DELETE FROM public.experience_bullets WHERE experience_id = $1', [id])
      await client.query('DELETE FROM public.experience_skills WHERE experience_id = $1', [id])
      
      // Delete experience
      const result = await client.query('DELETE FROM public.experience WHERE id = $1 RETURNING *', [id])
      
      await client.query('COMMIT')
      return result.rows[0] || null
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    }
  },
}
