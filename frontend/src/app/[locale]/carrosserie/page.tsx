import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Header, Footer, WhatsAppButton } from '@/components/layout'
import { CarrosserieForm } from './components/carrosserie-form'
import { CarrosserieInfo } from './components/carrosserie-info'

// Disable caching for this page
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  
  return {
    title: `${locale === 'nl' ? 'Carrosserie - Onderhoud & Herstellingen' : 'Body Shop - Maintenance & Repairs'} - Carcity`,
    description: locale === 'nl' 
      ? 'Professionele carrosserie diensten - onderhoud, herstellingen en schadeherstel voor uw voertuig'
      : 'Professional body shop services - maintenance, repairs and damage repair for your vehicle',
  }
}

export default async function CarrosseriePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header variant="light" />
      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-6xl font-bold text-neutral-900 mb-6">Carrosserie Diensten</h1>
            <p className="text-2xl text-neutral-600 max-w-3xl mx-auto">
              Professioneel onderhoud en herstellingen voor uw voertuig
            </p>
          </div>
        </section>

        {/* Form and Info Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <CarrosserieForm />
            <CarrosserieInfo />
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
