'use client'

import ExperienceListClient from './ExperienceListClient'

export default function ExperiencePage() {
  // Client component - fetch happens in ExperienceListClient
  // This ensures UI renders immediately without blocking
  return <ExperienceListClient initialExperiences={[]} initialError={null} />
}
