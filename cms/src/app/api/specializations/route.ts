import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Get all specializations
export async function GET() {
  try {
    const specializations = await prisma.specialization.findMany({
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json(specializations)
  } catch (error) {
    console.error('Error fetching specializations:', error)
    return NextResponse.json({ error: 'Failed to fetch specializations' }, { status: 500 })
  }
}

// POST - Create specialization
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { iconUrl, title, description } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const specialization = await prisma.specialization.create({
      data: {
        iconUrl: iconUrl || null,
        title,
        description: description || null,
      },
    })

    return NextResponse.json(specialization, { status: 201 })
  } catch (error) {
    console.error('Error creating specialization:', error)
    return NextResponse.json({ error: 'Failed to create specialization' }, { status: 500 })
  }
}
