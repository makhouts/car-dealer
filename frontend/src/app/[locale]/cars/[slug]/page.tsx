import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/prisma'
import { parseCarUrl, formatPrice } from '@/lib/utils'
import { Header, Footer, WhatsAppButton } from '@/components/layout'
import { CarDetailContent } from './components/car-detail-content'
import { SimilarCars } from './components/similar-cars'

interface CarPageProps {
  params: Promise<{ locale: string; slug: string }>
}

async function getCar(slugWithId: string) {
  const parsed = parseCarUrl(slugWithId)
  if (!parsed) return null

  try {
    return await prisma.car.findUnique({
      where: { shortId: parsed.shortId },
    })
  } catch {
    return null
  }
}

async function getSimilarCars(car: { id: string; brand: string; bodyType: string }) {
  try {
    return await prisma.car.findMany({
      where: {
        OR: [{ brand: car.brand }, { bodyType: car.bodyType }],
        NOT: { id: car.id },
        status: 'available',
      },
      take: 3,
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: CarPageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const car = await getCar(slug)

  if (!car) {
    return { title: 'Car Not Found' }
  }

  const t = await getTranslations({ locale, namespace: 'car' })
  const title = `${car.title} - Carcity`
  const description = `${car.brand} ${car.model} ${car.year} - ${formatPrice(car.price, locale)} - ${car.mileage} km`
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const carUrl = `${siteUrl}/${locale}/cars/${slug}`
  const image = car.images[0] || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: carUrl,
      images: [{ url: image, width: 1200, height: 630, alt: car.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

export default async function CarPage({ params }: CarPageProps) {
  const { locale, slug } = await params
  const car = await getCar(slug)

  if (!car) {
    notFound()
  }

  const similarCars = await getSimilarCars(car)

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <main className="py-8">
        <CarDetailContent car={car} />
        {similarCars.length > 0 && <SimilarCars cars={similarCars} />}
      </main>
      <Footer />
      <WhatsAppButton carTitle={car.title} />
    </div>
  )
}
