'use client'

import { useState, useEffect } from 'react'
import { AdminSidebar } from '../components/admin-sidebar'
import { TableSkeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  handled: boolean
  createdAt: string
  car?: { title: string; brand: string; model: string }
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads')
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
        toast.success('Status updated!')
        fetchLeads()
      }
    } catch {
      toast.error('Failed to update status')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900">Leads</h1>
            <p className="text-neutral-600">Manage customer inquiries</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-6"><TableSkeleton /></div>
            ) : leads.length === 0 ? (
              <p className="p-12 text-center text-neutral-500">No leads yet</p>
            ) : (
              <div className="divide-y divide-neutral-100">
                {leads.map((lead) => (
                  <div key={lead.id} className="p-6 hover:bg-neutral-50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-neutral-900">{lead.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            lead.handled ? 'bg-neutral-100 text-neutral-600' : 'bg-red-100 text-red-700'
                          }`}>
                            {lead.handled ? 'Handled' : 'New'}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-500">{formatDate(lead.createdAt)}</p>
                      </div>
                      <button
                        onClick={() => toggleHandled(lead.id, !lead.handled)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          lead.handled
                            ? 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {lead.handled ? 'Mark as New' : 'Mark as Handled'}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-neutral-600 mb-3">
                      <a href={`mailto:${lead.email}`} className="hover:text-neutral-900">{lead.email}</a>
                      {lead.phone && <a href={`tel:${lead.phone}`} className="hover:text-neutral-900">{lead.phone}</a>}
                    </div>

                    <div className="bg-neutral-50 rounded-lg p-4 mb-3">
                      <p className="text-neutral-700">{lead.message}</p>
                    </div>

                    {lead.car && (
                      <div className="text-sm text-neutral-500">
                        Interested in: <span className="font-medium text-neutral-700">{lead.car.title || `${lead.car.brand} ${lead.car.model}`}</span>
                      </div>
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
