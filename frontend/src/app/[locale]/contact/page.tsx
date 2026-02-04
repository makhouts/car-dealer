import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Header, Footer, WhatsAppButton } from '@/components/layout'
import { ContactForm } from './components/contact-form'
import { ContactInfo } from './components/contact-info'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })

  return {
    title: `${t('title')} - Carcity`,
    description: t('subtitle'),
  }
}

export default async function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <ContactForm />
            <ContactInfo />
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
