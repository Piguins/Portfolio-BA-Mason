'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DashboardCardProps {
  title: string
  description: string
  status?: string
  link?: string
}

export default function DashboardCard({
  title,
  description,
  status = 'Sắp có...',
  link,
}: DashboardCardProps) {
  const router = useRouter()

  const handleClick = () => {
    if (link) {
      router.push(link)
    }
  }

  return (
    <motion.div
      className={cn(
        'bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 p-6',
        link && 'cursor-pointer select-none'
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={link ? { y: -4 } : {}}
      transition={{ duration: 0.2 }}
      onClick={link ? handleClick : undefined}
      role={link ? 'button' : undefined}
      tabIndex={link ? 0 : undefined}
      onKeyDown={
        link
          ? (e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleClick()
              }
            }
          : undefined
      }
    >
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 mb-4 leading-relaxed">{description}</p>
      {link ? (
        <div className="flex items-center gap-2 text-blue-600 font-medium text-sm group">
          <span>Quản lý</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      ) : (
        <div className="text-sm text-slate-500 italic">{status}</div>
      )}
    </motion.div>
  )
}
