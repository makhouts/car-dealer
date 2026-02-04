'use client'

import { useTranslations } from 'next-intl'
import { Car } from '@prisma/client'
import { CarCard } from '@/components/cars/car-card'

interface SimilarCarsProps {
  cars: Car[]
}

export function SimilarCars({ cars }: SimilarCarsProps) {
  const t = useTranslations('car')

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      <h2 className="text-2xl font-bold text-neutral-900 mb-8">{t('similarCars')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </section>
  )
}
