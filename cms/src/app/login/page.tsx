'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getAuthErrorMessage } from '@/lib/auth-errors'
import { motion } from 'framer-motion'

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

      // Security: Supabase SSR automatically stores tokens in HTTP-only cookies
      // We don't need to use data from response - just check if login succeeded
      // Tokens are handled securely by Supabase, not exposed to JavaScript
      if (data?.user) {
        // Clear any sensitive data from memory
        // Don't store tokens or user data in component state
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, rotateX: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 200,
        damping: 20,
      },
    },
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'radial-gradient(circle at top, #E1DAFE 0, #FFFFFF 45%, #DEFCFF 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, -system-ui, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements */}
      <motion.div
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(88, 63, 188, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          top: '-200px',
          right: '-200px',
          filter: 'blur(60px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <motion.div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(125, 224, 234, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          bottom: '-150px',
          left: '-150px',
          filter: 'blur(60px)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          width: '100%',
          maxWidth: 440,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <motion.div
          variants={cardVariants}
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: 24,
            padding: '3rem',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5)',
            border: '1px solid rgba(88, 63, 188, 0.1)',
            transformStyle: 'preserve-3d',
            perspective: '1000px',
          }}
          whileHover={{
            scale: 1.02,
            rotateY: 2,
            transition: { duration: 0.3 },
          }}
        >
          <motion.div variants={itemVariants}>
            <h1
              style={{
                fontSize: '2rem',
                marginBottom: '0.5rem',
                background: 'linear-gradient(135deg, #583FBC 0%, #7DE0EA 50%, #FF8C69 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 700,
                letterSpacing: '-0.02em',
              }}
            >
              Mason CMS Login
            </h1>
            <p
              style={{
                color: '#6B7280',
                marginBottom: '2rem',
                fontSize: 15,
                lineHeight: 1.6,
              }}
            >
              Đăng nhập để quản lý Projects, Skills, Experience cho Portfolio.
            </p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                padding: '1rem 1.25rem',
                marginBottom: '1.5rem',
                background:
                  errorType === 'email'
                    ? 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)'
                    : errorType === 'password'
                      ? 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)'
                      : 'linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)',
                border: `2px solid ${errorType === 'email' ? '#FCD34D' : errorType === 'password' ? '#FCA5A5' : '#A5B4FC'}`,
                borderRadius: 12,
                color: errorType === 'email' ? '#92400E' : errorType === 'password' ? '#DC2626' : '#4338CA',
                fontSize: 14,
                fontWeight: 500,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <motion.div variants={itemVariants}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: 4,
                  }}
                >
                  Email
                </span>
                <motion.input
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
                    padding: '0.875rem 1.125rem',
                    borderRadius: 12,
                    border: `2px solid ${errorType === 'email' ? '#FCA5A5' : '#E5E7EB'}`,
                    fontSize: 15,
                    outline: 'none',
                    opacity: loading ? 0.6 : 1,
                    cursor: loading ? 'not-allowed' : 'text',
                    transition: 'all 0.3s ease',
                    background: '#FFFFFF',
                    boxShadow: errorType === 'email' ? '0 0 0 4px rgba(252, 165, 165, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
                  }}
                  whileFocus={{
                    scale: 1.02,
                    borderColor: errorType === 'email' ? '#F59E0B' : '#583FBC',
                    boxShadow: `0 0 0 4px ${errorType === 'email' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(88, 63, 188, 0.15)'}`,
                    transition: { duration: 0.2 },
                  }}
                  whileHover={{
                    borderColor: errorType === 'email' ? '#FCA5A5' : '#D1D5DB',
                    transition: { duration: 0.2 },
                  }}
                />
              </label>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: 4,
                  }}
                >
                  Mật khẩu
                </span>
                <motion.input
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
                    padding: '0.875rem 1.125rem',
                    borderRadius: 12,
                    border: `2px solid ${errorType === 'password' ? '#FCA5A5' : '#E5E7EB'}`,
                    fontSize: 15,
                    outline: 'none',
                    opacity: loading ? 0.6 : 1,
                    cursor: loading ? 'not-allowed' : 'text',
                    transition: 'all 0.3s ease',
                    background: '#FFFFFF',
                    boxShadow: errorType === 'password' ? '0 0 0 4px rgba(252, 165, 165, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
                  }}
                  whileFocus={{
                    scale: 1.02,
                    borderColor: errorType === 'password' ? '#F59E0B' : '#583FBC',
                    boxShadow: `0 0 0 4px ${errorType === 'password' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(88, 63, 188, 0.15)'}`,
                    transition: { duration: 0.2 },
                  }}
                  whileHover={{
                    borderColor: errorType === 'password' ? '#FCA5A5' : '#D1D5DB',
                    transition: { duration: 0.2 },
                  }}
                />
              </label>
            </motion.div>

            <motion.div variants={itemVariants} style={{ marginTop: '0.5rem' }}>
              <motion.button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.875rem 1.5rem',
                  borderRadius: 12,
                  border: 'none',
                  background: loading
                    ? '#9CA3AF'
                    : 'linear-gradient(135deg, #583FBC 0%, #7DE0EA 50%, #FF8C69 100%)',
                  backgroundSize: '200% 200%',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading
                    ? 'none'
                    : '0 8px 24px rgba(88, 63, 188, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                whileHover={
                  !loading
                    ? {
                        scale: 1.02,
                        boxShadow: '0 12px 32px rgba(88, 63, 188, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.2)',
                        transition: { duration: 0.2 },
                      }
                    : {}
                }
                whileTap={!loading ? { scale: 0.98 } : {}}
                animate={
                  !loading
                    ? {
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                      }
                    : {}
                }
                transition={
                  !loading
                    ? {
                        backgroundPosition: {
                          duration: 3,
                          repeat: Infinity,
                          ease: 'linear',
                        },
                      }
                    : {}
                }
              >
                <motion.span
                  animate={loading ? { opacity: [1, 0.5, 1] } : {}}
                  transition={loading ? { duration: 1.5, repeat: Infinity } : {}}
                >
                  {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </motion.span>
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </main>
  )
}
