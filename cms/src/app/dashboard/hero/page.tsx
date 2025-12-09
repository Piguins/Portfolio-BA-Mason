'use client'

import HeroListClient from './HeroListClient'
import './hero.css'

export default function HeroPage() {
  // Client component - fetch happens in HeroListClient
  // This ensures UI renders immediately without blocking
  return <HeroListClient initialHero={null} initialError={null} />
}
