'use client'

import { useTranslations } from 'next-intl'
import { Star, Quote } from 'lucide-react'

export function TestimonialsSection() {
  const t = useTranslations('testimonials')

  const testimonials = [
    { name: t('items.0.name'), text: t('items.0.text'), location: t('items.0.location') },
    { name: t('items.1.name'), text: t('items.1.text'), location: t('items.1.location') },
    { name: t('items.2.name'), text: t('items.2.text'), location: t('items.2.location') },
  ]

  return (
    <section className="py-24 bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-white mb-16">
          {t('title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-neutral-800 rounded-2xl p-8 relative"
            >
              <Quote className="w-10 h-10 text-red-500/30 absolute top-6 right-6" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <p className="text-neutral-300 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              <div>
                <p className="font-semibold text-white">{testimonial.name}</p>
                <p className="text-sm text-neutral-500">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
