import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Get portfolio project by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const portfolio = await prisma.portfolio.findUnique({
      where: { id },
    })

    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio project not found' }, { status: 404 })
    }

    return NextResponse.json(portfolio)
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 })
  }
}

// PUT - Update portfolio project
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { title, tagRole, description, imageUrl, projectUrl } = body

    if (!title || !tagRole) {
      return NextResponse.json({ error: 'Title and tagRole are required' }, { status: 400 })
    }

    const portfolio = await prisma.portfolio.update({
      where: { id },
      data: {
        title,
        tagRole,
        description: description || null,
        imageUrl: imageUrl || null,
        projectUrl: projectUrl || null,
      },
    })

    return NextResponse.json(portfolio)
  } catch (error) {
    console.error('Error updating portfolio:', error)
    return NextResponse.json({ error: 'Failed to update portfolio' }, { status: 500 })
  }
}

// DELETE - Delete portfolio project
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    await prisma.portfolio.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Portfolio project deleted successfully' })
  } catch (error) {
    console.error('Error deleting portfolio:', error)
    return NextResponse.json({ error: 'Failed to delete portfolio' }, { status: 500 })
  }
}
