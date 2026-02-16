'use client'

import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function CTASection() {
  const t = useTranslations('cta')

  return (
    <section className="py-24 bg-[#B5946A]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          {t('title')}
        </h2>
        <p className="text-xl text-white/90 mb-10">
          {t('subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/cars">
            <Button size="lg" className="bg-white text-[#B5946A] hover:bg-neutral-100 gap-2">
              {t('browse')}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              {t('contact')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
