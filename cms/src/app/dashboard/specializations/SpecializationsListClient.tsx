'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import LoadingButton from '@/components/LoadingButton'
import './specializations.css'

interface Specialization {
  id: number
  number: string
  title: string
  description?: string
  order_index: number
}

interface Props {
  initialSpecializations: Specialization[]
  initialError: string | null
}

export default function SpecializationsListClient({ initialSpecializations, initialError }: Props) {
  const router = useRouter()
  const [specializations, setSpecializations] = useState<Specialization[]>(initialSpecializations)
  const [error, setError] = useState<string | null>(initialError)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa specialization này?')) {
      return
    }

    setDeletingId(id)
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
      const response = await fetch(`${API_URL}/api/specializations/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete specialization')
      }

      // Remove from local state
      setSpecializations(specializations.filter(s => s.id !== id))
    } catch (err: any) {
      setError(err.message || 'Failed to delete specialization')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="specializations-page">
      <div className="page-container">
        <div className="page-header">
          <div className="header-content">
            <a href="/dashboard" className="back-link">
              ← Quay lại Dashboard
            </a>
            <div className="header-text">
              <h1>Quản lý Specializations</h1>
              <p>Quản lý các cards trong phần "I specialize in"</p>
            </div>
          </div>
          <LoadingButton
            onClick={() => router.push('/dashboard/specializations/new')}
            variant="primary"
            className="btn-add-specialization"
          >
            + Thêm Specialization
          </LoadingButton>
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

        {specializations.length === 0 ? (
          <div className="empty-state">
            <p>Chưa có specialization nào. Hãy tạo specialization đầu tiên!</p>
            <LoadingButton
              onClick={() => router.push('/dashboard/specializations/new')}
              variant="primary"
            >
              Tạo Specialization đầu tiên
            </LoadingButton>
          </div>
        ) : (
          <div className="specializations-list">
            {specializations.map((specialization) => (
              <motion.div
                key={specialization.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="specialization-card"
              >
                <div className="card-header">
                  <div className="card-title-section">
                    <div className="specialization-number">{specialization.number}</div>
                    <h3>{specialization.title}</h3>
                    <p className="specialization-description">{specialization.description || 'No description'}</p>
                  </div>
                  <div className="card-actions">
                    <LoadingButton
                      onClick={() => router.push(`/dashboard/specializations/${specialization.id}/edit`)}
                      variant="primary"
                      size="sm"
                    >
                      Sửa
                    </LoadingButton>
                    <LoadingButton
                      onClick={() => handleDelete(specialization.id)}
                      variant="danger"
                      size="sm"
                      loading={deletingId === specialization.id}
                    >
                      Xóa
                    </LoadingButton>
                  </div>
                </div>
                <div className="card-meta">
                  <span className="meta-item">Order: {specialization.order_index}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

