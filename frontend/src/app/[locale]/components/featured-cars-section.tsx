'use client'

import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { Car } from '@prisma/client'
import { CarCard } from '@/components/cars/car-card'
import { CarGridSkeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'

interface FeaturedCarsSectionProps {
  cars: Car[]
}

export function FeaturedCarsSection({ cars }: FeaturedCarsSectionProps) {
  const t = useTranslations('featuredCars')
  const tCommon = useTranslations('common')

  return (
    <section className="py-24 bg-zinc-950 noise-overlay" id="featured">
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-red-500 font-medium mb-2">FEATURED</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">{t('title')}</h2>
          </div>
          <Link 
            href="/cars" 
            className="hidden md:flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            {tCommon('viewAll')} <ChevronRight size={20} />
          </Link>
        </div>

        {cars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} variant="dark" />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-zinc-500">{tCommon('noResults')}</p>
          </div>
        )}

        <Link 
          href="/cars" 
          className="md:hidden flex items-center justify-center gap-2 text-zinc-400 hover:text-white transition-colors mt-8"
        >
          {tCommon('viewAll')} <ChevronRight size={20} />
        </Link>
      </div>
    </section>
  )
}
