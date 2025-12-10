'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import LoadingButton from './LoadingButton'
import { fetchWithAuth } from '@/lib/fetchWithAuth'
import { fetchWithTimeout } from '@/lib/fetchWithTimeout'
import '../app/dashboard/specializations/specializations.css'

interface Specialization {
  id: number
  number: string
  title: string
  description?: string
  icon_url?: string
}

interface SpecializationFormProps {
  specializationId?: number
  onSuccess: () => void
  onCancel: () => void
}

export default function SpecializationForm({
  specializationId,
  onSuccess,
  onCancel,
}: SpecializationFormProps) {
  const isEdit = !!specializationId
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    number: '',
    title: '',
    description: '',
    icon_url: '',
  })

  useEffect(() => {
    if (isEdit && specializationId) {
      fetchSpecialization()
    }
  }, [isEdit, specializationId])

  const fetchSpecialization = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetchWithTimeout(`/api/specializations/${specializationId}`, {
        timeout: 10000,
      })

      if (!response.ok) {
        throw new Error('Failed to fetch specialization')
      }

      const data: Specialization = await response.json()
      setFormData({
        number: data.number || '',
        title: data.title || '',
        description: data.description || '',
        icon_url: data.icon_url || '',
      })
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to load specialization'
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

    if (!formData.number || !formData.title) {
      setError('Vui lòng điền đầy đủ Number và Title.')
      setSaving(false)
      return
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      const url = isEdit ? `/api/specializations/${specializationId}` : `/api/specializations`
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetchWithAuth(url, {
        method,
        body: JSON.stringify(formData),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || errorData.message || `Failed to ${isEdit ? 'update' : 'create'} specialization`)
      }

      toast.success(`Specialization đã được ${isEdit ? 'cập nhật' : 'tạo'} thành công!`)
      onSuccess()
    } catch (err: any) {
      if (err.name === 'AbortError') {
        const errorMsg = 'Request timeout. Vui lòng thử lại.'
        setError(errorMsg)
        toast.error(errorMsg)
      } else {
        const errorMsg = err.message || `Failed to ${isEdit ? 'update' : 'create'} specialization`
        setError(errorMsg)
        toast.error(errorMsg)
      }
    } finally {
      setSaving(false)
    }
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
      className="specialization-form"
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
          <label htmlFor="number">Number *</label>
          <input
            id="number"
            type="text"
            required
            value={formData.number}
            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
            placeholder="1, 2, 3..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Business Analysis"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="I analyze business processes and requirements..."
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
      </div>

      <div className="form-actions">
        <LoadingButton type="button" onClick={onCancel} variant="secondary">
          Hủy
        </LoadingButton>
        <LoadingButton type="submit" loading={saving} variant="primary">
          {isEdit ? 'Lưu thay đổi' : 'Tạo Specialization'}
        </LoadingButton>
      </div>
    </motion.form>
  )
}

