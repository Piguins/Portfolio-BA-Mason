'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import BackButton from '@/components/BackButton'
import LoadingButton from '@/components/LoadingButton'
import { fetchWithAuth } from '@/lib/fetchWithAuth'
import { fetchWithTimeout } from '@/lib/fetchWithTimeout'
import '../../projects.css'

interface Project {
  id: string
  title: string
  summary?: string
  hero_image_url?: string
  case_study_url?: string
  tags_text?: string[]
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
    summary: '',
    hero_image_url: '',
    case_study_url: '',
    tags_text: [] as string[],
  })
  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetchWithTimeout(`/api/projects/${id}`, {
          timeout: 10000,
        })

        if (!response.ok) {
          throw new Error('Failed to fetch project')
        }

        const data: Project = await response.json()
        setFormData({
          title: data.title || '',
          summary: data.summary || '',
          hero_image_url: data.hero_image_url || '',
          case_study_url: data.case_study_url || '',
          tags_text: data.tags_text || [],
        })
      } catch (err: any) {
        setError(err.message || 'Failed to load project')
        toast.error(err.message || 'Failed to load project')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProject()
    }
  }, [id])

  const addTag = () => {
    const value = newTag.trim()
    if (!value) return
    if (formData.tags_text.some((t) => t.toLowerCase() === value.toLowerCase())) {
      setNewTag('')
      return
    }
    setFormData({
      ...formData,
      tags_text: [...formData.tags_text, value],
    })
    setNewTag('')
  }

  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      tags_text: formData.tags_text.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setSaving(true)
      setError(null)

      if (!formData.title) {
        setError('Vui lòng điền Title.')
        setSaving(false)
        return
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      try {
        const response = await fetchWithAuth(`/api/projects/${id}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
          signal: controller.signal,
        })
        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || errorData.message || 'Failed to update project')
        }

        toast.success('Project đã được cập nhật thành công!')
        router.replace('/dashboard/projects')
      } catch (err: any) {
        if (err.name === 'AbortError') {
          const errorMsg = 'Request timeout. Vui lòng thử lại.'
          setError(errorMsg)
          toast.error(errorMsg)
        } else {
          const errorMsg = err.message || 'Failed to update project'
          setError(errorMsg)
          toast.error(errorMsg)
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
        <div className="page-container">
          <div className="loading-state">Đang tải...</div>
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
              <h1>Chỉnh sửa Project</h1>
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
                placeholder="Re-Design For Business Analyst Portfolio"
              />
            </div>

            <div className="form-group">
              <label htmlFor="summary">Summary / Description</label>
              <textarea
                id="summary"
                rows={4}
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="It is a long established fact that a reader will be distracted..."
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Tags</h3>
            <div className="form-group">
              <div className="bullets-input">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Nhập tag và nhấn Enter hoặc nút Thêm"
                />
                <LoadingButton type="button" onClick={addTag} variant="primary">
                  Thêm
                </LoadingButton>
              </div>
              {formData.tags_text.length > 0 && (
                <div className="selected-skills-tags">
                  {formData.tags_text.map((tag, index) => (
                    <span key={index} className="selected-skill-tag">
                      {tag}
                      <button type="button" className="btn-remove" onClick={() => removeTag(index)}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Links & Media</h3>
            <div className="form-group">
              <label htmlFor="case_study_url">Case Study URL</label>
              <input
                id="case_study_url"
                type="url"
                value={formData.case_study_url}
                onChange={(e) => setFormData({ ...formData, case_study_url: e.target.value })}
                placeholder="https://example.com/case-study"
              />
            </div>

            <div className="form-group">
              <label htmlFor="hero_image_url">Hero Image URL</label>
              <input
                id="hero_image_url"
                type="url"
                value={formData.hero_image_url}
                onChange={(e) => setFormData({ ...formData, hero_image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
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
