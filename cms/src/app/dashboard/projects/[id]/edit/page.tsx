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

interface ProjectTag {
  id: number
  name: string
  color: string
}

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tags, setTags] = useState<ProjectTag[]>([])
  const [loadingTags, setLoadingTags] = useState(true)
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

  // Fetch all project tags for selection
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
        const response = await fetch(`${API_URL}/api/projects?published=true`)
        if (response.ok) {
          const projects = await response.json()
          const allTags = new Map<number, ProjectTag>()
          projects.forEach((project: any) => {
            if (project.tags && Array.isArray(project.tags)) {
              project.tags.forEach((tag: ProjectTag) => {
                if (!allTags.has(tag.id)) {
                  allTags.set(tag.id, tag)
                }
              })
            }
          })
          setTags(Array.from(allTags.values()))
        }
      } catch (err) {
        console.error('Failed to fetch tags:', err)
        setTags([])
      } finally {
        setLoadingTags(false)
      }
    }
    fetchTags()
  }, [])

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
        tag_ids: data.tags?.map((t) => t.id) || [],
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

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
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
    },
    [formData, id, router]
  )

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
            <BackButton href="/dashboard/projects" />
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
                onChange={(e) =>
                  setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })
                }
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
            <h3 className="section-title">Tags (Project Tags)</h3>
            <div className="form-group">
              <label htmlFor="tags">Chọn các tags cho project này</label>
              {loadingTags ? (
                <p className="text-muted">Đang tải danh sách tags...</p>
              ) : tags.length === 0 ? (
                <p className="text-muted">
                  Chưa có tag nào. Tags sẽ được tạo tự động khi bạn tạo project với tags mới.
                </p>
              ) : (
                <div className="tags-select-container">
                  <div className="tags-checkbox-list">
                    {tags.map((tag) => (
                      <label
                        key={tag.id}
                        className="tag-checkbox-item"
                        style={{ borderLeftColor: tag.color || '#6366f1' }}
                      >
                        <input
                          type="checkbox"
                          checked={formData.tag_ids.includes(tag.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                tag_ids: [...formData.tag_ids, tag.id],
                              })
                            } else {
                              setFormData({
                                ...formData,
                                tag_ids: formData.tag_ids.filter((id) => id !== tag.id),
                              })
                            }
                          }}
                        />
                        <span>{tag.name}</span>
                        <span
                          className="tag-color-badge"
                          style={{ backgroundColor: tag.color || '#6366f1' }}
                        ></span>
                      </label>
                    ))}
                  </div>
                  {formData.tag_ids.length > 0 && (
                    <div className="selected-tags-preview">
                      <p className="selected-tags-label">Đã chọn ({formData.tag_ids.length}):</p>
                      <div className="selected-tags-tags">
                        {formData.tag_ids.map((tagId) => {
                          const tag = tags.find((t) => t.id === tagId)
                          return tag ? (
                            <span
                              key={tagId}
                              className="selected-tag-tag"
                              style={{ backgroundColor: tag.color || '#6366f1' }}
                            >
                              {tag.name}
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
