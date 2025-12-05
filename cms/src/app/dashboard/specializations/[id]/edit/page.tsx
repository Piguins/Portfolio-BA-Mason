'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { fetchWithAuth } from '@/lib/fetchWithAuth'
import BackButton from '@/components/BackButton'
import LoadingButton from '@/components/LoadingButton'
import { FormField, Input, Textarea } from '@/components/FormField'
import { cn } from '@/lib/utils'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
}

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
        const response = await fetchWithAuth(`${API_URL}/api/specializations/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        })
        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(
            errorData.error || errorData.message || 'Failed to update specialization'
          )
        }

        toast.success('Specialization đã được cập nhật thành công!')
        router.replace('/dashboard/specializations')
      } catch (err: any) {
        let errorMsg = 'Failed to update specialization'
        if (err.name === 'AbortError') {
          errorMsg = 'Yêu cầu cập nhật đã hết thời gian. Vui lòng thử lại.'
        } else if (err.message) {
          errorMsg = err.message
        }
        setError(errorMsg)
        toast.error(errorMsg)
      } finally {
        setSaving(false)
      }
    },
    [formData, id, router]
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-8 lg:p-12">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] gap-4 text-slate-500">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <p className="text-base">Đang tải dữ liệu Specialization...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 lg:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 pb-6 border-b border-slate-200"
        >
          <div className="flex flex-col gap-4">
            <BackButton href="/dashboard/specializations" />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-2">
                Sửa Specialization
              </h1>
              <p className="text-base text-slate-600 leading-relaxed">
                Cập nhật thông tin specialization
              </p>
            </div>
          </div>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <motion.form
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8"
        >
          {/* Basic Info */}
          <div className="mb-8 pb-8 border-b border-slate-100">
            <h3 className="text-xl font-semibold text-slate-900 mb-6 pb-2 border-b-2 border-blue-50 inline-block">
              Thông tin cơ bản
            </h3>
            <div className="space-y-4">
              <FormField label="Number" required>
                <Input
                  type="text"
                  required
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  placeholder="1, 2, 3..."
                />
              </FormField>

              <FormField label="Title" required>
                <Input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Business Analysis"
                />
              </FormField>

              <FormField label="Description">
                <Textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="I analyze business processes and requirements..."
                />
              </FormField>

              <FormField label="Order Index">
                <Input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) =>
                    setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })
                  }
                  placeholder="0"
                />
              </FormField>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 justify-end mt-8 pt-6 border-t border-slate-200">
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
