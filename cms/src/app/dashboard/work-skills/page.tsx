import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import WorkSkillsListClient from './WorkSkillsListClient'
import './work-skills.css'

interface WorkSkill {
  id: number
  name: string
  slug: string
  category: string
}

// PERFORMANCE: Server Component - fetch data before render
export default async function WorkSkillsPage() {
  // Check auth
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  // PERFORMANCE: Fetch data on server-side (before render)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
  let workSkills: WorkSkill[] = []
  let error: string | null = null

  try {
    const response = await fetch(`${API_URL}/api/work-skills`, {
      next: { revalidate: 60 }, // Cache 60 seconds
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch work skills')
    }

    workSkills = await response.json()
  } catch (err: any) {
    console.error('Failed to fetch work skills:', err)
    error = err.message || 'Failed to load work skills'
  }

  // Pass data to client component for interactivity
  return <WorkSkillsListClient initialWorkSkills={workSkills} initialError={error} />
}

