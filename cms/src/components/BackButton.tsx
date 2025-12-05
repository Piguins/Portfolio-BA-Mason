'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BackButtonProps {
  href: string
  className?: string
}

export default function BackButton({ href, className }: BackButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg px-4 py-2 transition-all duration-200 font-medium text-sm w-fit',
        className
      )}
    >
      <ArrowLeft className="w-4 h-4" />
      Back
    </Link>
  )
}
