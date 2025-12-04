'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import './BackButton.css'

interface BackButtonProps {
  href: string
  children: React.ReactNode
}

export default function BackButton({ href, children }: BackButtonProps) {
  return (
    <Link href={href}>
      <motion.button
        className="btn-back"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span>{children}</span>
      </motion.button>
    </Link>
  )
}

