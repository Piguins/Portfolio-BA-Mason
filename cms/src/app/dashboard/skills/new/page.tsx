'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { fetchWithAuth } from '@/lib/fetchWithAuth'
import BackButton from '@/components/BackButton'
import LoadingButton from '@/components/LoadingButton'
import { FormField, Input } from '@/components/FormField'
import { cn } from '@/lib/utils'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
}

export default function NewSkillPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'technical',
    level: 1,
    icon_url: '',
    is_highlight: false,
    order_index: 0,
  })

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)
      setError(null)

      if (!formData.name || !formData.slug) {
        setError('Vui lòng điền đầy đủ Name và Slug.')
        setLoading(false)
        return
      }

      const payload = {
        ...formData,
        level: Number(formData.level),
        order_index: Number(formData.order_index),
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
        const response = await fetchWithAuth(`${API_URL}/api/skills`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        })
        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || errorData.message || 'Failed to create skill')
        }

        toast.success('Skill đã được tạo thành công!')
        router.replace('/dashboard/skills')
      } catch (err: any) {
        let errorMsg = 'Failed to create skill'
        if (err.name === 'AbortError') {
          errorMsg = 'Yêu cầu tạo skill đã hết thời gian. Vui lòng thử lại.'
        } else if (err.message) {
          errorMsg = err.message
        }
        setError(errorMsg)
        toast.error(errorMsg)
      } finally {
        setLoading(false)
      }
    },
    [formData, router]
  )

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData((prev) => ({
      ...prev,
      name,
      slug:
        prev.slug ||
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, ''),
    }))
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
            <BackButton href="/dashboard/skills" />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-2">
                Thêm Skill mới
              </h1>
              <p className="text-base text-slate-600 leading-relaxed">
                Điền thông tin để tạo skill mới
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
              <FormField label="Name" required>
                <Input
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="Tên skill"
                />
              </FormField>

              <FormField label="Slug" required>
                <Input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="skill-slug"
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="Category">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  >
                    <option value="technical">Technical</option>
                    <option value="soft">Soft Skills</option>
                    <option value="tool">Tools</option>
                  </select>
                </FormField>

                <FormField label="Level (1-5)">
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({ ...formData, level: parseInt(e.target.value) || 1 })
                    }
                  />
                </FormField>

                <FormField label="Order Index">
                  <Input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) =>
                      setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })
                    }
                  />
                </FormField>
              </div>
            </div>
          </div>

          {/* Media & Settings */}
          <div className="mb-8 pb-8 border-b border-slate-100">
            <h3 className="text-xl font-semibold text-slate-900 mb-6 pb-2 border-b-2 border-blue-50 inline-block">
              Media & Settings
            </h3>
            <div className="space-y-4">
              <FormField label="Icon URL">
                <Input
                  type="url"
                  value={formData.icon_url}
                  onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                  placeholder="https://example.com/icon.svg"
                />
              </FormField>

              <div className="flex items-center gap-3">
                <input
                  id="is_highlight"
                  type="checkbox"
                  checked={formData.is_highlight}
                  onChange={(e) => setFormData({ ...formData, is_highlight: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="is_highlight" className="text-sm font-medium text-slate-700">
                  Highlight skill (hiển thị nổi bật)
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 justify-end mt-8 pt-6 border-t border-slate-200">
            <LoadingButton
              type="button"
              onClick={() => router.push('/dashboard/skills')}
              variant="secondary"
            >
              Hủy
            </LoadingButton>
            <LoadingButton type="submit" loading={loading} variant="primary">
              {loading ? 'Đang tạo...' : 'Tạo Skill'}
            </LoadingButton>
          </div>
        </motion.form>
      </div>
    </div>
  )
}
