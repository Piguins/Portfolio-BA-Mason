'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import LoadingButton from './LoadingButton'
import { fetchWithAuth } from '@/lib/fetchWithAuth'
import '../app/dashboard/experience/experience.css'

interface HeroData {
  id: number
  greeting: string
  greeting_part2: string
  name: string
  title: string
  description: string | null
  linkedin_url: string | null
  github_url: string | null
  email_url: string | null
  profile_image_url: string | null
}

interface HeroFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export default function HeroForm({ onSuccess, onCancel }: HeroFormProps) {
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

  useEffect(() => {
    const fetchHero = async () => {
      try {
        setLoading(true)
        setError(null)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)

        const response = await fetch('/api/hero', {
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
          setError('Request timeout. Vui lòng thử lại.')
        } else {
          setError(err.message || 'Failed to load hero content')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchHero()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
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
      const response = await fetchWithAuth('/api/hero', {
        method: 'PUT',
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update hero content')
      }

      toast.success('Hero content đã được cập nhật thành công!')
      onSuccess()
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Yêu cầu cập nhật đã hết thời gian. Vui lòng thử lại.')
      } else {
        setError(err.message || 'Failed to update hero content')
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto' }}></div>
        <p>Đang tải dữ liệu Hero...</p>
      </div>
    )
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="hero-form"
      noValidate
    >
      {error && (
        <div className="error-message" style={{ marginBottom: '1rem' }}>
          {error}
        </div>
      )}

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
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value || null })}
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
            <div className="image-preview" style={{ marginTop: '1rem' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={formData.profile_image_url}
                alt="Profile preview"
                style={{ maxWidth: '200px', borderRadius: '8px' }}
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            </div>
          )}
        </div>
      </div>

      <div className="form-actions">
        <LoadingButton type="button" onClick={onCancel} variant="secondary">
          Hủy
        </LoadingButton>
        <LoadingButton type="submit" loading={saving} variant="primary">
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </LoadingButton>
      </div>
    </motion.form>
  )
}

