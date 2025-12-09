'use client'

import ExperienceListClient from './ExperienceListClient'
import './experience.css'

export default function ExperiencePage() {
  // Client component - fetch happens in ExperienceListClient
  // This ensures UI renders immediately without blocking
  return <ExperienceListClient initialExperiences={[]} initialError={null} />
}
