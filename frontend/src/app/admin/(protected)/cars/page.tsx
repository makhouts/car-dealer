'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { AdminSidebar } from '../components/admin-sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TableSkeleton } from '@/components/ui/skeleton'
import { Plus, Pencil, Trash2, X, ImagePlus, Upload, Link as LinkIcon, CheckCircle, Clock, XCircle, Download, FileUp } from 'lucide-react'
import { toast } from 'sonner'

interface Car {
  id: string
  shortId: string
  title: string
  brand: string
  model: string
  year: number
  price: number
  mileage: number
  fuelType: string
  transmission: string
  bodyType: string
  condition: string
  colorExterior: string
  colorInterior?: string
  powerHP?: number
  engine?: string
  drivetrain?: string
  seats?: number
  doors?: number
  features: string[]
  description: string
  images: string[]
  isFeatured: boolean
  status: string
  soldAt?: string
}

const FUEL_TYPES = ['petrol', 'diesel', 'hybrid', 'electric', 'other']
const TRANSMISSIONS = ['automatic', 'manual', 'other']
const BODY_TYPES = ['sedan', 'suv', 'coupe', 'hatchback', 'wagon', 'convertible', 'van', 'other']
const CONDITIONS = ['new', 'used']
const STATUSES = ['available', 'reserved', 'sold']

const STATUS_CONFIG = {
  available: { label: 'Beschikbaar', icon: CheckCircle, bg: 'bg-green-100', text: 'text-green-700', hover: 'hover:bg-green-200' },
  reserved: { label: 'Gereserveerd', icon: Clock, bg: 'bg-amber-100', text: 'text-amber-700', hover: 'hover:bg-amber-200' },
  sold: { label: 'Verkocht', icon: XCircle, bg: 'bg-neutral-200', text: 'text-neutral-700', hover: 'hover:bg-neutral-300' },
}

// Calculate time remaining until auto-delete (3 days after soldAt)
function getDeleteCountdown(soldAt?: string): { text: string; isUrgent: boolean } | null {
  if (!soldAt) return null
  
  const soldDate = new Date(soldAt)
  const deleteAt = new Date(soldDate.getTime() + 3 * 24 * 60 * 60 * 1000)
  const now = new Date()
  const remainingMs = deleteAt.getTime() - now.getTime()
  
  if (remainingMs <= 0) {
    return { text: 'Wordt verwijderd...', isUrgent: true }
  }
  
  const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60))
  const remainingDays = Math.floor(remainingHours / 24)
  const hours = remainingHours % 24
  
  const isUrgent = remainingMs < 24 * 60 * 60 * 1000 // Less than 24 hours
  const text = remainingDays > 0 ? `${remainingDays}d ${hours}u` : `${hours}u`
  
  return { text, isUrgent }
}

const emptyCar = {
  title: '',
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  price: 0,
  mileage: 0,
  fuelType: 'petrol',
  transmission: 'automatic',
  bodyType: 'sedan',
  condition: 'used',
  colorExterior: '',
  colorInterior: '',
  powerHP: undefined as number | undefined,
  engine: '',
  drivetrain: '',
  seats: undefined as number | undefined,
  doors: undefined as number | undefined,
  features: [] as string[],
  description: '',
  images: [] as string[],
  isFeatured: false,
  status: 'available',
}

