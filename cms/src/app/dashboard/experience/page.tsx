'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import BackButton from '@/components/BackButton'
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
  order_index: number
  bullets?: Array<{ id: number; text: string; order_index: number }>
  skills_used?: Array<{ id: number; name: string; slug: string }>
}

export default function ExperiencePage() {
  const router = useRouter()
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/experience`, {
        signal: controller.signal,
        cache: 'no-store',
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) throw new Error('Failed to fetch experiences')
      const data = await response.json()
      setExperiences(data)
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Request timeout. Vui lòng thử lại.')
      } else {
        setError(err.message || 'Failed to load experiences')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa experience này?')) return

    try {
      setDeletingId(id)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/experience/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete experience')
      await fetchExperiences()
    } catch (err: any) {
      alert(err.message || 'Failed to delete experience')
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

  if (loading) {
    return (
      <div className="experience-page">
        <div className="page-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="experience-page">
      <div className="page-container">
        <div className="page-header">
          <div className="header-content">
            <BackButton href="/dashboard">Quay lại Dashboard</BackButton>
            <div className="header-text">
              <h1>Quản lý Experience</h1>
              <p>Quản lý kinh nghiệm làm việc và timeline</p>
            </div>
          </div>
          <LoadingButton
            onClick={() => router.push('/dashboard/experience/new')}
            variant="primary"
          >
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

        {experiences.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>Chưa có experience nào</h3>
            <p>Hãy thêm experience đầu tiên để bắt đầu quản lý!</p>
            <LoadingButton
              onClick={() => router.push('/dashboard/experience/new')}
              variant="primary"
            >
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
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          {exp.location}
                        </span>
                      )}
                      <span className="meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        {formatDate(exp.start_date)} - {exp.is_current ? 'Hiện tại' : exp.end_date ? formatDate(exp.end_date) : 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="card-actions">
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

                {exp.skills_used && exp.skills_used.length > 0 && (
                  <div className="card-skills">
                    <h4>Kỹ năng sử dụng</h4>
                    <div className="skills-tags">
                      {exp.skills_used.map((skill) => (
                        <span key={skill.id} className="skill-tag">
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
