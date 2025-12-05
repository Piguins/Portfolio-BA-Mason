import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Get specialization by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const idNum = parseInt(id, 10)

    if (isNaN(idNum)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 })
    }

    const specialization = await prisma.specialization.findUnique({
      where: { id: idNum },
    })

    if (!specialization) {
      return NextResponse.json({ error: 'Specialization not found' }, { status: 404 })
    }

    return NextResponse.json(specialization)
  } catch (error) {
    console.error('Error fetching specialization:', error)
    return NextResponse.json({ error: 'Failed to fetch specialization' }, { status: 500 })
  }
}

// PUT - Update specialization
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const idNum = parseInt(id, 10)

    if (isNaN(idNum)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 })
    }

    const body = await request.json()
    const { iconUrl, title, description } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const specialization = await prisma.specialization.update({
      where: { id: idNum },
      data: {
        iconUrl: iconUrl || null,
        title,
        description: description || null,
      },
    })

    return NextResponse.json(specialization)
  } catch (error) {
    console.error('Error updating specialization:', error)
    return NextResponse.json({ error: 'Failed to update specialization' }, { status: 500 })
  }
}

// DELETE - Delete specialization
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const idNum = parseInt(id, 10)

    if (isNaN(idNum)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 })
    }

    await prisma.specialization.delete({
      where: { id: idNum },
    })

    return NextResponse.json({ message: 'Specialization deleted successfully' })
  } catch (error) {
    console.error('Error deleting specialization:', error)
    return NextResponse.json({ error: 'Failed to delete specialization' }, { status: 500 })
  }
}
