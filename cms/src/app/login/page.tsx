'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getAuthErrorMessage } from '@/lib/auth-errors'
import { motion } from 'framer-motion'
import './login.css'

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

      if (data?.user) {
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

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </motion.div>
    </main>
  )
}
