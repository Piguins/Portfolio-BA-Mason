// Type definitions for the CMS application

export interface User {
  // Security: id removed to prevent UUID exposure
  email: string
  name?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
