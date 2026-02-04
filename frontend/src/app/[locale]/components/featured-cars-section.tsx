'use client'

import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { Car } from '@prisma/client'
import { CarCard } from '@/components/cars/car-card'
import { CarGridSkeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

interface FeaturedCarsSectionProps {
  cars: Car[]
}

export function FeaturedCarsSection({ cars }: FeaturedCarsSectionProps) {
  const t = useTranslations('featuredCars')
  const tCommon = useTranslations('common')

  return (
    <section className="py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-neutral-900 mb-2">{t('title')}</h2>
            <p className="text-lg text-neutral-600">{t('subtitle')}</p>
          </div>
          <Link href="/cars" className="hidden md:block">
            <Button variant="outline" className="gap-2">
              {tCommon('viewAll')}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {cars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-neutral-500">{tCommon('noResults')}</p>
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link href="/cars">
            <Button variant="outline" className="gap-2">
              {tCommon('viewAll')}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
