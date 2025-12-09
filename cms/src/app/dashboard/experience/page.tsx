'use client'

import ExperienceListClient from './ExperienceListClient'
import './experience.css'

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic'

export default function ExperiencePage() {
  // Client component - fetch happens in ExperienceListClient
  // This ensures UI renders immediately without blocking
  return <ExperienceListClient initialExperiences={[]} initialError={null} />
}
