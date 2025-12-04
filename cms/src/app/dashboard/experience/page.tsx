import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import ExperienceListClient from './ExperienceListClient'
import './experience.css'

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
export default async function ExperiencePage() {
  // Check auth
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  // PERFORMANCE: Fetch data on server-side (before render)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
  let experiences: Experience[] = []
  let error: string | null = null

  try {
    const response = await fetch(`${API_URL}/api/experience`, {
      next: { revalidate: 60 }, // Cache 60 seconds
      headers: {
        'Content-Type': 'application/json',
      },
    })

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
  return <ExperienceListClient initialExperiences={experiences} initialError={error} />
}
