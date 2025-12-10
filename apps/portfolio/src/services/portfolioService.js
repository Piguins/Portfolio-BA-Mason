// Portfolio service - Fetch portfolio/projects data from API
import { API_ENDPOINTS } from '../config/api.js'

export const portfolioService = {
  /**
   * Fetch all projects from API
   * @param {string} language - Language code ('en' or 'vi'), defaults to 'en'
   */
  async getAll(language = 'en') {
    try {
      const url = `${API_ENDPOINTS.projects}?lang=${language}`
      const response = await fetch(url, {
        cache: 'no-store',
        headers: {
          'Accept-Language': language,
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching projects:', error)
      throw error
    }
  },

  /**
   * Format project data for UI display
   */
  formatProject(project) {
    return {
      id: project.id,
      title: project.title,
      description: project.summary || '',
      tags: project.tags_text || [],
      caseStudyUrl: project.case_study_url,
      heroImageUrl: project.hero_image_url,
      created_at: project.created_at,
    }
  },
}

