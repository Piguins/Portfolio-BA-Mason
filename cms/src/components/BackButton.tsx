'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import './BackButton.css'

interface BackButtonProps {
  href: string
  children?: React.ReactNode
}

export default function BackButton({ href, children = 'Back' }: BackButtonProps) {
  return (
    <Link href={href}>
      <motion.button
        className="btn-back"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span>{children}</span>
      </motion.button>
    </Link>
  )
}

