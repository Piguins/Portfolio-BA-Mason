'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getAuthErrorMessage } from '@/lib/auth-errors'
import { motion } from 'framer-motion'
import LoadingButton from '@/components/LoadingButton'
import { FormField, Input } from '@/components/FormField'
import { cn } from '@/lib/utils'

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

        if (data?.user) {
          // Wait a bit for cookies to be set by Supabase SSR
          // Then use window.location for full page reload to ensure middleware sees the cookies
          await new Promise((resolve) => setTimeout(resolve, 100))
          window.location.href = '/dashboard'
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
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-sm p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-2">
            Đăng nhập
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">Quản lý Portfolio của bạn</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'mb-6 p-4 rounded-lg text-sm',
              errorType === 'email' || errorType === 'password'
                ? 'bg-red-50 border border-red-200 text-red-700'
                : 'bg-amber-50 border border-amber-200 text-amber-700'
            )}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="Email" error={errorType === 'email' ? error : undefined}>
            <Input
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
              error={errorType === 'email' ? error : undefined}
            />
          </FormField>

          <FormField label="Mật khẩu" error={errorType === 'password' ? error : undefined}>
            <Input
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
              error={errorType === 'password' ? error : undefined}
            />
          </FormField>

          <LoadingButton type="submit" loading={loading} variant="primary" className="w-full">
            Đăng nhập
          </LoadingButton>
        </form>
      </motion.div>
    </main>
  )
}
