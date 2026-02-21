'use client'

import { useLocale } from 'next-intl'
import { Wrench, Shield, Clock, Award } from 'lucide-react'

export function CarrosserieInfo() {
  const locale = useLocale()

  const services = [
    {
      icon: Wrench,
      title: locale === 'nl' ? 'Onderhoud & Reparaties' : 'Maintenance & Repairs',
      description: locale === 'nl'
        ? 'Alle soorten carrosserie herstellingen en preventief onderhoud'
        : 'All types of body repairs and preventive maintenance',
    },
    {
      icon: Shield,
      title: locale === 'nl' ? 'Schadeherstel' : 'Damage Repair',
      description: locale === 'nl'
        ? 'Professioneel herstel van ongeluksschade en deuken'
        : 'Professional repair of accident damage and dents',
    },
    {
      icon: Clock,
      title: locale === 'nl' ? 'Snelle Service' : 'Fast Service',
      description: locale === 'nl'
        ? 'Snelle doorlooptijd zonder in te boeten op kwaliteit'
        : 'Fast turnaround without compromising on quality',
    },
    {
      icon: Award,
      title: locale === 'nl' ? 'Vakmanschap' : 'Craftsmanship',
      description: locale === 'nl'
        ? 'Gecertificeerde vakmensen met jarenlange ervaring'
        : 'Certified professionals with years of experience',
    },
  ]

  return (
    <div>
      <h2 className="text-3xl font-bold text-neutral-900 mb-8">
        {locale === 'nl' ? 'Onze Diensten' : 'Our Services'}
      </h2>

      <div className="space-y-6 mb-12">
        {services.map((service, index) => (
          <div
            key={index}
            className="flex gap-4 p-6 bg-neutral-50 rounded-2xl hover:bg-neutral-100 transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-[#B5946A]/10 rounded-xl flex items-center justify-center">
                <service.icon className="w-7 h-7 text-[#B5946A]" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                {service.title}
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#B5946A]/5 border border-[#B5946A]/20 rounded-2xl p-8">
        <h3 className="text-xl font-bold text-neutral-900 mb-4">
          {locale === 'nl' ? 'Werkwijze' : 'How it works'}
        </h3>
        <ol className="space-y-3">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-[#B5946A] text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </span>
            <span className="text-neutral-700">
              {locale === 'nl' 
                ? 'Vul het formulier in met uw gegevens en chassisnummer' 
                : 'Fill out the form with your details and chassis number'}
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-[#B5946A] text-white rounded-full flex items-center justify-center text-sm font-bold">
              2
            </span>
            <span className="text-neutral-700">
              {locale === 'nl' 
                ? 'Wij nemen binnen 24 uur contact met u op' 
                : 'We will contact you within 24 hours'}
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-[#B5946A] text-white rounded-full flex items-center justify-center text-sm font-bold">
              3
            </span>
            <span className="text-neutral-700">
              {locale === 'nl' 
                ? 'Wij maken een afspraak en geven u een offerte' 
                : 'We schedule an appointment and provide you with a quote'}
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-[#B5946A] text-white rounded-full flex items-center justify-center text-sm font-bold">
              4
            </span>
            <span className="text-neutral-700">
              {locale === 'nl' 
                ? 'Professioneel herstel door onze vakmensen' 
                : 'Professional repair by our craftsmen'}
            </span>
          </li>
        </ol>
      </div>
    </div>
  )
}
