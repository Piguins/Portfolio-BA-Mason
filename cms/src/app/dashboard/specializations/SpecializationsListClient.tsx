'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import DashboardHeader from '@/components/DashboardHeader'
import Modal from '@/components/Modal'
import SpecializationForm from '@/components/SpecializationForm'
import LoadingButton from '@/components/LoadingButton'
import './specializations.css'

interface Specialization {
  id: number
  number: string
  title: string
  description?: string
  icon_url?: string
}

interface Props {
  initialSpecializations: Specialization[]
  initialError: string | null
}

export default function SpecializationsListClient({ initialSpecializations, initialError }: Props) {
  const [specializations, setSpecializations] = useState<Specialization[]>(initialSpecializations)
  const [error, setError] = useState<string | null>(initialError)
  const [loading, setLoading] = useState(initialSpecializations.length === 0)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const fetchSpecializations = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

      const response = await fetch(`/api/specializations`, {
        cache: 'no-store',
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) throw new Error('Failed to fetch specializations')
      const data = await response.json()
      // Handle both array and object with data property
      const specializationsData = Array.isArray(data) ? data : data.data || []
      setSpecializations(specializationsData)
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Request timeout. Vui lòng thử lại.')
      } else {
        setError(err.message || 'Failed to load specializations')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Fetch on mount if no initial data
    if (initialSpecializations.length === 0) {
      fetchSpecializations()
    }
  }, [initialSpecializations.length, fetchSpecializations])

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa specialization này?')) {
      return
    }

    setDeletingId(id)
    try {
      const response = await fetch(`/api/specializations/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete specialization')
      }

      // Refetch to ensure data is in sync
      await fetchSpecializations()
    } catch (err: any) {
      setError(err.message || 'Failed to delete specialization')
    } finally {
      setDeletingId(null)
    }
  }

  const handleOpenCreate = () => {
    setEditingId(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (id: number) => {
    setEditingId(id)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingId(null)
  }

  const handleFormSuccess = () => {
    setIsModalOpen(false)
    setEditingId(null)
    fetchSpecializations()
  }

  return (
    <div className="specializations-page">
      <div className="page-container">
        <DashboardHeader
          title="Quản lý Specializations"
          subtitle='Quản lý các cards trong phần "I specialize in"'
          showBack={true}
          backHref="/dashboard"
        />

        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <LoadingButton onClick={handleOpenCreate} variant="primary">
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

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Đang tải dữ liệu Specializations...</p>
          </div>
        ) : specializations.length === 0 ? (
          <div className="empty-state">
            <p>Chưa có specialization nào. Hãy tạo specialization đầu tiên!</p>
            <LoadingButton onClick={handleOpenCreate} variant="primary">
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
                    <p className="specialization-description">
                      {specialization.description || 'No description'}
                    </p>
                  </div>
                  <div className="card-actions">
                    <LoadingButton
                      onClick={() => handleOpenEdit(specialization.id)}
                      variant="primary"
                    >
                      Sửa
                    </LoadingButton>
                    <LoadingButton
                      onClick={() => handleDelete(specialization.id)}
                      variant="danger"
                      loading={deletingId === specialization.id}
                    >
                      Xóa
                    </LoadingButton>
                  </div>
                </div>
                <div className="card-meta"></div>
              </motion.div>
            ))}
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title={editingId ? 'Sửa Specialization' : 'Thêm Specialization mới'}
          size="medium"
        >
          <SpecializationForm
            specializationId={editingId || undefined}
            onSuccess={handleFormSuccess}
            onCancel={handleModalClose}
          />
        </Modal>
      </div>
    </div>
  )
}
