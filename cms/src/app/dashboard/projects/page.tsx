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
export default async function ProjectsPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
  let projects: Project[] = []
  let error: string | null = null

  try {
    const response = await fetch(`${API_URL}/api/projects?published=`, {
      next: { revalidate: 60 },
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch projects')
    }

    projects = await response.json()
  } catch (err: any) {
    console.error('Failed to fetch projects:', err)
    error = err.message || 'Failed to load projects'
  }

  return <ProjectsListClient initialProjects={projects} initialError={error} />
}

