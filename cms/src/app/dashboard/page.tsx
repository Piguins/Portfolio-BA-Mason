import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import LogoutButton from '@/components/LogoutButton'
import DashboardCard from '@/components/DashboardCard'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '2rem',
        background: 'radial-gradient(circle at top, #E1DAFE 0, #FFFFFF 45%, #DEFCFF 100%)',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, system-ui, -system-ui, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '2rem',
                marginBottom: '0.5rem',
                color: '#242A41',
                fontWeight: 700,
              }}
            >
              Mason Portfolio CMS
            </h1>
            <p style={{ color: '#6B7280', fontSize: 14 }}>
              Xin chào, <strong>{user.name || user.email?.split('@')[0] || 'User'}</strong>
            </p>
          </div>
          <LogoutButton />
        </div>

        {/* Dashboard Content */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginTop: '2rem',
          }}
        >
          <DashboardCard
            title="Projects"
            description="Quản lý Projects / Case Studies"
          />
          <DashboardCard
            title="Skills"
            description="Quản lý Skills, Tools, Certifications"
          />
          <DashboardCard
            title="Experience"
            description="Quản lý Experience / Timeline"
          />
        </div>

        {/* Info Section */}
        <div
          style={{
            marginTop: '2rem',
            background: 'rgba(255,255,255,0.9)',
            borderRadius: 16,
            padding: '2rem',
            boxShadow: '0 20px 45px rgba(0,0,0,0.08)',
            border: '1px solid rgba(88,63,188,0.08)',
          }}
        >
          <h3
            style={{
              fontSize: '1.25rem',
              marginBottom: '1rem',
              color: '#242A41',
              fontWeight: 600,
            }}
          >
            Thông tin hệ thống
          </h3>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'grid',
              gap: '0.75rem',
            }}
          >
            <li style={{ color: '#242A41', fontSize: 14 }}>
              ✓ Kết nối tới API Node.js + PostgreSQL (apps/api)
            </li>
            <li style={{ color: '#242A41', fontSize: 14 }}>
              ✓ Authentication với Supabase
            </li>
            <li style={{ color: '#242A41', fontSize: 14 }}>
              ✓ Protected routes và middleware
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}

