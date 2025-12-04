'use client'

import Link from 'next/link'

interface DashboardCardProps {
  title: string
  description: string
  status?: string
  link?: string
}

export default function DashboardCard({ title, description, status = 'Sắp có...', link }: DashboardCardProps) {
  const content = (
    <div
      style={{
        background: 'var(--bg-white)',
        borderRadius: 16,
        padding: '2rem',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid rgba(88,63,188,0.1)',
        cursor: link ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        if (link) {
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.boxShadow = '0 25px 50px rgba(88,63,188,0.15)'
        }
      }}
      onMouseLeave={(e) => {
        if (link) {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
        }
      }}
    >
      <h2
        style={{
          fontSize: '1.5rem',
          marginBottom: '0.5rem',
          color: 'var(--dark-blue)',
          fontWeight: 600,
          fontFamily: 'var(--font-primary)',
        }}
      >
        {title}
      </h2>
      <p style={{ color: 'var(--text-light)', fontSize: 14, marginBottom: '1rem' }}>
        {description}
      </p>
      {link ? (
        <div style={{ color: 'var(--primary-color)', fontSize: 12, fontWeight: 500 }}>
          Quản lý →
        </div>
      ) : (
        <div style={{ color: 'var(--grey)', fontSize: 12 }}>{status}</div>
      )}
    </div>
  )

  if (link) {
    return <Link href={link}>{content}</Link>
  }

  return content
}

