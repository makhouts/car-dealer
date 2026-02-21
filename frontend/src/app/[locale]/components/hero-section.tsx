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
          className="w-full h-full object-cover opacity-35"
        />
        {/* Multi-layer gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-transparent to-transparent" />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(181,148,106,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(181,148,106,0.5) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-40">
        <div className="max-w-4xl stagger-children">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-10 bg-[#B5946A]" />
            <p className="text-[#B5946A] font-semibold tracking-[0.2em] text-xs uppercase">
              Premium Pre-Owned Vehicles
            </p>
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] mb-8 tracking-tight">
            {t('title').split(' ').slice(0, 2).join(' ')}{' '}
            <br />
            <span className="gold-text">
              {t('title').split(' ').slice(2).join(' ') || 'Dream Car'}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-xl leading-relaxed">
            {t('subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-20">
            <Link href="/cars">
              <button
                className="inline-flex items-center justify-center gap-3 bg-white text-black hover:bg-zinc-100 rounded-full px-10 py-4 text-base font-semibold transition-all hover:scale-105 hover:shadow-[0_8px_30px_rgba(255,255,255,0.15)]"
                data-testid="hero-browse-btn"
              >
                {t('cta')}
                <ArrowRight size={18} />
              </button>
            </Link>
            <Link href="/contact">
              <button
                className="inline-flex items-center justify-center border border-[#B5946A]/50 text-white hover:bg-[#B5946A]/10 hover:border-[#B5946A] rounded-full px-10 py-4 text-base font-semibold transition-all"
                data-testid="hero-contact-btn"
              >
                {t('contact')}
              </button>
            </Link>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-white/10">
            {[
              { value: '500+', label: 'Cars Sold' },
              { value: '10', label: 'Years Experience' },
              { value: '4.9★', label: 'Customer Rating' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-2xl font-bold text-white font-mono">{stat.value}</span>
                <span className="text-xs text-zinc-500 tracking-widest uppercase mt-0.5">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-5 h-9 border border-[#B5946A]/40 rounded-full flex items-start justify-center p-1.5">
          <div className="w-1 h-2.5 bg-[#B5946A] rounded-full" />
        </div>
      </div>
    </section>
  )
}
