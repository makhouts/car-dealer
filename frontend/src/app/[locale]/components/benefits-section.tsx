'use client'

import { useTranslations } from 'next-intl'
import { Shield, Car, Clock } from 'lucide-react'

export function BenefitsSection() {
  const t = useTranslations('benefits')

  const features = [
    { icon: Shield, key: 'warranty' },
    { icon: Car, key: 'inspection' },
    { icon: Clock, key: 'financing' },
  ]

  return (
    <section className="py-24 bg-zinc-100" id="about">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <p className="text-[#B5946A] font-medium mb-2">WHY CHOOSE US</p>
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900">{t('title')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.key} 
              className="bg-zinc-50 border border-zinc-200 p-8 rounded-xl transition-all duration-300 hover:shadow-xl text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-zinc-900 rounded-full flex items-center justify-center">
                <feature.icon className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-3">
                {t(`${feature.key}.title`)}
              </h3>
              <p className="text-zinc-600">
                {t(`${feature.key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
