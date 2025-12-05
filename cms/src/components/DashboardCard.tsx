'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import './DashboardCard.css'

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

  const cardContent = (
    <motion.div
      className={`dashboard-card ${link ? 'clickable' : ''}`}
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
      <h3>{title}</h3>
      <p>{description}</p>
      {link ? (
        <div className="card-link">
          Quản lý <span>→</span>
        </div>
      ) : (
        <div className="card-status">{status}</div>
      )}
    </motion.div>
  )

  return cardContent
}
