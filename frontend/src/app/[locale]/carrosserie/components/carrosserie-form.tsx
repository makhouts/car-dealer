'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

export function CarrosserieForm() {
  const locale = useLocale()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    chassisNumber: '',
    serviceType: '',
    message: '',
    honeypot: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const serviceTypes = [
    { value: 'onderhoud', label: locale === 'nl' ? 'Onderhoud' : 'Maintenance' },
    { value: 'herstelling', label: locale === 'nl' ? 'Herstelling' : 'Repair' },
    { value: 'andere', label: locale === 'nl' ? 'Andere' : 'Other' },
  ]

  const t = {
    title: locale === 'nl' ? 'Vraag een offerte aan' : 'Request a quote',
    subtitle: locale === 'nl' 
      ? 'Vul het formulier in en wij nemen zo snel mogelijk contact met u op' 
      : 'Fill out the form and we will contact you as soon as possible',
    name: locale === 'nl' ? 'Naam' : 'Name',
    namePlaceholder: locale === 'nl' ? 'Uw naam' : 'Your name',
    email: locale === 'nl' ? 'E-mail' : 'Email',
    emailPlaceholder: locale === 'nl' ? 'uw.email@voorbeeld.nl' : 'your.email@example.com',
    phone: locale === 'nl' ? 'Telefoonnummer' : 'Phone number',
    phonePlaceholder: locale === 'nl' ? '+32 123 45 67 89' : '+32 123 45 67 89',
    serviceType: locale === 'nl' ? 'Type dienst' : 'Service type',
    serviceTypePlaceholder: locale === 'nl' ? 'Selecteer type dienst' : 'Select service type',
    chassisNumber: locale === 'nl' ? 'Chassisnummer (VIN)' : 'Chassis Number (VIN)',
    chassisPlaceholder: locale === 'nl' ? 'Bijv. WBA12345678901234' : 'E.g. WBA12345678901234',
    message: locale === 'nl' ? 'Bericht (optioneel)' : 'Message (optional)',
    messagePlaceholder: locale === 'nl' 
      ? 'Beschrijf uw vraag of het probleem...' 
      : 'Describe your question or problem...',
    submit: locale === 'nl' ? 'Verstuur aanvraag' : 'Send request',
    sending: locale === 'nl' ? 'Verzenden...' : 'Sending...',
    success: locale === 'nl' ? 'Bedankt! We nemen zo snel mogelijk contact met u op.' : 'Thank you! We will contact you as soon as possible.',
    error: locale === 'nl' ? 'Er is iets misgegaan. Probeer het opnieuw.' : 'Something went wrong. Please try again.',
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.honeypot) return // Bot detected

    setSubmitting(true)
    try {
      const res = await fetch('/api/carrosserie-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast.success(t.success)
        setFormData({
          name: '',
          email: '',
          phone: '',
          chassisNumber: '',
          serviceType: '',
          message: '',
          honeypot: '',
        })
      } else {
        throw new Error()
      }
    } catch {
      toast.error(t.error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-neutral-900 mb-4">{t.title}</h2>
      <p className="text-lg text-neutral-600 mb-8">{t.subtitle}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Honeypot */}
        <input
          type="text"
          name="honeypot"
          value={formData.honeypot}
          onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {t.name} *
          </label>
          <Input
            type="text"
            placeholder={t.namePlaceholder}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="h-12"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {t.email} *
          </label>
          <Input
            type="email"
            placeholder={t.emailPlaceholder}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="h-12"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {t.phone} *
          </label>
          <Input
            type="tel"
            placeholder={t.phonePlaceholder}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
            className="h-12"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {t.chassisNumber} *
          </label>
          <Input
            type="text"
            placeholder={t.chassisPlaceholder}
            value={formData.chassisNumber}
            onChange={(e) => setFormData({ ...formData, chassisNumber: e.target.value })}
            required
            className="h-12 font-mono"
          />
          <p className="text-xs text-neutral-500 mt-1">
            {locale === 'nl' 
              ? 'Het chassisnummer vindt u op uw kentekenbewijs' 
              : 'You can find the chassis number on your vehicle registration'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {t.message}
          </label>
          <Textarea
            placeholder={t.messagePlaceholder}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={4}
          />
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full h-12 bg-[#B5946A] hover:bg-[#A38559] text-white font-semibold"
        >
          {submitting ? t.sending : t.submit}
        </Button>
      </form>
    </div>
  )
}
