'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Loader2, X } from 'lucide-react'
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

interface Experience {
  id: string
  company: string
  role: string
  location?: string
  start_date: string
  end_date?: string
  is_current: boolean
  description?: string
  order_index: number
  bullets?: Array<{ id: number; text: string; order_index: number }>
  // New free-text skills stored directly on experience
  skills_text?: string[]
  // Legacy: old skills relation (for backward compatibility)
  skills_used?: Array<{ id: number; name: string; slug: string }>
}

export default function EditExperiencePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    location: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
    order_index: 0,
    bullets: [] as Array<{ text: string; order_index: number }>,
    // Free-text skills, e.g. ["UX/UI", "SQL"]
    skills_text: [] as string[],
  })
  const [newBullet, setNewBullet] = useState('')
  const [newSkill, setNewSkill] = useState('')

  useEffect(() => {
    if (id) {
      fetchExperience()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchExperience = async () => {
    try {
      setLoading(true)
      setError(null)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/experience/${id}`, {
        signal: controller.signal,
        cache: 'no-store',
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error('Failed to fetch experience')
      }

      const data: Experience = await response.json()

      const formatDateForInput = (dateString: string | null | undefined) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toISOString().split('T')[0]
      }

      setFormData({
        company: data.company,
        role: data.role,
        location: data.location || '',
        start_date: formatDateForInput(data.start_date),
        end_date: formatDateForInput(data.end_date),
        is_current: data.is_current || false,
        description: data.description || '',
        order_index: data.order_index || 0,
        bullets: data.bullets?.map((b) => ({ text: b.text, order_index: b.order_index })) || [],
        // Prefer new skills_text if present; fallback to names from old skills_used
        skills_text:
          Array.isArray(data.skills_text) && data.skills_text.length > 0
            ? data.skills_text
            : data.skills_used?.map((s) => s.name) || [],
      })
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Request timeout. Vui lòng thử lại.')
      } else {
        setError(err.message || 'Failed to load experience')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15s timeout

      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/api/experience/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
          signal: controller.signal,
        }
      )

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || errorData.message || 'Failed to update experience')
      }

      toast.success('Experience đã được cập nhật thành công!')
      router.replace('/dashboard/experience')
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Request timeout. Vui lòng thử lại.')
      } else {
        setError(err.message || 'Failed to update experience')
      }
    } finally {
      setSaving(false)
    }
  }

  const addBullet = () => {
    if (!newBullet.trim()) return
    setFormData({
      ...formData,
      bullets: [...formData.bullets, { text: newBullet, order_index: formData.bullets.length }],
    })
    setNewBullet('')
  }

  const removeBullet = (index: number) => {
    setFormData({
      ...formData,
      bullets: formData.bullets
        .filter((_, i) => i !== index)
        .map((bullet, i) => ({ ...bullet, order_index: i })),
    })
  }

  const updateBullet = (index: number, text: string) => {
    const updated = [...formData.bullets]
    updated[index] = { ...updated[index], text }
    setFormData({ ...formData, bullets: updated })
  }

  const addSkill = () => {
    const value = newSkill.trim()
    if (!value) return
    // Avoid duplicates (case-insensitive)
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
      <div className="min-h-screen bg-slate-50 p-6 md:p-8 lg:p-12">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] gap-4 text-slate-500">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <p className="text-base">Đang tải dữ liệu...</p>
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
            <BackButton href="/dashboard/experience" />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-2">
                Sửa Experience
              </h1>
              <p className="text-base text-slate-600 leading-relaxed">
                Cập nhật thông tin experience
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
              <FormField label="Company" required>
                <Input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Tên công ty"
                />
              </FormField>

              <FormField label="Role" required>
                <Input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Vị trí công việc"
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Location">
                  <Input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Địa điểm"
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
          </div>

          {/* Work Period */}
          <div className="mb-8 pb-8 border-b border-slate-100">
            <h3 className="text-xl font-semibold text-slate-900 mb-6 pb-2 border-b-2 border-blue-50 inline-block">
              Thời gian làm việc
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Start Date" required>
                  <Input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </FormField>

                <FormField label="End Date">
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    disabled={formData.is_current}
                  />
                </FormField>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.is_current}
                  onChange={(e) =>
                    setFormData({ ...formData, is_current: e.target.checked, end_date: '' })
                  }
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-slate-700">
                  Đây là vị trí hiện tại
                </label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8 pb-8 border-b border-slate-100">
            <h3 className="text-xl font-semibold text-slate-900 mb-6 pb-2 border-b-2 border-blue-50 inline-block">
              Mô tả
            </h3>
            <FormField label="Description">
              <Textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả về công việc và trách nhiệm..."
              />
            </FormField>
          </div>

          {/* Bullets */}
          <div className="mb-8 pb-8 border-b border-slate-100">
            <h3 className="text-xl font-semibold text-slate-900 mb-6 pb-2 border-b-2 border-blue-50 inline-block">
              Thành tựu (Bullets) - Key Achievements
            </h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newBullet}
                  onChange={(e) => setNewBullet(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBullet())}
                  placeholder="Nhập thành tựu và nhấn Enter hoặc nút Thêm"
                  className="flex-1"
                />
                <LoadingButton type="button" onClick={addBullet} variant="primary">
                  Thêm
                </LoadingButton>
              </div>
              {formData.bullets.length > 0 && (
                <ul className="space-y-2">
                  {formData.bullets.map((bullet, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <Input
                        type="text"
                        value={bullet.text}
                        onChange={(e) => updateBullet(index, e.target.value)}
                        placeholder="Nhập thành tựu..."
                        className="flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => removeBullet(index)}
                        className="p-1 hover:bg-red-100 rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="mb-8 pb-8 border-b border-slate-100">
            <h3 className="text-xl font-semibold text-slate-900 mb-6 pb-2 border-b-2 border-blue-50 inline-block">
              Kỹ năng sử dụng (Skills Used)
            </h3>
            <div className="space-y-4">
              <FormField label="Nhập kỹ năng đã sử dụng trong công việc này (ví dụ: UX/UI, SQL)">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="Nhập skill và nhấn Enter hoặc nút Thêm"
                    className="flex-1"
                  />
                  <LoadingButton type="button" onClick={addSkill} variant="primary">
                    Thêm
                  </LoadingButton>
                </div>
              </FormField>
              {formData.skills_text.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.skills_text.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium bg-blue-50 text-blue-700"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="hover:bg-blue-100 rounded transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 justify-end mt-8 pt-6 border-t border-slate-200">
            <LoadingButton
              type="button"
              onClick={() => router.push('/dashboard/experience')}
              variant="secondary"
            >
              Hủy
            </LoadingButton>
            <LoadingButton type="submit" loading={saving} variant="primary">
              Lưu thay đổi
            </LoadingButton>
          </div>
        </motion.form>
      </div>
    </div>
  )
}
