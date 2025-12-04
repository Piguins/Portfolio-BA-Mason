'use client'

interface DashboardCardProps {
  title: string
  description: string
  status?: string
}

export default function DashboardCard({ title, description, status = 'Sắp có...' }: DashboardCardProps) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.9)',
        borderRadius: 16,
        padding: '2rem',
        boxShadow: '0 20px 45px rgba(0,0,0,0.08)',
        border: '1px solid rgba(88,63,188,0.08)',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.12)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 20px 45px rgba(0,0,0,0.08)'
      }}
    >
      <h2
        style={{
          fontSize: '1.5rem',
          marginBottom: '0.5rem',
          color: '#242A41',
          fontWeight: 600,
        }}
      >
        {title}
      </h2>
      <p style={{ color: '#6B7280', fontSize: 14, marginBottom: '1rem' }}>
        {description}
      </p>
      <div style={{ color: '#9CA3AF', fontSize: 12 }}>{status}</div>
    </div>
  )
}

