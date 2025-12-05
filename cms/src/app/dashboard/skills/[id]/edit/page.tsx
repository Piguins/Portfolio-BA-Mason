'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import BackButton from '@/components/BackButton'
import LoadingButton from '@/components/LoadingButton'
import '../../skills.css'

interface Skill {
  id: number
  name: string
  slug: string
  category: string
  level: number
  icon_url?: string
  is_highlight: boolean
  order_index: number
}

export default function EditSkillPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'technical',
    level: 1,
    icon_url: '',
    is_highlight: false,
    order_index: 0,
  })

  const fetchSkill = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
      const response = await fetch(`${API_URL}/api/skills/${id}`, {
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch skill')
      }

      const data: Skill = await response.json()
      setFormData({
        name: data.name,
        slug: data.slug,
        category: data.category,
        level: data.level,
        icon_url: data.icon_url || '',
        is_highlight: data.is_highlight || false,
        order_index: data.order_index || 0,
      })
    } catch (err: any) {
      setError(err.message || 'Failed to load skill')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchSkill()
    }
  }, [id, fetchSkill])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setSaving(true)
      setError(null)

      if (!formData.name || !formData.slug) {
        setError('Vui lòng điền đầy đủ Name và Slug.')
        setSaving(false)
        return
      }

      const payload = {
        ...formData,
        level: Number(formData.level),
        order_index: Number(formData.order_index),
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
        const response = await fetch(`${API_URL}/api/skills/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        })
        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to update skill')
        }

        router.replace('/dashboard/skills')
      } catch (err: any) {
        if (err.name === 'AbortError') {
          setError('Yêu cầu cập nhật skill đã hết thời gian. Vui lòng thử lại.')
        } else {
          setError(err.message || 'Failed to update skill')
        }
      } finally {
        setSaving(false)
      }
    },
    [formData, id, router]
  )

  if (loading) {
    return (
      <div className="skills-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu Skill...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="skills-page">
      <div className="page-container">
        <div className="page-header">
          <div className="header-content">
            <BackButton href="/dashboard/skills" />
            <div className="header-text">
              <h1>Sửa Skill</h1>
              <p>Cập nhật thông tin skill</p>
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
          className="skill-form"
        >
          <div className="form-section">
            <h3 className="section-title">Thông tin cơ bản</h3>
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Tên skill"
              />
            </div>

            <div className="form-group">
              <label htmlFor="slug">Slug *</label>
              <input
                id="slug"
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="skill-slug"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="technical">Technical</option>
                  <option value="soft">Soft Skills</option>
                  <option value="tool">Tools</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="level">Level (1-5)</label>
                <input
                  id="level"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.level}
                  onChange={(e) =>
                    setFormData({ ...formData, level: parseInt(e.target.value) || 1 })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="order_index">Order Index</label>
                <input
                  id="order_index"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) =>
                    setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Media & Settings</h3>
            <div className="form-group">
              <label htmlFor="icon_url">Icon URL</label>
              <input
                id="icon_url"
                type="url"
                value={formData.icon_url}
                onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                placeholder="https://example.com/icon.svg"
              />
            </div>

            <div className="form-group checkbox-group">
              <label htmlFor="is_highlight">
                <input
                  id="is_highlight"
                  type="checkbox"
                  checked={formData.is_highlight}
                  onChange={(e) => setFormData({ ...formData, is_highlight: e.target.checked })}
                />
                Highlight skill (hiển thị nổi bật)
              </label>
            </div>
          </div>

          <div className="form-actions">
            <LoadingButton
              type="button"
              onClick={() => router.push('/dashboard/skills')}
              variant="secondary"
            >
              Hủy
            </LoadingButton>
            <LoadingButton type="submit" loading={saving} variant="primary">
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </LoadingButton>
          </div>
        </motion.form>
      </div>
    </div>
  )
}
