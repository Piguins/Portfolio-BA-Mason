'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import '../experience.css'

export default function NewExperiencePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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
    skill_ids: [] as number[],
  })
  const [newBullet, setNewBullet] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/experience`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to create experience')
      router.push('/dashboard/experience')
    } catch (err: any) {
      alert(err.message || 'Failed to create experience')
    } finally {
      setLoading(false)
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
      bullets: formData.bullets.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="experience-page">
      <div className="page-header">
        <div>
          <Link href="/dashboard/experience" className="back-link">
            ← Quay lại Experience
          </Link>
          <h1>Thêm Experience mới</h1>
        </div>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="experience-form"
      >
        <div className="form-group">
          <label>Company *</label>
          <input
            type="text"
            required
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Role *</label>
          <input
            type="text"
            required
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Order Index</label>
            <input
              type="number"
              value={formData.order_index}
              onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Date *</label>
            <input
              type="date"
              required
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              disabled={formData.is_current}
            />
          </div>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={formData.is_current}
              onChange={(e) => setFormData({ ...formData, is_current: e.target.checked, end_date: '' })}
            />
            Current Position
          </label>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Bullets</label>
          <div className="bullets-input">
            <input
              type="text"
              value={newBullet}
              onChange={(e) => setNewBullet(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBullet())}
              placeholder="Nhập bullet point và nhấn Enter"
            />
            <button type="button" onClick={addBullet} className="btn-add">
              Thêm
            </button>
          </div>
          <ul className="bullets-list">
            {formData.bullets.map((bullet, index) => (
              <li key={index}>
                {bullet.text}
                <button type="button" onClick={() => removeBullet(index)} className="btn-remove">
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="form-actions">
          <Link href="/dashboard/experience" className="btn-cancel">
            Hủy
          </Link>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Đang tạo...' : 'Tạo Experience'}
          </button>
        </div>
      </motion.form>
    </div>
  )
}

