import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Get hero section (singleton)
export async function GET() {
  try {
    const hero = await prisma.heroSection.findFirst({
      orderBy: { createdAt: 'desc' },
    })

    if (!hero) {
      return NextResponse.json({ error: 'Hero section not found' }, { status: 404 })
    }

    return NextResponse.json(hero)
  } catch (error) {
    console.error('Error fetching hero section:', error)
    return NextResponse.json({ error: 'Failed to fetch hero section' }, { status: 500 })
  }
}

// POST - Create hero section
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, introduction, linkedinUrl, email, githubUrl, bannerUrl } = body

    if (!title || !introduction) {
      return NextResponse.json({ error: 'Title and introduction are required' }, { status: 400 })
    }

    const hero = await prisma.heroSection.create({
      data: {
        title,
        introduction,
        linkedinUrl: linkedinUrl || null,
        email: email || null,
        githubUrl: githubUrl || null,
        bannerUrl: bannerUrl || null,
      },
    })

    return NextResponse.json(hero, { status: 201 })
  } catch (error) {
    console.error('Error creating hero section:', error)
    return NextResponse.json({ error: 'Failed to create hero section' }, { status: 500 })
  }
}

// PUT - Update hero section
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, introduction, linkedinUrl, email, githubUrl, bannerUrl } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const hero = await prisma.heroSection.update({
      where: { id },
      data: {
        title,
        introduction,
        linkedinUrl: linkedinUrl || null,
        email: email || null,
        githubUrl: githubUrl || null,
        bannerUrl: bannerUrl || null,
      },
    })

    return NextResponse.json(hero)
  } catch (error) {
    console.error('Error updating hero section:', error)
    return NextResponse.json({ error: 'Failed to update hero section' }, { status: 500 })
  }
}

// DELETE - Delete hero section
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await prisma.heroSection.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Hero section deleted successfully' })
  } catch (error) {
    console.error('Error deleting hero section:', error)
    return NextResponse.json({ error: 'Failed to delete hero section' }, { status: 500 })
  }
}
