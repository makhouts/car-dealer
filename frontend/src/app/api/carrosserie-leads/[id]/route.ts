import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Disable caching for this route
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const lead = await prisma.carrosserieLead.update({
      where: { id },
      data: { handled: body.handled },
    })

    return NextResponse.json(lead)
  } catch (error) {
    console.error('Carrosserie lead update error:', error)
    return NextResponse.json({ error: 'Failed to update carrosserie lead' }, { status: 400 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.carrosserieLead.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Carrosserie lead deletion error:', error)
    return NextResponse.json({ error: 'Failed to delete carrosserie lead' }, { status: 500 })
  }
}
