'use client'

import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { Car } from '@prisma/client'
import { CarCard } from '@/components/cars/car-card'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'

interface FeaturedCarsSectionProps {
  cars: Car[]
}

export function FeaturedCarsSection({ cars }: FeaturedCarsSectionProps) {
  const t = useTranslations('featuredCars')
  const tCommon = useTranslations('common')

  return (
    <section className="py-32 bg-zinc-950 noise-overlay" id="featured">
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* Section header */}
        <div className="flex items-end justify-between mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#B5946A]" />
              <p className="text-[#B5946A] font-semibold tracking-[0.2em] text-xs uppercase">
                Featured
              </p>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
              {t('title')}
            </h2>
          </div>
          <Link
            href="/cars"
            className="hidden md:flex items-center gap-2 text-zinc-500 hover:text-[#B5946A] transition-colors text-sm font-medium group"
          >
            {tCommon('viewAll')}
            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Gold divider */}
        <div className="gold-divider mb-16 opacity-30" />

        {cars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} variant="dark" />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-zinc-500 text-lg">{tCommon('noResults')}</p>
          </div>
        )}

        <Link
          href="/cars"
          className="md:hidden flex items-center justify-center gap-2 text-zinc-500 hover:text-[#B5946A] transition-colors mt-12 text-sm font-medium"
        >
          {tCommon('viewAll')} <ChevronRight size={16} />
        </Link>
      </div>
    </section>
  )
}
