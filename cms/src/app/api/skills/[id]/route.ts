import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Get skill by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const idNum = parseInt(id, 10)

    if (isNaN(idNum)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 })
    }

    const result = await prisma.$queryRawUnsafe(`SELECT * FROM public.skills WHERE id = $1`, idNum)

    const skill = Array.isArray(result) ? result[0] : result

    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
    }

    return NextResponse.json(skill)
  } catch (error) {
    console.error('Error fetching skill:', error)
    return NextResponse.json({ error: 'Failed to fetch skill' }, { status: 500 })
  }
}

// PUT - Update skill
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const idNum = parseInt(id, 10)

    if (isNaN(idNum)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 })
    }

    const body = await request.json()
    const { name, slug, category, level, icon_url, description, order_index, is_highlight } = body

    if (!name || !category) {
      return NextResponse.json({ error: 'Name and category are required' }, { status: 400 })
    }

    await prisma.$executeRawUnsafe(
      `UPDATE public.skills
       SET name = $1, slug = $2, category = $3, level = $4, icon_url = $5,
           description = $6, order_index = $7, is_highlight = $8, updated_at = NOW()
       WHERE id = $9`,
      name,
      slug || null,
      category,
      level || null,
      icon_url || null,
      description || null,
      order_index || 0,
      is_highlight || false,
      idNum
    )

    const skill = await prisma.$queryRawUnsafe(`SELECT * FROM public.skills WHERE id = $1`, idNum)

    return NextResponse.json(Array.isArray(skill) ? skill[0] : skill)
  } catch (error) {
    console.error('Error updating skill:', error)
    return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 })
  }
}

// DELETE - Delete skill
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const idNum = parseInt(id, 10)

    if (isNaN(idNum)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 })
    }

    await prisma.$executeRawUnsafe(`DELETE FROM public.skills WHERE id = $1`, idNum)

    return NextResponse.json({ message: 'Skill deleted successfully' })
  } catch (error) {
    console.error('Error deleting skill:', error)
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 })
  }
}
