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

    const result = await prisma.$queryRawUnsafe(
      `SELECT id, number, title, description, icon_url, created_at, updated_at
       FROM public.specializations WHERE id = $1`,
      idNum
    )

    const specialization = Array.isArray(result) ? result[0] : result

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
    const { number, title, description, icon_url } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    await prisma.$executeRawUnsafe(
      `UPDATE public.specializations
       SET number = $1, title = $2, description = $3, icon_url = $4, updated_at = NOW()
       WHERE id = $5`,
      number || null,
      title,
      description || null,
      icon_url || null,
      idNum
    )

    const result = await prisma.$queryRawUnsafe(
      `SELECT id, number, title, description, icon_url, created_at, updated_at
       FROM public.specializations WHERE id = $1`,
      idNum
    )

    const specialization = Array.isArray(result) ? result[0] : result

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

    await prisma.$executeRawUnsafe(`DELETE FROM public.specializations WHERE id = $1`, idNum)

    return NextResponse.json({ message: 'Specialization deleted successfully' })
  } catch (error) {
    console.error('Error deleting specialization:', error)
    return NextResponse.json({ error: 'Failed to delete specialization' }, { status: 500 })
  }
}
