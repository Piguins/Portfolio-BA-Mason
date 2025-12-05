import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { corsHeaders, corsOptionsHandler } from '@/middleware/cors'

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return corsOptionsHandler(request)
}

// GET - Get all experiences (with bullets from experience_bullets)
export async function GET(request: NextRequest) {
  try {
    const result = await prisma.$queryRawUnsafe(`
      SELECT
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
          json_agg(DISTINCT jsonb_build_object(
            'id', eb.id,
            'text', eb.text
          )) FILTER (WHERE eb.id IS NOT NULL),
          '[]'
        ) AS bullets
      FROM public.experience e
      LEFT JOIN public.experience_bullets eb ON eb.experience_id = e.id
      GROUP BY e.id, e.company, e.role, e.location, e.start_date, e.end_date, 
               e.is_current, e.description, e.created_at, e.updated_at, e.skills_text
      ORDER BY e.start_date DESC
    `)

    const experiences = Array.isArray(result) ? result : [result]
    return NextResponse.json(experiences, { headers: corsHeaders(request) })
  } catch (error) {
    console.error('Error fetching experiences:', error)
    return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 })
  }
}

// POST - Create experience (with bullets in experience_bullets table)
export async function POST(request: NextRequest) {
  try {
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

    // Use transaction for atomicity
    const experience = await prisma.$transaction(async (tx) => {
      // Insert experience and get ID
      const expResult = await tx.$queryRawUnsafe(
        `INSERT INTO public.experience 
         (company, role, location, start_date, end_date, is_current, description, skills_text)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8::text[])
         RETURNING id`,
        company,
        role,
        location || null,
        start_date,
        end_date || null,
        is_current || false,
        description || null,
        Array.isArray(skills_text) ? skills_text : []
      )

      const exp = Array.isArray(expResult) ? expResult[0] : expResult
      const expId = (exp as any).id

      // Insert bullets
      if (bullets.length > 0) {
        for (const bullet of bullets) {
          await tx.$executeRawUnsafe(
            `INSERT INTO public.experience_bullets (experience_id, text) VALUES ($1::uuid, $2)`,
            expId,
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
        expId
      )

      return Array.isArray(fullExp) ? fullExp[0] : fullExp
    })

    return NextResponse.json(experience, { 
      status: 201,
      headers: corsHeaders(request)
    })
  } catch (error) {
    console.error('Error creating experience:', error)
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 })
  }
}
