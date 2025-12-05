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

interface Skill {
  id: number
  name: string
  slug: string
  category: string
  level: number
  icon_url?: string
  is_highlight: boolean
  order_index: number
}

interface SkillsListClientProps {
  initialSkills: Skill[]
  initialError: string | null
}

export default function SkillsListClient({ initialSkills, initialError }: SkillsListClientProps) {
  const router = useRouter()
  const [skills, setSkills] = useState<Skill[]>(initialSkills)
  const [error, setError] = useState<string | null>(initialError)
  const [loading, setLoading] = useState(initialSkills.length === 0)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('all')

  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
      const response = await fetch(`${API_URL}/api/skills`, {
        cache: 'no-store',
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) throw new Error('Failed to fetch skills')
      const responseData = await response.json()
      // Handle both old format (array) and new format ({ data, pagination })
      const data = Array.isArray(responseData) ? responseData : responseData.data || []
      setSkills(data)
    } catch (err: any) {
      let errorMsg = 'Failed to load skills'
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
    if (initialSkills.length === 0) {
      fetchSkills()
    }
  }, [initialSkills.length, fetchSkills])

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa skill này?')) return

    try {
      setDeletingId(id)
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
      const response = await fetchWithAuth(`${API_URL}/api/skills/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || errorData.message || 'Failed to delete skill')
      }
      
      await fetchSkills()
      toast.success('Skill đã được xóa thành công!')
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to delete skill'
      toast.error(errorMsg)
    } finally {
      setDeletingId(null)
    }
  }

  const filteredSkills =
    filterCategory === 'all' ? skills : skills.filter((s) => s.category === filterCategory)

  const categories = Array.from(new Set(skills.map((s) => s.category)))

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
                  Quản lý Skills
                </h1>
                <p className="text-base text-slate-600 leading-relaxed">
                  Quản lý skills, tools và certifications
                </p>
              </div>
            </div>
            <LoadingButton onClick={() => router.push('/dashboard/skills/new')} variant="primary">
              + Thêm Skill
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
            <p className="text-base">Đang tải dữ liệu Skills...</p>
          </div>
        ) : (
          <>
            {/* Filter */}
            {skills.length > 0 && (
              <div className="mb-6 flex items-center gap-4">
                <label htmlFor="category-filter" className="text-sm font-medium text-slate-700">
                  Lọc theo category:
                </label>
                <select
                  id="category-filter"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                >
                  <option value="all">Tất cả</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Empty State */}
            {filteredSkills.length === 0 ? (
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="text-center p-12 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center gap-4"
              >
                <div className="text-5xl mb-4">🛠️</div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Chưa có skill nào
                  {filterCategory !== 'all' ? ` trong category "${filterCategory}"` : ''}
                </h3>
                <p className="text-base text-slate-600 mb-6">
                  Hãy thêm skill đầu tiên để bắt đầu quản lý!
                </p>
                <LoadingButton onClick={() => router.push('/dashboard/skills/new')} variant="primary">
                  + Thêm Skill đầu tiên
                </LoadingButton>
              </motion.div>
            ) : (
              /* Skills List */
              <div className="flex flex-col gap-6">
                {filteredSkills.map((skill, index) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 p-6"
                  >
                    <div className="flex justify-between items-start gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-slate-900">{skill.name}</h3>
                          {skill.is_highlight && (
                            <span className="px-2 py-1 rounded text-xs font-medium bg-amber-50 text-amber-700">
                              ⭐ Highlight
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 font-mono mb-3">{skill.slug}</p>
                        <div className="flex items-center gap-4 flex-wrap">
                          <span className="px-3 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700">
                            {skill.category}
                          </span>
                          <span className="text-sm text-slate-600">Level: {skill.level}/5</span>
                          <span className="text-sm text-slate-500">Order: {skill.order_index}</span>
                        </div>
                        {skill.icon_url && (
                          <div className="mt-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={skill.icon_url}
                              alt={skill.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <LoadingButton
                          onClick={() => router.push(`/dashboard/skills/${skill.id}/edit`)}
                          variant="primary"
                        >
                          Sửa
                        </LoadingButton>
                        <LoadingButton
                          onClick={() => handleDelete(skill.id)}
                          variant="danger"
                          loading={deletingId === skill.id}
                        >
                          Xóa
                        </LoadingButton>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
