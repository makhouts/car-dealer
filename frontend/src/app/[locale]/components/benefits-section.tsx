'use client'

import { useTranslations } from 'next-intl'
import { Shield, Search, Wallet, Truck } from 'lucide-react'

export function BenefitsSection() {
  const t = useTranslations('benefits')

  const benefits = [
    { icon: Shield, key: 'warranty' },
    { icon: Search, key: 'inspection' },
    { icon: Wallet, key: 'financing' },
    { icon: Truck, key: 'delivery' },
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-neutral-900 mb-16">
          {t('title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit) => (
            <div
              key={benefit.key}
              className="text-center p-8 rounded-2xl bg-neutral-50 hover:bg-neutral-100 transition-colors"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-6">
                <benefit.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                {t(`${benefit.key}.title`)}
              </h3>
              <p className="text-neutral-600">
                {t(`${benefit.key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
