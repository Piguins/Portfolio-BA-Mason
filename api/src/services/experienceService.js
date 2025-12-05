// Experience service - OPTIMIZED VERSION
// Performance improvements:
// 1. Batch inserts for bullets (reduces queries from N to 1)
// 2. Removed unnecessary JOINs for skills (using skills_text array)
// 3. Added pagination support
// 4. Optimized GROUP BY query

import client from '../db.js'

export const experienceService = {
  /**
   * Get all work experience with bullets and skills
   * OPTIMIZED: Using JOINs, removed unnecessary skills JOIN, added pagination
   * @param {Object} filters - Optional filters (current, company, limit, offset)
   */
  async getAll(filters = {}) {
    const {
      current,
      company,
      limit = 100, // Default limit to prevent loading too much data
      offset = 0,
    } = filters

    // Optimized query - removed skills JOIN since we use skills_text now
    let query = `
      SELECT
        e.id,
        e.company,
        e.role,
        e.location,
        e.start_date,
        e.end_date,
        e.is_current,
        e.description,
        e.created_at,
        e.updated_at,
        e.skills_text,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'id', eb.id,
            'text', eb.text
          )) FILTER (WHERE eb.id IS NOT NULL),
          '[]'
        ) AS bullets
      FROM public.experience e
      LEFT JOIN public.experience_bullets eb ON eb.experience_id = e.id
      WHERE 1=1
    `
    const params = []
    let paramIndex = 1
    
    if (current !== undefined) {
      query += ` AND e.is_current = $${paramIndex}`
      params.push(current)
      paramIndex++
    }
    
    if (company) {
      query += ` AND e.company ILIKE $${paramIndex}`
      params.push(`%${company}%`)
      paramIndex++
    }
    
    query += `
      GROUP BY e.id, e.company, e.role, e.location, e.start_date, e.end_date, 
               e.is_current, e.description, e.created_at, e.updated_at, e.skills_text
      ORDER BY e.start_date DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `
    params.push(limit, offset)
    
    const startTime = Date.now()
    
    // OPTIMIZED: Parallelize main query and count query (if needed)
    const queries = [client.query(query, params)]
    
    // Get total count for pagination (only if limit/offset used and reasonable limit)
    let totalCount = null
    if (limit < 1000 && offset === 0) { // Only count on first page
      const countQuery = `
        SELECT COUNT(DISTINCT e.id) as total
        FROM public.experience e
        WHERE 1=1
          ${current !== undefined ? `AND e.is_current = $1` : ''}
          ${company ? `AND e.company ILIKE $${current !== undefined ? '2' : '1'}` : ''}
      `
      const countParams = []
      if (current !== undefined) countParams.push(current)
      if (company) countParams.push(`%${company}%`)
      
      queries.push(client.query(countQuery, countParams))
    }
    
    // Execute queries in parallel
    const results = await Promise.all(queries)
    const result = results[0]
    
    if (results.length > 1) {
      totalCount = parseInt(results[1].rows[0].total)
    }
    
    const queryTime = Date.now() - startTime
    
    // Log slow queries
    if (queryTime > 200) {
      console.warn(`⚠️ Slow query detected: ${queryTime}ms for getAll experiences`)
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
   * Get experience by ID
   * OPTIMIZED: Using JOINs instead of subqueries
   */
  /**
   * Get experience by ID
   * OPTIMIZED: Removed unnecessary skills JOIN
   */
  async getById(id) {
    const result = await client.query(`
      SELECT
        e.id,
        e.company,
        e.role,
        e.location,
        e.start_date,
        e.end_date,
        e.is_current,
        e.description,
        e.created_at,
        e.updated_at,
        e.skills_text,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'id', eb.id,
            'text', eb.text
          )) FILTER (WHERE eb.id IS NOT NULL),
          '[]'
        ) AS bullets
      FROM public.experience e
      LEFT JOIN public.experience_bullets eb ON eb.experience_id = e.id
      WHERE e.id = $1
      GROUP BY e.id, e.company, e.role, e.location, e.start_date, e.end_date, 
               e.is_current, e.description, e.created_at, e.updated_at, e.skills_text
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
      bullets = [],
      // New free-text skills stored directly on experience as text[]
      skills_text = [],
    } = data

    try {
      // Start transaction
      await client.query('BEGIN')

      // Insert experience
      const expResult = await client.query(
        `INSERT INTO public.experience 
         (company, role, location, start_date, end_date, is_current, description, skills_text)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          company,
          role,
          location,
          start_date,
          end_date || null,
          is_current || false,
          description || null,
          Array.isArray(skills_text) ? skills_text : [],
        ]
      )
      const experience = expResult.rows[0]

      // Simple batch insert bullets (no order_index)
      if (bullets.length > 0) {
        const values = bullets.map((bullet, i) => 
          `($1, $${i + 2})`
        ).join(', ')
        
        const params = [experience.id]
        bullets.forEach((bullet) => {
          params.push(bullet.text || bullet) // Support both object and string
        })
        
        await client.query(
          `INSERT INTO public.experience_bullets (experience_id, text)
           VALUES ${values}`,
          params
        )
      }

      // NOTE: Old relation table experience_skills is no longer used for new data.

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
      bullets = [],
      // New free-text skills stored directly on experience as text[]
      skills_text = [],
    } = data

    try {
      await client.query('BEGIN')

      // Update experience
      await client.query(
        `UPDATE public.experience 
         SET company = $1, role = $2, location = $3, start_date = $4, 
             end_date = $5, is_current = $6, description = $7,
             skills_text = $8,
             updated_at = NOW()
         WHERE id = $9`,
        [
          company,
          role,
          location,
          start_date,
          end_date || null,
          is_current || false,
          description || null,
          Array.isArray(skills_text) ? skills_text : [],
          id,
        ]
      )

      // Delete existing bullets
      await client.query('DELETE FROM public.experience_bullets WHERE experience_id = $1', [id])

      // Simple batch insert new bullets (no order_index)
      if (bullets.length > 0) {
        const values = bullets.map((bullet, i) => 
          `($1, $${i + 2})`
        ).join(', ')
        
        const params = [id]
        bullets.forEach((bullet) => {
          params.push(bullet.text || bullet) // Support both object and string
        })
        
        await client.query(
          `INSERT INTO public.experience_bullets (experience_id, text)
           VALUES ${values}`,
          params
        )
      }

      // NOTE: Old relation table experience_skills is no longer used for new data.

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
