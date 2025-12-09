// Skills service - Fetch skills data from API
import { API_ENDPOINTS } from '../config/api.js'

export const skillsService = {
  /**
   * Fetch all skills from API
   */
  async getAll() {
    try {
      const response = await fetch(API_ENDPOINTS.skills, {
        cache: 'no-store',
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch skills: ${response.statusText}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching skills:', error)
      throw error
    }
  },

  /**
   * Format skills data for UI display
   */
  formatSkills(skills) {
    return skills.map(skill => ({
      id: skill.id,
      name: skill.name,
      slug: skill.slug,
      category: skill.category,
      level: skill.level,
      iconUrl: skill.icon_url,
      description: skill.description,
      isHighlight: skill.is_highlight,
      orderIndex: skill.order_index || 0,
    }))
  },
}