export default function AdminCarsPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const csvInputRef = useRef<HTMLInputElement>(null)
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCar, setEditingCar] = useState<Car | null>(null)
  const [formData, setFormData] = useState(emptyCar)
  const [featureInput, setFeatureInput] = useState('')
  const [imageInput, setImageInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload')
  const [importing, setImporting] = useState(false)

  useEffect(() => {
    fetchCars()
  }, [])

  const fetchCars = async () => {
    try {
      const res = await fetch('/api/cars')
      if (res.ok) {
        setCars(await res.json())
      }
    } catch (error) {
      console.error('Failed to fetch cars:', error)
    } finally {
      setLoading(false)
    }
  }

  const openDialog = (car?: Car) => {
    if (car) {
      setEditingCar(car)
      setFormData({
        title: car.title,
        brand: car.brand,
        model: car.model,
        year: car.year,
        price: car.price,
        mileage: car.mileage,
        fuelType: car.fuelType,
        transmission: car.transmission,
        bodyType: car.bodyType,
        condition: car.condition,
        colorExterior: car.colorExterior,
        colorInterior: car.colorInterior || '',
        powerHP: car.powerHP,
        engine: car.engine || '',
        drivetrain: car.drivetrain || '',
        seats: car.seats,
        doors: car.doors,
        features: car.features,
        description: car.description,
        images: car.images,
        isFeatured: car.isFeatured,
        status: car.status,
      })
    } else {
      setEditingCar(null)
      setFormData(emptyCar)
    }
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setEditingCar(null)
    setFormData(emptyCar)
    setFeatureInput('')
    setImageInput('')
  }

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({ ...formData, features: [...formData.features, featureInput.trim()] })
      setFeatureInput('')
    }
  }

  const removeFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) })
  }

  const addImage = () => {
    if (imageInput.trim()) {
      setFormData({ ...formData, images: [...formData.images, imageInput.trim()] })
      setImageInput('')
    }
  }

  const removeImage = (index: number) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) })
  }

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const formDataUpload = new FormData()
    
    for (let i = 0; i < files.length; i++) {
      formDataUpload.append('files', files[i])
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      })

      if (res.ok) {
        const { urls } = await res.json()
        setFormData({ ...formData, images: [...formData.images, ...urls] })
        toast.success(`${urls.length} foto('s) geüpload!`)
      } else {
        throw new Error()
      }
    } catch {
      toast.error('Upload mislukt')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const url = editingCar ? `/api/cars/${editingCar.id}` : '/api/cars'
      const method = editingCar ? 'PUT' : 'POST'

      // Clean the form data - ensure proper types and remove empty optional fields
      const cleanedData = {
        title: formData.title,
        brand: formData.brand,
        model: formData.model,
        year: Number(formData.year),
        price: Number(formData.price),
        mileage: Number(formData.mileage),
        fuelType: formData.fuelType,
        transmission: formData.transmission,
        bodyType: formData.bodyType,
        condition: formData.condition,
        colorExterior: formData.colorExterior,
        colorInterior: formData.colorInterior || undefined,
        powerHP: formData.powerHP ? Number(formData.powerHP) : undefined,
        engine: formData.engine || undefined,
        drivetrain: formData.drivetrain || undefined,
        seats: formData.seats ? Number(formData.seats) : undefined,
        doors: formData.doors ? Number(formData.doors) : undefined,
        features: formData.features || [],
        description: formData.description,
        images: formData.images || [],
        isFeatured: Boolean(formData.isFeatured),
        status: formData.status,
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData),
      })

      if (res.ok) {
        toast.success(editingCar ? 'Auto bijgewerkt!' : 'Auto toegevoegd!')
        closeDialog()
        fetchCars()
        router.refresh()
      } else {
        throw new Error()
      }
    } catch {
      toast.error('Opslaan mislukt')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je deze auto wilt verwijderen?')) return

    try {
      const res = await fetch(`/api/cars/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Auto verwijderd!')
        fetchCars()
        router.refresh()
      } else {
        throw new Error()
      }
    } catch {
      toast.error('Verwijderen mislukt')
    }
  }

  // Quick status change
  const handleQuickStatusChange = async (carId: string, newStatus: string) => {
    try {
      const car = cars.find(c => c.id === carId)
      if (!car) return

      // Clean the data - remove fields that shouldn't be sent and ensure proper types
      const cleanedData = {
        title: car.title,
        brand: car.brand,
        model: car.model,
        year: Number(car.year),
        price: Number(car.price),
        mileage: Number(car.mileage),
        fuelType: car.fuelType,
        transmission: car.transmission,
        bodyType: car.bodyType,
        condition: car.condition,
        colorExterior: car.colorExterior,
        colorInterior: car.colorInterior || undefined,
        powerHP: car.powerHP ? Number(car.powerHP) : undefined,
        engine: car.engine || undefined,
        drivetrain: car.drivetrain || undefined,
        seats: car.seats ? Number(car.seats) : undefined,
        doors: car.doors ? Number(car.doors) : undefined,
        features: car.features || [],
        description: car.description,
        images: car.images || [],
        isFeatured: Boolean(car.isFeatured),
        status: newStatus,
      }

      const res = await fetch(`/api/cars/${carId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData),
      })

      if (res.ok) {
        toast.success(`Status gewijzigd naar ${STATUS_CONFIG[newStatus as keyof typeof STATUS_CONFIG]?.label || newStatus}`)
        fetchCars()
      } else {
        throw new Error()
      }
    } catch {
      toast.error('Status wijzigen mislukt')
    }
  }

  // Export cars to CSV
  const handleExport = async () => {
    try {
      const res = await fetch('/api/cars/export')
      if (res.ok) {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `cars-export-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success('Export gedownload!')
      } else {
        throw new Error()
      }
    } catch {
      toast.error('Export mislukt')
    }
  }

  // Import cars from CSV
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImporting(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/cars/import', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const result = await res.json()
        toast.success(`${result.imported} auto's geïmporteerd${result.failed > 0 ? `, ${result.failed} mislukt` : ''}`)
        fetchCars()
        router.refresh()
      } else {
        const error = await res.json()
        throw new Error(error.error || 'Import failed')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Import mislukt')
    } finally {
      setImporting(false)
      if (csvInputRef.current) {
        csvInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Auto's</h1>
              <p className="text-neutral-600">Beheer je voorraad</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Import CSV */}
              <input
                ref={csvInputRef}
                type="file"
                accept=".csv"
                onChange={handleImport}
                className="hidden"
                id="csv-import"
              />
              <Button 
                variant="outline" 
                onClick={() => csvInputRef.current?.click()}
                disabled={importing}
                className="gap-2"
              >
                <FileUp className="w-4 h-4" />
                {importing ? 'Importeren...' : 'Import CSV'}
              </Button>
              
              {/* Export CSV */}
              <Button 
                variant="outline" 
                onClick={handleExport}
                className="gap-2"
                disabled={cars.length === 0}
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
              
              {/* Add Car */}
              <Button onClick={() => openDialog()} className="gap-2">
                <Plus className="w-4 h-4" /> Auto Toevoegen
              </Button>
            </div>
          </div>

          {/* Cars Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-6"><TableSkeleton /></div>
            ) : cars.length === 0 ? (
              <p className="p-12 text-center text-neutral-500">Nog geen auto's. Voeg je eerste auto toe!</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    <th className="p-4">Voertuig</th>
                    <th className="p-4">Jaar</th>
                    <th className="p-4">Prijs</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Featured</th>
                    <th className="p-4">Acties</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {cars.map((car) => (
                    <tr key={car.id} className="hover:bg-neutral-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={car.images[0] || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=100&q=80'}
                            alt={car.title}
                            className="w-16 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-medium text-neutral-900">{car.brand}</p>
                            <p className="text-sm text-neutral-500">{car.model}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono">{car.year}</td>
                      <td className="p-4 font-mono text-red-600">€{car.price.toLocaleString()}</td>
                      <td className="p-4">
                        {/* Quick Status Dropdown */}
                        <div className="relative group">
                          <button 
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                              STATUS_CONFIG[car.status as keyof typeof STATUS_CONFIG]?.bg || 'bg-neutral-100'
                            } ${STATUS_CONFIG[car.status as keyof typeof STATUS_CONFIG]?.text || 'text-neutral-700'} ${
                              STATUS_CONFIG[car.status as keyof typeof STATUS_CONFIG]?.hover || 'hover:bg-neutral-200'
                            }`}
                          >
                            {(() => {
                              const Icon = STATUS_CONFIG[car.status as keyof typeof STATUS_CONFIG]?.icon || CheckCircle
                              return <Icon className="w-3.5 h-3.5" />
                            })()}
                            {STATUS_CONFIG[car.status as keyof typeof STATUS_CONFIG]?.label || car.status}
                          </button>
                          {/* Dropdown */}
                          <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all min-w-[140px]">
                            {STATUSES.map((status) => {
                              const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]
                              const Icon = config?.icon || CheckCircle
                              return (
                                <button
                                  key={status}
                                  onClick={() => handleQuickStatusChange(car.id, status)}
                                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-50 ${
                                    car.status === status ? 'bg-neutral-100 font-medium' : ''
                                  }`}
                                >
                                  <Icon className={`w-4 h-4 ${config?.text || ''}`} />
                                  {config?.label || status}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                        {/* Delete Countdown for sold cars */}
                        {car.status === 'sold' && car.soldAt && (() => {
                          const countdown = getDeleteCountdown(car.soldAt)
                          if (!countdown) return null
                          return (
                            <div className={`mt-1.5 flex items-center gap-1 text-xs ${
                              countdown.isUrgent ? 'text-red-600 font-medium' : 'text-neutral-500'
                            }`}>
                              <Trash2 className="w-3 h-3" />
                              <span>Verwijderd in {countdown.text}</span>
                            </div>
                          )
                        })()}
                      </td>
                      <td className="p-4">{car.isFeatured && <span className="text-amber-500 text-lg">★</span>}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openDialog(car)} className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg" title="Bewerken">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(car.id)} className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg" title="Verwijderen">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-xl font-semibold">{editingCar ? 'Auto Bewerken' : 'Auto Toevoegen'}</h2>
              <button onClick={closeDialog} className="text-neutral-500 hover:text-neutral-900"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Merk *</label>
                  <Input value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Model *</label>
                  <Input value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Titel *</label>
                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="bijv. BMW 330i M Sport 2020" required />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Bouwjaar *</label>
                  <Input type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Prijs (€) *</label>
                  <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Kilometerstand *</label>
                  <Input type="number" value={formData.mileage} onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) })} required />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Brandstof</label>
                  <Select value={formData.fuelType} onValueChange={(v) => setFormData({ ...formData, fuelType: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {FUEL_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Transmissie</label>
                  <Select value={formData.transmission} onValueChange={(v) => setFormData({ ...formData, transmission: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TRANSMISSIONS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Carrosserie</label>
                  <Select value={formData.bodyType} onValueChange={(v) => setFormData({ ...formData, bodyType: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {BODY_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Kleur Exterieur *</label>
                  <Input value={formData.colorExterior} onChange={(e) => setFormData({ ...formData, colorExterior: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Conditie</label>
                  <Select value={formData.condition} onValueChange={(v) => setFormData({ ...formData, condition: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CONDITIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Beschrijving *</label>
                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} required />
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium mb-2">Opties & Features</label>
                <div className="flex gap-2 mb-2">
                  <Input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} placeholder="Voeg optie toe" onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())} />
                  <Button type="button" variant="outline" onClick={addFeature}>Toevoegen</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((f, i) => (
                    <span key={i} className="bg-neutral-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {f} <button type="button" onClick={() => removeFeature(i)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Images - With Upload and URL options */}
              <div>
                <label className="block text-sm font-medium mb-2">Foto's</label>
                
                {/* Toggle between upload and URL */}
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setImageMode('upload')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      imageMode === 'upload' 
                        ? 'bg-neutral-900 text-white' 
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    <Upload className="w-4 h-4" /> Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMode('url')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      imageMode === 'url' 
                        ? 'bg-neutral-900 text-white' 
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    <LinkIcon className="w-4 h-4" /> URL
                  </button>
                </div>

                {imageMode === 'upload' ? (
                  <div className="mb-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                        uploading 
                          ? 'border-neutral-300 bg-neutral-50' 
                          : 'border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50'
                      }`}
                    >
                      {uploading ? (
                        <div className="flex items-center gap-2 text-neutral-500">
                          <div className="w-5 h-5 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin" />
                          Uploaden...
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-neutral-400 mb-2" />
                          <span className="text-sm text-neutral-600">Klik om foto's te uploaden</span>
                          <span className="text-xs text-neutral-400 mt-1">of sleep bestanden hierheen</span>
                        </>
                      )}
                    </label>
                  </div>
                ) : (
                  <div className="flex gap-2 mb-3">
                    <Input 
                      value={imageInput} 
                      onChange={(e) => setImageInput(e.target.value)} 
                      placeholder="Plak afbeelding URL" 
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())} 
                    />
                    <Button type="button" variant="outline" onClick={addImage}>
                      <ImagePlus className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {/* Image Preview Grid */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {formData.images.map((img, i) => (
                      <div key={i} className="relative group aspect-video">
                        <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
                        <button 
                          type="button" 
                          onClick={() => removeImage(i)} 
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {i === 0 && (
                          <span className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                            Hoofdfoto
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => {
                        const config = STATUS_CONFIG[s as keyof typeof STATUS_CONFIG]
                        return (
                          <SelectItem key={s} value={s}>
                            <span className="flex items-center gap-2">
                              {config?.label || s}
                            </span>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} className="w-4 h-4 rounded" />
                    <span>Uitgelicht op homepage</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={closeDialog}>Annuleren</Button>
                <Button type="submit" disabled={submitting}>{submitting ? 'Opslaan...' : editingCar ? 'Bijwerken' : 'Toevoegen'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
