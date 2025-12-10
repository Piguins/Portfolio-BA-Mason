'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import LoadingButton from './LoadingButton'
import './ConfirmModal.css'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  loading?: boolean
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Xác nhận',
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  variant = 'danger',
  loading = false,
}: ConfirmModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose, loading])

  const handleConfirm = () => {
    if (!loading) {
      onConfirm()
    }
  }

  const handleCancel = () => {
    if (!loading) {
      onClose()
    }
  }

  // Debug: Log when modal should render
  useEffect(() => {
    if (isOpen) {
      console.log('[ConfirmModal] Rendering modal, isOpen:', isOpen, 'variant:', variant)
    }
  }, [isOpen, variant])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="confirm-modal-overlay" onClick={handleCancel} key="confirm-overlay">
        <motion.div
          className="confirm-modal-content"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          <div className={`confirm-modal-icon confirm-modal-icon-${variant}`}>
            {variant === 'danger' && (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            )}
            {variant === 'warning' && (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            )}
            {variant === 'info' && (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            )}
          </div>

          <div className="confirm-modal-header">
            <h2>{title}</h2>
          </div>

          <div className="confirm-modal-body">
            <p>{message}</p>
          </div>

          <div className="confirm-modal-actions">
            <LoadingButton
              onClick={handleCancel}
              variant="secondary"
              disabled={loading}
            >
              {cancelText}
            </LoadingButton>
            <LoadingButton
              onClick={handleConfirm}
              variant={variant === 'danger' ? 'danger' : 'primary'}
              loading={loading}
            >
              {confirmText}
            </LoadingButton>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  )
}

