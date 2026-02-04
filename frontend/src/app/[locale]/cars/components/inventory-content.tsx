'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Car } from '@prisma/client'
import { CarCard } from '@/components/cars/car-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FilterSidebarSkeleton, CarGridSkeleton } from '@/components/ui/skeleton'
import { Search, SlidersHorizontal, X } from 'lucide-react'

interface InventoryContentProps {
  initialCars: Car[]
  brands: string[]
}

const FUEL_TYPES = ['petrol', 'diesel', 'hybrid', 'electric', 'other']
const TRANSMISSIONS = ['automatic', 'manual', 'other']
const BODY_TYPES = ['sedan', 'suv', 'coupe', 'hatchback', 'wagon', 'convertible', 'van', 'other']
const CONDITIONS = ['new', 'used']
const ITEMS_PER_PAGE = 12

export function InventoryContent({ initialCars, brands }: InventoryContentProps) {
  const t = useTranslations('inventory')
  const tCar = useTranslations('car')
  const tCommon = useTranslations('common')

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBrand, setSelectedBrand] = useState<string>('')
  const [selectedFuelType, setSelectedFuelType] = useState<string>('')
  const [selectedTransmission, setSelectedTransmission] = useState<string>('')
  const [selectedBodyType, setSelectedBodyType] = useState<string>('')
  const [selectedCondition, setSelectedCondition] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<number | ''>('')
  const [maxMileage, setMaxMileage] = useState<number | ''>('')
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  const filteredCars = useMemo(() => {
    let result = [...initialCars]

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter((car) =>
        car.title.toLowerCase().includes(term) ||
        car.brand.toLowerCase().includes(term) ||
        car.model.toLowerCase().includes(term)
      )
    }

    // Brand filter
    if (selectedBrand && selectedBrand !== 'all') {
      result = result.filter((car) => car.brand === selectedBrand)
    }

    // Fuel type filter
    if (selectedFuelType && selectedFuelType !== 'all') {
      result = result.filter((car) => car.fuelType === selectedFuelType)
    }

    // Transmission filter
    if (selectedTransmission && selectedTransmission !== 'all') {
      result = result.filter((car) => car.transmission === selectedTransmission)
    }

    // Body type filter
    if (selectedBodyType && selectedBodyType !== 'all') {
      result = result.filter((car) => car.bodyType === selectedBodyType)
    }

    // Condition filter
    if (selectedCondition && selectedCondition !== 'all') {
      result = result.filter((car) => car.condition === selectedCondition)
    }

    // Max price filter
    if (maxPrice) {
      result = result.filter((car) => car.price <= maxPrice)
    }

    // Max mileage filter
    if (maxMileage) {
      result = result.filter((car) => car.mileage <= maxMileage)
    }

    // Sorting
    switch (sortBy) {
      case 'priceAsc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'priceDesc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'mileageAsc':
        result.sort((a, b) => a.mileage - b.mileage)
        break
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    return result
  }, [initialCars, searchTerm, selectedBrand, selectedFuelType, selectedTransmission, selectedBodyType, selectedCondition, maxPrice, maxMileage, sortBy])

  const totalPages = Math.ceil(filteredCars.length / ITEMS_PER_PAGE)
  const paginatedCars = filteredCars.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedBrand('')
    setSelectedFuelType('')
    setSelectedTransmission('')
    setSelectedBodyType('')
    setSelectedCondition('')
    setMaxPrice('')
    setMaxMileage('')
    setCurrentPage(1)
  }

  const hasActiveFilters = searchTerm || selectedBrand || selectedFuelType || selectedTransmission || selectedBodyType || selectedCondition || maxPrice || maxMileage

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">{t('title')}</h1>
        <p className="text-lg text-neutral-600">{t('subtitle')}</p>
      </div>

      {/* Search and Sort Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <Input
            type="text"
            placeholder={tCommon('search')}
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
            className="pl-12"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder={tCommon('sort')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t('sort.newest')}</SelectItem>
            <SelectItem value="priceAsc">{t('sort.priceAsc')}</SelectItem>
            <SelectItem value="priceDesc">{t('sort.priceDesc')}</SelectItem>
            <SelectItem value="mileageAsc">{t('sort.mileageAsc')}</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          className="md:hidden gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="w-4 h-4" />
          {tCommon('filter')}
        </Button>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-72 flex-shrink-0`}>
          <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-neutral-900">{tCommon('filter')}</h3>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-sm text-red-600 hover:text-red-700">
                  {tCommon('clear')}
                </button>
              )}
            </div>

            <div className="space-y-6">
              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">{t('filters.brand')}</label>
                <Select value={selectedBrand} onValueChange={(v) => { setSelectedBrand(v); setCurrentPage(1) }}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('filters.allBrands')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('filters.allBrands')}</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Body Type */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">{t('filters.bodyType')}</label>
                <Select value={selectedBodyType} onValueChange={(v) => { setSelectedBodyType(v); setCurrentPage(1) }}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('filters.allBodyTypes')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('filters.allBodyTypes')}</SelectItem>
                    {BODY_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{tCar(`bodyTypes.${type}`)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Fuel Type */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">{t('filters.fuelType')}</label>
                <Select value={selectedFuelType} onValueChange={(v) => { setSelectedFuelType(v); setCurrentPage(1) }}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('filters.allFuelTypes')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('filters.allFuelTypes')}</SelectItem>
                    {FUEL_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{tCar(`fuelTypes.${type}`)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Transmission */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">{t('filters.transmission')}</label>
                <Select value={selectedTransmission} onValueChange={(v) => { setSelectedTransmission(v); setCurrentPage(1) }}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('filters.allTransmissions')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('filters.allTransmissions')}</SelectItem>
                    {TRANSMISSIONS.map((type) => (
                      <SelectItem key={type} value={type}>{tCar(`transmissions.${type}`)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">{t('filters.priceRange')}</label>
                <Input
                  type="number"
                  placeholder="Max €"
                  value={maxPrice}
                  onChange={(e) => { setMaxPrice(e.target.value ? parseInt(e.target.value) : ''); setCurrentPage(1) }}
                />
              </div>

              {/* Max Mileage */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">{t('filters.maxMileage')}</label>
                <Input
                  type="number"
                  placeholder="Max km"
                  value={maxMileage}
                  onChange={(e) => { setMaxMileage(e.target.value ? parseInt(e.target.value) : ''); setCurrentPage(1) }}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Cars Grid */}
        <main className="flex-1">
          <p className="text-sm text-neutral-600 mb-4">
            {t('results', { count: filteredCars.length })}
          </p>

          {paginatedCars.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedCars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    {tCommon('previous')}
                  </Button>
                  <span className="px-4 text-sm text-neutral-600">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    {tCommon('next')}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl">
              <p className="text-neutral-500">{t('noResults')}</p>
              {hasActiveFilters && (
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  {tCommon('clear')} {tCommon('filter').toLowerCase()}
                </Button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
