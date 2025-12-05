import SkillsListClient from './SkillsListClient'
import './skills.css'

// Force dynamic rendering - dashboard pages should not be statically generated
export const dynamic = 'force-dynamic'
export const revalidate = 0

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
  
  // Middleware already handles auth - no need to redirect here
  let skills: Skill[] = []
  let error: string | null = null

  try {
    const response = await fetch(`${API_URL}/api/skills`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch skills')
    }

    const responseData = await response.json()
    skills = Array.isArray(responseData) ? responseData : (responseData.data || [])
  } catch (err: any) {
    console.error('Failed to fetch skills:', err)
    error = err.message || 'Failed to load skills'
  }

  return <SkillsListClient initialSkills={skills} initialError={error} />
}

