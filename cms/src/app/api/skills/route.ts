import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Get all skills
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const highlight = searchParams.get('highlight')

    let query = `
      SELECT
        id,
        name,
        slug,
        category,
        level,
        icon_url,
        description,
        order_index,
        is_highlight,
        created_at,
        updated_at
      FROM public.skills
      WHERE 1=1
    `
    const params: any[] = []
    let paramIndex = 1

    if (category) {
      query += ` AND category = $${paramIndex}`
      params.push(category)
      paramIndex++
    }

    if (highlight !== null && highlight !== undefined) {
      query += ` AND is_highlight = $${paramIndex}`
      params.push(highlight === 'true')
      paramIndex++
    }

    query += ` ORDER BY order_index ASC, name ASC`

    const result = await prisma.$queryRawUnsafe(query, ...params)
    const skills = Array.isArray(result) ? result : [result]

    return NextResponse.json(skills)
  } catch (error) {
    console.error('Error fetching skills:', error)
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 })
  }
}

// POST - Create skill
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, category, level, icon_url, description, order_index, is_highlight } = body

    if (!name || !category) {
      return NextResponse.json({ error: 'Name and category are required' }, { status: 400 })
    }

    const result = await prisma.$executeRawUnsafe(
      `INSERT INTO public.skills (name, slug, category, level, icon_url, description, order_index, is_highlight)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      name,
      slug || null,
      category,
      level || null,
      icon_url || null,
      description || null,
      order_index || 0,
      is_highlight || false
    )

    const skill = Array.isArray(result) ? result[0] : result
    return NextResponse.json(skill, { status: 201 })
  } catch (error) {
    console.error('Error creating skill:', error)
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 })
  }
}
