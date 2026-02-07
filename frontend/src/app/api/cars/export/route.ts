import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const cars = await prisma.car.findMany({
      orderBy: { createdAt: 'desc' },
    })

    // CSV Headers
    const headers = [
      'id',
      'shortId',
      'title',
      'brand',
      'model',
      'year',
      'price',
      'mileage',
      'fuelType',
      'transmission',
      'bodyType',
      'condition',
      'colorExterior',
      'colorInterior',
      'powerHP',
      'engine',
      'drivetrain',
      'seats',
      'doors',
      'features',
      'description',
      'images',
      'isFeatured',
      'status',
    ]

    // Convert cars to CSV rows
    const rows = cars.map(car => {
      return [
        car.id,
        car.shortId,
        `"${(car.title || '').replace(/"/g, '""')}"`,
        `"${(car.brand || '').replace(/"/g, '""')}"`,
        `"${(car.model || '').replace(/"/g, '""')}"`,
        car.year,
        car.price,
        car.mileage,
        car.fuelType,
        car.transmission,
        car.bodyType,
        car.condition,
        `"${(car.colorExterior || '').replace(/"/g, '""')}"`,
        `"${(car.colorInterior || '').replace(/"/g, '""')}"`,
        car.powerHP || '',
        `"${(car.engine || '').replace(/"/g, '""')}"`,
        car.drivetrain || '',
        car.seats || '',
        car.doors || '',
        `"${(car.features || []).join(', ')}"`,
        `"${(car.description || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
        `"${(car.images || []).join(', ')}"`,
        car.isFeatured ? 'true' : 'false',
        car.status,
      ].join(',')
    })

    const csv = [headers.join(','), ...rows].join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="cars-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}
