'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import DashboardHeader from '@/components/DashboardHeader'
import Modal from '@/components/Modal'
import ConfirmModal from '@/components/ConfirmModal'
import ExperienceForm from '@/components/ExperienceForm'
import LoadingButton from '@/components/LoadingButton'
import './experience.css'

interface Experience {
  id: string
  company: string
  role: string
  location?: string
  start_date: string
  end_date?: string
  is_current: boolean
  description?: string
  bullets?: Array<{ id: number; text: string }>
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
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences)
  const [error, setError] = useState<string | null>(initialError)
  const [loading, setLoading] = useState(initialExperiences.length === 0)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const fetchExperiences = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

      const response = await fetch('/api/experience', {
        cache: 'no-store',
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || errorData.message || 'Failed to fetch experiences')
      }
      const responseData = await response.json()
      // Handle both old format (array) and new format ({ data, pagination })
      const data = Array.isArray(responseData) ? responseData : responseData.data || []
      setExperiences(data)
    } catch (err: any) {
      const errorMsg = err.name === 'AbortError' 
        ? 'Request timeout. Vui lòng thử lại.' 
        : err.message || 'Failed to load experiences'
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

  const handleDeleteClick = (id: string) => {
    setConfirmDeleteId(id)
    setIsConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return

    try {
      setDeletingId(confirmDeleteId)
      setIsConfirmOpen(false)

      const response = await fetch(`/api/experience/${confirmDeleteId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || errorData.message || 'Failed to delete experience')
      }
      toast.success('Experience đã được xóa thành công!')
      await fetchExperiences()
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to delete experience'
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

  const handleFormSuccess = async () => {
    setIsModalOpen(false)
    setEditingId(null)
    // Small delay to ensure API has committed the transaction
    await new Promise(resolve => setTimeout(resolve, 100))
    await fetchExperiences()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
    })
  }

  return (
    <div className="experience-page">
      <div className="page-container">
        <DashboardHeader
          title="Quản lý Experience"
          subtitle="Quản lý kinh nghiệm làm việc và timeline"
          showBack={true}
          backHref="/dashboard"
        />

        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <LoadingButton onClick={handleOpenCreate} variant="primary">
            + Thêm Experience
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
            <div className="loading-spinner"></div>
            <p>Đang tải dữ liệu Experience...</p>
          </div>
        ) : experiences.length === 0 ? (
          <div className="empty-state">
            <h3>Chưa có experience nào</h3>
            <p>Hãy thêm experience đầu tiên để bắt đầu quản lý!</p>
            <LoadingButton onClick={handleOpenCreate} variant="primary">
              + Thêm Experience đầu tiên
            </LoadingButton>
          </div>
        ) : (
          <div className="experience-list">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="experience-card"
              >
                <div className="card-header">
                  <div className="card-title-section">
                    <h3>{exp.role}</h3>
                    <p className="company">{exp.company}</p>
                    <div className="card-meta">
                      {exp.location && (
                        <span className="meta-item">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          {exp.location}
                        </span>
                      )}
                      <span className="meta-item">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        {formatDate(exp.start_date)} -{' '}
                        {exp.is_current
                          ? 'Hiện tại'
                          : exp.end_date
                            ? formatDate(exp.end_date)
                            : 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <LoadingButton onClick={() => handleOpenEdit(exp.id)} variant="primary">
                      Sửa
                    </LoadingButton>
                    <LoadingButton
                      onClick={() => handleDeleteClick(exp.id)}
                      variant="danger"
                      loading={deletingId === exp.id}
                    >
                      Xóa
                    </LoadingButton>
                  </div>
                </div>

                {exp.description && (
                  <div className="card-description">
                    <p>{exp.description}</p>
                  </div>
                )}

                {exp.bullets && exp.bullets.length > 0 && (
                  <div className="card-bullets">
                    <h4>Thành tựu chính</h4>
                    <ul className="bullets-list">
                      {exp.bullets.map((bullet) => (
                        <li key={bullet.id}>{bullet.text}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {(exp.skills_text && exp.skills_text.length > 0) ||
                (exp.skills_used && exp.skills_used.length > 0) ? (
                  <div className="card-skills">
                    <h4>Kỹ năng sử dụng</h4>
                    <div className="skills-tags">
                      {exp.skills_text && exp.skills_text.length > 0
                        ? exp.skills_text.map((skill, index) => (
                            <span key={index} className="skill-tag">
                              {skill}
                            </span>
                          ))
                        : exp.skills_used?.map((skill) => (
                            <span key={skill.id} className="skill-tag">
                              {skill.name}
                            </span>
                          ))}
                    </div>
                  </div>
                ) : null}
              </motion.div>
            ))}
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title={editingId ? 'Sửa Experience' : 'Thêm Experience mới'}
          size="xlarge"
        >
          <ExperienceForm
            experienceId={editingId || undefined}
            onSuccess={handleFormSuccess}
            onCancel={handleModalClose}
          />
        </Modal>

        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Xác nhận xóa"
          message="Bạn có chắc chắn muốn xóa experience này? Hành động này không thể hoàn tác."
          confirmText="Xóa"
          cancelText="Hủy"
          variant="danger"
          loading={deletingId !== null}
        />
      </div>
    </div>
  )
}
