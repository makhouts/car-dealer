import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Header, Footer, WhatsAppButton } from '@/components/layout'
import { Shield, Eye, HeartHandshake, Award } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })

  return {
    title: `${t('title')} - Carcity`,
    description: t('subtitle'),
  }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })

  const values = [
    { icon: Award, key: 'quality' },
    { icon: Eye, key: 'transparency' },
    { icon: HeartHandshake, key: 'service' },
    { icon: Shield, key: 'trust' },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header variant="light" />
      <main className="pt-20">
        {/* Hero */}
        <section className="relative py-32 bg-neutral-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-6xl font-bold text-white mb-6">{t('title')}</h1>
            <p className="text-2xl text-neutral-300">{t('subtitle')}</p>
          </div>
        </section>

        {/* Story */}
        <section className="py-32">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
              <div>
                <h2 className="text-4xl font-bold text-neutral-900 mb-6">{t('story.title')}</h2>
                <p className="text-lg text-neutral-600 leading-relaxed">{t('story.content')}</p>
              </div>
              <div>
                <h2 className="text-4xl font-bold text-neutral-900 mb-6">{t('mission.title')}</h2>
                <p className="text-lg text-neutral-600 leading-relaxed">{t('mission.content')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-32 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-neutral-900 mb-20">{t('values.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {values.map((value) => (
                <div key={value.key} className="bg-white rounded-3xl p-10 text-center shadow-md border border-neutral-100 hover:shadow-xl transition-shadow">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-100 text-red-600 mb-8">
                    <value.icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-4">
                    {t(`values.${value.key}.title`)}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {t(`values.${value.key}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
