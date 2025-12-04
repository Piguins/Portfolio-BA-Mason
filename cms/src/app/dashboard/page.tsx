import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import LogoutButton from '@/components/LogoutButton'
import DashboardCard from '@/components/DashboardCard'
import './dashboard.css'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Xin chào, {user.name || user.email?.split('@')[0] || 'User'}</p>
          </div>
          <LogoutButton />
        </div>

        <div className="dashboard-grid">
          <DashboardCard
            title="Projects"
            description="Quản lý Projects / Case Studies"
            status="Sắp có..."
          />
          <DashboardCard
            title="Skills"
            description="Quản lý Skills, Tools, Certifications"
            status="Sắp có..."
          />
          <DashboardCard
            title="Experience"
            description="Quản lý Experience / Timeline"
            link="/dashboard/experience"
          />
        </div>

        <div className="info-section">
          <h3>Thông tin hệ thống</h3>
          <ul className="info-list">
            <li>Kết nối tới API Node.js + PostgreSQL</li>
            <li>Authentication với Supabase</li>
            <li>Protected routes và middleware</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
