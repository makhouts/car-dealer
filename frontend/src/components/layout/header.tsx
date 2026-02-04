'use client'

import { Link, usePathname } from '@/i18n/routing'
import { useTranslations, useLocale } from 'next-intl'
import { useState, useEffect } from 'react'
import { Menu, X, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/cars', label: t('inventory') },
    { href: '/about', label: t('about') },
    { href: '/contact', label: t('contact') },
  ]

  const otherLocale = locale === 'nl' ? 'en' : 'nl'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'glass py-4' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="text-2xl font-bold tracking-tight text-white"
          data-testid="logo"
        >
          CARCITY
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-white ${
                pathname === link.href ? 'text-white' : 'text-zinc-400'
              }`}
              data-testid={`nav-${link.href.replace('/', '') || 'home'}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Language Switch + Browse Button + Mobile Menu */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href={pathname}
            locale={otherLocale}
            className="flex items-center gap-1 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            data-testid="language-switch"
          >
            <Globe className="w-4 h-4" />
            <span className="uppercase">{otherLocale}</span>
          </Link>

          <Link href="/cars">
            <Button 
              className="rounded-full px-6 bg-white text-black hover:bg-zinc-200"
              data-testid="browse-cars-btn"
            >
              {t('inventory')}
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          data-testid="mobile-menu-btn"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden glass mt-4 mx-6 rounded-xl p-6 animate-fade-in">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`py-2 text-sm font-medium transition-colors ${
                  pathname === link.href ? 'text-white' : 'text-zinc-400'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={pathname}
              locale={otherLocale}
              className="flex items-center gap-1 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase">{otherLocale}</span>
            </Link>
            <Link href="/cars" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full rounded-full bg-white text-black hover:bg-zinc-200">
                {t('inventory')}
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
