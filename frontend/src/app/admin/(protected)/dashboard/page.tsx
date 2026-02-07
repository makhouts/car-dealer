import { prisma } from '@/lib/prisma'
import { AdminSidebar } from '../components/admin-sidebar'
import { Car, MessageSquare, DollarSign, TrendingUp, Clock, Trash2, ExternalLink } from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  try {
    const [totalCars, availableCars, soldCars, totalLeads, newLeads] = await Promise.all([
      prisma.car.count(),
      prisma.car.count({ where: { status: 'available' } }),
      prisma.car.count({ where: { status: 'sold' } }),
      prisma.lead.count(),
      prisma.lead.count({ where: { handled: false } }),
    ])
    return { totalCars, availableCars, soldCars, totalLeads, newLeads }
  } catch {
    return { totalCars: 0, availableCars: 0, soldCars: 0, totalLeads: 0, newLeads: 0 }
  }
}

async function getRecentCars() {
  try {
    return await prisma.car.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    return []
  }
}

async function getRecentLeads() {
  try {
    return await prisma.lead.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { car: true },
    })
  } catch {
    return []
  }
}

async function getSoldCarsWithCountdown() {
  try {
    // First try to get sold cars with soldAt - if field doesn't exist, this will throw
    const soldCars = await prisma.car.findMany({
      where: {
        status: 'sold',
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    // Filter to only cars that have soldAt
    const carsWithSoldAt = soldCars.filter(car => car.soldAt)
    
    if (carsWithSoldAt.length === 0) {
      return []
    }

    const now = new Date()
    const threeDaysInMs = 3 * 24 * 60 * 60 * 1000

    return carsWithSoldAt.map(car => {
      const soldAt = car.soldAt ? new Date(car.soldAt) : now
      const deleteAt = new Date(soldAt.getTime() + threeDaysInMs)
      const remainingMs = deleteAt.getTime() - now.getTime()
      const remainingHours = Math.max(0, Math.floor(remainingMs / (1000 * 60 * 60)))
      const remainingDays = Math.floor(remainingHours / 24)
      const hours = remainingHours % 24

      return {
        ...car,
        remainingText: remainingMs <= 0 
          ? 'Wordt verwijderd...' 
          : remainingDays > 0 
            ? `${remainingDays}d ${hours}u` 
            : `${hours}u`,
        isOverdue: remainingMs <= 0,
        isUrgent: remainingMs > 0 && remainingMs < 24 * 60 * 60 * 1000, // Less than 24 hours
      }
    })
  } catch (error) {
    console.log('getSoldCarsWithCountdown skipped:', error instanceof Error ? error.message : 'Unknown error')
    return []
  }
}

// Auto cleanup old sold cars - only runs if soldAt field exists
async function cleanupOldSoldCars() {
  try {
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

    // First check if any cars have soldAt field populated
    const carsWithSoldAt = await prisma.car.findFirst({
      where: {
        status: 'sold',
        soldAt: { not: null },
      },
    })

    // Only run cleanup if there are cars with soldAt
    if (carsWithSoldAt) {
      await prisma.car.deleteMany({
        where: {
          status: 'sold',
          soldAt: {
            lte: threeDaysAgo,
          },
        },
      })
    }
  } catch (error) {
    // Silently fail - soldAt field might not exist yet
    console.log('Auto cleanup skipped:', error instanceof Error ? error.message : 'Unknown error')
  }
}

export default async function AdminDashboard() {
  // Run cleanup on dashboard load
  await cleanupOldSoldCars()

  const [stats, recentCars, recentLeads, soldCarsCountdown] = await Promise.all([
    getStats(),
    getRecentCars(),
    getRecentLeads(),
    getSoldCarsWithCountdown(),
  ])

  const statCards = [
    { label: 'Totaal Auto\'s', value: stats.totalCars, icon: Car, color: 'bg-blue-500', href: '/admin/cars' },
    { label: 'Beschikbaar', value: stats.availableCars, icon: TrendingUp, color: 'bg-green-500', href: '/admin/cars' },
    { label: 'Verkocht', value: stats.soldCars, icon: DollarSign, color: 'bg-neutral-500', href: '/admin/cars' },
    { label: 'Nieuwe Leads', value: stats.newLeads, icon: MessageSquare, color: 'bg-red-500', href: '/admin/leads' },
  ]

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Dashboard</h1>
          <p className="text-neutral-600 mb-8">Welkom terug! Hier is een overzicht van je bedrijf.</p>

          {/* Stats - Clickable */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <Link 
                key={index} 
                href={stat.href}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-500 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Sold Cars Countdown Warning */}
          {soldCarsCountdown.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-amber-900">Auto-Delete Countdown</h2>
                  <p className="text-sm text-amber-700">Verkochte auto's worden na 3 dagen automatisch verwijderd</p>
                </div>
              </div>
              <div className="space-y-2">
                {soldCarsCountdown.map((car) => (
                  <Link
                    key={car.id}
                    href="/admin/cars"
                    className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-amber-100/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={car.images[0] || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=100&q=80'}
                        alt={car.title}
                        className="w-12 h-9 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium text-neutral-900">{car.brand} {car.model}</p>
                        <p className="text-xs text-neutral-500">{car.title}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                      car.isOverdue 
                        ? 'bg-red-100 text-red-700' 
                        : car.isUrgent 
                          ? 'bg-red-100 text-red-700 animate-pulse' 
                          : 'bg-amber-100 text-amber-700'
                    }`}>
                      <Clock className="w-4 h-4" />
                      {car.remainingText}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Cars - Clickable */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-neutral-900">Recente Auto's</h2>
                <Link href="/admin/cars" className="text-sm text-neutral-500 hover:text-neutral-900 flex items-center gap-1">
                  Bekijk alle <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="divide-y divide-neutral-100">
                {recentCars.length === 0 ? (
                  <p className="p-6 text-neutral-500 text-center">Nog geen auto's</p>
                ) : (
                  recentCars.map((car) => (
                    <Link 
                      key={car.id} 
                      href="/admin/cars"
                      className="p-4 flex items-center gap-4 hover:bg-neutral-50 cursor-pointer transition-colors"
                    >
                      <img
                        src={car.images[0] || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=100&q=80'}
                        alt={car.title}
                        className="w-16 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-neutral-900 truncate">{car.title}</p>
                        <p className="text-sm text-neutral-500">€{car.price.toLocaleString()}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        car.status === 'available' ? 'bg-green-100 text-green-700' :
                        car.status === 'sold' ? 'bg-neutral-100 text-neutral-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {car.status === 'available' ? 'Beschikbaar' : car.status === 'sold' ? 'Verkocht' : 'Gereserveerd'}
                      </span>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Recent Leads - Clickable */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-neutral-900">Recente Leads</h2>
                <Link href="/admin/leads" className="text-sm text-neutral-500 hover:text-neutral-900 flex items-center gap-1">
                  Bekijk alle <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="divide-y divide-neutral-100">
                {recentLeads.length === 0 ? (
                  <p className="p-6 text-neutral-500 text-center">Nog geen leads</p>
                ) : (
                  recentLeads.map((lead) => (
                    <Link 
                      key={lead.id} 
                      href="/admin/leads"
                      className="p-4 hover:bg-neutral-50 block cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-neutral-900">{lead.name}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          lead.handled ? 'bg-neutral-100 text-neutral-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {lead.handled ? 'Afgehandeld' : 'Nieuw'}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-500 truncate">{lead.message}</p>
                      <p className="text-xs text-neutral-400 mt-1">{lead.email}</p>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
