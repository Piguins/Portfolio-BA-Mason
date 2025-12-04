'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import LoadingButton from '@/components/LoadingButton'
import './work-skills.css'

interface WorkSkill {
  id: number
  name: string
  slug: string
  category: string
}

interface Props {
  initialWorkSkills: WorkSkill[]
  initialError: string | null
}

export default function WorkSkillsListClient({ initialWorkSkills, initialError }: Props) {
  const router = useRouter()
  const [workSkills, setWorkSkills] = useState<WorkSkill[]>(initialWorkSkills)
  const [error, setError] = useState<string | null>(initialError)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa work skill này?')) {
      return
    }

    setDeletingId(id)
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
      const response = await fetch(`${API_URL}/api/work-skills/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete work skill')
      }

      // Remove from local state
      setWorkSkills(workSkills.filter(s => s.id !== id))
    } catch (err: any) {
      setError(err.message || 'Failed to delete work skill')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="work-skills-page">
      <div className="page-container">
        <div className="page-header">
          <div className="header-content">
            <a href="/dashboard" className="back-link">
              ← Quay lại Dashboard
            </a>
            <div className="header-text">
              <h1>Quản lý Work Skills</h1>
              <p>Quản lý các kỹ năng sử dụng trong Experience (độc lập với Skills section)</p>
            </div>
          </div>
          <LoadingButton
            onClick={() => router.push('/dashboard/work-skills/new')}
            variant="primary"
            className="btn-add-work-skill"
          >
            + Thêm Work Skill
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

        {workSkills.length === 0 ? (
          <div className="empty-state">
            <p>Chưa có work skill nào. Hãy tạo work skill đầu tiên!</p>
            <LoadingButton
              onClick={() => router.push('/dashboard/work-skills/new')}
              variant="primary"
            >
              Tạo Work Skill đầu tiên
            </LoadingButton>
          </div>
        ) : (
          <div className="work-skills-list">
            {workSkills.map((workSkill) => (
              <motion.div
                key={workSkill.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="work-skill-card"
              >
                <div className="card-header">
                  <div className="card-title-section">
                    <h3>{workSkill.name}</h3>
                    <p className="slug">{workSkill.slug}</p>
                    <div className="card-meta">
                      <span className="category-badge">{workSkill.category}</span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <LoadingButton
                      onClick={() => router.push(`/dashboard/work-skills/${workSkill.id}/edit`)}
                      variant="primary"
                    >
                      Sửa
                    </LoadingButton>
                    <LoadingButton
                      onClick={() => handleDelete(workSkill.id)}
                      variant="danger"
                      loading={deletingId === workSkill.id}
                    >
                      Xóa
                    </LoadingButton>
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

