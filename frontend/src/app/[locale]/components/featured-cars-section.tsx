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
    <section className="py-32 bg-zinc-950 noise-overlay" id="featured">
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="text-[#B5946A] font-semibold mb-3 tracking-widest text-sm uppercase">Featured</p>
            <h2 className="text-5xl md:text-6xl font-bold text-white">{t('title')}</h2>
          </div>
          <Link 
            href="/cars" 
            className="hidden md:flex items-center gap-2 text-zinc-400 hover:text-white transition-colors font-medium"
          >
            {tCommon('viewAll')} <ChevronRight size={22} />
          </Link>
        </div>

        {cars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 stagger-children">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} variant="dark" />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-zinc-400 text-lg">{tCommon('noResults')}</p>
          </div>
        )}

        <Link 
          href="/cars" 
          className="md:hidden flex items-center justify-center gap-2 text-zinc-400 hover:text-white transition-colors mt-12 font-medium"
        >
          {tCommon('viewAll')} <ChevronRight size={20} />
        </Link>
      </div>
    </section>
  )
}
