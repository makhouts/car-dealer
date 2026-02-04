'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminSidebar } from '../components/admin-sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TableSkeleton } from '@/components/ui/skeleton'
import { Plus, Pencil, Trash2, X, ImagePlus } from 'lucide-react'
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
}

const FUEL_TYPES = ['petrol', 'diesel', 'hybrid', 'electric', 'other']
const TRANSMISSIONS = ['automatic', 'manual', 'other']
const BODY_TYPES = ['sedan', 'suv', 'coupe', 'hatchback', 'wagon', 'convertible', 'van', 'other']
const CONDITIONS = ['new', 'used']
const STATUSES = ['available', 'reserved', 'sold']

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
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCar, setEditingCar] = useState<Car | null>(null)
  const [formData, setFormData] = useState(emptyCar)
  const [featureInput, setFeatureInput] = useState('')
  const [imageInput, setImageInput] = useState('')
  const [submitting, setSubmitting] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const url = editingCar ? `/api/cars/${editingCar.id}` : '/api/cars'
      const method = editingCar ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast.success(editingCar ? 'Car updated!' : 'Car added!')
        closeDialog()
        fetchCars()
        router.refresh()
      } else {
        throw new Error()
      }
    } catch {
      toast.error('Failed to save car')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this car?')) return

    try {
      const res = await fetch(`/api/cars/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Car deleted!')
        fetchCars()
        router.refresh()
      } else {
        throw new Error()
      }
    } catch {
      toast.error('Failed to delete car')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Cars</h1>
              <p className="text-neutral-600">Manage your vehicle inventory</p>
            </div>
            <Button onClick={() => openDialog()} className="gap-2">
              <Plus className="w-4 h-4" /> Add Car
            </Button>
          </div>

          {/* Cars Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-6"><TableSkeleton /></div>
            ) : cars.length === 0 ? (
              <p className="p-12 text-center text-neutral-500">No cars yet. Add your first car!</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    <th className="p-4">Vehicle</th>
                    <th className="p-4">Year</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Featured</th>
                    <th className="p-4">Actions</th>
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
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          car.status === 'available' ? 'bg-green-100 text-green-700' :
                          car.status === 'sold' ? 'bg-neutral-100 text-neutral-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {car.status}
                        </span>
                      </td>
                      <td className="p-4">{car.isFeatured && <span className="text-amber-500">★</span>}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openDialog(car)} className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(car.id)} className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg">
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
              <h2 className="text-xl font-semibold">{editingCar ? 'Edit Car' : 'Add Car'}</h2>
              <button onClick={closeDialog} className="text-neutral-500 hover:text-neutral-900"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Brand *</label>
                  <Input value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Model *</label>
                  <Input value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g., BMW 330i M Sport 2020" required />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Year *</label>
                  <Input type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Price (€) *</label>
                  <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Mileage (km) *</label>
                  <Input type="number" value={formData.mileage} onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) })} required />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Fuel Type</label>
                  <Select value={formData.fuelType} onValueChange={(v) => setFormData({ ...formData, fuelType: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {FUEL_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Transmission</label>
                  <Select value={formData.transmission} onValueChange={(v) => setFormData({ ...formData, transmission: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TRANSMISSIONS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Body Type</label>
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
                  <label className="block text-sm font-medium mb-2">Exterior Color *</label>
                  <Input value={formData.colorExterior} onChange={(e) => setFormData({ ...formData, colorExterior: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Condition</label>
                  <Select value={formData.condition} onValueChange={(v) => setFormData({ ...formData, condition: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CONDITIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} required />
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium mb-2">Features</label>
                <div className="flex gap-2 mb-2">
                  <Input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} placeholder="Add feature" onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())} />
                  <Button type="button" variant="outline" onClick={addFeature}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((f, i) => (
                    <span key={i} className="bg-neutral-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {f} <button type="button" onClick={() => removeFeature(i)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium mb-2">Image URLs</label>
                <div className="flex gap-2 mb-2">
                  <Input value={imageInput} onChange={(e) => setImageInput(e.target.value)} placeholder="Paste image URL" onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())} />
                  <Button type="button" variant="outline" onClick={addImage}><ImagePlus className="w-4 h-4" /></Button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {formData.images.map((img, i) => (
                    <div key={i} className="relative group">
                      <img src={img} alt="" className="w-full h-20 object-cover rounded-lg" />
                      <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} className="w-4 h-4 rounded" />
                    <span>Featured</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
                <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : editingCar ? 'Update' : 'Add Car'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
