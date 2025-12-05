'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getAuthErrorMessage } from '@/lib/auth-errors'
import { motion } from 'framer-motion'
import LoadingButton from '@/components/LoadingButton'
import './login.css'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [errorType, setErrorType] = useState<'email' | 'password' | 'network' | 'unknown' | null>(
    null
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setError('')
      setErrorType(null)
      setLoading(true)

      // Quick validation before API call
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

        if (data?.user && data?.session) {
          // Ensure session is saved to cookies before redirect
          // Wait a bit for cookies to be set by Supabase SSR
          await new Promise((resolve) => setTimeout(resolve, 200))
          
          // Verify session is available before redirect
          const { data: { session: verifySession }, error: sessionError } = await supabase.auth.getSession()
          
          if (verifySession && !sessionError) {
            // Use window.location for full page reload to ensure middleware sees the cookies
            window.location.href = '/dashboard'
          } else {
            // If session not available, try to refresh it
            const { data: { session: refreshedSession } } = await supabase.auth.refreshSession()
            if (refreshedSession) {
              window.location.href = '/dashboard'
            } else {
              setError('Không thể lưu phiên đăng nhập. Vui lòng thử lại.')
              setErrorType('unknown')
              setLoading(false)
            }
          }
        }
      } catch (err: any) {
        const errorInfo = getAuthErrorMessage(err)
        setError(errorInfo.message)
        setErrorType(errorInfo.type)
        setLoading(false)
      }
      // router is not used directly in the callback, removed from deps
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [email, password]
  )

  return (
    <main className="login-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="login-container"
      >
        <div className="login-header">
          <h1>Đăng nhập</h1>
          <p>Quản lý Portfolio của bạn</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`error-alert ${errorType || 'unknown'}`}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
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
              placeholder="your@email.com"
              disabled={loading}
              className={errorType === 'email' ? 'error' : ''}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
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
              className={errorType === 'password' ? 'error' : ''}
            />
          </div>

          <LoadingButton
            type="submit"
            loading={loading}
            variant="primary"
            className="btn-primary-full"
          >
            Đăng nhập
          </LoadingButton>
        </form>
      </motion.div>
    </main>
  )
}
