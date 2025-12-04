'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getAuthErrorMessage } from '@/lib/auth-errors'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [errorType, setErrorType] = useState<'email' | 'password' | 'network' | 'unknown' | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setErrorType(null)
    setLoading(true)

    // Basic validation
    if (!email.trim()) {
      setError('Vui lòng nhập email')
      setErrorType('email')
      setLoading(false)
      return
    }

    if (!password.trim()) {
      setError('Vui lòng nhập mật khẩu')
      setErrorType('password')
      setLoading(false)
      return
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Email không đúng định dạng')
      setErrorType('email')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (authError) {
        const errorInfo = getAuthErrorMessage(authError)
        setError(errorInfo.message)
        setErrorType(errorInfo.type)
        setLoading(false)
        return
      }

      if (data.user) {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err: any) {
      const errorInfo = getAuthErrorMessage(err)
      setError(errorInfo.message)
      setErrorType(errorInfo.type)
      setLoading(false)
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background:
          'radial-gradient(circle at top, #E1DAFE 0, #FFFFFF 45%, #DEFCFF 100%)',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, system-ui, -system-ui, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'rgba(255,255,255,0.96)',
          borderRadius: 16,
          padding: '2rem 2.5rem',
          boxShadow: '0 20px 45px rgba(0,0,0,0.08)',
          border: '1px solid rgba(88,63,188,0.08)',
        }}
      >
        <h1
          style={{
            fontSize: '1.75rem',
            marginBottom: '0.5rem',
            color: '#242A41',
            fontWeight: 700,
          }}
        >
          Mason CMS Login
        </h1>
        <p
          style={{
            color: '#6B7280',
            marginBottom: '1.75rem',
            fontSize: 14,
          }}
        >
          Đăng nhập để quản lý Projects, Skills, Experience cho Portfolio.
        </p>

        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
              background: errorType === 'email' ? '#FEF3C7' : errorType === 'password' ? '#FEE2E2' : '#E0E7FF',
              border: `1px solid ${errorType === 'email' ? '#FCD34D' : errorType === 'password' ? '#FCA5A5' : '#A5B4FC'}`,
              borderRadius: 8,
              color: errorType === 'email' ? '#92400E' : errorType === 'password' ? '#DC2626' : '#4338CA',
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span style={{ fontSize: 16 }}>
              {errorType === 'email' ? '📧' : errorType === 'password' ? '🔒' : '⚠️'}
            </span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: '#374151',
              }}
            >
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errorType === 'email') {
                  setError('')
                  setErrorType(null)
                }
              }}
              placeholder="you@example.com"
              disabled={loading}
              style={{
                padding: '0.75rem 0.9rem',
                borderRadius: 10,
                border: `1px solid ${errorType === 'email' ? '#FCA5A5' : '#E5E7EB'}`,
                fontSize: 14,
                outline: 'none',
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'text',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = errorType === 'email' ? '#F59E0B' : '#583FBC'
                e.currentTarget.style.boxShadow = `0 0 0 1px ${errorType === 'email' ? 'rgba(245,158,11,0.25)' : 'rgba(88,63,188,0.25)'}`
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errorType === 'email' ? '#FCA5A5' : '#E5E7EB'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: '#374151',
              }}
            >
              Mật khẩu
            </span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errorType === 'password') {
                  setError('')
                  setErrorType(null)
                }
              }}
              placeholder="••••••••"
              disabled={loading}
              style={{
                padding: '0.75rem 0.9rem',
                borderRadius: 10,
                border: `1px solid ${errorType === 'password' ? '#FCA5A5' : '#E5E7EB'}`,
                fontSize: 14,
                outline: 'none',
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'text',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = errorType === 'password' ? '#F59E0B' : '#583FBC'
                e.currentTarget.style.boxShadow = `0 0 0 1px ${errorType === 'password' ? 'rgba(245,158,11,0.25)' : 'rgba(88,63,188,0.25)'}`
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errorType === 'password' ? '#FCA5A5' : '#E5E7EB'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '0.5rem',
              padding: '0.8rem 1rem',
              borderRadius: 999,
              border: 'none',
              background: loading
                ? '#9CA3AF'
                : 'linear-gradient(135deg, #583FBC 0%, #7DE0EA 50%, #FF8C69 100%)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: 14,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 12px 30px rgba(88,63,188,0.35)',
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </main>
  )
}
