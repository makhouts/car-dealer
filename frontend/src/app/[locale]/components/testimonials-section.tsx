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
    <section className="py-24 bg-zinc-950 noise-overlay">
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <p className="text-[#B5946A] font-medium mb-2">TESTIMONIALS</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">{t('title')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="glass rounded-2xl p-8 relative"
            >
              <Quote className="w-10 h-10 text-[#B5946A]/30 absolute top-6 right-6" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <p className="text-zinc-300 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              <div>
                <p className="font-semibold text-white">{testimonial.name}</p>
                <p className="text-sm text-zinc-500">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
