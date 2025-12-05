'use client'

import ProjectsListClient from './ProjectsListClient'

export default function ProjectsPage() {
  // Client component - fetch happens in ProjectsListClient
  // This ensures UI renders immediately without blocking
  return <ProjectsListClient initialProjects={[]} initialError={null} />
}
