import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import ProjectsListClient from './ProjectsListClient'
import './projects.css'

interface Project {
  id: string
  title: string
  slug: string
  description?: string
  content?: string
  thumbnail_url?: string
  demo_url?: string
  github_url?: string
  is_published: boolean
  order_index: number
  tags?: Array<{ id: number; name: string; color: string }>
}

// PERFORMANCE: Server Component - fetch data before render
// OPTIMIZED: Parallelize auth check and data fetching
export default async function ProjectsPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
  
  // OPTIMIZED: Start auth check and data fetch in parallel
  const [user, dataResponse] = await Promise.allSettled([
    getCurrentUser(),
    fetch(`${API_URL}/api/projects?published=`, {
      next: { revalidate: 300 }, // Cache 5 minutes
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  ])

  // Check auth first
  if (user.status === 'rejected' || !user.value) {
    redirect('/login')
  }

  let projects: Project[] = []
  let error: string | null = null

  try {
    if (dataResponse.status === 'rejected') {
      throw new Error('Failed to fetch projects')
    }

    const response = dataResponse.value

    if (!response.ok) {
      throw new Error('Failed to fetch projects')
    }

    const responseData = await response.json()
    // Handle both old format (array) and new format ({ data, pagination })
    projects = Array.isArray(responseData) ? responseData : (responseData.data || [])
  } catch (err: any) {
    console.error('Failed to fetch projects:', err)
    error = err.message || 'Failed to load projects'
  }

  return <ProjectsListClient initialProjects={projects} initialError={error} />
}

