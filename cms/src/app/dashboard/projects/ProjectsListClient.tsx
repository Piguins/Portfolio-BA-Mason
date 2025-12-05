'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Loader2, ExternalLink, Image as ImageIcon, Globe, Github } from 'lucide-react'
import { fetchWithAuth } from '@/lib/fetchWithAuth'
import BackButton from '@/components/BackButton'
import LoadingButton from '@/components/LoadingButton'
import { cn } from '@/lib/utils'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
}

interface Project {
  id: string
  title: string
  slug: string
  description?: string
  content?: string
  thumbnail_url?: string
  demo_url?: string
  github_url?: string
  is_published: boolean
  order_index: number
  tags?: Array<{ id: number; name: string; color: string }>
}

interface ProjectsListClientProps {
  initialProjects: Project[]
  initialError: string | null
}

export default function ProjectsListClient({
  initialProjects,
  initialError,
}: ProjectsListClientProps) {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [error, setError] = useState<string | null>(initialError)
  const [loading, setLoading] = useState(initialProjects.length === 0)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
      const response = await fetch(`${API_URL}/api/projects?published=`, {
        cache: 'no-store',
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) throw new Error('Failed to fetch projects')
      const responseData = await response.json()
      // Handle both old format (array) and new format ({ data, pagination })
      const data = Array.isArray(responseData) ? responseData : responseData.data || []
      setProjects(data)
    } catch (err: any) {
      let errorMsg = 'Failed to load projects'
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
    if (initialProjects.length === 0) {
      fetchProjects()
    }
  }, [initialProjects.length, fetchProjects])

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa project này?')) return

    try {
      setDeletingId(id)
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
      const response = await fetchWithAuth(`${API_URL}/api/projects/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || errorData.message || 'Failed to delete project')
      }
      
      await fetchProjects()
      toast.success('Project đã được xóa thành công!')
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to delete project'
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
                  Quản lý Projects
                </h1>
                <p className="text-base text-slate-600 leading-relaxed">
                  Quản lý portfolio projects và case studies
                </p>
              </div>
            </div>
            <LoadingButton onClick={() => router.push('/dashboard/projects/new')} variant="primary">
              + Thêm Project
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
            <p className="text-base">Đang tải dữ liệu Projects...</p>
          </div>
        ) : projects.length === 0 ? (
          /* Empty State */
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="text-center p-12 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center gap-4"
          >
            <div className="text-5xl mb-4">📁</div>
            <h3 className="text-xl font-semibold text-slate-900">Chưa có project nào</h3>
            <p className="text-base text-slate-600 mb-6">
              Hãy thêm project đầu tiên để bắt đầu quản lý!
            </p>
            <LoadingButton onClick={() => router.push('/dashboard/projects/new')} variant="primary">
              + Thêm Project đầu tiên
            </LoadingButton>
          </motion.div>
        ) : (
          /* Projects List */
          <div className="flex flex-col gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 p-6"
              >
                {/* Card Header */}
                <div className="flex justify-between items-start gap-6 mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900 mb-1">{project.title}</h3>
                    <p className="text-sm text-slate-500 font-mono mb-3">{project.slug}</p>
                    <div className="flex items-center gap-4 flex-wrap mb-3">
                      <span
                        className={cn(
                          'inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium',
                          project.is_published
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        )}
                      >
                        {project.is_published ? '✓ Published' : '○ Draft'}
                      </span>
                      {project.order_index !== null && (
                        <span className="text-sm text-slate-500">Order: {project.order_index}</span>
                      )}
                    </div>
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="px-2 py-1 rounded text-xs font-medium text-white"
                            style={{ backgroundColor: tag.color || '#94a3b8' }}
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <LoadingButton
                      onClick={() => router.push(`/dashboard/projects/${project.id}/edit`)}
                      variant="primary"
                    >
                      Sửa
                    </LoadingButton>
                    <LoadingButton
                      onClick={() => handleDelete(project.id)}
                      variant="danger"
                      loading={deletingId === project.id}
                    >
                      Xóa
                    </LoadingButton>
                  </div>
                </div>

                {/* Description */}
                {project.description && (
                  <div className="mb-4">
                    <p className="text-base text-slate-600 leading-relaxed">{project.description}</p>
                  </div>
                )}

                {/* Links */}
                {(project.demo_url || project.github_url || project.thumbnail_url) && (
                  <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-200">
                    {project.thumbnail_url && (
                      <a
                        href={project.thumbnail_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <ImageIcon className="w-4 h-4" />
                        Thumbnail
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        Demo
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        GitHub
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
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
