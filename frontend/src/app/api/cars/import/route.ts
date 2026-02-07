import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateShortId, generateSlug } from '@/lib/utils'

interface CsvCar {
  title: string
  brand: string
  model: string
  year: number
  price: number
  mileage: number
  fuelType: string
  transmission: string
  bodyType: string
  condition: string
  colorExterior: string
  colorInterior?: string
  powerHP?: number
  engine?: string
  drivetrain?: string
  seats?: number
  doors?: number
  features: string[]
  description: string
  images: string[]
  isFeatured: boolean
  status: string
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"' && inQuotes && nextChar === '"') {
      current += '"'
      i++ // Skip next quote
    } else if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  result.push(current.trim())

  return result
}

function parseCSV(csvContent: string): CsvCar[] {
  const lines = csvContent.split('\n').filter(line => line.trim())
  if (lines.length < 2) return []

  const headers = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase())
  const cars: CsvCar[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    const car: Record<string, unknown> = {}

    headers.forEach((header, index) => {
      const value = values[index] || ''

      switch (header) {
        case 'year':
        case 'price':
        case 'mileage':
          car[header] = parseInt(value) || 0
          break
        case 'powerhp':
        case 'seats':
        case 'doors':
          car[header === 'powerhp' ? 'powerHP' : header] = value ? parseInt(value) : undefined
          break
        case 'features':
        case 'images':
          car[header] = value ? value.split(',').map(s => s.trim()).filter(Boolean) : []
          break
        case 'isfeatured':
          car['isFeatured'] = value.toLowerCase() === 'true'
          break
        case 'colorexterior':
          car['colorExterior'] = value
          break
        case 'colorinterior':
          car['colorInterior'] = value || undefined
          break
        case 'fueltype':
          car['fuelType'] = value || 'petrol'
          break
        case 'bodytype':
          car['bodyType'] = value || 'sedan'
          break
        case 'id':
        case 'shortid':
          // Skip these fields for import
          break
        default:
          car[header] = value
      }
    })

    // Validate required fields
    if (car.brand && car.model && car.title && car.year && car.price !== undefined) {
      cars.push({
        title: (car.title as string) || '',
        brand: (car.brand as string) || '',
        model: (car.model as string) || '',
        year: (car.year as number) || new Date().getFullYear(),
        price: (car.price as number) || 0,
        mileage: (car.mileage as number) || 0,
        fuelType: (car.fuelType as string) || 'petrol',
        transmission: (car.transmission as string) || 'automatic',
        bodyType: (car.bodyType as string) || 'sedan',
        condition: (car.condition as string) || 'used',
        colorExterior: (car.colorExterior as string) || '',
        colorInterior: car.colorInterior as string | undefined,
        powerHP: car.powerHP as number | undefined,
        engine: car.engine as string | undefined,
        drivetrain: car.drivetrain as string | undefined,
        seats: car.seats as number | undefined,
        doors: car.doors as number | undefined,
        features: (car.features as string[]) || [],
        description: (car.description as string) || '',
        images: (car.images as string[]) || [],
        isFeatured: (car.isFeatured as boolean) || false,
        status: (car.status as string) || 'available',
      })
    }
  }

  return cars
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const csvContent = await file.text()
    const cars = parseCSV(csvContent)

    if (cars.length === 0) {
      return NextResponse.json({ error: 'No valid cars found in CSV' }, { status: 400 })
    }

    let imported = 0
    let failed = 0

    for (const carData of cars) {
      try {
        const shortId = generateShortId()
        const slug = generateSlug(carData.brand, carData.model, carData.year, carData.title)

        await prisma.car.create({
          data: {
            ...carData,
            shortId,
            slug,
          },
        })
        imported++
      } catch (err) {
        console.error('Failed to import car:', err)
        failed++
      }
    }

    return NextResponse.json({
      success: true,
      imported,
      failed,
      total: cars.length,
    })
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json({ error: 'Import failed' }, { status: 500 })
  }
}
