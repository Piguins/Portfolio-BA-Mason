// Experience service - Fetch experience data from API
import { API_ENDPOINTS } from '../config/api.js'

export const experienceService = {
  /**
   * Fetch all experiences from API
   */
  async getAll() {
    try {
      const response = await fetch(API_ENDPOINTS.experience)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch experiences: ${response.statusText}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching experiences:', error)
      throw error
    }
  },

  /**
   * Format experience data for UI display
   */
  formatExperience(exp) {
    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
      })
    }

    const startDate = formatDate(exp.start_date)
    const endDate = exp.is_current 
      ? 'Hiện tại' 
      : exp.end_date 
        ? formatDate(exp.end_date) 
        : ''
    
    const dates = endDate ? `${startDate} - ${endDate}` : startDate

    // Prefer new free-text skills_text if available; otherwise fallback to old skills_used
    const skills =
      Array.isArray(exp.skills_text) && exp.skills_text.length > 0
        ? exp.skills_text
        : exp.skills_used?.map((skill) => skill.name) || []

    return {
      id: exp.id,
      role: exp.role,
      company: exp.company,
      location: exp.location || '',
      dates,
      startDate: exp.start_date, // Keep for sorting
      description: exp.description || '',
      achievements: exp.bullets?.map(bullet => bullet.text) || [],
      skills,
      isCurrent: exp.is_current,
      orderIndex: exp.order_index || 0,
    }
  },
}

