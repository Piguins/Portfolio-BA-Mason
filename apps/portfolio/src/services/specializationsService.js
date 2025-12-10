// Specializations service - Fetch specializations data from API
import { API_ENDPOINTS } from '../config/api.js'

export const specializationsService = {
  /**
   * Fetch all specializations from API
   * @param {string} language - Language code ('en' or 'vi'), defaults to 'en'
   */
  async getAll(language = 'en') {
    try {
      const url = `${API_ENDPOINTS.specializations}?lang=${language}`
      const response = await fetch(url, {
        cache: 'no-store',
        headers: {
          'Accept-Language': language,
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch specializations: ${response.statusText}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching specializations:', error)
      throw error
    }
  },

  /**
   * Format specializations data for UI display
   */
  formatSpecializations(specializations) {
    return specializations
      .sort((a, b) => {
        // Sort by number if available, otherwise by id
        if (a.number && b.number) {
          return Number(a.number) - Number(b.number)
        }
        return a.id - b.id
      })
      .map((spec, index) => ({
        id: spec.id,
        number: spec.number || String(index + 1),
        title: spec.title,
        description: spec.description,
        iconUrl: spec.icon_url,
      }))
  },
}

