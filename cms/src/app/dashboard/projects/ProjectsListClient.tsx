'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import BackButton from '@/components/BackButton'
import LoadingButton from '@/components/LoadingButton'
import './projects.css'

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
      if (err.name === 'AbortError') {
        setError('Request timeout. Vui lòng thử lại.')
      } else {
        setError(err.message || 'Failed to load projects')
      }
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
      const response = await fetch(`${API_URL}/api/projects/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete project')
      await fetchProjects()
    } catch (err: any) {
      alert(err.message || 'Failed to delete project')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="projects-page">
      <div className="page-container">
        <div className="page-header">
          <div className="header-content">
            <BackButton href="/dashboard" />
            <div className="header-text">
              <h1>Quản lý Projects</h1>
              <p>Quản lý portfolio projects và case studies</p>
            </div>
          </div>
          <LoadingButton onClick={() => router.push('/dashboard/projects/new')} variant="primary">
            + Thêm Project
          </LoadingButton>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="error-alert"
          >
            {error}
          </motion.div>
        )}

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Đang tải dữ liệu Projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📁</div>
            <h3>Chưa có project nào</h3>
            <p>Hãy thêm project đầu tiên để bắt đầu quản lý!</p>
            <LoadingButton onClick={() => router.push('/dashboard/projects/new')} variant="primary">
              + Thêm Project đầu tiên
            </LoadingButton>
          </div>
        ) : (
          <div className="projects-list">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="project-card"
              >
                <div className="card-header">
                  <div className="card-title-section">
                    <h3>{project.title}</h3>
                    <p className="slug">{project.slug}</p>
                    <div className="card-meta">
                      <span
                        className={`status-badge ${project.is_published ? 'published' : 'draft'}`}
                      >
                        {project.is_published ? '✓ Published' : '○ Draft'}
                      </span>
                      {project.order_index !== null && (
                        <span className="meta-item">Order: {project.order_index}</span>
                      )}
                    </div>
                    {project.tags && project.tags.length > 0 && (
                      <div className="tags-list">
                        {project.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="tag"
                            style={{ backgroundColor: tag.color || '#e0e0e0' }}
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="card-actions">
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

                {project.description && (
                  <div className="card-description">
                    <p>{project.description}</p>
                  </div>
                )}

                {(project.demo_url || project.github_url || project.thumbnail_url) && (
                  <div className="card-links">
                    {project.thumbnail_url && (
                      <a
                        href={project.thumbnail_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link"
                      >
                        🖼️ Thumbnail
                      </a>
                    )}
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link"
                      >
                        🌐 Demo
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link"
                      >
                        💻 GitHub
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
