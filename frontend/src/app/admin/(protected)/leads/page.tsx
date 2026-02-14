'use client'

import { useState, useEffect } from 'react'
import { AdminSidebar } from '../components/admin-sidebar'
import { TableSkeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { Inbox, CheckCircle2, Mail, Phone, Car, Clock } from 'lucide-react'

interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  handled: boolean
  createdAt: string
  car?: { id: string; title: string; brand: string; model: string }
}

type FilterType = 'all' | 'new' | 'handled'

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('new')
  const [counts, setCounts] = useState({ all: 0, new: 0, handled: 0 })

  useEffect(() => {
    fetchLeads()
  }, [filter])

  useEffect(() => {
    fetchCounts()
  }, [])

  const fetchCounts = async () => {
    try {
      const [allRes, newRes, handledRes] = await Promise.all([
        fetch('/api/leads'),
        fetch('/api/leads?filter=new'),
        fetch('/api/leads?filter=handled'),
      ])
      
      if (allRes.ok && newRes.ok && handledRes.ok) {
        const [all, newLeads, handled] = await Promise.all([
          allRes.json(),
          newRes.json(),
          handledRes.json(),
        ])
        setCounts({
          all: all.length,
          new: newLeads.length,
          handled: handled.length,
        })
      }
    } catch (error) {
      console.error('Failed to fetch counts:', error)
    }
  }

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const url = filter === 'all' ? '/api/leads' : `/api/leads?filter=${filter}`
      const res = await fetch(url)
      if (res.ok) {
        setLeads(await res.json())
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleHandled = async (id: string, handled: boolean) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handled }),
      })
      if (res.ok) {
        toast.success(handled ? 'Gemarkeerd als afgehandeld' : 'Gemarkeerd als nieuw')
        fetchLeads()
        fetchCounts()
      }
    } catch {
      toast.error('Status bijwerken mislukt')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-BE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `${diffDays}d geleden`
    if (diffHours > 0) return `${diffHours}u geleden`
    return 'Zojuist'
  }

  const tabs = [
    { key: 'new' as FilterType, label: 'Nieuwe Leads', icon: Inbox, count: counts.new, color: 'text-red-600 bg-red-50' },
    { key: 'handled' as FilterType, label: 'Afgehandeld', icon: CheckCircle2, count: counts.handled, color: 'text-green-600 bg-green-50' },
    { key: 'all' as FilterType, label: 'Alle Leads', icon: Mail, count: counts.all, color: 'text-neutral-600 bg-neutral-100' },
  ]

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900">Leads</h1>
            <p className="text-neutral-600">Beheer klantaanvragen</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 mb-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = filter === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive
                      ? 'bg-white shadow-sm text-neutral-900'
                      : 'bg-transparent text-neutral-500 hover:bg-white/50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-neutral-700' : ''}`} />
                  <span>{tab.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${tab.color}`}>
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Leads List */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-6"><TableSkeleton /></div>
            ) : leads.length === 0 ? (
              <div className="p-12 text-center">
                <Inbox className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-500">
                  {filter === 'new' && 'Geen nieuwe leads'}
                  {filter === 'handled' && 'Geen afgehandelde leads'}
                  {filter === 'all' && 'Nog geen leads'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {leads.map((lead) => (
                  <div key={lead.id} className={`p-6 hover:bg-neutral-50 transition-colors ${!lead.handled ? 'bg-red-50/30' : ''}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-neutral-900">{lead.name}</h3>
                          {!lead.handled && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 animate-pulse">
                              Nieuw
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-500">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatDate(lead.createdAt)}</span>
                          <span className="text-neutral-400">•</span>
                          <span className={!lead.handled ? 'text-red-600 font-medium' : ''}>{getTimeAgo(lead.createdAt)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleHandled(lead.id, !lead.handled)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          lead.handled
                            ? 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                            : 'bg-green-500 text-white hover:bg-green-600 shadow-sm'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {lead.handled ? 'Markeer als Nieuw' : 'Markeer als Afgehandeld'}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm mb-3">
                      <a 
                        href={`mailto:${lead.email}`} 
                        className="flex items-center gap-1.5 text-neutral-600 hover:text-neutral-900 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        {lead.email}
                      </a>
                      {lead.phone && (
                        <a 
                          href={`tel:${lead.phone}`} 
                          className="flex items-center gap-1.5 text-neutral-600 hover:text-neutral-900 transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                          {lead.phone}
                        </a>
                      )}
                    </div>

                    <div className="bg-neutral-50 rounded-lg p-4 mb-3">
                      <p className="text-neutral-700 whitespace-pre-wrap">{lead.message}</p>
                    </div>

                    {lead.car && (
                      <a 
                        href={`/admin/cars`}
                        className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
                      >
                        <Car className="w-4 h-4" />
                        Geïnteresseerd in: 
                        <span className="font-medium text-neutral-700">
                          {lead.car.title || `${lead.car.brand} ${lead.car.model}`}
                        </span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
