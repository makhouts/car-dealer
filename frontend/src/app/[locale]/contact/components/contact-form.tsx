'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export function ContactForm() {
  const t = useTranslations('contact')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    honeypot: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.honeypot) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast.success(t('form.success'))
        setFormData({ name: '', email: '', phone: '', message: '', honeypot: '' })
      } else {
        throw new Error()
      }
    } catch {
      toast.error(t('form.error'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-neutral-900 mb-4">{t('title')}</h1>
      <p className="text-lg text-neutral-600 mb-8">{t('subtitle')}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input type="text" name="honeypot" value={formData.honeypot} onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })} className="hidden" tabIndex={-1} autoComplete="off" />
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">{t('form.name')}</label>
          <Input
            placeholder={t('form.namePlaceholder')}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">{t('form.email')}</label>
          <Input
            type="email"
            placeholder={t('form.emailPlaceholder')}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">{t('form.phone')}</label>
          <Input
            type="tel"
            placeholder={t('form.phonePlaceholder')}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">{t('form.message')}</label>
          <Textarea
            placeholder={t('form.messagePlaceholder')}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={5}
            required
          />
        </div>

        <Button 
          type="submit" 
          disabled={submitting} 
          size="lg" 
          className="bg-[#B5946A] hover:bg-[#A38559] text-white"
        >
          {submitting ? t('form.sending') : t('form.submit')}
        </Button>
      </form>
    </div>
  )
}
