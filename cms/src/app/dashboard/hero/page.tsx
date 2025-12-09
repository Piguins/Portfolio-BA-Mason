'use client'

import HeroListClient from './HeroListClient'
import './hero.css'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default function HeroPage() {
  // Client component - fetch happens in HeroListClient
  // This ensures UI renders immediately without blocking
  return <HeroListClient initialHero={null} initialError={null} />
}
