// API configuration for Portfolio frontend
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.mason.id.vn'

export const API_ENDPOINTS = {
  experience: `${API_BASE_URL}/api/experience`,
  projects: `${API_BASE_URL}/api/projects`,
  skills: `${API_BASE_URL}/api/skills`,
}

