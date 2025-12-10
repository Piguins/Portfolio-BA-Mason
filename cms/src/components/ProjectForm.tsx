'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import LoadingButton from './LoadingButton'
import LanguageTabs, { SupportedLanguage } from './LanguageTabs'
import { fetchWithAuth } from '@/lib/fetchWithAuth'
import { fetchWithTimeout } from '@/lib/fetchWithTimeout'
import '../app/dashboard/projects/projects.css'

interface Project {
  id: string
  title: string
  summary?: string
  hero_image_url?: string
  case_study_url?: string
  tags_text?: string[]
}

interface ProjectFormProps {
  projectId?: string
  onSuccess: () => void
  onCancel: () => void
}

export default function ProjectForm({ projectId, onSuccess, onCancel }: ProjectFormProps) {
  const isEdit = !!projectId
  const [loading, setLoading] = useState(isEdit)
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

  const fetchProject = useCallback(async () => {
    if (!projectId) return
    
    try {
      setLoading(true)
      setError(null)

      // Fetch raw i18n data for CMS editing
      const response = await fetchWithTimeout(`/api/projects/${projectId}?raw=true`, {
        timeout: 10000,
      })

      if (!response.ok) {
        throw new Error('Failed to fetch project')
      }

      const data: Project & {
        title_i18n?: Record<string, string> | string
        summary_i18n?: Record<string, string> | string
      } = await response.json()

      // Parse i18n data
      const parseI18n = (i18nValue: unknown, fallback: string): Record<SupportedLanguage, string> => {
        if (typeof i18nValue === 'object' && i18nValue !== null) {
          const obj = i18nValue as Record<string, string>
          return {
            en: obj.en || fallback,
            vi: obj.vi || '',
          }
        }
        return { en: fallback, vi: '' }
      }

      setFormData({
        hero_image_url: data.hero_image_url || '',
        case_study_url: data.case_study_url || '',
        tags_text: data.tags_text || [],
      })

      setI18nData({
        title: parseI18n(data.title_i18n, data.title || ''),
        summary: parseI18n(data.summary_i18n, data.summary || ''),
      })
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to load project'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    if (isEdit && projectId) {
      fetchProject()
    }
  }, [isEdit, projectId, fetchProject])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    if (!formData.title) {
      setError('Vui lòng điền Title.')
      setSaving(false)
      return
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      const url = isEdit ? `/api/projects/${projectId}` : `/api/projects`
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetchWithAuth(url, {
        method,
        body: JSON.stringify(formData),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || errorData.message || `Failed to ${isEdit ? 'update' : 'create'} project`)
      }

      toast.success(`Project đã được ${isEdit ? 'cập nhật' : 'tạo'} thành công!`)
      onSuccess()
    } catch (err: any) {
      if (err.name === 'AbortError') {
        const errorMsg = 'Request timeout. Vui lòng thử lại.'
        setError(errorMsg)
        toast.error(errorMsg)
      } else {
        const errorMsg = err.message || `Failed to ${isEdit ? 'update' : 'create'} project`
        setError(errorMsg)
        toast.error(errorMsg)
      }
    } finally {
      setSaving(false)
    }
  }

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
      className="project-form"
      noValidate
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
            placeholder="It is a long established fact that a reader will be distracted by the readable content..."
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
        <LoadingButton type="button" onClick={onCancel} variant="secondary">
          Hủy
        </LoadingButton>
        <LoadingButton type="submit" loading={saving} variant="primary">
          {isEdit ? 'Lưu thay đổi' : 'Tạo Project'}
        </LoadingButton>
      </div>
    </motion.form>
  )
}

