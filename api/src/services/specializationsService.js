// Specializations service - Database operations for specializations (3 cards)
import client from '../db.js'

export const specializationsService = {
  /**
   * Get all specializations ordered by order_index
   */
  async getAll() {
    const result = await client.query(`
      SELECT * FROM public.specializations
      ORDER BY order_index ASC
    `)
    return result.rows
  },

  /**
   * Get specialization by ID
   */
  async getById(id) {
    const result = await client.query(`
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
      order_index = 0,
    } = data

    const result = await client.query(`
      INSERT INTO public.specializations (number, title, description, order_index)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [number, title, description || null, order_index])
    
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
      order_index,
    } = data

    const result = await client.query(`
      UPDATE public.specializations
      SET number = $1, title = $2, description = $3, order_index = $4, updated_at = NOW()
      WHERE id = $5
      RETURNING *
    `, [number, title, description || null, order_index, id])
    
    return result.rows[0] || null
  },

  /**
   * Delete specialization
   */
  async delete(id) {
    const result = await client.query(`
      DELETE FROM public.specializations
      WHERE id = $1
      RETURNING *
    `, [id])
    
    return result.rows[0] || null
  },
}

