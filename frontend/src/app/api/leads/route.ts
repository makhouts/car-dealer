import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { leadSchema } from '@/lib/validations'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = leadSchema.parse(body)

    // Check honeypot
    if (validated.honeypot && validated.honeypot.length > 0) {
      return NextResponse.json({ success: true }) // Pretend success for bots
    }

    const lead = await prisma.lead.create({
      data: {
        name: validated.name,
        email: validated.email,
        phone: validated.phone || null,
        message: validated.message,
        carId: validated.carId || null,
      },
    })

    return NextResponse.json({ success: true, id: lead.id })
  } catch (error) {
    console.error('Lead creation error:', error)
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 400 })
  }
}

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      include: { car: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(leads)
  } catch (error) {
    console.error('Lead fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
  }
}
