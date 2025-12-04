'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
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

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/experience`)
      if (!response.ok) throw new Error('Failed to fetch experiences')
      const data = await response.json()
      setExperiences(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load experiences')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa experience này?')) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/experience/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete experience')
      fetchExperiences()
    } catch (err: any) {
      alert(err.message || 'Failed to delete experience')
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
        <div className="loading">Đang tải...</div>
      </div>
    )
  }

  return (
    <div className="experience-page">
      <div className="page-header">
        <div>
          <Link href="/dashboard" className="back-link">
            ← Quay lại Dashboard
          </Link>
          <h1>Quản lý Experience</h1>
          <p>Quản lý kinh nghiệm làm việc và timeline</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/dashboard/experience/new')}
          className="btn-primary"
        >
          + Thêm Experience
        </motion.button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="experience-list">
        {experiences.length === 0 ? (
          <div className="empty-state">
            <p>Chưa có experience nào. Hãy thêm experience đầu tiên!</p>
          </div>
        ) : (
          experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="experience-card"
            >
              <div className="experience-header">
                <div>
                  <h3>{exp.role}</h3>
                  <p className="company">{exp.company}</p>
                  <div className="experience-meta">
                    {exp.location && <span>📍 {exp.location}</span>}
                    <span>
                      📅 {formatDate(exp.start_date)} -{' '}
                      {exp.is_current ? 'Hiện tại' : exp.end_date ? formatDate(exp.end_date) : 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="experience-actions">
                  <button
                    onClick={() => router.push(`/dashboard/experience/${exp.id}/edit`)}
                    className="btn-edit"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="btn-delete"
                  >
                    Xóa
                  </button>
                </div>
              </div>
              {exp.description && (
                <p className="experience-description">{exp.description}</p>
              )}
              {exp.bullets && exp.bullets.length > 0 && (
                <ul className="bullets-list">
                  {exp.bullets.map((bullet) => (
                    <li key={bullet.id}>{bullet.text}</li>
                  ))}
                </ul>
              )}
              {exp.skills_used && exp.skills_used.length > 0 && (
                <div className="skills-tags">
                  {exp.skills_used.map((skill) => (
                    <span key={skill.id} className="skill-tag">
                      {skill.name}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

