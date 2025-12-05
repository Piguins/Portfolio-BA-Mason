import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { DashboardContent } from './DashboardContent'

// Force dynamic rendering - dashboard pages should not be statically generated
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return <DashboardContent user={{ name: user.name, email: user.email }} />
}
