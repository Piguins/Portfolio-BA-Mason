'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Loader2, MapPin, Calendar } from 'lucide-react'
import { fetchWithAuth } from '@/lib/fetchWithAuth'
import BackButton from '@/components/BackButton'
import LoadingButton from '@/components/LoadingButton'
import { cn } from '@/lib/utils'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
}

interface Experience {
  id: string
  company: string
  role: string
  location?: string
  start_date: string
  end_date?: string
  is_current: boolean
  description?: string
  order_index: number
  bullets?: Array<{ id: number; text: string; order_index: number }>
  // New free-text skills
  skills_text?: string[]
  // Old relation-based skills (still supported for backward compatibility)
  skills_used?: Array<{ id: number; name: string; slug: string }>
}

interface ExperienceListClientProps {
  initialExperiences: Experience[]
  initialError: string | null
}

export default function ExperienceListClient({
  initialExperiences,
  initialError,
}: ExperienceListClientProps) {
  const router = useRouter()
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences)
  const [error, setError] = useState<string | null>(initialError)
  const [loading, setLoading] = useState(initialExperiences.length === 0)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchExperiences = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
      const response = await fetch(`${API_URL}/api/experience`, {
        cache: 'no-store',
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) throw new Error('Failed to fetch experiences')
      const responseData = await response.json()
      // Handle both old format (array) and new format ({ data, pagination })
      const data = Array.isArray(responseData) ? responseData : responseData.data || []
      setExperiences(data)
    } catch (err: any) {
      let errorMsg = 'Failed to load experiences'
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
    if (initialExperiences.length === 0) {
      fetchExperiences()
    }
  }, [initialExperiences.length, fetchExperiences])

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa experience này?')) return

    try {
      setDeletingId(id)
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
      const response = await fetchWithAuth(`${API_URL}/api/experience/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || errorData.message || 'Failed to delete experience')
      }
      
      await fetchExperiences()
      toast.success('Experience đã được xóa thành công!')
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to delete experience'
      toast.error(errorMsg)
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
    })
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
                  Quản lý Experience
                </h1>
                <p className="text-base text-slate-600 leading-relaxed">
                  Quản lý kinh nghiệm làm việc và timeline
                </p>
              </div>
            </div>
            <LoadingButton onClick={() => router.push('/dashboard/experience/new')} variant="primary">
              + Thêm Experience
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
            <p className="text-base">Đang tải dữ liệu Experience...</p>
          </div>
        ) : experiences.length === 0 ? (
          /* Empty State */
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="text-center p-12 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center gap-4"
          >
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-slate-900">Chưa có experience nào</h3>
            <p className="text-base text-slate-600 mb-6">
              Hãy thêm experience đầu tiên để bắt đầu quản lý!
            </p>
            <LoadingButton
              onClick={() => router.push('/dashboard/experience/new')}
              variant="primary"
            >
              + Thêm Experience đầu tiên
            </LoadingButton>
          </motion.div>
        ) : (
          /* Experiences List */
          <div className="flex flex-col gap-6">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 p-6"
              >
                {/* Card Header */}
                <div className="flex justify-between items-start gap-6 mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900 mb-1">{exp.role}</h3>
                    <p className="text-lg font-medium text-slate-700 mb-3">{exp.company}</p>
                    <div className="flex items-center gap-4 flex-wrap">
                      {exp.location && (
                        <span className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin className="w-4 h-4" />
                          {exp.location}
                        </span>
                      )}
                      <span className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-4 h-4" />
                        {formatDate(exp.start_date)} -{' '}
                        {exp.is_current
                          ? 'Hiện tại'
                          : exp.end_date
                            ? formatDate(exp.end_date)
                            : 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <LoadingButton
                      onClick={() => router.push(`/dashboard/experience/${exp.id}/edit`)}
                      variant="primary"
                    >
                      Sửa
                    </LoadingButton>
                    <LoadingButton
                      onClick={() => handleDelete(exp.id)}
                      variant="danger"
                      loading={deletingId === exp.id}
                    >
                      Xóa
                    </LoadingButton>
                  </div>
                </div>

                {/* Description */}
                {exp.description && (
                  <div className="mb-4">
                    <p className="text-base text-slate-600 leading-relaxed">{exp.description}</p>
                  </div>
                )}

                {/* Bullets */}
                {exp.bullets && exp.bullets.length > 0 && (
                  <div className="mb-4 pt-4 border-t border-slate-200">
                    <h4 className="text-sm font-semibold text-slate-900 mb-2">Thành tựu chính</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                      {exp.bullets.map((bullet) => (
                        <li key={bullet.id}>{bullet.text}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Skills */}
                {((exp.skills_text && exp.skills_text.length > 0) ||
                  (exp.skills_used && exp.skills_used.length > 0)) && (
                  <div className="pt-4 border-t border-slate-200">
                    <h4 className="text-sm font-semibold text-slate-900 mb-2">Kỹ năng sử dụng</h4>
                    <div className="flex flex-wrap gap-2">
                      {exp.skills_text && exp.skills_text.length > 0
                        ? exp.skills_text.map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700"
                            >
                              {skill}
                            </span>
                          ))
                        : exp.skills_used?.map((skill) => (
                            <span
                              key={skill.id}
                              className="px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700"
                            >
                              {skill.name}
                            </span>
                          ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
