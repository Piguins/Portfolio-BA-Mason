'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import BackButton from '@/components/BackButton'
import LoadingButton from '@/components/LoadingButton'
import ErrorAlert from '@/components/ErrorAlert'
import FormSection from '@/components/FormSection'
import FormField from '@/components/FormField'
import { useApiQuery } from '@/hooks/useApiQuery'
import { useApiMutation } from '@/hooks/useApiMutation'
import { Specialization } from '@/types/api'
import '../../specializations.css'

export default function EditSpecializationPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const { data: specialization, loading, error } = useApiQuery<Specialization>(
    `/api/specializations/${id}`
  )

  const [formData, setFormData] = useState({
    number: '',
    title: '',
    description: '',
    icon_url: '',
  })

  // Update form data when specialization is loaded
  if (specialization && formData.number === '' && formData.title === '') {
    setFormData({
      number: specialization.number,
      title: specialization.title,
      description: specialization.description || '',
      icon_url: specialization.icon_url || '',
    })
  }

  const { mutate: updateSpecialization, loading: saving, error: saveError } = useApiMutation(
    `/api/specializations/${id}`,
    'PUT',
    {
      successMessage: 'Specialization đã được cập nhật thành công!',
      redirectTo: '/dashboard/specializations',
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.number || !formData.title) {
      return
    }

    await updateSpecialization(formData)
  }

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

        <ErrorAlert error={error || saveError} />

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
            <LoadingButton type="submit" loading={saving} variant="primary">
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </LoadingButton>
          </div>
        </motion.form>
      </div>
    </div>
  )
}
