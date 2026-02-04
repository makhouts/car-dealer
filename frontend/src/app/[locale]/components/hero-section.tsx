'use client'

import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function HeroSection() {
  const t = useTranslations('hero')

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=80"
          alt="Luxury car"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            {t('title')}
          </h1>
          <p className="text-xl text-neutral-300 mb-10">
            {t('subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/cars">
              <Button size="lg" className="bg-white text-neutral-900 hover:bg-neutral-100 gap-2">
                {t('cta')}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                {t('contact')}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/80 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}
