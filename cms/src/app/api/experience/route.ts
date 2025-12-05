import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Get all experiences
export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { startDate: 'desc' },
    })

    return NextResponse.json(experiences)
  } catch (error) {
    console.error('Error fetching experiences:', error)
    return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 })
  }
}

// POST - Create experience
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { company, role, location, startDate, endDate, description, bullets, skills } = body

    if (!company || !role || !startDate) {
      return NextResponse.json(
        { error: 'Company, role, and startDate are required' },
        { status: 400 }
      )
    }

    const experience = await prisma.experience.create({
      data: {
        company,
        role,
        location: location || null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        description: description || null,
        bullets: bullets || [],
        skills: skills || [],
      },
    })

    return NextResponse.json(experience, { status: 201 })
  } catch (error) {
    console.error('Error creating experience:', error)
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 })
  }
}
