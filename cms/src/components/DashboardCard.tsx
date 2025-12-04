'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import './DashboardCard.css'

interface DashboardCardProps {
  title: string
  description: string
  status?: string
  link?: string
}

export default function DashboardCard({ title, description, status = 'Sắp có...', link }: DashboardCardProps) {
  const content = (
    <motion.div
      className={`dashboard-card ${link ? 'clickable' : ''}`}
      whileHover={link ? { y: -4 } : {}}
      transition={{ duration: 0.2 }}
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

  if (link) {
    return <Link href={link}>{content}</Link>
  }

  return content
}
