'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import DashboardHeader from '@/components/DashboardHeader'
import Modal from '@/components/Modal'
import SkillForm from '@/components/SkillForm'
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
  const [skills, setSkills] = useState<Skill[]>(initialSkills)
  const [error, setError] = useState<string | null>(initialError)
  const [loading, setLoading] = useState(initialSkills.length === 0)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

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

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || errorData.message || 'Failed to fetch skills')
      }
      const responseData = await response.json()
      // Handle both old format (array) and new format ({ data, pagination })
      const data = Array.isArray(responseData) ? responseData : responseData.data || []
      setSkills(data)
    } catch (err: any) {
      const errorMsg = err.name === 'AbortError' 
        ? 'Request timeout. Vui lòng thử lại.' 
        : err.message || 'Failed to load skills'
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

      const response = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || errorData.message || 'Failed to delete skill')
      }
      toast.success('Skill đã được xóa thành công!')
      await fetchSkills()
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to delete skill'
      toast.error(errorMsg)
    } finally {
      setDeletingId(null)
    }
  }

  const handleOpenCreate = () => {
    setEditingId(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (id: number) => {
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
    fetchSkills()
  }

  const filteredSkills =
    filterCategory === 'all' ? skills : skills.filter((s) => s.category === filterCategory)

  const categories = Array.from(new Set(skills.map((s) => s.category)))

  // Pagination calculations
  const totalPages = Math.ceil(filteredSkills.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedSkills = filteredSkills.slice(startIndex, endIndex)

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [filterCategory])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of list
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="skills-page">
      <div className="page-container">
        <DashboardHeader
          title="Quản lý Skills"
          subtitle="Quản lý skills, tools và certifications"
          showBack={true}
          backHref="/dashboard"
        />

        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <LoadingButton onClick={handleOpenCreate} variant="primary">
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
                <LoadingButton onClick={handleOpenCreate} variant="primary">
                  + Thêm Skill đầu tiên
                </LoadingButton>
              </div>
            ) : (
              <>
                <div className="skills-list">
                  {paginatedSkills.map((skill, index) => (
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
                        <LoadingButton onClick={() => handleOpenEdit(skill.id)} variant="primary">
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <LoadingButton
                      onClick={() => handlePageChange(currentPage - 1)}
                      variant="secondary"
                      disabled={currentPage === 1}
                    >
                      ← Trước
                    </LoadingButton>

                    <div className="pagination-pages">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <LoadingButton
                      onClick={() => handlePageChange(currentPage + 1)}
                      variant="secondary"
                      disabled={currentPage === totalPages}
                    >
                      Sau →
                    </LoadingButton>
                  </div>
                )}

                {/* Pagination info */}
                {filteredSkills.length > 0 && (
                  <div className="pagination-info">
                    Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredSkills.length)} trong tổng số{' '}
                    {filteredSkills.length} skills
                  </div>
                )}
              </>
            )}
          </>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title={editingId ? 'Sửa Skill' : 'Thêm Skill mới'}
          size="large"
        >
          <SkillForm
            skillId={editingId || undefined}
            onSuccess={handleFormSuccess}
            onCancel={handleModalClose}
          />
        </Modal>
      </div>
    </div>
  )
}
