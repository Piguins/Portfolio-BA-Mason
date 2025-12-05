import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import ExperienceListClient from './ExperienceListClient'
import './experience.css'

// Force dynamic rendering - dashboard pages should not be statically generated
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface Experience {
  id: string
  company: string
  role: string
  location?: string
  start_date: string
  end_date?: string
  is_current: boolean
  description?: string
  order_index: number
  bullets?: Array<{ id: number; text: string; order_index: number }>
  // New free-text skills
  skills_text?: string[]
  // Old relation-based skills (still supported for backward compatibility)
  skills_used?: Array<{ id: number; name: string; slug: string }>
}

// PERFORMANCE: Server Component - fetch data before render
// OPTIMIZED: Parallelize auth check and data fetching
export default async function ExperiencePage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
  
  // OPTIMIZED: Start auth check and data fetch in parallel
  const [user, dataResponse] = await Promise.allSettled([
    getCurrentUser(),
    fetch(`${API_URL}/api/experience`, {
      cache: 'no-store', // Always fetch fresh data for dashboard
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  ])

  // Check auth first
  if (user.status === 'rejected' || !user.value) {
    redirect('/login')
  }

  let experiences: Experience[] = []
  let error: string | null = null

  try {
    if (dataResponse.status === 'rejected') {
      throw new Error('Failed to fetch experiences')
    }

    const response = dataResponse.value

    if (!response.ok) {
      throw new Error('Failed to fetch experiences')
    }

    const responseData = await response.json()
    // Handle both old format (array) and new format ({ data, pagination })
    experiences = Array.isArray(responseData) ? responseData : (responseData.data || [])
  } catch (err: any) {
    console.error('Failed to fetch experiences:', err)
    error = err.message || 'Failed to load experiences'
  }

  // Pass data to client component for interactivity
  // Always render client component even if there's an error - let it handle display
  return <ExperienceListClient initialExperiences={experiences} initialError={error} />
}
