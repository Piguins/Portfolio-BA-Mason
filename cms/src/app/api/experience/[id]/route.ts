import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Get experience by ID (with bullets from experience_bullets)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const result = await prisma.$queryRawUnsafe(
      `SELECT
        e.id,
        e.company,
        e.role,
        e.location,
        e.start_date,
        e.end_date,
        e.is_current,
        e.description,
        e.created_at,
        e.updated_at,
        e.skills_text,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('id', eb.id, 'text', eb.text)) 
          FILTER (WHERE eb.id IS NOT NULL),
          '[]'
        ) AS bullets
       FROM public.experience e
       LEFT JOIN public.experience_bullets eb ON eb.experience_id = e.id
       WHERE e.id = $1::uuid
       GROUP BY e.id, e.company, e.role, e.location, e.start_date, e.end_date, 
                e.is_current, e.description, e.created_at, e.updated_at, e.skills_text`,
      id
    )

    const experience = Array.isArray(result) ? result[0] : result

    if (!experience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 })
    }

    return NextResponse.json(experience)
  } catch (error) {
    console.error('Error fetching experience:', error)
    return NextResponse.json({ error: 'Failed to fetch experience' }, { status: 500 })
  }
}

// PUT - Update experience (with bullets in experience_bullets table)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const {
      company,
      role,
      location,
      start_date,
      end_date,
      is_current,
      description,
      bullets = [],
      skills_text = [],
    } = body

    if (!company || !role || !start_date) {
      return NextResponse.json(
        { error: 'Company, role, and start_date are required' },
        { status: 400 }
      )
    }

    // Use transaction
    const experience = await prisma.$transaction(async (tx) => {
      // Update experience
      await tx.$executeRawUnsafe(
        `UPDATE public.experience 
         SET company = $1, role = $2, location = $3, start_date = $4, 
             end_date = $5, is_current = $6, description = $7,
             skills_text = $8::text[], updated_at = NOW()
         WHERE id = $9::uuid`,
        company,
        role,
        location || null,
        start_date,
        end_date || null,
        is_current || false,
        description || null,
        Array.isArray(skills_text) ? skills_text : [],
        id
      )

      // Delete old bullets
      await tx.$executeRawUnsafe(
        `DELETE FROM public.experience_bullets WHERE experience_id = $1::uuid`,
        id
      )

      // Insert new bullets
      if (bullets.length > 0) {
        for (const bullet of bullets) {
          await tx.$executeRawUnsafe(
            `INSERT INTO public.experience_bullets (experience_id, text) VALUES ($1::uuid, $2)`,
            id,
            bullet.text || bullet
          )
        }
      }

      // Return full experience with bullets
      const fullExp = await tx.$queryRawUnsafe(
        `SELECT
          e.*,
          COALESCE(
            json_agg(DISTINCT jsonb_build_object('id', eb.id, 'text', eb.text)) 
            FILTER (WHERE eb.id IS NOT NULL),
            '[]'
          ) AS bullets
         FROM public.experience e
         LEFT JOIN public.experience_bullets eb ON eb.experience_id = e.id
         WHERE e.id = $1::uuid
         GROUP BY e.id`,
        id
      )

      return Array.isArray(fullExp) ? fullExp[0] : fullExp
    })

    return NextResponse.json(experience)
  } catch (error) {
    console.error('Error updating experience:', error)
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 })
  }
}

// DELETE - Delete experience (cascades to experience_bullets)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Use transaction to delete bullets first, then experience
    await prisma.$transaction(async (tx) => {
      await tx.$executeRawUnsafe(
        `DELETE FROM public.experience_bullets WHERE experience_id = $1::uuid`,
        id
      )
      await tx.$executeRawUnsafe(`DELETE FROM public.experience WHERE id = $1::uuid`, id)
    })

    return NextResponse.json({ message: 'Experience deleted successfully' })
  } catch (error) {
    console.error('Error deleting experience:', error)
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 })
  }
}
