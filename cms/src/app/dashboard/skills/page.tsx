import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import SkillsListClient from './SkillsListClient'
import './skills.css'

interface Skill {
  id: number
  name: string
  slug: string
  category: string
  level: number
  icon_url?: string
  is_highlight: boolean
  order_index: number
}

// PERFORMANCE: Server Component - fetch data before render
// OPTIMIZED: Parallelize auth check and data fetching
export default async function SkillsPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
  
  // OPTIMIZED: Start auth check and data fetch in parallel
  const [user, dataResponse] = await Promise.allSettled([
    getCurrentUser(),
    fetch(`${API_URL}/api/skills`, {
      next: { revalidate: 300 }, // Cache 5 minutes
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.NEXT_PUBLIC_API_KEY ? { 'X-API-Key': process.env.NEXT_PUBLIC_API_KEY } : {}),
      },
    }),
  ])

  // Check auth first
  if (user.status === 'rejected' || !user.value) {
    redirect('/login')
  }

  let skills: Skill[] = []
  let error: string | null = null

  try {
    if (dataResponse.status === 'rejected') {
      throw new Error('Failed to fetch skills')
    }

    const response = dataResponse.value

    if (!response.ok) {
      throw new Error('Failed to fetch skills')
    }

    const responseData = await response.json()
    // Handle both old format (array) and new format ({ data, pagination })
    skills = Array.isArray(responseData) ? responseData : (responseData.data || [])
  } catch (err: any) {
    console.error('Failed to fetch skills:', err)
    error = err.message || 'Failed to load skills'
  }

  return <SkillsListClient initialSkills={skills} initialError={error} />
}

