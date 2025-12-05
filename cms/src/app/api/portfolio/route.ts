import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Get all portfolio projects
export async function GET() {
  try {
    const portfolios = await prisma.portfolio.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(portfolios)
  } catch (error) {
    console.error('Error fetching portfolios:', error)
    return NextResponse.json({ error: 'Failed to fetch portfolios' }, { status: 500 })
  }
}

// POST - Create portfolio project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, tagRole, description, imageUrl, projectUrl } = body

    if (!title || !tagRole) {
      return NextResponse.json({ error: 'Title and tagRole are required' }, { status: 400 })
    }

    const portfolio = await prisma.portfolio.create({
      data: {
        title,
        tagRole,
        description: description || null,
        imageUrl: imageUrl || null,
        projectUrl: projectUrl || null,
      },
    })

    return NextResponse.json(portfolio, { status: 201 })
  } catch (error) {
    console.error('Error creating portfolio:', error)
    return NextResponse.json({ error: 'Failed to create portfolio' }, { status: 500 })
  }
}
