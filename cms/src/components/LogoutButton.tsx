'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export default function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      style={{
        padding: '0.6rem 1.2rem',
        borderRadius: 8,
        border: '1px solid #E5E7EB',
        background: '#FFFFFF',
        color: '#374151',
        fontWeight: 500,
        fontSize: 14,
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.6 : 1,
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        if (!loading) {
          e.currentTarget.style.background = '#F9FAFB'
          e.currentTarget.style.borderColor = '#D1D5DB'
        }
      }}
      onMouseLeave={(e) => {
        if (!loading) {
          e.currentTarget.style.background = '#FFFFFF'
          e.currentTarget.style.borderColor = '#E5E7EB'
        }
      }}
    >
      {loading ? 'Đang đăng xuất...' : 'Đăng xuất'}
    </button>
  )
}

