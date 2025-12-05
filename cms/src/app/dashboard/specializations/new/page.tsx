'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import BackButton from '@/components/BackButton'
import LoadingButton from '@/components/LoadingButton'
import { fetchWithAuth } from '@/lib/fetchWithAuth'
import '../specializations.css'

export default function NewSpecializationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    number: '',
    title: '',
    description: '',
  })

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)
      setError(null)

      if (!formData.number || !formData.title) {
        setError('Vui lòng điền đầy đủ Number và Title.')
        setLoading(false)
        return
      }

      const payload = {
        ...formData,
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      try {
        const response = await fetchWithAuth(`/api/specializations`, {
          method: 'POST',
          body: JSON.stringify(payload),
          signal: controller.signal,
        })
        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || errorData.message || 'Failed to create specialization')
        }

        toast.success('Specialization đã được tạo thành công!')
        router.replace('/dashboard/specializations')
      } catch (err: any) {
        if (err.name === 'AbortError') {
          const errorMsg = 'Yêu cầu tạo specialization đã hết thời gian. Vui lòng thử lại.'
          setError(errorMsg)
          toast.error(errorMsg)
        } else {
          const errorMsg = err.message || 'Failed to create specialization'
          setError(errorMsg)
          toast.error(errorMsg)
        }
      } finally {
        setLoading(false)
      }
    },
    [formData, router]
  )

  return (
    <div className="specializations-page">
      <div className="page-container">
        <div className="page-header">
          <div className="header-content">
            <BackButton href="/dashboard/specializations" />
            <div className="header-text">
              <h1>Thêm Specialization mới</h1>
              <p>Điền thông tin để tạo specialization mới</p>
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

            <div className="form-group"></div>
          </div>

          <div className="form-actions">
            <LoadingButton
              type="button"
              onClick={() => router.push('/dashboard/specializations')}
              variant="secondary"
            >
              Hủy
            </LoadingButton>
            <LoadingButton type="submit" loading={loading} variant="primary">
              {loading ? 'Đang tạo...' : 'Tạo Specialization'}
            </LoadingButton>
          </div>
        </motion.form>
      </div>
    </div>
  )
}
