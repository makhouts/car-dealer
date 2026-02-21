'use client'

import { useState, useEffect } from 'react'
import { AdminSidebar } from '../components/admin-sidebar'
import { Button } from '@/components/ui/button'
import { Wrench, Mail, Phone, Car, MessageSquare, Check, X, Trash2, Filter } from 'lucide-react'
import { toast } from 'sonner'

interface CarrosserieLead {
  id: string
  name: string
  email: string
  phone: string
  chassisNumber: string
  serviceType: string
  message?: string
  handled: boolean
  createdAt: string
}

type FilterType = 'all' | 'new' | 'handled'

export default function AdminCarrosserieLeadsPage() {
  const [leads, setLeads] = useState<CarrosserieLead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/carrosserie-leads', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      })
      if (res.ok) {
        setLeads(await res.json())
      }
    } catch (error) {
      console.error('Failed to fetch carrosserie leads:', error)
      toast.error('Kon leads niet laden')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const handleToggleHandled = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/carrosserie-leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handled: !currentStatus }),
      })

      if (res.ok) {
        toast.success(currentStatus ? 'Gemarkeerd als nieuw' : 'Gemarkeerd als afgehandeld')
        fetchLeads()
      } else {
        throw new Error()
      }
    } catch {
      toast.error('Status wijzigen mislukt')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je deze carrosserie lead wilt verwijderen?')) return

    try {
      const res = await fetch(`/api/carrosserie-leads/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Carrosserie lead verwijderd')
        fetchLeads()
      } else {
        throw new Error()
      }
    } catch {
      toast.error('Verwijderen mislukt')
    }
  }

  const filteredLeads = leads.filter((lead) => {
    if (filter === 'new') return !lead.handled
    if (filter === 'handled') return lead.handled
    return true
  })

  const counts = {
    all: leads.length,
    new: leads.filter((l) => !l.handled).length,
    handled: leads.filter((l) => l.handled).length,
  }

  const filters = [
    { key: 'all' as FilterType, label: 'Alle Aanvragen', count: counts.all, color: 'text-neutral-600 bg-neutral-50' },
    { key: 'new' as FilterType, label: 'Nieuwe Aanvragen', count: counts.new, color: 'text-[#B5946A] bg-[#B5946A]/10' },
    { key: 'handled' as FilterType, label: 'Afgehandeld', count: counts.handled, color: 'text-green-600 bg-green-50' },
  ]

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Zojuist'
    if (diffMins < 60) return `${diffMins} min geleden`
    if (diffHours < 24) return `${diffHours} uur geleden`
    if (diffDays === 1) return 'Gisteren'
    return `${diffDays} dagen geleden`
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <AdminSidebar />
      
      <main className="flex-1 p-8 ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Wrench className="w-8 h-8 text-[#B5946A]" />
              <h1 className="text-3xl font-bold text-neutral-900">Carrosserie Aanvragen</h1>
            </div>
            <p className="text-neutral-600">Beheer alle aanvragen voor onderhoud en herstellingen</p>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-8">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all ${
                  filter === f.key
                    ? `${f.color} shadow-sm`
                    : 'bg-white hover:bg-neutral-50 text-neutral-600'
                }`}
              >
                <Filter className="w-5 h-5" />
                <span className="font-medium">{f.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  filter === f.key ? 'bg-white/50' : 'bg-neutral-100'
                }`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          {/* Leads List */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-neutral-500">Laden...</p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl">
              <Wrench className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500 text-lg">Geen carrosserie aanvragen gevonden</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition-all hover:shadow-md ${
                    !lead.handled ? 'border-[#B5946A]/20' : 'border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-neutral-900">{lead.name}</h3>
                        {!lead.handled && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#B5946A] text-white animate-pulse">
                            NIEUW
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-500">
                        <span className={!lead.handled ? 'text-[#B5946A] font-medium' : ''}>
                          {getTimeAgo(lead.createdAt)}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleHandled(lead.id, lead.handled)}
                        className={`p-2 rounded-lg transition-colors ${
                          lead.handled
                            ? 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100'
                            : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                        }`}
                        title={lead.handled ? 'Markeer als nieuw' : 'Markeer als afgehandeld'}
                      >
                        {lead.handled ? <X className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                        title="Verwijderen"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-3 text-neutral-700">
                      <Mail className="w-4 h-4 text-neutral-400" />
                      <a href={`mailto:${lead.email}`} className="hover:text-[#B5946A]">
                        {lead.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-3 text-neutral-700">
                      <Phone className="w-4 h-4 text-neutral-400" />
                      <a href={`tel:${lead.phone}`} className="hover:text-[#B5946A]">
                        {lead.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-3 text-neutral-700 font-mono">
                      <Car className="w-4 h-4 text-neutral-400" />
                      <span className="font-semibold">{lead.chassisNumber}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Wrench className="w-4 h-4 text-neutral-400" />
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#B5946A]/10 text-[#B5946A] capitalize">
                        {lead.serviceType}
                      </span>
                    </div>
                  </div>
                      <span className="font-semibold">{lead.chassisNumber}</span>
                    </div>
                  </div>

                  {lead.message && (
                    <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                      <div className="flex items-start gap-2 text-neutral-700">
                        <MessageSquare className="w-4 h-4 text-neutral-400 mt-1 flex-shrink-0" />
                        <p className="text-sm leading-relaxed">{lead.message}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
