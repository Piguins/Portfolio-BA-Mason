'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import BackButton from '@/components/BackButton'
import LoadingButton from '@/components/LoadingButton'
import { FormField, Input, Textarea } from '@/components/FormField'
import { fetchWithAuth } from '@/lib/fetchWithAuth'
import { cn } from '@/lib/utils'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
}

interface HeroData {
  id: number
  greeting: string
  greeting_part2: string
  name: string
  title: string
  description: string
  linkedin_url: string | null
  github_url: string | null
  email_url: string | null
  profile_image_url: string | null
}

export default function HeroPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<HeroData>({
    id: 1,
    greeting: '',
    greeting_part2: '',
    name: '',
    title: '',
    description: '',
    linkedin_url: null,
    github_url: null,
    email_url: null,
    profile_image_url: null,
  })

  const fetchHero = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
      const response = await fetch(`${API_URL}/api/hero`, {
        cache: 'no-store',
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error('Failed to fetch hero content')
      }

      const data: HeroData = await response.json()
      setFormData(data)
    } catch (err: any) {
      if (err.name === 'AbortError') {
        const errorMsg = 'Request timeout. Vui lòng thử lại.'
        setError(errorMsg)
        toast.error(errorMsg)
      } else {
        const errorMsg = err.message || 'Failed to load hero content'
        setError(errorMsg)
        toast.error(errorMsg)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHero()
  }, [fetchHero])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setSaving(true)
      setError(null)

      const payload = {
        greeting: formData.greeting,
        greeting_part2: formData.greeting_part2,
        name: formData.name,
        title: formData.title,
        description: formData.description || null,
        linkedin_url: formData.linkedin_url || null,
        github_url: formData.github_url || null,
        email_url: formData.email_url || null,
        profile_image_url: formData.profile_image_url || null,
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
        const response = await fetchWithAuth(`${API_URL}/api/hero`, {
          method: 'PUT',
          body: JSON.stringify(payload),
          signal: controller.signal,
        })
        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to update hero content')
        }

        const updated = await response.json()
        setFormData(updated.data || updated)

        // Show success message
        toast.success('Hero content đã được cập nhật thành công!')
      } catch (err: any) {
        let errorMsg = 'Failed to update hero content'
        if (err.name === 'AbortError') {
          errorMsg = 'Yêu cầu cập nhật đã hết thời gian. Vui lòng thử lại.'
        } else if (err.message) {
          errorMsg = err.message
        } else if (typeof err === 'string') {
          errorMsg = err
        }
        setError(errorMsg)
        toast.error(errorMsg)
      } finally {
        setSaving(false)
      }
    },
    [formData]
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-8 lg:p-12">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] gap-4 text-slate-500">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <p className="text-base">Đang tải dữ liệu Hero...</p>
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
            <BackButton href="/dashboard" />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-2">
                Quản lý Hero Section
              </h1>
              <p className="text-base text-slate-600 leading-relaxed">
                Cập nhật thông tin Hero section (singleton - chỉ có 1 record)
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
          {/* Basic Info Section */}
          <div className="mb-8 pb-8 border-b border-slate-100 last:border-0 last:mb-0 last:pb-0">
            <h3 className="text-xl font-semibold text-slate-900 mb-6 pb-2 border-b-2 border-blue-50 inline-block">
              Thông tin cơ bản
            </h3>
            <div className="space-y-4">
              <FormField label="Greeting" required>
                <Input
                  type="text"
                  required
                  value={formData.greeting}
                  onChange={(e) => setFormData({ ...formData, greeting: e.target.value })}
                  placeholder="Hey!"
                />
              </FormField>

              <FormField label="Greeting Part 2" required>
                <Input
                  type="text"
                  required
                  value={formData.greeting_part2}
                  onChange={(e) => setFormData({ ...formData, greeting_part2: e.target.value })}
                  placeholder="I'm"
                />
              </FormField>

              <FormField label="Name" required>
                <Input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Thế Kiệt (Mason)"
                />
              </FormField>

              <FormField label="Title" required>
                <Input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Business Analyst"
                />
              </FormField>

              <FormField label="Description">
                <Textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Agency-quality business analysis with the personal touch of a freelancer."
                />
              </FormField>
            </div>
          </div>

          {/* Social Links Section */}
          <div className="mb-8 pb-8 border-b border-slate-100 last:border-0 last:mb-0 last:pb-0">
            <h3 className="text-xl font-semibold text-slate-900 mb-6 pb-2 border-b-2 border-blue-50 inline-block">
              Social Links
            </h3>
            <div className="space-y-4">
              <FormField label="LinkedIn URL">
                <Input
                  type="url"
                  value={formData.linkedin_url || ''}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value || null })}
                  placeholder="https://www.linkedin.com/in/username/"
                />
              </FormField>

              <FormField label="GitHub URL">
                <Input
                  type="url"
                  value={formData.github_url || ''}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value || null })}
                  placeholder="https://github.com/username"
                />
              </FormField>

              <FormField label="Email URL">
                <Input
                  type="url"
                  value={formData.email_url || ''}
                  onChange={(e) => setFormData({ ...formData, email_url: e.target.value || null })}
                  placeholder="mailto:youremail@gmail.com"
                />
              </FormField>
            </div>
          </div>

          {/* Media Section */}
          <div className="mb-8 pb-8 border-b border-slate-100 last:border-0 last:mb-0 last:pb-0">
            <h3 className="text-xl font-semibold text-slate-900 mb-6 pb-2 border-b-2 border-blue-50 inline-block">
              Media
            </h3>
            <div className="space-y-4">
              <FormField label="Profile Image URL">
                <Input
                  type="url"
                  value={formData.profile_image_url || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, profile_image_url: e.target.value || null })
                  }
                  placeholder="https://example.com/profile-image.jpg"
                />
              </FormField>
              {formData.profile_image_url && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 flex justify-center items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.profile_image_url}
                    alt="Profile preview"
                    className="max-w-[200px] max-h-[200px] rounded-lg object-cover"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 justify-end mt-8 pt-6 border-t border-slate-200">
            <LoadingButton
              type="button"
              onClick={() => router.push('/dashboard')}
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
