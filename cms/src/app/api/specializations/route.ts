import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Get all specializations (uses specializations table)
export async function GET() {
  try {
    const result = await prisma.$queryRawUnsafe(`
      SELECT id, number, title, description, icon_url, created_at, updated_at
      FROM public.specializations
      ORDER BY id ASC
    `)

    const specializations = Array.isArray(result) ? result : [result]
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
    const { number, title, description, icon_url } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const result = await prisma.$executeRawUnsafe(
      `INSERT INTO public.specializations (number, title, description, icon_url)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      number || null,
      title,
      description || null,
      icon_url || null
    )

    const specialization = Array.isArray(result) ? result[0] : result
    return NextResponse.json(specialization, { status: 201 })
  } catch (error) {
    console.error('Error creating specialization:', error)
    return NextResponse.json({ error: 'Failed to create specialization' }, { status: 500 })
  }
}
