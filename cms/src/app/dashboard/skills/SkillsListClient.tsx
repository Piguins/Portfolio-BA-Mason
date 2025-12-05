'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import BackButton from '@/components/BackButton'
import LoadingButton from '@/components/LoadingButton'
import './skills.css'

interface Skill {
  id: number
  name: string
  slug: string
  category: string
  level: number
  icon_url?: string
  description?: string
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

      const response = await fetch(`/api/skills`, {
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
      if (err.name === 'AbortError') {
        setError('Request timeout. Vui lòng thử lại.')
      } else {
        setError(err.message || 'Failed to load skills')
      }
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

      const response = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete skill')
      }
      await fetchSkills()
    } catch (err: any) {
      alert(err.message || 'Failed to delete skill')
    } finally {
      setDeletingId(null)
    }
  }

  const filteredSkills =
    filterCategory === 'all' ? skills : skills.filter((s) => s.category === filterCategory)

  const categories = Array.from(new Set(skills.map((s) => s.category)))

  return (
    <div className="skills-page">
      <div className="page-container">
        <div className="page-header">
          <div className="header-content">
            <BackButton href="/dashboard" />
            <div className="header-text">
              <h1>Quản lý Skills</h1>
              <p>Quản lý skills, tools và certifications</p>
            </div>
          </div>
          <LoadingButton onClick={() => router.push('/dashboard/skills/new')} variant="primary">
            + Thêm Skill
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
            <p>Đang tải dữ liệu Skills...</p>
          </div>
        ) : (
          <>
            {skills.length > 0 && (
              <div className="filter-section">
                <label htmlFor="category-filter">Lọc theo category:</label>
                <select
                  id="category-filter"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="filter-select"
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

            {filteredSkills.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🛠️</div>
                <h3>
                  Chưa có skill nào
                  {filterCategory !== 'all' ? ` trong category "${filterCategory}"` : ''}
                </h3>
                <p>Hãy thêm skill đầu tiên để bắt đầu quản lý!</p>
                <LoadingButton
                  onClick={() => router.push('/dashboard/skills/new')}
                  variant="primary"
                >
                  + Thêm Skill đầu tiên
                </LoadingButton>
              </div>
            ) : (
              <div className="skills-list">
                {filteredSkills.map((skill, index) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="skill-card"
                  >
                    <div className="card-header">
                      <div className="card-title-section">
                        <div className="skill-header-row">
                          <h3>{skill.name}</h3>
                          {skill.is_highlight && (
                            <span className="highlight-badge">⭐ Highlight</span>
                          )}
                        </div>
                        <p className="slug">{skill.slug}</p>
                        <div className="card-meta">
                          <span className="category-badge">{skill.category}</span>
                          <span className="level-badge">Level: {skill.level}/5</span>
                          <span className="meta-item">Order: {skill.order_index}</span>
                        </div>
                        {skill.icon_url && (
                          <div className="icon-preview">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={skill.icon_url} alt={skill.name} />
                          </div>
                        )}
                      </div>
                      <div className="card-actions">
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
