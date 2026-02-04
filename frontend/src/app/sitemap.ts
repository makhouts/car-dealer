import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { buildCarUrl } from '@/lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // Static pages
  const staticPages = [
    { url: `${siteUrl}/nl`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${siteUrl}/en`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${siteUrl}/nl/cars`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${siteUrl}/en/cars`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${siteUrl}/nl/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${siteUrl}/en/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${siteUrl}/nl/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${siteUrl}/en/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
  ]

  // Dynamic car pages
  let carPages: MetadataRoute.Sitemap = []
  try {
    const cars = await prisma.car.findMany({
      where: { status: { in: ['available', 'reserved'] } },
      select: { slug: true, shortId: true, updatedAt: true },
    })

    carPages = cars.flatMap((car) => {
      const carPath = buildCarUrl(car.slug, car.shortId)
      return [
        { url: `${siteUrl}/nl${carPath}`, lastModified: car.updatedAt, changeFrequency: 'weekly' as const, priority: 0.8 },
        { url: `${siteUrl}/en${carPath}`, lastModified: car.updatedAt, changeFrequency: 'weekly' as const, priority: 0.8 },
      ]
    })
  } catch (error) {
    console.error('Sitemap car fetch error:', error)
  }

  return [...staticPages, ...carPages]
}
