'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import BackButton from '@/components/BackButton'
import LoadingButton from '@/components/LoadingButton'
import ErrorAlert from '@/components/ErrorAlert'
import FormSection from '@/components/FormSection'
import FormField from '@/components/FormField'
import { useApiMutation } from '@/hooks/useApiMutation'
import '../specializations.css'

export default function NewSpecializationPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    number: '',
    title: '',
    description: '',
    icon_url: '',
  })

  const { mutate, loading, error } = useApiMutation(
    '/api/specializations',
    'POST',
    {
      successMessage: 'Specialization đã được tạo thành công!',
      redirectTo: '/dashboard/specializations',
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.number || !formData.title) {
      return
    }

    await mutate(formData)
  }

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

        <ErrorAlert error={error} />

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="specialization-form"
        >
          <FormSection title="Thông tin cơ bản">
            <FormField label="Number" id="number" required>
              <input
                id="number"
                type="text"
                required
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                placeholder="1, 2, 3..."
              />
            </FormField>

            <FormField label="Title" id="title" required>
              <input
                id="title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Business Analysis"
              />
            </FormField>

            <FormField label="Description" id="description">
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="I analyze business processes and requirements..."
              />
            </FormField>

            <FormField label="Icon URL" id="icon_url">
              <input
                id="icon_url"
                type="url"
                value={formData.icon_url}
                onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                placeholder="https://example.com/icon.svg"
              />
            </FormField>
          </FormSection>

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
