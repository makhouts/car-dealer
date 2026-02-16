'use client'

import { Link, usePathname } from '@/i18n/routing'
import { useTranslations, useLocale } from 'next-intl'
import { useState, useEffect } from 'react'
import { Menu, X, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  variant?: 'dark' | 'light'
}

export function Header({ variant = 'dark' }: HeaderProps) {
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

  // Dynamic styles based on variant
  const isDark = variant === 'dark'
  
  const headerBg = scrolled
    ? isDark ? 'glass py-4' : 'glass-light py-4 shadow-sm'
    : 'bg-transparent py-6'
  
  const logoColor = scrolled
    ? isDark ? 'text-white' : 'text-zinc-900'
    : isDark ? 'text-white' : 'text-zinc-900'
  
  const navLinkBase = scrolled
    ? isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
    : isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
  
  const navLinkActive = scrolled
    ? isDark ? 'text-white' : 'text-[#B5946A]'
    : isDark ? 'text-white' : 'text-[#B5946A]'

  const mobileMenuBtnColor = isDark ? 'text-white' : 'text-zinc-900'
  
  const browseButtonStyle = isDark
    ? 'bg-white text-black hover:bg-zinc-200'
    : 'bg-zinc-900 text-white hover:bg-zinc-800'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className={`text-2xl font-bold tracking-tight transition-colors ${logoColor}`}
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
              className={`text-sm font-medium transition-colors ${
                pathname === link.href ? navLinkActive : navLinkBase
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
            className={`flex items-center gap-1 text-sm font-medium transition-colors ${navLinkBase}`}
            data-testid="language-switch"
          >
            <Globe className="w-4 h-4" />
            <span className="uppercase">{otherLocale}</span>
          </Link>

          <Link href="/cars">
            <Button 
              className={`rounded-full px-6 ${browseButtonStyle}`}
              data-testid="browse-cars-btn"
            >
              {t('inventory')}
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden p-2 ${mobileMenuBtnColor}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          data-testid="mobile-menu-btn"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className={`md:hidden mt-4 mx-6 rounded-xl p-6 animate-fade-in ${isDark ? 'glass' : 'glass-light shadow-lg'}`}>
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`py-2 text-sm font-medium transition-colors ${
                  pathname === link.href ? navLinkActive : navLinkBase
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={pathname}
              locale={otherLocale}
              className={`flex items-center gap-1 py-2 text-sm font-medium transition-colors ${navLinkBase}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase">{otherLocale}</span>
            </Link>
            <Link href="/cars" onClick={() => setMobileMenuOpen(false)}>
              <Button className={`w-full rounded-full ${browseButtonStyle}`}>
                {t('inventory')}
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
