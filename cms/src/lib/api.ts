const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || ''

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(API_KEY ? { 'X-API-Key': API_KEY } : {}),
      ...options.headers,
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || 'Request failed',
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    }
  }
}

// Auth API helpers
export const authApi = {
  login: async (email: string, password: string) => {
    return apiRequest<{ token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  logout: async () => {
    return apiRequest('/api/auth/logout', {
      method: 'POST',
    })
  },

  checkSession: async () => {
    return apiRequest<{ user: any; authenticated: boolean }>('/api/auth/session', {
      method: 'GET',
    })
  },
}

