import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { fetchWithAuth } from '@/lib/fetchWithAuth'

interface UseApiMutationOptions {
  onSuccess?: () => void
  onError?: (error: string) => void
  successMessage?: string
  redirectTo?: string
  timeout?: number
}

export function useApiMutation<T = any>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'DELETE' = 'POST',
  options: UseApiMutationOptions = {}
) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mutate = useCallback(
    async (data: T) => {
      setLoading(true)
      setError(null)

      const controller = new AbortController()
      const timeout = options.timeout || 15000
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      try {
        const response = await fetchWithAuth(endpoint, {
          method,
          body: JSON.stringify(data),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || errorData.message || 'Request failed')
        }

        const result = await response.json()

        if (options.successMessage) {
          toast.success(options.successMessage)
        }

        if (options.onSuccess) {
          options.onSuccess()
        }

        if (options.redirectTo) {
          router.replace(options.redirectTo)
        }

        return result
      } catch (err: any) {
        clearTimeout(timeoutId)

        let errorMsg = 'Request failed'
        if (err.name === 'AbortError') {
          errorMsg = 'Request timeout. Vui lòng thử lại.'
        } else if (err.message) {
          errorMsg = err.message
        }

        setError(errorMsg)
        toast.error(errorMsg)

        if (options.onError) {
          options.onError(errorMsg)
        }

        throw err
      } finally {
        setLoading(false)
      }
    },
    [endpoint, method, router, options]
  )

  return { mutate, loading, error }
}

