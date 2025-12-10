'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import LoadingButton from './LoadingButton'
import LanguageTabs, { SupportedLanguage } from './LanguageTabs'
import { fetchWithAuth } from '@/lib/fetchWithAuth'
import '../app/dashboard/experience/experience.css'

interface Experience {
  id: string
  company: string
  role: string
  location?: string
  start_date: string
  end_date?: string
  is_current: boolean
  description?: string
  bullets?: Array<{ id: number; text: string; text_i18n?: Record<string, string> | string }>
  skills_text?: string[]
  skills_used?: Array<{ id: number; name: string; slug: string }>
  company_i18n?: Record<string, string> | string
  role_i18n?: Record<string, string> | string
  location_i18n?: Record<string, string> | string
  description_i18n?: Record<string, string> | string
}

interface ExperienceFormProps {
  experienceId?: string
  onSuccess: () => void
  onCancel: () => void
}

export default function ExperienceForm({ experienceId, onSuccess, onCancel }: ExperienceFormProps) {
  const isEdit = !!experienceId
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en')
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Store i18n data: {en: "...", vi: "..."}
  const [i18nData, setI18nData] = useState<{
    company: Record<SupportedLanguage, string>
    role: Record<SupportedLanguage, string>
    location: Record<SupportedLanguage, string>
    description: Record<SupportedLanguage, string>
    bullets: Array<{ text: Record<SupportedLanguage, string> }>
  }>({
    company: { en: '', vi: '' },
    role: { en: '', vi: '' },
    location: { en: '', vi: '' },
    description: { en: '', vi: '' },
    bullets: [],
  })
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    is_current: false,
    skills_text: [] as string[],
  })
  const [newBullet, setNewBullet] = useState('')
  const [newSkill, setNewSkill] = useState('')

  const fetchExperience = useCallback(async () => {
    if (!experienceId) return
    
    try {
      setLoading(true)
      setError(null)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      // Fetch raw i18n data for CMS editing
      const response = await fetch(`/api/experience/${experienceId}?raw=true`, {
        signal: controller.signal,
        cache: 'no-store',
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error('Failed to fetch experience')
      }

      const data: Experience & {
        company_i18n?: Record<string, string> | string
        role_i18n?: Record<string, string> | string
        location_i18n?: Record<string, string> | string
        description_i18n?: Record<string, string> | string
        bullets?: Array<{ id: number; text: string; text_i18n?: Record<string, string> | string }>
      } = await response.json()

      const formatDateForInput = (dateString: string | null | undefined) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toISOString().split('T')[0]
      }

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
        start_date: formatDateForInput(data.start_date),
        end_date: formatDateForInput(data.end_date),
        is_current: data.is_current || false,
        skills_text:
          Array.isArray(data.skills_text) && data.skills_text.length > 0
            ? data.skills_text
            : data.skills_used?.map((s) => s.name) || [],
      })

      setI18nData({
        company: parseI18n(data.company_i18n, data.company || ''),
        role: parseI18n(data.role_i18n, data.role || ''),
        location: parseI18n(data.location_i18n, data.location || ''),
        description: parseI18n(data.description_i18n, data.description || ''),
        bullets: (data.bullets || []).map(bullet => ({
          text: parseI18n(bullet.text_i18n, bullet.text || '')
        })),
      })
    } catch (err: any) {
      if (err.name === 'AbortError') {
        const errorMsg = 'Request timeout. Vui lòng thử lại.'
        setError(errorMsg)
        toast.error(errorMsg)
      } else {
        const errorMsg = err.message || 'Failed to load experience'
        setError(errorMsg)
        toast.error(errorMsg)
      }
    } finally {
      setLoading(false)
    }
  }, [experienceId])

  useEffect(() => {
    if (isEdit && experienceId) {
      fetchExperience()
    }
  }, [isEdit, experienceId, fetchExperience])

  // Update i18n data when form fields change
  const updateI18nField = (field: keyof typeof i18nData, value: string) => {
    if (field === 'bullets') return // Bullets handled separately
    setI18nData(prev => ({
      ...prev,
      [field]: { ...prev[field], [currentLanguage]: value }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      const url = isEdit ? `/api/experience/${experienceId}` : `/api/experience`
      const method = isEdit ? 'PUT' : 'POST'

      const payload = {
        company: i18nData.company,
        role: i18nData.role,
        location: i18nData.location,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        is_current: formData.is_current,
        description: i18nData.description,
        bullets: i18nData.bullets.map(b => ({ text: b.text })),
        skills_text: formData.skills_text,
      }

      const response = await fetchWithAuth(url, {
        method,
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || errorData.message || `Failed to ${isEdit ? 'update' : 'create'} experience`)
      }

      toast.success(`Experience đã được ${isEdit ? 'cập nhật' : 'tạo'} thành công!`)
      onSuccess()
    } catch (err: any) {
      if (err.name === 'AbortError') {
        const errorMsg = 'Request timeout. Vui lòng thử lại.'
        setError(errorMsg)
        toast.error(errorMsg)
      } else {
        const errorMsg = err.message || `Failed to ${isEdit ? 'update' : 'create'} experience`
        setError(errorMsg)
        toast.error(errorMsg)
      }
    } finally {
      setSaving(false)
    }
  }

  const addBullet = () => {
    if (!newBullet.trim()) return
    setFormData({
      ...formData,
      bullets: [...formData.bullets, { text: newBullet }],
    })
    setNewBullet('')
  }

  const removeBullet = (index: number) => {
    setFormData({
      ...formData,
      bullets: formData.bullets.filter((_, i) => i !== index),
    })
  }

  const addSkill = () => {
    const value = newSkill.trim()
    if (!value) return
    if (formData.skills_text.some((s) => s.toLowerCase() === value.toLowerCase())) {
      setNewSkill('')
      return
    }
    setFormData({
      ...formData,
      skills_text: [...formData.skills_text, value],
    })
    setNewSkill('')
  }

  const removeSkill = (index: number) => {
    setFormData({
      ...formData,
      skills_text: formData.skills_text.filter((_, i) => i !== index),
    })
  }

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    )
  }

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="experience-form"
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
        
        <LanguageTabs
          activeLanguage={currentLanguage}
          onLanguageChange={setCurrentLanguage}
        />

        <div className="form-group">
          <label htmlFor="company">Company *</label>
          <input
            id="company"
            type="text"
            required
            value={i18nData.company[currentLanguage]}
            onChange={(e) => updateI18nField('company', e.target.value)}
            placeholder={currentLanguage === 'en' ? "Company name" : "Tên công ty"}
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role *</label>
          <input
            id="role"
            type="text"
            required
            value={i18nData.role[currentLanguage]}
            onChange={(e) => updateI18nField('role', e.target.value)}
            placeholder={currentLanguage === 'en' ? "Job title" : "Vị trí công việc"}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              type="text"
              value={i18nData.location[currentLanguage]}
              onChange={(e) => updateI18nField('location', e.target.value)}
              placeholder={currentLanguage === 'en' ? "Location" : "Địa điểm"}
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
              onChange={(e) =>
                setFormData({ ...formData, is_current: e.target.checked, end_date: '' })
              }
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
            value={i18nData.description[currentLanguage]}
            onChange={(e) => updateI18nField('description', e.target.value)}
            placeholder={currentLanguage === 'en' 
              ? "Job description and responsibilities..."
              : "Mô tả về công việc và trách nhiệm..."}
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
            <LoadingButton type="button" onClick={addBullet} variant="primary">
              Thêm
            </LoadingButton>
          </div>
          {i18nData.bullets.length > 0 && (
            <ul className="bullets-list-form">
              {i18nData.bullets.map((bullet, index) => (
                <li key={index} className="bullet-item">
                  <input
                    type="text"
                    value={bullet.text[currentLanguage]}
                    onChange={(e) => updateBullet(index, e.target.value)}
                    className="bullet-input"
                    placeholder={currentLanguage === 'en' 
                      ? "Enter achievement..."
                      : "Nhập thành tựu..."}
                  />
                  <button
                    type="button"
                    onClick={() => removeBullet(index)}
                    className="btn-remove"
                  >
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
          <label htmlFor="skills_input">
            Nhập kỹ năng đã sử dụng trong công việc này (ví dụ: UX/UI, SQL)
          </label>
          <div className="bullets-input">
            <input
              id="skills_input"
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              placeholder="Nhập skill và nhấn Enter hoặc nút Thêm"
            />
            <LoadingButton type="button" onClick={addSkill} variant="primary">
              Thêm
            </LoadingButton>
          </div>
          {formData.skills_text.length > 0 && (
            <div className="selected-skills-tags">
              {formData.skills_text.map((skill, index) => (
                <span key={index} className="selected-skill-tag">
                  {skill}
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => removeSkill(index)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="form-actions">
        <LoadingButton type="button" onClick={onCancel} variant="secondary">
          Hủy
        </LoadingButton>
        <LoadingButton type="submit" loading={saving} variant="primary">
          {isEdit ? 'Lưu thay đổi' : 'Tạo Experience'}
        </LoadingButton>
      </div>
    </motion.form>
  )
}

