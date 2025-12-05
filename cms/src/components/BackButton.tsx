'use client'

import Link from 'next/link'
import './BackButton.css'

interface BackButtonProps {
  href: string
}

export default function BackButton({ href }: BackButtonProps) {
  return (
    <Link href={href} className="btn-back">
      Back
    </Link>
  )
}
