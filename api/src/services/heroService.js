// Hero service - Database operations for hero content (singleton)
import client from '../db.js'

export const heroService = {
  /**
   * Get hero content (singleton - only 1 record)
   */
  async get() {
    const result = await client.query(`
      SELECT * FROM public.hero_content
      WHERE id = 1
      LIMIT 1
    `)
    
    if (result.rows.length === 0) {
      // Return default if not exists
      return {
        id: 1,
        greeting: 'Hey!',
        greeting_part2: 'I\'m',
        name: 'Thế Kiệt (Mason)',
        title: 'Business Analyst',
        description: 'Agency-quality business analysis with the personal touch of a freelancer.',
        linkedin_url: null,
        github_url: null,
        email_url: null,
        profile_image_url: null,
        created_at: new Date(),
        updated_at: new Date(),
      }
    }
    
    return result.rows[0]
  },

  /**
   * Update hero content (singleton - always updates id = 1)
   */
  async update(data) {
    const {
      greeting,
      greeting_part2,
      name,
      title,
      description,
      linkedin_url,
      github_url,
      email_url,
      profile_image_url,
    } = data

    const result = await client.query(`
      INSERT INTO public.hero_content (
        id, greeting, greeting_part2, name, title, description,
        linkedin_url, github_url, email_url, profile_image_url, updated_at
      )
      VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      ON CONFLICT (id) DO UPDATE SET
        greeting = EXCLUDED.greeting,
        greeting_part2 = EXCLUDED.greeting_part2,
        name = EXCLUDED.name,
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        linkedin_url = EXCLUDED.linkedin_url,
        github_url = EXCLUDED.github_url,
        email_url = EXCLUDED.email_url,
        profile_image_url = EXCLUDED.profile_image_url,
        updated_at = NOW()
      RETURNING *
    `, [
      greeting || 'Hey!',
      greeting_part2 || 'I\'m',
      name || 'Thế Kiệt (Mason)',
      title || 'Business Analyst',
      description || null,
      linkedin_url || null,
      github_url || null,
      email_url || null,
      profile_image_url || null,
    ])

    return result.rows[0]
  },
}

