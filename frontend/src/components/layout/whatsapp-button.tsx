'use client'

import { useTranslations, useLocale } from 'next-intl'
import { usePathname } from '@/i18n/routing'
import { MessageCircle } from 'lucide-react'
import { buildWhatsAppUrl } from '@/lib/utils'

interface WhatsAppButtonProps {
  carTitle?: string
}

export function WhatsAppButton({ carTitle }: WhatsAppButtonProps) {
  const t = useTranslations('whatsapp')
  const locale = useLocale()
  const pathname = usePathname()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const fullUrl = `${siteUrl}/${locale}${pathname}`

  let message: string
  if (carTitle) {
    message = t('carMessage', { carTitle, carUrl: fullUrl })
  } else {
    message = t('defaultMessage')
  }

  const whatsappUrl = buildWhatsAppUrl(message)

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      aria-label="Contact via WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  )
}
