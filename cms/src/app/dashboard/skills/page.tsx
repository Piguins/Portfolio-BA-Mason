'use client'

import SkillsListClient from './SkillsListClient'

export default function SkillsPage() {
  // Client component - fetch happens in SkillsListClient
  // This ensures UI renders immediately without blocking
  return <SkillsListClient initialSkills={[]} initialError={null} />
}
