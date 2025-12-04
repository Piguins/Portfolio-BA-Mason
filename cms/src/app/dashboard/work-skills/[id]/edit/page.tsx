'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import BackButton from '@/components/BackButton'
import LoadingButton from '@/components/LoadingButton'
import '../../work-skills.css'

interface WorkSkill {
  id: number
  name: string
  slug: string
  category: string
}

export default function EditWorkSkillPage() {
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
  })

  const fetchWorkSkill = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
      const response = await fetch(`${API_URL}/api/work-skills/${id}`, {
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch work skill')
      }

      const data: WorkSkill = await response.json()
      setFormData({
        name: data.name,
        slug: data.slug,
        category: data.category || 'technical',
      })
    } catch (err: any) {
      setError(err.message || 'Failed to load work skill')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchWorkSkill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
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
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
      const response = await fetch(`${API_URL}/api/work-skills/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update work skill')
      }

      router.replace('/dashboard/work-skills')
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Yêu cầu cập nhật đã hết thời gian. Vui lòng thử lại.')
      } else {
        setError(err.message || 'Failed to update work skill')
      }
    } finally {
      setSaving(false)
    }
  }, [formData, id, router])

  if (loading) {
    return (
      <div className="work-skills-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu Work Skill...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="work-skills-page">
      <div className="page-container">
        <div className="page-header">
          <div className="header-content">
            <BackButton href="/dashboard/work-skills">← Quay lại Work Skills</BackButton>
            <div className="header-text">
              <h1>Sửa Work Skill</h1>
              <p>Cập nhật thông tin work skill</p>
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
          className="work-skill-form"
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
                placeholder="Tên work skill"
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
                placeholder="work-skill-slug"
              />
            </div>

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
          </div>

          <div className="form-actions">
            <LoadingButton
              type="button"
              onClick={() => router.push('/dashboard/work-skills')}
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

