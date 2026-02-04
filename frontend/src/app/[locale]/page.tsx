import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/prisma'
import { Header, Footer, WhatsAppButton } from '@/components/layout'
import { HeroSection } from './components/hero-section'
import { FeaturedCarsSection } from './components/featured-cars-section'
import { BenefitsSection } from './components/benefits-section'
import { TestimonialsSection } from './components/testimonials-section'
import { CTASection } from './components/cta-section'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'hero' })

  return {
    title: `Carcity - ${t('subtitle')}`,
    description: t('subtitle'),
    openGraph: {
      title: `Carcity - ${t('title')}`,
      description: t('subtitle'),
      type: 'website',
    },
  }
}

async function getFeaturedCars() {
  try {
    return await prisma.car.findMany({
      where: {
        isFeatured: true,
        status: 'available',
      },
      take: 6,
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    return []
  }
}

export default async function HomePage() {
  const featuredCars = await getFeaturedCars()

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <FeaturedCarsSection cars={featuredCars} />
        <BenefitsSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
