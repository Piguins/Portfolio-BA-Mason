// API configuration for Portfolio frontend
// Uses CMS Next.js API routes
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://admin.mason.id.vn'

export const API_ENDPOINTS = {
  hero: `${API_BASE_URL}/api/hero`,
  experience: `${API_BASE_URL}/api/experience`,
  projects: `${API_BASE_URL}/api/projects`,
  skills: `${API_BASE_URL}/api/skills`,
  specializations: `${API_BASE_URL}/api/specializations`,
}

