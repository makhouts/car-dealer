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
            <div className="w-12 h-12 bg-[#B5946A]/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <item.icon className="w-6 h-6 text-[#B5946A]" />
            </div>
            <div>
              <p className="text-sm text-neutral-500 mb-1">{item.label}</p>
              <p className="text-neutral-900 whitespace-pre-line">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Google Maps — larger */}
      <div className="mt-8 rounded-xl overflow-hidden" style={{ height: '420px' }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2501.3143928044287!2d4.386525477246435!3d51.17642807173995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3f1343ad99c0d%3A0x4a7a66fbd5515799!2sCarCity%20Handiri!5e0!3m2!1sen!2sbe!4v1771430495346!5m2!1sen!2sbe"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  )
}
