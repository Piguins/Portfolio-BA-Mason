'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import BackButton from '@/components/BackButton'
import LoadingButton from '@/components/LoadingButton'
import { fetchWithAuth } from '@/lib/fetchWithAuth'
import '../skills.css'

export default function NewSkillPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)
      setError(null)

      if (!formData.name || !formData.slug) {
        setError('Vui lòng điền đầy đủ Name và Slug.')
        setLoading(false)
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
        const response = await fetchWithAuth(`/api/skills`, {
          method: 'POST',
          body: JSON.stringify(payload),
          signal: controller.signal,
        })
        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || errorData.message || 'Failed to create skill')
        }

        toast.success('Skill đã được tạo thành công!')
        router.replace('/dashboard/skills')
      } catch (err: any) {
        if (err.name === 'AbortError') {
          const errorMsg = 'Yêu cầu tạo skill đã hết thời gian. Vui lòng thử lại.'
          setError(errorMsg)
          toast.error(errorMsg)
        } else {
          const errorMsg = err.message || 'Failed to create skill'
          setError(errorMsg)
          toast.error(errorMsg)
        }
      } finally {
        setLoading(false)
      }
    },
    [formData, router]
  )

  // Auto-generate slug from name
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

  return (
    <div className="skills-page">
      <div className="page-container">
        <div className="page-header">
          <div className="header-content">
            <BackButton href="/dashboard/skills" />
            <div className="header-text">
              <h1>Thêm Skill mới</h1>
              <p>Điền thông tin để tạo skill mới</p>
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
            <LoadingButton
              type="button"
              onClick={() => router.push('/dashboard/skills')}
              variant="secondary"
            >
              Hủy
            </LoadingButton>
            <LoadingButton type="submit" loading={loading} variant="primary">
              {loading ? 'Đang tạo...' : 'Tạo Skill'}
            </LoadingButton>
          </div>
        </motion.form>
      </div>
    </div>
  )
}
