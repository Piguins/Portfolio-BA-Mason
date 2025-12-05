'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { fetchWithAuth } from '@/lib/fetchWithAuth'
import BackButton from '@/components/BackButton'
import LoadingButton from '@/components/LoadingButton'
import { cn } from '@/lib/utils'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
}

interface Specialization {
  id: number
  number: string
  title: string
  description?: string
  order_index: number
}

interface Props {
  initialSpecializations: Specialization[]
  initialError: string | null
}

export default function SpecializationsListClient({ initialSpecializations, initialError }: Props) {
  const router = useRouter()
  const [specializations, setSpecializations] = useState<Specialization[]>(initialSpecializations)
  const [error, setError] = useState<string | null>(initialError)
  const [loading, setLoading] = useState(initialSpecializations.length === 0)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const fetchSpecializations = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
      const response = await fetch(`${API_URL}/api/specializations`, {
        cache: 'no-store',
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) throw new Error('Failed to fetch specializations')
      const data = await response.json()
      // Handle both array and object with data property
      const specializationsData = Array.isArray(data) ? data : data.data || []
      setSpecializations(specializationsData)
    } catch (err: any) {
      let errorMsg = 'Failed to load specializations'
      if (err.name === 'AbortError') {
        errorMsg = 'Request timeout. Vui lòng thử lại.'
      } else if (err.message) {
        errorMsg = err.message
      }
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Fetch on mount if no initial data
    if (initialSpecializations.length === 0) {
      fetchSpecializations()
    }
  }, [initialSpecializations.length, fetchSpecializations])

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa specialization này?')) {
      return
    }

    setDeletingId(id)
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
      const response = await fetchWithAuth(`${API_URL}/api/specializations/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || errorData.message || 'Failed to delete specialization')
      }

      // Refetch to ensure data is in sync
      await fetchSpecializations()
      toast.success('Specialization đã được xóa thành công!')
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to delete specialization'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 pb-6 border-b border-slate-200"
        >
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="flex flex-col gap-4 flex-1">
              <BackButton href="/dashboard" />
              <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-2">
                  Quản lý Specializations
                </h1>
                <p className="text-base text-slate-600 leading-relaxed">
                  Quản lý các cards trong phần &quot;I specialize in&quot;
                </p>
              </div>
            </div>
            <LoadingButton
              onClick={() => router.push('/dashboard/specializations/new')}
              variant="primary"
            >
              + Thêm Specialization
            </LoadingButton>
          </div>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-slate-500">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            <p className="text-base">Đang tải dữ liệu Specializations...</p>
          </div>
        ) : specializations.length === 0 ? (
          /* Empty State */
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="text-center p-12 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center gap-4"
          >
            <p className="text-base text-slate-600 mb-6">
              Chưa có specialization nào. Hãy tạo specialization đầu tiên!
            </p>
            <LoadingButton
              onClick={() => router.push('/dashboard/specializations/new')}
              variant="primary"
            >
              Tạo Specialization đầu tiên
            </LoadingButton>
          </motion.div>
        ) : (
          /* Specializations List */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specializations.map((specialization, index) => (
              <motion.div
                key={specialization.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 p-6"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {specialization.number}
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">
                        {specialization.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {specialization.description || 'No description'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <span className="text-sm text-slate-500">Order: {specialization.order_index}</span>
                    <div className="flex gap-2">
                      <LoadingButton
                        onClick={() =>
                          router.push(`/dashboard/specializations/${specialization.id}/edit`)
                        }
                        variant="primary"
                      >
                        Sửa
                      </LoadingButton>
                      <LoadingButton
                        onClick={() => handleDelete(specialization.id)}
                        variant="danger"
                        loading={deletingId === specialization.id}
                      >
                        Xóa
                      </LoadingButton>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
