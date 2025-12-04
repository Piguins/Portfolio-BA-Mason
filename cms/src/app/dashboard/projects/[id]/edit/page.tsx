'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import BackButton from '@/components/BackButton'
import LoadingButton from '@/components/LoadingButton'
import '../../projects.css'

interface Project {
  id: string
  title: string
  slug: string
  description?: string
  content?: string
  thumbnail_url?: string
  demo_url?: string
  github_url?: string
  is_published: boolean
  order_index: number
  tags?: Array<{ id: number; name: string; color: string }>
}

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    thumbnail_url: '',
    demo_url: '',
    github_url: '',
    is_published: false,
    order_index: 0,
    tag_ids: [] as number[],
  })

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
      const response = await fetch(`${API_URL}/api/projects/id/${id}`, {
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch project')
      }

      const data: Project = await response.json()
      setFormData({
        title: data.title,
        slug: data.slug,
        description: data.description || '',
        content: data.content || '',
        thumbnail_url: data.thumbnail_url || '',
        demo_url: data.demo_url || '',
        github_url: data.github_url || '',
        is_published: data.is_published || false,
        order_index: data.order_index || 0,
        tag_ids: data.tags?.map(t => t.id) || [],
      })
    } catch (err: any) {
      setError(err.message || 'Failed to load project')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchProject()
    }
  }, [id, fetchProject])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    if (!formData.title || !formData.slug) {
      setError('Vui lòng điền đầy đủ Title và Slug.')
      setSaving(false)
      return
    }

    const payload = {
      ...formData,
      order_index: Number(formData.order_index),
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
      const response = await fetch(`${API_URL}/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update project')
      }

      router.replace('/dashboard/projects')
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Yêu cầu cập nhật project đã hết thời gian. Vui lòng thử lại.')
      } else {
        setError(err.message || 'Failed to update project')
      }
    } finally {
      setSaving(false)
    }
  }, [formData, id, router])

  if (loading) {
    return (
      <div className="projects-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu Project...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="projects-page">
      <div className="page-container">
        <div className="page-header">
          <div className="header-content">
            <BackButton href="/dashboard/projects">← Quay lại Projects</BackButton>
            <div className="header-text">
              <h1>Sửa Project</h1>
              <p>Cập nhật thông tin project</p>
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
          className="project-form"
        >
          <div className="form-section">
            <h3 className="section-title">Thông tin cơ bản</h3>
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                id="title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Tên project"
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
                placeholder="project-slug"
              />
            </div>

            <div className="form-group">
              <label htmlFor="order_index">Order Index</label>
              <input
                id="order_index"
                type="number"
                value={formData.order_index}
                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Nội dung</h3>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả ngắn về project..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                rows={8}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Nội dung chi tiết về project (Markdown supported)..."
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Links & Media</h3>
            <div className="form-group">
              <label htmlFor="thumbnail_url">Thumbnail URL</label>
              <input
                id="thumbnail_url"
                type="url"
                value={formData.thumbnail_url}
                onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                placeholder="https://example.com/thumbnail.jpg"
              />
            </div>

            <div className="form-group">
              <label htmlFor="demo_url">Demo URL</label>
              <input
                id="demo_url"
                type="url"
                value={formData.demo_url}
                onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                placeholder="https://example.com/demo"
              />
            </div>

            <div className="form-group">
              <label htmlFor="github_url">GitHub URL</label>
              <input
                id="github_url"
                type="url"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Publish Settings</h3>
            <div className="form-group checkbox-group">
              <label htmlFor="is_published">
                <input
                  id="is_published"
                  type="checkbox"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                />
                Publish project (hiển thị trên portfolio)
              </label>
            </div>
          </div>

          <div className="form-actions">
            <LoadingButton
              type="button"
              onClick={() => router.push('/dashboard/projects')}
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

