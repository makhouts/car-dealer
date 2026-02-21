'use client'

import { Link, usePathname } from '@/i18n/routing'
import { useTranslations, useLocale } from 'next-intl'
import { useState, useEffect } from 'react'
import { Menu, X, Globe } from 'lucide-react'

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
  const isDark = variant === 'dark'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? 'header-scrolled py-3'
        : 'bg-transparent py-6'
        }`}
    >
      {/* Gold accent line at bottom when scrolled */}
      {scrolled && (
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(181,148,106,0.4), transparent)',
          }}
        />
      )}

      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className={`text-2xl font-bold tracking-tight transition-colors ${isDark ? 'text-white' : 'text-zinc-900'
            }`}
          data-testid="logo"
        >
          CARCITY
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link group relative py-1"
                data-testid={`nav-${link.href.replace('/', '') || 'home'}`}
              >
                <span
                  className={`text-xs font-semibold tracking-[0.12em] uppercase transition-colors duration-300 ${isActive
                    ? 'text-[#B5946A]'
                    : isDark
                      ? 'text-zinc-400 group-hover:text-white'
                      : 'text-zinc-500 group-hover:text-zinc-900'
                    }`}
                >
                  {link.label}
                </span>
                {/* Animated underline */}
                <span
                  className="absolute bottom-0 left-0 h-px transition-all duration-300"
                  style={{
                    background: 'linear-gradient(90deg, var(--gold), var(--gold-light))',
                    width: isActive ? '100%' : '0%',
                  }}
                />
                {/* Hover underline (CSS only via group-hover) */}
                <span
                  className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                  style={{
                    background: 'linear-gradient(90deg, var(--gold), var(--gold-light))',
                    opacity: isActive ? 0 : 0.6,
                  }}
                />
              </Link>
            )
          })}
        </nav>

        {/* Right side: Language + CTA */}
        <div className="hidden md:flex items-center gap-5">
          {/* Language switch */}
          <Link
            href={pathname}
            locale={otherLocale}
            className={`flex items-center gap-1.5 text-xs font-semibold tracking-[0.1em] uppercase transition-colors duration-300 ${isDark ? 'text-zinc-500 hover:text-zinc-200' : 'text-zinc-400 hover:text-zinc-700'
              }`}
            data-testid="language-switch"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{otherLocale}</span>
          </Link>

          {/* Divider */}
          <div
            className="w-px h-4"
            style={{ background: 'rgba(181,148,106,0.25)' }}
          />

          {/* Gold CTA button */}
          <Link href="/cars" data-testid="browse-cars-btn">
            <button
              className="group relative overflow-hidden rounded-full px-6 py-2.5 text-xs font-semibold tracking-[0.12em] uppercase transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #B5946A 0%, #8B6E4E 100%)',
                color: 'white',
                boxShadow: '0 0 20px rgba(181,148,106,0.25)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.boxShadow = '0 0 35px rgba(181,148,106,0.5)'
                el.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.boxShadow = '0 0 20px rgba(181,148,106,0.25)'
                el.style.transform = 'translateY(0)'
              }}
            >
              {/* Shine sweep */}
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)',
                  backgroundSize: '200% 100%',
                }}
              />
              <span className="relative cursor-pointer">{t('inventory')}</span>
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden p-2 transition-colors ${isDark ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          data-testid="mobile-menu-btn"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden mt-3 mx-4 rounded-2xl p-6 animate-fade-in ${isDark ? 'glass' : 'glass-light shadow-xl'
            }`}
          style={{
            border: '1px solid rgba(181,148,106,0.15)',
          }}
        >
          {/* Gold top accent */}
          <div
            className="w-12 h-px mb-5 mx-auto"
            style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }}
          />
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-3 px-2 text-xs font-semibold tracking-[0.12em] uppercase border-b transition-colors duration-200 ${isActive
                    ? 'text-[#B5946A]'
                    : isDark
                      ? 'text-zinc-400 hover:text-white'
                      : 'text-zinc-500 hover:text-zinc-900'
                    }`}
                  style={{ borderColor: 'rgba(181,148,106,0.1)' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="mt-5 flex items-center justify-between">
            <Link
              href={pathname}
              locale={otherLocale}
              className={`flex items-center gap-1.5 text-xs font-semibold tracking-[0.1em] uppercase transition-colors ${isDark ? 'text-zinc-500 hover:text-zinc-200' : 'text-zinc-400 hover:text-zinc-700'
                }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{otherLocale}</span>
            </Link>

            <Link href="/cars" onClick={() => setMobileMenuOpen(false)}>
              <button
                className="rounded-full px-5 py-2 text-xs font-semibold tracking-[0.12em] uppercase text-white"
                style={{
                  background: 'linear-gradient(135deg, #B5946A 0%, #8B6E4E 100%)',
                  boxShadow: '0 0 16px rgba(181,148,106,0.3)',
                }}
              >
                {t('inventory')}
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
