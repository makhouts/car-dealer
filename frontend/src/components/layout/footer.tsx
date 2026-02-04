import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { Facebook, Instagram, Twitter } from 'lucide-react'

export function Footer() {
  const t = useTranslations('footer')
  const tNav = useTranslations('nav')
  const tContact = useTranslations('contact.info')

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-2xl font-bold text-white tracking-tight">CARCITY</div>
          <div className="flex items-center gap-8 text-zinc-500 text-sm">
            <Link href="/cars" className="hover:text-white transition-colors">
              {tNav('inventory')}
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              {tNav('about')}
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              {tNav('contact')}
            </Link>
            <Link href="/admin/login" className="hover:text-white transition-colors">
              Admin
            </Link>
          </div>
          <p className="text-zinc-600 text-sm">
            © {new Date().getFullYear()} Carcity. {t('rights')}.
          </p>
        </div>
      </div>
    </footer>
  )
}
