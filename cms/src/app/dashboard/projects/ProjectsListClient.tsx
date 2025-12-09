'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import DashboardHeader from '@/components/DashboardHeader'
import Modal from '@/components/Modal'
import ConfirmModal from '@/components/ConfirmModal'
import ProjectForm from '@/components/ProjectForm'
import LoadingButton from '@/components/LoadingButton'
import './projects.css'

interface Project {
  id: string
  title: string
  summary?: string
  hero_image_url?: string
  case_study_url?: string
  tags_text?: string[]
}

interface ProjectsListClientProps {
  initialProjects: Project[]
  initialError: string | null
}

export default function ProjectsListClient({
  initialProjects,
  initialError,
}: ProjectsListClientProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [error, setError] = useState<string | null>(initialError)
  const [loading, setLoading] = useState(initialProjects.length === 0)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

      const response = await fetch(`/api/projects?published=`, {
        cache: 'no-store',
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || errorData.message || 'Failed to fetch projects')
      }
      const responseData = await response.json()
      // Handle both old format (array) and new format ({ data, pagination })
      const data = Array.isArray(responseData) ? responseData : responseData.data || []
      setProjects(data)
    } catch (err: any) {
      const errorMsg = err.name === 'AbortError' 
        ? 'Request timeout. Vui lòng thử lại.' 
        : err.message || 'Failed to load projects'
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

  const handleDeleteClick = (id: string) => {
    setConfirmDeleteId(id)
    setIsConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return

    try {
      setDeletingId(confirmDeleteId)
      setIsConfirmOpen(false)

      const response = await fetch(`/api/projects/${confirmDeleteId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || errorData.message || 'Failed to delete project')
      }
      toast.success('Project đã được xóa thành công!')
      await fetchProjects()
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to delete project'
      toast.error(errorMsg)
    } finally {
      setDeletingId(null)
      setConfirmDeleteId(null)
    }
  }

  const handleCancelDelete = () => {
    setIsConfirmOpen(false)
    setConfirmDeleteId(null)
  }

  const handleOpenCreate = () => {
    setEditingId(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (id: string) => {
    setEditingId(id)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingId(null)
  }

  const handleFormSuccess = () => {
    setIsModalOpen(false)
    setEditingId(null)
    fetchProjects()
  }

  return (
    <div className="projects-page">
      <div className="page-container">
        <DashboardHeader
          title="Quản lý Projects"
          subtitle="Quản lý portfolio projects và case studies"
          showBack={true}
          backHref="/dashboard"
        />

        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <LoadingButton onClick={handleOpenCreate} variant="primary">
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
            <LoadingButton onClick={handleOpenCreate} variant="primary">
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
                    {project.tags_text && project.tags_text.length > 0 && (
                      <div className="tags-list">
                        {project.tags_text.map((tag, index) => (
                          <span key={index} className="tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="card-actions">
                    <LoadingButton onClick={() => handleOpenEdit(project.id)} variant="primary">
                      Sửa
                    </LoadingButton>
                    <LoadingButton
                      onClick={() => handleDeleteClick(project.id)}
                      variant="danger"
                      loading={deletingId === project.id}
                    >
                      Xóa
                    </LoadingButton>
                  </div>
                </div>

                {project.summary && (
                  <div className="card-description">
                    <p>{project.summary}</p>
                  </div>
                )}

                {(project.case_study_url || project.hero_image_url) && (
                  <div className="card-links">
                    {project.case_study_url && (
                      <a
                        href={project.case_study_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link"
                      >
                        📄 Case Study
                      </a>
                    )}
                    {project.hero_image_url && (
                      <a
                        href={project.hero_image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link"
                      >
                        🖼️ Hero Image
                      </a>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title={editingId ? 'Sửa Project' : 'Thêm Project mới'}
          size="large"
        >
          <ProjectForm
            projectId={editingId || undefined}
            onSuccess={handleFormSuccess}
            onCancel={handleModalClose}
          />
        </Modal>

        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Xác nhận xóa"
          message="Bạn có chắc chắn muốn xóa project này? Hành động này không thể hoàn tác."
          confirmText="Xóa"
          cancelText="Hủy"
          variant="danger"
          loading={deletingId !== null}
        />
      </div>
    </div>
  )
}
