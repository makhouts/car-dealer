import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { Facebook, Instagram, Twitter } from 'lucide-react'

export function Footer() {
  const t = useTranslations('footer')
  const tNav = useTranslations('nav')
  const tContact = useTranslations('contact.info')

  return (
    <footer className="bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold tracking-tight mb-4">CARCITY</h3>
            <p className="text-neutral-400 max-w-md">{t('description')}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 mb-4">
              {t('quickLinks')}
            </h4>
            <nav className="flex flex-col gap-3">
              <Link href="/" className="text-neutral-300 hover:text-white transition-colors">
                {tNav('home')}
              </Link>
              <Link href="/cars" className="text-neutral-300 hover:text-white transition-colors">
                {tNav('inventory')}
              </Link>
              <Link href="/about" className="text-neutral-300 hover:text-white transition-colors">
                {tNav('about')}
              </Link>
              <Link href="/contact" className="text-neutral-300 hover:text-white transition-colors">
                {tNav('contact')}
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 mb-4">
              {t('contact')}
            </h4>
            <div className="space-y-3 text-neutral-300">
              <p className="whitespace-pre-line">{tContact('addressValue')}</p>
              <p>{tContact('phoneValue')}</p>
              <p>{tContact('emailValue')}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-neutral-400">
            © {new Date().getFullYear()} Carcity. {t('rights')}.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-neutral-400 hover:text-white transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-neutral-400 hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-neutral-400 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
