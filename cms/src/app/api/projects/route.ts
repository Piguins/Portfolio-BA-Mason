import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Get all projects (uses projects table)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published')

    // Use raw query to access projects table
    const result = await prisma.$queryRawUnsafe(`
      SELECT
        id,
        title,
        summary,
        hero_image_url,
        case_study_url,
        tags_text,
        created_at,
        updated_at
      FROM public.projects
      ORDER BY created_at DESC
    `)

    const projects = Array.isArray(result) ? result : [result]
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

// POST - Create project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, summary, hero_image_url, case_study_url, tags_text } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    await prisma.$executeRawUnsafe(
      `INSERT INTO public.projects (title, summary, hero_image_url, case_study_url, tags_text)
       VALUES ($1, $2, $3, $4, $5::text[])
       RETURNING *`,
      title,
      summary || null,
      hero_image_url || null,
      case_study_url || null,
      tags_text || []
    )

    const project = await prisma.$queryRawUnsafe(
      `SELECT * FROM public.projects WHERE id = (SELECT id FROM public.projects ORDER BY created_at DESC LIMIT 1)`
    )

    return NextResponse.json(Array.isArray(project) ? project[0] : project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
