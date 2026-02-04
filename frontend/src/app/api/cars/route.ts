import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { carSchema } from '@/lib/validations'
import { generateShortId, generateSlug } from '@/lib/utils'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const status = searchParams.get('status')

    const where: Record<string, unknown> = {}
    if (featured === 'true') where.isFeatured = true
    if (status) where.status = status

    const cars = await prisma.car.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(cars)
  } catch (error) {
    console.error('Cars fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = carSchema.parse(body)

    const shortId = generateShortId()
    const slug = generateSlug(validated.brand, validated.model, validated.year, validated.title)

    const car = await prisma.car.create({
      data: {
        ...validated,
        shortId,
        slug,
      },
    })

    return NextResponse.json(car, { status: 201 })
  } catch (error) {
    console.error('Car creation error:', error)
    return NextResponse.json({ error: 'Failed to create car' }, { status: 400 })
  }
}
