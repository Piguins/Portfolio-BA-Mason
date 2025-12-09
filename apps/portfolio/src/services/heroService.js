// Hero service - Fetch hero data from API
import { API_ENDPOINTS } from '../config/api.js'

export const heroService = {
  /**
   * Fetch hero section from API
   */
  async get() {
    try {
      const response = await fetch(API_ENDPOINTS.hero, {
        cache: 'no-store',
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch hero: ${response.statusText}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching hero:', error)
      throw error
    }
  },

  /**
   * Format hero data for UI display
   */
  formatHero(hero) {
    return {
      greeting: hero.greeting || 'Hey!',
      greetingPart2: hero.greeting_part2 || "I'm",
      name: hero.name || 'Thế Kiệt (Mason)',
      title: hero.title || 'Business Analyst',
      description: hero.description || 'Agency-quality business analysis with the personal touch of a freelancer.',
      linkedinUrl: hero.linkedin_url,
      githubUrl: hero.github_url,
      emailUrl: hero.email_url,
      profileImageUrl: hero.profile_image_url,
    }
  },
}

