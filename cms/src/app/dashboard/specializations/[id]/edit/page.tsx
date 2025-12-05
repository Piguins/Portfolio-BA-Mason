'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import BackButton from '@/components/BackButton'
import LoadingButton from '@/components/LoadingButton'
import '../../specializations.css'

interface Specialization {
  id: number
  number: string
  title: string
  description?: string
  order_index: number
}

export default function EditSpecializationPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    number: '',
    title: '',
    description: '',
    order_index: 0,
  })

  const fetchSpecialization = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
      const response = await fetch(`${API_URL}/api/specializations/${id}`, {
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch specialization')
      }

      const data: Specialization = await response.json()
      setFormData({
        number: data.number,
        title: data.title,
        description: data.description || '',
        order_index: data.order_index || 0,
      })
    } catch (err: any) {
      setError(err.message || 'Failed to load specialization')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchSpecialization()
    }
  }, [id, fetchSpecialization])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setSaving(true)
      setError(null)

      if (!formData.number || !formData.title) {
        setError('Vui lòng điền đầy đủ Number và Title.')
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
        const response = await fetch(`${API_URL}/api/specializations/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        })
        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to update specialization')
        }

        router.replace('/dashboard/specializations')
      } catch (err: any) {
        if (err.name === 'AbortError') {
          setError('Yêu cầu cập nhật đã hết thời gian. Vui lòng thử lại.')
        } else {
          setError(err.message || 'Failed to update specialization')
        }
      } finally {
        setSaving(false)
      }
    },
    [formData, id, router]
  )

  if (loading) {
    return (
      <div className="specializations-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu Specialization...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="specializations-page">
      <div className="page-container">
        <div className="page-header">
          <div className="header-content">
            <BackButton href="/dashboard/specializations" />
            <div className="header-text">
              <h1>Sửa Specialization</h1>
              <p>Cập nhật thông tin specialization</p>
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
          className="specialization-form"
        >
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
              <label htmlFor="order_index">Order Index</label>
              <input
                id="order_index"
                type="number"
                value={formData.order_index}
                onChange={(e) =>
                  setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })
                }
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-actions">
            <LoadingButton
              type="button"
              onClick={() => router.push('/dashboard/specializations')}
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
