'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import LoadingButton from './LoadingButton'
import { fetchWithAuth } from '@/lib/fetchWithAuth'
import '../app/dashboard/skills/skills.css'

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

interface SkillFormProps {
  skillId?: number
  onSuccess: () => void
  onCancel: () => void
}

export default function SkillForm({ skillId, onSuccess, onCancel }: SkillFormProps) {
  const isEdit = !!skillId
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'technical',
    level: 1,
    icon_url: '',
    description: '',
    is_highlight: false,
    order_index: 0,
  })

  useEffect(() => {
    if (isEdit && skillId) {
      fetchSkill()
    }
  }, [isEdit, skillId])

  const fetchSkill = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/skills/${skillId}`, {
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
        description: data.description || '',
        is_highlight: data.is_highlight || false,
        order_index: data.order_index || 0,
      })
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to load skill'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    if (!formData.name || !formData.slug) {
      setError('Vui lòng điền đầy đủ Name và Slug.')
      setSaving(false)
      return
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      const payload = {
        ...formData,
        level: Number(formData.level),
        order_index: Number(formData.order_index),
      }

      const url = isEdit ? `/api/skills/${skillId}` : `/api/skills`
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetchWithAuth(url, {
        method,
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || errorData.message || `Failed to ${isEdit ? 'update' : 'create'} skill`)
      }

      toast.success(`Skill đã được ${isEdit ? 'cập nhật' : 'tạo'} thành công!`)
      onSuccess()
    } catch (err: any) {
      if (err.name === 'AbortError') {
        const errorMsg = 'Request timeout. Vui lòng thử lại.'
        setError(errorMsg)
        toast.error(errorMsg)
      } else {
        const errorMsg = err.message || `Failed to ${isEdit ? 'update' : 'create'} skill`
        setError(errorMsg)
        toast.error(errorMsg)
      }
    } finally {
      setSaving(false)
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData((prev) => ({
      ...prev,
      name,
      slug:
        prev.slug ||
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, ''),
    }))
  }

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    )
  }

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="skill-form"
    >
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="error-alert"
        >
          {error}
        </motion.div>
      )}

      <div className="form-section">
        <h3 className="section-title">Thông tin cơ bản</h3>
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={handleNameChange}
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
        <h3 className="section-title">Mô tả & Media</h3>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Mô tả về skill này..."
          />
        </div>

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
        <LoadingButton type="button" onClick={onCancel} variant="secondary">
          Hủy
        </LoadingButton>
        <LoadingButton type="submit" loading={saving} variant="primary">
          {isEdit ? 'Lưu thay đổi' : 'Tạo Skill'}
        </LoadingButton>
      </div>
    </motion.form>
  )
}

