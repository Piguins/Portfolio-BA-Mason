// Specializations service - Database operations for specializations (3 cards)
import { queryWithTimeout } from '../utils/dbQuery.js'

export const specializationsService = {
  /**
   * Get all specializations
   */
  async getAll() {
    const result = await queryWithTimeout(`
      SELECT * FROM public.specializations
      ORDER BY id ASC
    `)
    return result.rows
  },

  /**
   * Get specialization by ID
   */
  async getById(id) {
    const result = await queryWithTimeout(`
      SELECT * FROM public.specializations
      WHERE id = $1
    `, [id])
    return result.rows[0] || null
  },

  /**
   * Create new specialization
   */
  async create(data) {
    const {
      number,
      title,
      description,
    } = data

    const result = await queryWithTimeout(`
      INSERT INTO public.specializations (number, title, description)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [number, title, description || null])
    
    return result.rows[0]
  },

  /**
   * Update specialization
   */
  async update(id, data) {
    const {
      number,
      title,
      description,
    } = data

    const result = await queryWithTimeout(`
      UPDATE public.specializations
      SET number = $1, title = $2, description = $3, updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `, [number, title, description || null, id])
    
    return result.rows[0] || null
  },

  /**
   * Delete specialization
   */
  async delete(id) {
    const result = await queryWithTimeout(`
      DELETE FROM public.specializations
      WHERE id = $1
      RETURNING *
    `, [id])
    
    return result.rows[0] || null
  },
}

