import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { carSchema } from '@/lib/validations'
import { generateSlug } from '@/lib/utils'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const car = await prisma.car.findUnique({ where: { id } })

    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 })
    }

    return NextResponse.json(car)
  } catch (error) {
    console.error('Car fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch car' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validated = carSchema.parse(body)

    const slug = generateSlug(validated.brand, validated.model, validated.year, validated.title)

    const car = await prisma.car.update({
      where: { id },
      data: {
        ...validated,
        slug,
      },
    })

    return NextResponse.json(car)
  } catch (error) {
    console.error('Car update error:', error)
    return NextResponse.json({ error: 'Failed to update car' }, { status: 400 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.car.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Car deletion error:', error)
    return NextResponse.json({ error: 'Failed to delete car' }, { status: 500 })
  }
}
