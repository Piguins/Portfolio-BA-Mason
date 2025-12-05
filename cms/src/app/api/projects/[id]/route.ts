import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Get project by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const result = await prisma.$queryRawUnsafe(
      `SELECT * FROM public.projects WHERE id = $1::uuid`,
      id
    )

    const project = Array.isArray(result) ? result[0] : result

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 })
  }
}

// PUT - Update project
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { title, summary, hero_image_url, case_study_url, tags_text } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    await prisma.$executeRawUnsafe(
      `UPDATE public.projects
       SET title = $1, summary = $2, hero_image_url = $3, case_study_url = $4,
           tags_text = $5::text[], updated_at = NOW()
       WHERE id = $6::uuid`,
      title,
      summary || null,
      hero_image_url || null,
      case_study_url || null,
      tags_text || [],
      id
    )

    const project = await prisma.$queryRawUnsafe(
      `SELECT * FROM public.projects WHERE id = $1::uuid`,
      id
    )

    return NextResponse.json(Array.isArray(project) ? project[0] : project)
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

// DELETE - Delete project
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    await prisma.$executeRawUnsafe(`DELETE FROM public.projects WHERE id = $1::uuid`, id)

    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
