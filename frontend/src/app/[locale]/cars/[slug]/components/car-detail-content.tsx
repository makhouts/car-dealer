'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Car } from '@prisma/client'
import { formatPrice, formatMileage } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ChevronLeft, ChevronRight, Check, Calendar, Gauge, Fuel, Settings, Car as CarIcon, Palette, Zap, Cog } from 'lucide-react'
import { toast } from 'sonner'

interface CarDetailContentProps {
  car: Car
}

export function CarDetailContent({ car }: CarDetailContentProps) {
  const t = useTranslations('car')
  const tCommon = useTranslations('common')
  const tContact = useTranslations('contact.form')
  const locale = useLocale()

  const [selectedImage, setSelectedImage] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `${locale === 'nl' ? 'Hallo, ik heb interesse in' : 'Hi, I\'m interested in'} ${car.title}.`,
    honeypot: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const images = car.images.length > 0 ? car.images : ['https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80']

  const nextImage = () => setSelectedImage((prev) => (prev + 1) % images.length)
  const prevImage = () => setSelectedImage((prev) => (prev - 1 + images.length) % images.length)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.honeypot) return // Bot detected

    setSubmitting(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, carId: car.id }),
      })

      if (res.ok) {
        toast.success(tContact('success'))
        setFormData({ ...formData, name: '', email: '', phone: '', message: '' })
      } else {
        throw new Error()
      }
    } catch {
      toast.error(tContact('error'))
    } finally {
      setSubmitting(false)
    }
  }

  const specs = [
    { icon: Calendar, label: t('year'), value: car.year },
    { icon: Gauge, label: t('mileage'), value: formatMileage(car.mileage, locale) },
    { icon: Fuel, label: t('fuelType'), value: t(`fuelTypes.${car.fuelType}`) },
    { icon: Settings, label: t('transmission'), value: t(`transmissions.${car.transmission}`) },
    { icon: CarIcon, label: t('bodyType'), value: t(`bodyTypes.${car.bodyType}`) },
    { icon: Palette, label: t('colorExterior'), value: car.colorExterior },
  ]

  if (car.powerHP) specs.push({ icon: Zap, label: t('powerHP'), value: `${car.powerHP} HP` })
  if (car.engine) specs.push({ icon: Cog, label: t('engine'), value: car.engine })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image */}
          <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm">
            <div
              className="aspect-[16/10] relative cursor-pointer"
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={images[selectedImage]}
                alt={car.title}
                className="w-full h-full object-cover"
              />

              {/* Status Badge */}
              {car.status !== 'available' && (
                <span className={`absolute top-4 right-4 px-4 py-2 rounded-full font-medium text-sm text-white ${
                  car.status === 'sold' ? 'bg-neutral-900' : 'bg-amber-500'
                }`}>
                  {tCommon(car.status)}
                </span>
              )}

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prevImage() }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImage() }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="p-4 flex gap-3 overflow-x-auto">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-[#B5946A]' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Specifications */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">{t('specifications')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {specs.map((spec, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl">
                  <div className="w-10 h-10 bg-neutral-200 rounded-lg flex items-center justify-center">
                    <spec.icon className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">{spec.label}</p>
                    <p className="font-medium text-neutral-900">{spec.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">{t('description')}</h2>
            <p className="text-neutral-600 leading-relaxed whitespace-pre-line">{car.description}</p>
          </div>

          {/* Features */}
          {car.features.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">{t('features')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {car.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-neutral-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Price & Form */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
            <div className="mb-6">
              <p className="text-neutral-500">{car.brand}</p>
              <h1 className="text-2xl font-bold text-neutral-900">{car.title}</h1>
              <p className="text-3xl font-bold text-[#B5946A] font-mono mt-2">
                {formatPrice(car.price, locale)}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-sm">{car.year}</span>
              <span className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-sm font-mono">{formatMileage(car.mileage, locale)}</span>
              <span className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-sm">{t(`transmissions.${car.transmission}`)}</span>
            </div>

            {/* Car Pass Button */}
            {car.carPassUrl && (
              <div className="mb-6">
                <a
                  href={car.carPassUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-6 py-3 bg-[#B5946A] hover:bg-[#A38559] text-white font-semibold rounded-xl transition-colors shadow-sm"
                >
                  {locale === 'nl' ? '📄 Bekijk Car Pass' : '📄 View Car Pass'}
                </a>
              </div>
            )}

            {car.status === 'available' && (
              <div className="border-t border-neutral-200 pt-6">
                <h3 className="font-semibold text-neutral-900 mb-4">{t('requestInfo')}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="text" name="honeypot" value={formData.honeypot} onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })} className="hidden" tabIndex={-1} autoComplete="off" />
                  <Input
                    placeholder={tContact('namePlaceholder')}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <Input
                    type="email"
                    placeholder={tContact('emailPlaceholder')}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  <Input
                    type="tel"
                    placeholder={tContact('phonePlaceholder')}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <Textarea
                    placeholder={tContact('messagePlaceholder')}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                  <Button type="submit" disabled={submitting} className="w-full" variant="accent">
                    {submitting ? tContact('sending') : tContact('submit')}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
          <button onClick={() => setLightboxOpen(false)} className="absolute top-4 right-4 text-white text-2xl">✕</button>
          <button onClick={(e) => { e.stopPropagation(); prevImage() }} className="absolute left-4 text-white p-2"><ChevronLeft className="w-8 h-8" /></button>
          <img src={images[selectedImage]} alt={car.title} className="max-w-full max-h-[90vh] object-contain" onClick={(e) => e.stopPropagation()} />
          <button onClick={(e) => { e.stopPropagation(); nextImage() }} className="absolute right-4 text-white p-2"><ChevronRight className="w-8 h-8" /></button>
        </div>
      )}
    </div>
  )
}
