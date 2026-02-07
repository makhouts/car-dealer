import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// This endpoint cleans up cars that have been sold for more than 3 days
// Can be called manually or via a cron job
export async function POST() {
  try {
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

    const result = await prisma.car.deleteMany({
      where: {
        status: 'sold',
        soldAt: {
          lte: threeDaysAgo,
        },
      },
    })

    return NextResponse.json({
      success: true,
      deleted: result.count,
      message: `${result.count} sold car(s) older than 3 days have been deleted`,
    })
  } catch (error) {
    console.error('Cleanup error:', error)
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 })
  }
}

// GET to check which cars are pending deletion
export async function GET() {
  try {
    const soldCars = await prisma.car.findMany({
      where: {
        status: 'sold',
        soldAt: { not: null },
      },
      select: {
        id: true,
        brand: true,
        model: true,
        title: true,
        soldAt: true,
      },
      orderBy: { soldAt: 'asc' },
    })

    const now = new Date()
    const threeDaysInMs = 3 * 24 * 60 * 60 * 1000

    const carsWithCountdown = soldCars.map(car => {
      const soldAt = car.soldAt ? new Date(car.soldAt) : now
      const deleteAt = new Date(soldAt.getTime() + threeDaysInMs)
      const remainingMs = deleteAt.getTime() - now.getTime()
      const remainingHours = Math.max(0, Math.floor(remainingMs / (1000 * 60 * 60)))
      const remainingDays = Math.floor(remainingHours / 24)
      const hours = remainingHours % 24

      return {
        ...car,
        deleteAt,
        remainingMs,
        remainingText: remainingMs <= 0 
          ? 'Wordt verwijderd...' 
          : remainingDays > 0 
            ? `${remainingDays}d ${hours}u` 
            : `${hours}u`,
        isOverdue: remainingMs <= 0,
      }
    })

    return NextResponse.json(carsWithCountdown)
  } catch (error) {
    console.error('Cleanup check error:', error)
    return NextResponse.json({ error: 'Failed to check cleanup status' }, { status: 500 })
  }
}
