'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import BackButton from '@/components/BackButton'
import LoadingButton from '@/components/LoadingButton'
import '../../experience.css'

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

export default function EditExperiencePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
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

  useEffect(() => {
    if (id) {
      fetchExperience()
    }
  }, [id])

  const fetchExperience = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/experience/${id}`, {
        signal: controller.signal,
        cache: 'no-store',
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error('Failed to fetch experience')
      }
      
      const data: Experience = await response.json()
      
      const formatDateForInput = (dateString: string | null | undefined) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toISOString().split('T')[0]
      }
      
      setFormData({
        company: data.company,
        role: data.role,
        location: data.location || '',
        start_date: formatDateForInput(data.start_date),
        end_date: formatDateForInput(data.end_date),
        is_current: data.is_current || false,
        description: data.description || '',
        order_index: data.order_index || 0,
        bullets: data.bullets?.map(b => ({ text: b.text, order_index: b.order_index })) || [],
        skill_ids: data.skills_used?.map(s => s.id) || [],
      })
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Request timeout. Vui lòng thử lại.')
      } else {
        setError(err.message || 'Failed to load experience')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15s timeout
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/experience/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update experience')
      }

      router.replace('/dashboard/experience')
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Request timeout. Vui lòng thử lại.')
      } else {
        setError(err.message || 'Failed to update experience')
      }
    } finally {
      setSaving(false)
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

  const updateBullet = (index: number, text: string) => {
    const updated = [...formData.bullets]
    updated[index] = { ...updated[index], text }
    setFormData({ ...formData, bullets: updated })
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
            <BackButton href="/dashboard/experience">Quay lại Experience</BackButton>
            <div className="header-text">
              <h1>Sửa Experience</h1>
              <p>Cập nhật thông tin experience</p>
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
            <h3 className="section-title">Thành tựu (Bullets)</h3>
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
                    <li key={index} className="bullet-edit-item">
                      <input
                        type="text"
                        value={bullet.text}
                        onChange={(e) => updateBullet(index, e.target.value)}
                        className="bullet-input"
                        placeholder="Nhập thành tựu..."
                      />
                      <button type="button" onClick={() => removeBullet(index)} className="btn-remove">
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
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
              loading={saving}
              variant="primary"
            >
              Lưu thay đổi
            </LoadingButton>
          </div>
        </motion.form>
      </div>
    </div>
  )
}
