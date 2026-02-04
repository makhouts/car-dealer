import { prisma } from '@/lib/prisma'
import { AdminSidebar } from './components/admin-sidebar'
import { Car, MessageSquare, DollarSign, TrendingUp } from 'lucide-react'

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

export default async function AdminDashboard() {
  const [stats, recentCars, recentLeads] = await Promise.all([
    getStats(),
    getRecentCars(),
    getRecentLeads(),
  ])

  const statCards = [
    { label: 'Total Cars', value: stats.totalCars, icon: Car, color: 'bg-blue-500' },
    { label: 'Available', value: stats.availableCars, icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Sold', value: stats.soldCars, icon: DollarSign, color: 'bg-neutral-500' },
    { label: 'New Leads', value: stats.newLeads, icon: MessageSquare, color: 'bg-red-500' },
  ]

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Dashboard</h1>
          <p className="text-neutral-600 mb-8">Welcome back! Here's an overview of your dealership.</p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-500 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Cars */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-neutral-100">
                <h2 className="text-lg font-semibold text-neutral-900">Recent Cars</h2>
              </div>
              <div className="divide-y divide-neutral-100">
                {recentCars.length === 0 ? (
                  <p className="p-6 text-neutral-500 text-center">No cars yet</p>
                ) : (
                  recentCars.map((car) => (
                    <div key={car.id} className="p-4 flex items-center gap-4 hover:bg-neutral-50">
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
                        {car.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Leads */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-neutral-100">
                <h2 className="text-lg font-semibold text-neutral-900">Recent Leads</h2>
              </div>
              <div className="divide-y divide-neutral-100">
                {recentLeads.length === 0 ? (
                  <p className="p-6 text-neutral-500 text-center">No leads yet</p>
                ) : (
                  recentLeads.map((lead) => (
                    <div key={lead.id} className="p-4 hover:bg-neutral-50">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-neutral-900">{lead.name}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          lead.handled ? 'bg-neutral-100 text-neutral-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {lead.handled ? 'Handled' : 'New'}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-500 truncate">{lead.message}</p>
                      <p className="text-xs text-neutral-400 mt-1">{lead.email}</p>
                    </div>
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
