'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ExperienceListClient from './ExperienceListClient'
import './experience.css'

interface Experience {
  id: string
  company: string
  role: string
  location?: string
  start_date: string
  end_date?: string
  is_current: boolean
  description?: string
  order_index: number
  bullets?: Array<{ id: number; text: string; order_index: number }>
  skills_text?: string[]
  skills_used?: Array<{ id: number; name: string; slug: string }>
}

export default function ExperiencePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [error, setError] = useState<string | null>(null)
  const [authChecked, setAuthChecked] = useState(false)

  // Check auth first
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.push('/login')
          return
        }
        
        setAuthChecked(true)
      } catch (err) {
        console.error('Auth check failed:', err)
        router.push('/login')
      }
    }
    
    checkAuth()
  }, [router])

  // Fetch data after auth check
  useEffect(() => {
    if (!authChecked) return

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
        const response = await fetch(`${API_URL}/api/experience`, {
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch experiences')
        }

        const responseData = await response.json()
        const data = Array.isArray(responseData) ? responseData : (responseData.data || [])
        setExperiences(data)
      } catch (err: any) {
        console.error('Failed to fetch experiences:', err)
        setError(err.message || 'Failed to load experiences')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [authChecked])

  if (!authChecked || loading) {
    return (
      <div className="experience-page">
        <div className="page-container" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh' 
        }}>
          <div className="spinner"></div>
          <p>Đang tải...</p>
        </div>
      </div>
    )
  }

  return <ExperienceListClient initialExperiences={experiences} initialError={error} />
}

