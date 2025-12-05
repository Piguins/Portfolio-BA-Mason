'use client'

import SkillsListClient from './SkillsListClient'
import './skills.css'

export default function SkillsPage() {
  // Client component - fetch happens in SkillsListClient
  // This ensures UI renders immediately without blocking
  return <SkillsListClient initialSkills={[]} initialError={null} />
}
