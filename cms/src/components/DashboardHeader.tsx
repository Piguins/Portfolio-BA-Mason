'use client'

import Link from 'next/link'
import LogoutButton from './LogoutButton'
import './DashboardHeader.css'

interface DashboardHeaderProps {
  title: string
  subtitle?: string
  showBack?: boolean
  backHref?: string
}

export default function DashboardHeader({
  title,
  subtitle,
  showBack = true,
  backHref = '/dashboard',
}: DashboardHeaderProps) {
  return (
    <div className="dashboard-header">
      <div className="header-left">
        {showBack && (
          <Link href={backHref} className="btn-back">
            ← Back
          </Link>
        )}
        <div className="header-text">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      <LogoutButton />
    </div>
  )
}

