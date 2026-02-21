import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { carrosserieLeadSchema } from '@/lib/validations'

// Disable caching for this route
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const handled = searchParams.get('handled')

    const where: Record<string, unknown> = {}
    if (handled === 'true') where.handled = true
    if (handled === 'false') where.handled = false

    const leads = await prisma.carrosserieLead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(leads)
  } catch (error) {
    console.error('Carrosserie leads fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch carrosserie leads' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Remove honeypot from body
    const { honeypot, ...bodyWithoutHoneypot } = body
    
    // Check honeypot
    if (honeypot) {
      return NextResponse.json({ error: 'Spam detected' }, { status: 400 })
    }
    
    const validated = carrosserieLeadSchema.parse(bodyWithoutHoneypot)

    const lead = await prisma.carrosserieLead.create({
      data: validated,
    })

    return NextResponse.json(lead, { status: 201 })
  } catch (error) {
    console.error('Carrosserie lead creation error:', error)
    return NextResponse.json({ error: 'Failed to create carrosserie lead' }, { status: 400 })
  }
}
