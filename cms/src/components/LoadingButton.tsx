'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingButtonProps {
  children: React.ReactNode
  loading?: boolean
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  className?: string
}

export default function LoadingButton({
  children,
  loading = false,
  disabled = false,
  variant = 'primary',
  type = 'button',
  onClick,
  className,
}: LoadingButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium px-6 py-2.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 active:scale-95',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 active:scale-95',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20 active:scale-95',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:scale-95',
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(baseClasses, variantClasses[variant], className)}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      <span className={loading ? 'opacity-70' : ''}>{children}</span>
    </motion.button>
  )
}
