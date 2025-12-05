// Centralized API client with consistent error handling and timeout

import { fetchWithAuth } from './fetchWithAuth'
import { ApiResponse, ApiError } from '@/types/api'

const DEFAULT_TIMEOUT = 15000

interface ApiClientOptions extends RequestInit {
  timeout?: number
  requiresAuth?: boolean
}

class ApiClient {
  private async request<T = any>(
    endpoint: string,
    options: ApiClientOptions = {}
  ): Promise<T> {
    const { timeout = DEFAULT_TIMEOUT, requiresAuth, ...fetchOptions } = options

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const fetchFn = requiresAuth ? fetchWithAuth : fetch
      const response = await fetchFn(endpoint, {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
      })

      clearTimeout(timeoutId)

      const data = await response.json()

      if (!response.ok) {
        const error: ApiError = data
        throw new Error(error.error || error.message || 'Request failed')
      }

      return data
    } catch (error: any) {
      clearTimeout(timeoutId)

      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms`)
      }

      throw error
    }
  }

  async get<T = any>(endpoint: string, options: Omit<ApiClientOptions, 'method' | 'body'> = {}) {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T = any>(endpoint: string, data: any, options: Omit<ApiClientOptions, 'method' | 'body'> = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth: true,
    })
  }

  async put<T = any>(endpoint: string, data: any, options: Omit<ApiClientOptions, 'method' | 'body'> = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
      requiresAuth: true,
    })
  }

  async delete<T = any>(endpoint: string, options: Omit<ApiClientOptions, 'method' | 'body'> = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
      requiresAuth: true,
    })
  }
}

export const apiClient = new ApiClient()

