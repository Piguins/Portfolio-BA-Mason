'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import BackButton from '@/components/BackButton'
import LoadingButton from '@/components/LoadingButton'
import { fetchWithAuth } from '@/lib/fetchWithAuth'
import './hero.css'

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
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
      const response = await fetch(`${API_URL}/api/hero`, {
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch hero content')
      }

      const data: HeroData = await response.json()
      setFormData(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load hero content')
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
        alert('Hero content đã được cập nhật thành công!')
      } catch (err: any) {
        if (err.name === 'AbortError') {
          setError('Yêu cầu cập nhật đã hết thời gian. Vui lòng thử lại.')
        } else {
          setError(err.message || 'Failed to update hero content')
        }
      } finally {
        setSaving(false)
      }
    },
    [formData]
  )

  if (loading) {
    return (
      <div className="hero-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu Hero...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="hero-page">
      <div className="page-container">
        <div className="page-header">
          <div className="header-content">
            <BackButton href="/dashboard" />
            <div className="header-text">
              <h1>Quản lý Hero Section</h1>
              <p>Cập nhật thông tin Hero section (singleton - chỉ có 1 record)</p>
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
          className="hero-form"
        >
          <div className="form-section">
            <h3 className="section-title">Thông tin cơ bản</h3>
            <div className="form-group">
              <label htmlFor="greeting">Greeting *</label>
              <input
                id="greeting"
                type="text"
                required
                value={formData.greeting}
                onChange={(e) => setFormData({ ...formData, greeting: e.target.value })}
                placeholder="Hey!"
              />
            </div>

            <div className="form-group">
              <label htmlFor="greeting_part2">Greeting Part 2 *</label>
              <input
                id="greeting_part2"
                type="text"
                required
                value={formData.greeting_part2}
                onChange={(e) => setFormData({ ...formData, greeting_part2: e.target.value })}
                placeholder="I'm"
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Thế Kiệt (Mason)"
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
                placeholder="Business Analyst"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Agency-quality business analysis with the personal touch of a freelancer."
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Social Links</h3>
            <div className="form-group">
              <label htmlFor="linkedin_url">LinkedIn URL</label>
              <input
                id="linkedin_url"
                type="url"
                value={formData.linkedin_url || ''}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value || null })}
                placeholder="https://www.linkedin.com/in/username/"
              />
            </div>

            <div className="form-group">
              <label htmlFor="github_url">GitHub URL</label>
              <input
                id="github_url"
                type="url"
                value={formData.github_url || ''}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value || null })}
                placeholder="https://github.com/username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email_url">Email URL</label>
              <input
                id="email_url"
                type="url"
                value={formData.email_url || ''}
                onChange={(e) => setFormData({ ...formData, email_url: e.target.value || null })}
                placeholder="mailto:youremail@gmail.com"
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Media</h3>
            <div className="form-group">
              <label htmlFor="profile_image_url">Profile Image URL</label>
              <input
                id="profile_image_url"
                type="url"
                value={formData.profile_image_url || ''}
                onChange={(e) =>
                  setFormData({ ...formData, profile_image_url: e.target.value || null })
                }
                placeholder="https://example.com/profile-image.jpg"
              />
              {formData.profile_image_url && (
                <div className="image-preview">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.profile_image_url}
                    alt="Profile preview"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
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
