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
export default async function SkillsPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
  let skills: Skill[] = []
  let error: string | null = null

  try {
    const response = await fetch(`${API_URL}/api/skills`, {
      next: { revalidate: 60 },
      headers: {
        'Content-Type': 'application/json',
      },
    })

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

