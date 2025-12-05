import SpecializationsListClient from './SpecializationsListClient'
import './specializations.css'

// Force dynamic rendering - dashboard pages should not be statically generated
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface Specialization {
  id: number
  number: string
  title: string
  description?: string
  order_index: number
}

// PERFORMANCE: Server Component - fetch data before render
// Middleware already handles auth - no need to check here
export default async function SpecializationsPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
  let specializations: Specialization[] = []
  let error: string | null = null

  try {
    const response = await fetch(`${API_URL}/api/specializations`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch specializations')
    }

    specializations = await response.json()
  } catch (err: any) {
    console.error('Failed to fetch specializations:', err)
    error = err.message || 'Failed to load specializations'
  }

  // Pass data to client component for interactivity
  return <SpecializationsListClient initialSpecializations={specializations} initialError={error} />
}
