import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Get hero section (singleton) - Uses hero_content table
export async function GET() {
  try {
    // Use raw query to access hero_content table (not Prisma model)
    const result = await prisma.$queryRawUnsafe(
      `SELECT * FROM public.hero_content WHERE id = 1 LIMIT 1`
    )
    const hero = Array.isArray(result) ? result[0] : result

    if (!hero) {
      // Return default if not exists
      return NextResponse.json({
        id: 1,
        greeting: 'Hey!',
        greeting_part2: "I'm",
        name: 'Thế Kiệt (Mason)',
        title: 'Business Analyst',
        description: 'Agency-quality business analysis with the personal touch of a freelancer.',
        linkedin_url: null,
        github_url: null,
        email_url: null,
        profile_image_url: null,
        created_at: new Date(),
        updated_at: new Date(),
      })
    }

    return NextResponse.json(hero)
  } catch (error) {
    console.error('Error fetching hero section:', error)
    return NextResponse.json({ error: 'Failed to fetch hero section' }, { status: 500 })
  }
}

// POST - Not used (hero is singleton, use PUT instead)
export async function POST() {
  return NextResponse.json({ error: 'Use PUT to update hero content' }, { status: 405 })
}

// PUT - Update hero section (singleton - always updates id = 1)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      greeting,
      greeting_part2,
      name,
      title,
      description,
      linkedin_url,
      github_url,
      email_url,
      profile_image_url,
    } = body

    await prisma.$executeRawUnsafe(
      `INSERT INTO public.hero_content (
        id, greeting, greeting_part2, name, title, description,
        linkedin_url, github_url, email_url, profile_image_url, updated_at
      )
      VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      ON CONFLICT (id) DO UPDATE SET
        greeting = EXCLUDED.greeting,
        greeting_part2 = EXCLUDED.greeting_part2,
        name = EXCLUDED.name,
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        linkedin_url = EXCLUDED.linkedin_url,
        github_url = EXCLUDED.github_url,
        email_url = EXCLUDED.email_url,
        profile_image_url = EXCLUDED.profile_image_url,
        updated_at = NOW()`,
      greeting || 'Hey!',
      greeting_part2 || "I'm",
      name || 'Thế Kiệt (Mason)',
      title || 'Business Analyst',
      description || null,
      linkedin_url || null,
      github_url || null,
      email_url || null,
      profile_image_url || null
    )

    const hero = await prisma.$queryRawUnsafe(
      `SELECT * FROM public.hero_content WHERE id = 1 LIMIT 1`
    )

    return NextResponse.json(Array.isArray(hero) ? hero[0] : hero)
  } catch (error) {
    console.error('Error updating hero section:', error)
    return NextResponse.json({ error: 'Failed to update hero section' }, { status: 500 })
  }
}

// DELETE - Not allowed (hero is singleton)
export async function DELETE() {
  return NextResponse.json({ error: 'Cannot delete hero content (singleton)' }, { status: 405 })
}
