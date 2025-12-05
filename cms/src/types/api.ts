// API Types - Centralized type definitions for API responses

export interface HeroContent {
  id: number
  greeting: string
  greeting_part2: string
  name: string
  title: string
  description: string | null
  linkedin_url: string | null
  github_url: string | null
  email_url: string | null
  profile_image_url: string | null
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  summary: string | null
  hero_image_url: string | null
  case_study_url: string | null
  tags_text: string[]
  created_at: string
  updated_at: string
}

export interface Experience {
  id: string
  company: string
  role: string
  location: string | null
  start_date: string
  end_date: string | null
  is_current: boolean
  description: string | null
  bullets: Array<{ id: number; text: string }>
  skills_text: string[]
  created_at: string
  updated_at: string
}

export interface Specialization {
  id: number
  number: string
  title: string
  description: string | null
  icon_url: string | null
  created_at: string
  updated_at: string
}

export interface Skill {
  id: number
  name: string
  slug: string
  category: string
  level: number | null
  icon_url: string | null
  description: string | null
  order_index: number
  is_highlight: boolean
  created_at: string
  updated_at: string
}

export interface ApiError {
  error: string
  message?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

