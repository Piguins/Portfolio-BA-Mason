import ProjectsListClient from './ProjectsListClient'
import './projects.css'

// Force dynamic rendering - dashboard pages should not be statically generated
export const dynamic = 'force-dynamic'
export const revalidate = 0

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
  
  // Middleware already handles auth - no need to redirect here
  let projects: Project[] = []
  let error: string | null = null

  try {
    const response = await fetch(`${API_URL}/api/projects?published=`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch projects')
    }

    const responseData = await response.json()
    projects = Array.isArray(responseData) ? responseData : (responseData.data || [])
  } catch (err: any) {
    console.error('Failed to fetch projects:', err)
    error = err.message || 'Failed to load projects'
  }

  return <ProjectsListClient initialProjects={projects} initialError={error} />
}

