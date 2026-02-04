import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/prisma'
import { Header, Footer, WhatsAppButton } from '@/components/layout'
import { InventoryContent } from './components/inventory-content'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'inventory' })

  return {
    title: `${t('title')} - Carcity`,
    description: t('subtitle'),
    openGraph: {
      title: `${t('title')} - Carcity`,
      description: t('subtitle'),
      type: 'website',
    },
  }
}

async function getCars() {
  try {
    return await prisma.car.findMany({
      where: { status: { in: ['available', 'reserved'] } },
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    return []
  }
}

async function getBrands() {
  try {
    const cars = await prisma.car.findMany({
      select: { brand: true },
      distinct: ['brand'],
    })
    return cars.map((c) => c.brand).sort()
  } catch {
    return []
  }
}

export default async function InventoryPage() {
  const [cars, brands] = await Promise.all([getCars(), getBrands()])

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <main className="py-12">
        <InventoryContent initialCars={cars} brands={brands} />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
