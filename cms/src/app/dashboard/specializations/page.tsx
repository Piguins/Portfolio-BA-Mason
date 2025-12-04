import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import SpecializationsListClient from './SpecializationsListClient'
import './specializations.css'

interface Specialization {
  id: number
  number: string
  title: string
  description?: string
  order_index: number
}

// PERFORMANCE: Server Component - fetch data before render
export default async function SpecializationsPage() {
  // Check auth
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  // PERFORMANCE: Fetch data on server-side (before render)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
  let specializations: Specialization[] = []
  let error: string | null = null

  try {
    const response = await fetch(`${API_URL}/api/specializations`, {
      next: { revalidate: 60 }, // Cache 60 seconds
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

