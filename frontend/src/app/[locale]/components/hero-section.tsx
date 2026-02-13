'use client'

import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'

export function HeroSection() {
  const t = useTranslations('hero')

  return (
    <section className="relative min-h-screen bg-zinc-950 flex items-center noise-overlay overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=80"
          alt="Luxury Car"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-40">
        <div className="max-w-4xl stagger-children">
          <p className="text-red-500 font-semibold mb-6 tracking-widest text-sm uppercase">Premium Pre-Owned Vehicles</p>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] mb-8">
            {t('title').split(' ').slice(0, 2).join(' ')} <br />
            <span className="text-zinc-400">{t('title').split(' ').slice(2).join(' ') || 'Dream Car'}</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-300 mb-12 max-w-2xl leading-relaxed">
            {t('subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-5">
            <Link href="/cars">
              <button 
                className="inline-flex items-center justify-center gap-3 bg-white text-black hover:bg-zinc-200 rounded-full px-12 py-5 text-lg font-semibold transition-all hover:scale-105 hover:shadow-2xl"
                data-testid="hero-browse-btn"
              >
                {t('cta')}
                <ArrowRight size={22} />
              </button>
            </Link>
            <Link href="/contact">
              <button 
                className="inline-flex items-center justify-center border-2 border-zinc-500 text-white hover:bg-white hover:text-black rounded-full px-12 py-5 text-lg font-semibold transition-all hover:shadow-2xl"
                data-testid="hero-contact-btn"
              >
                {t('contact')}
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-zinc-500 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-zinc-400 rounded-full" />
        </div>
      </div>
    </section>
  )
}
