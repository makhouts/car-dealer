'use client'

import { useTranslations } from 'next-intl'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export function ContactInfo() {
  const t = useTranslations('contact.info')

  const contactItems = [
    { icon: MapPin, label: t('address'), value: t('addressValue') },
    { icon: Phone, label: t('phone'), value: t('phoneValue') },
    { icon: Mail, label: t('email'), value: t('emailValue') },
    { icon: Clock, label: t('hours'), value: t('hoursValue') },
  ]

  return (
    <div className="bg-neutral-50 rounded-2xl p-8 lg:p-12">
      <h2 className="text-2xl font-bold text-neutral-900 mb-8">Contact Info</h2>
      
      <div className="space-y-8">
        {contactItems.map((item, index) => (
          <div key={index} className="flex gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <item.icon className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500 mb-1">{item.label}</p>
              <p className="text-neutral-900 whitespace-pre-line">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Map placeholder */}
      <div className="mt-8 aspect-video bg-neutral-200 rounded-xl flex items-center justify-center">
        <span className="text-neutral-500">Map</span>
      </div>
    </div>
  )
}
