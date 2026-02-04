import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { customAlphabet } from 'nanoid'
import slugifyLib from 'slugify'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate short ID (6-8 chars)
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 6)
export const generateShortId = () => nanoid()

// Generate slug from car details
export function generateSlug(brand: string, model: string, year: number, title?: string): string {
  const parts = [brand, model, year.toString()]
  if (title) {
    parts.push(title.split(' ').slice(0, 3).join(' '))
  }
  return slugifyLib(parts.join(' '), { lower: true, strict: true })
}

// Format price with currency
export function formatPrice(price: number, locale: string = 'nl'): string {
  return new Intl.NumberFormat(locale === 'nl' ? 'nl-BE' : 'en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Format mileage
export function formatMileage(mileage: number, locale: string = 'nl'): string {
  return new Intl.NumberFormat(locale === 'nl' ? 'nl-BE' : 'en-US').format(mileage) + ' km'
}

// Build car URL
export function buildCarUrl(slug: string, shortId: string): string {
  return `/cars/${slug}-${shortId}`
}

// Parse car URL to get shortId
export function parseCarUrl(slugWithId: string): { slug: string; shortId: string } | null {
  const lastDash = slugWithId.lastIndexOf('-')
  if (lastDash === -1) return null
  
  return {
    slug: slugWithId.substring(0, lastDash),
    shortId: slugWithId.substring(lastDash + 1),
  }
}

// WhatsApp URL builder
export function buildWhatsAppUrl(message: string, phoneNumber?: string): string {
  const phone = phoneNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+32123456789'
  const cleanPhone = phone.replace(/[^0-9+]/g, '')
  return `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(message)}`
}
