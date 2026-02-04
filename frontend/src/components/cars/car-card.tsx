import { Link } from '@/i18n/routing'
import { useTranslations, useLocale } from 'next-intl'
import { formatPrice, formatMileage, buildCarUrl } from '@/lib/utils'
import { Car } from '@prisma/client'

interface CarCardProps {
  car: Car
}

export function CarCard({ car }: CarCardProps) {
  const t = useTranslations('car')
  const tCommon = useTranslations('common')
  const locale = useLocale()

  const carUrl = buildCarUrl(car.slug, car.shortId)
  const primaryImage = car.images[0] || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80'

  return (
    <Link href={carUrl} className="group block">
      <article className="bg-white rounded-xl overflow-hidden shadow-sm border border-neutral-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={primaryImage}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Status Badge */}
          {car.status !== 'available' && (
            <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium text-white ${
              car.status === 'sold' ? 'bg-neutral-900' : 'bg-amber-500'
            }`}>
              {tCommon(car.status)}
            </span>
          )}
          
          {/* Featured Badge */}
          {car.isFeatured && car.status === 'available' && (
            <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium bg-red-600 text-white">
              {tCommon('featured')}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-1">
            <p className="text-sm text-neutral-500">{car.brand}</p>
            <span className="text-lg font-bold text-red-600 font-mono">
              {formatPrice(car.price, locale)}
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-neutral-900 mb-3 group-hover:text-red-600 transition-colors">
            {car.title || `${car.model} ${car.year}`}
          </h3>
          
          <div className="flex flex-wrap gap-2 text-xs text-neutral-500">
            <span className="bg-neutral-100 px-2 py-1 rounded">{car.year}</span>
            <span className="bg-neutral-100 px-2 py-1 rounded font-mono">{formatMileage(car.mileage, locale)}</span>
            <span className="bg-neutral-100 px-2 py-1 rounded">{t(`fuelTypes.${car.fuelType}`)}</span>
            <span className="bg-neutral-100 px-2 py-1 rounded">{t(`transmissions.${car.transmission}`)}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
