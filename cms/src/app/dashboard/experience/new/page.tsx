'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import BackButton from '@/components/BackButton'
import LoadingButton from '@/components/LoadingButton'
import '../experience.css'

interface Skill {
  id: number
  name: string
  slug: string
  category: string
}

export default function NewExperiencePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [loadingSkills, setLoadingSkills] = useState(true)
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    location: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
    order_index: 0,
    bullets: [] as Array<{ text: string; order_index: number }>,
    skill_ids: [] as number[],
  })
  const [newBullet, setNewBullet] = useState('')

  // Fetch all skills for selection
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
        const response = await fetch(`${API_URL}/api/skills`)
        if (response.ok) {
          const data = await response.json()
          setSkills(data)
        }
      } catch (err) {
        console.error('Failed to fetch skills:', err)
      } finally {
        setLoadingSkills(false)
      }
    }
    fetchSkills()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15s timeout
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/experience`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create experience')
      }

      router.replace('/dashboard/experience')
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Request timeout. Vui lòng thử lại.')
      } else {
        setError(err.message || 'Failed to create experience')
      }
    } finally {
      setLoading(false)
    }
  }

  const addBullet = () => {
    if (!newBullet.trim()) return
    setFormData({
      ...formData,
      bullets: [...formData.bullets, { text: newBullet, order_index: formData.bullets.length }],
    })
    setNewBullet('')
  }

  const removeBullet = (index: number) => {
    setFormData({
      ...formData,
      bullets: formData.bullets
        .filter((_, i) => i !== index)
        .map((bullet, i) => ({ ...bullet, order_index: i })),
    })
  }

  return (
    <div className="experience-page">
      <div className="page-container">
        <div className="page-header">
          <div className="header-content">
            <BackButton href="/dashboard/experience">Quay lại Experience</BackButton>
            <div className="header-text">
              <h1>Thêm Experience mới</h1>
              <p>Điền thông tin để tạo experience mới</p>
            </div>
          </div>
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

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="experience-form"
        >
          <div className="form-section">
            <h3 className="section-title">Thông tin cơ bản</h3>
            <div className="form-group">
              <label htmlFor="company">Company *</label>
              <input
                id="company"
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Tên công ty"
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Role *</label>
              <input
                id="role"
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Vị trí công việc"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Địa điểm"
                />
              </div>

              <div className="form-group">
                <label htmlFor="order_index">Order Index</label>
                <input
                  id="order_index"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Thời gian làm việc</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="start_date">Start Date *</label>
                <input
                  id="start_date"
                  type="date"
                  required
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="end_date">End Date</label>
                <input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  disabled={formData.is_current}
                />
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.is_current}
                  onChange={(e) => setFormData({ ...formData, is_current: e.target.checked, end_date: '' })}
                />
                <span>Đây là vị trí hiện tại</span>
              </label>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Mô tả</h3>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả về công việc và trách nhiệm..."
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Thành tựu (Bullets) - Key Achievements</h3>
            <div className="form-group">
              <div className="bullets-input">
                <input
                  type="text"
                  value={newBullet}
                  onChange={(e) => setNewBullet(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBullet())}
                  placeholder="Nhập thành tựu và nhấn Enter hoặc nút Thêm"
                />
                <LoadingButton
                  type="button"
                  onClick={addBullet}
                  variant="primary"
                >
                  Thêm
                </LoadingButton>
              </div>
              {formData.bullets.length > 0 && (
                <ul className="bullets-list-form">
                  {formData.bullets.map((bullet, index) => (
                    <li key={index} className="bullet-item">
                      <span>{bullet.text}</span>
                      <button type="button" onClick={() => removeBullet(index)} className="btn-remove">
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Kỹ năng sử dụng (Skills Used)</h3>
            <div className="form-group">
              <label htmlFor="skills">Chọn các kỹ năng đã sử dụng trong công việc này</label>
              {loadingSkills ? (
                <p className="text-muted">Đang tải danh sách skills...</p>
              ) : skills.length === 0 ? (
                <p className="text-muted">Chưa có skill nào. Hãy tạo skills trước.</p>
              ) : (
                <div className="skills-select-container">
                  <div className="skills-checkbox-list">
                    {skills.map((skill) => (
                      <label key={skill.id} className="skill-checkbox-item">
                        <input
                          type="checkbox"
                          checked={formData.skill_ids.includes(skill.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                skill_ids: [...formData.skill_ids, skill.id],
                              })
                            } else {
                              setFormData({
                                ...formData,
                                skill_ids: formData.skill_ids.filter(id => id !== skill.id),
                              })
                            }
                          }}
                        />
                        <span>{skill.name}</span>
                        <span className="skill-category-badge">{skill.category}</span>
                      </label>
                    ))}
                  </div>
                  {formData.skill_ids.length > 0 && (
                    <div className="selected-skills-preview">
                      <p className="selected-skills-label">Đã chọn ({formData.skill_ids.length}):</p>
                      <div className="selected-skills-tags">
                        {formData.skill_ids.map(skillId => {
                          const skill = skills.find(s => s.id === skillId)
                          return skill ? (
                            <span key={skillId} className="selected-skill-tag">
                              {skill.name}
                            </span>
                          ) : null
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <LoadingButton
              type="button"
              onClick={() => router.push('/dashboard/experience')}
              variant="secondary"
            >
              Hủy
            </LoadingButton>
            <LoadingButton
              type="submit"
              loading={loading}
              variant="primary"
            >
              Tạo Experience
            </LoadingButton>
          </div>
        </motion.form>
      </div>
    </div>
  )
}
