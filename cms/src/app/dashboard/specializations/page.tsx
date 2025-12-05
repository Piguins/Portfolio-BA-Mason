'use client'

import SpecializationsListClient from './SpecializationsListClient'

export default function SpecializationsPage() {
  // Client component - fetch happens in SpecializationsListClient
  // This ensures UI renders immediately without blocking
  return <SpecializationsListClient initialSpecializations={[]} initialError={null} />
}
