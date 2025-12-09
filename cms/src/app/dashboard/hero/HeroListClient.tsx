'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import DashboardHeader from '@/components/DashboardHeader'
import Modal from '@/components/Modal'
import HeroForm from '@/components/HeroForm'
import LoadingButton from '@/components/LoadingButton'
import './hero.css'

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
  created_at: string
  updated_at: string
}

interface HeroListClientProps {
  initialHero: HeroData | null
  initialError: string | null
}

export default function HeroListClient({ initialHero, initialError }: HeroListClientProps) {
  const [hero, setHero] = useState<HeroData | null>(initialHero)
  const [error, setError] = useState<string | null>(initialError)
  const [loading, setLoading] = useState(!initialHero)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchHero = useCallback(async () => {
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

      if (!response.ok) throw new Error('Failed to fetch hero content')
      const data: HeroData = await response.json()
      setHero(data)
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Request timeout. Vui lòng thử lại.')
      } else {
        setError(err.message || 'Failed to load hero content')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!initialHero) {
      fetchHero()
    }
  }, [initialHero, fetchHero])

  const handleOpenEdit = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleSuccess = () => {
    setIsModalOpen(false)
    fetchHero()
  }

  if (loading) {
    return (
      <div className="hero-page">
        <DashboardHeader
          title="Hero Section"
          subtitle="Quản lý Hero Section (singleton - chỉ có 1 record)"
        />
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu Hero...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="hero-page">
      <DashboardHeader
        title="Hero Section"
        subtitle="Quản lý Hero Section (singleton - chỉ có 1 record)"
      />

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="error-alert"
        >
          {error}
        </motion.div>
      )}

      <div className="hero-content-card">
        {hero ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-display"
          >
            <div className="hero-info-section">
              <h3>Thông tin hiện tại</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Greeting:</label>
                  <span>{hero.greeting}</span>
                </div>
                <div className="info-item">
                  <label>Greeting Part 2:</label>
                  <span>{hero.greeting_part2}</span>
                </div>
                <div className="info-item">
                  <label>Name:</label>
                  <span>{hero.name}</span>
                </div>
                <div className="info-item">
                  <label>Title:</label>
                  <span>{hero.title}</span>
                </div>
                {hero.description && (
                  <div className="info-item">
                    <label>Description:</label>
                    <span>{hero.description}</span>
                  </div>
                )}
                {hero.linkedin_url && (
                  <div className="info-item">
                    <label>LinkedIn:</label>
                    <a href={hero.linkedin_url} target="_blank" rel="noopener noreferrer">
                      {hero.linkedin_url}
                    </a>
                  </div>
                )}
                {hero.github_url && (
                  <div className="info-item">
                    <label>GitHub:</label>
                    <a href={hero.github_url} target="_blank" rel="noopener noreferrer">
                      {hero.github_url}
                    </a>
                  </div>
                )}
                {hero.email_url && (
                  <div className="info-item">
                    <label>Email:</label>
                    <a href={hero.email_url}>{hero.email_url}</a>
                  </div>
                )}
                {hero.profile_image_url && (
                  <div className="info-item">
                    <label>Profile Image:</label>
                    <div className="image-preview-small">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={hero.profile_image_url}
                        alt="Profile"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="hero-actions">
              <LoadingButton onClick={handleOpenEdit} variant="primary">
                Chỉnh sửa Hero
              </LoadingButton>
            </div>
          </motion.div>
        ) : (
          <div className="empty-state">
            <p>Chưa có dữ liệu Hero. Hãy tạo mới.</p>
            <LoadingButton onClick={handleOpenEdit} variant="primary">
              Tạo Hero
            </LoadingButton>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Chỉnh sửa Hero Section"
        size="large"
      >
        <HeroForm onSuccess={handleSuccess} onCancel={handleCloseModal} />
      </Modal>
    </div>
  )
}

