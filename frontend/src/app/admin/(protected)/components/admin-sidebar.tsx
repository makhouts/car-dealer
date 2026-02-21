'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Car, MessageSquare, Wrench, LogOut, ExternalLink } from 'lucide-react'
import { useState, useEffect } from 'react'

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [leadCounts, setLeadCounts] = useState({ leads: 0, carrosserie: 0 })

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [leadsRes, carrosserieRes] = await Promise.all([
          fetch('/api/leads', { cache: 'no-store' }),
          fetch('/api/carrosserie-leads', { cache: 'no-store' }),
        ])

        if (leadsRes.ok && carrosserieRes.ok) {
          const leads = await leadsRes.json()
          const carrosserie = await carrosserieRes.json()

          setLeadCounts({
            leads: leads.filter((l: any) => !l.handled).length,
            carrosserie: carrosserie.filter((l: any) => !l.handled).length,
          })
        }
      } catch (error) {
        console.error('Failed to fetch lead counts:', error)
      }
    }

    fetchCounts()
    // Refresh counts every 30 seconds
    const interval = setInterval(fetchCounts, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/cars', label: 'Cars', icon: Car },
    { href: '/admin/leads', label: 'Leads', icon: MessageSquare, count: leadCounts.leads },
    { href: '/admin/carrosserie', label: 'Carrosserie', icon: Wrench, count: leadCounts.carrosserie },
  ]

  return (
    <aside className="w-64 bg-neutral-900 min-h-screen p-6 flex flex-col fixed left-0 top-0">
      <Link href="/admin/dashboard" className="text-2xl font-bold text-white tracking-tight mb-10">
        CARCITY
      </Link>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${isActive
                ? 'bg-white/10 text-white'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="flex-1">{item.label}</span>
              {item.count !== undefined && item.count > 0 && (
                <span className="flex items-center justify-center min-w-[24px] h-6 px-2 bg-[#B5946A] text-white text-xs font-bold rounded-full">
                  {item.count}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ExternalLink className="w-5 h-5" />
          Home
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  )
}
