// Type definitions for the CMS application

export interface User {
  // Security: id removed to prevent UUID exposure
  email: string
  name?: string
}

// Re-export API types
export * from './api'
