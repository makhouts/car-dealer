import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { carSchema } from '@/lib/validations'
import { generateSlug } from '@/lib/utils'

// Disable caching for this route
export const dynamic = 'force-dynamic'
export const revalidate = 0

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
    
    // Remove soldAt from body if present (we'll handle it separately)
    const { soldAt: _ignoreSoldAt, ...bodyWithoutSoldAt } = body
    
    const validated = carSchema.parse(bodyWithoutSoldAt)
    const slug = generateSlug(validated.brand, validated.model, validated.year, validated.title)

    // Get current car to check status change
    const currentCar = await prisma.car.findUnique({ where: { id } })
    
    // Build update data
    const updateData: Record<string, unknown> = {
      ...validated,
      slug,
    }
    
    // Handle soldAt based on status change
    if (validated.status === 'sold' && currentCar?.status !== 'sold') {
      // Status changed TO sold - set soldAt
      updateData.soldAt = new Date()
    } else if (validated.status !== 'sold' && currentCar?.status === 'sold') {
      // Status changed FROM sold - clear soldAt
      updateData.soldAt = null
    }
    // If status didn't change, don't touch soldAt

    const car = await prisma.car.update({
      where: { id },
      data: updateData,
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
