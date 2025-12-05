import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

interface UseApiQueryOptions {
  enabled?: boolean
  onError?: (error: string) => void
  timeout?: number
}

export function useApiQuery<T = any>(
  endpoint: string,
  options: UseApiQueryOptions = {}
) {
  const { enabled = true, onError, timeout = 10000 } = options
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!enabled) return

    try {
      setLoading(true)
      setError(null)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(endpoint, {
        cache: 'no-store',
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }

      const result = await response.json()
      setData(result)
    } catch (err: any) {
      let errorMsg = 'Failed to load data'
      if (err.name === 'AbortError') {
        errorMsg = 'Request timeout. Vui lòng thử lại.'
      } else if (err.message) {
        errorMsg = err.message
      }

      setError(errorMsg)
      if (onError) {
        onError(errorMsg)
      } else {
        toast.error(errorMsg)
      }
    } finally {
      setLoading(false)
    }
  }, [endpoint, enabled, timeout, onError])

  useEffect(() => {
    if (enabled) {
      fetchData()
    }
  }, [enabled, fetchData])

  return { data, loading, error, refetch: fetchData }
}

