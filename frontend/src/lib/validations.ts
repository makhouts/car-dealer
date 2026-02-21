import { z } from 'zod'

export const carSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  price: z.number().min(0),
  mileage: z.number().min(0),
  fuelType: z.enum(['petrol', 'diesel', 'hybrid', 'electric', 'other']),
  transmission: z.enum(['automatic', 'manual', 'other']),
  bodyType: z.enum(['sedan', 'suv', 'coupe', 'hatchback', 'wagon', 'convertible', 'van', 'other']),
  condition: z.enum(['new', 'used']),
  colorExterior: z.string().min(1, 'Exterior color is required'),
  colorInterior: z.string().optional(),
  powerHP: z.number().optional(),
  engine: z.string().optional(),
  drivetrain: z.string().optional(),
  seats: z.number().optional(),
  doors: z.number().optional(),
  features: z.array(z.string()).default([]),
  description: z.string().min(1, 'Description is required'),
  images: z.array(z.string()).default([]),
  carPassUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  isFeatured: z.boolean().default(false),
  status: z.enum(['available', 'reserved', 'sold']).default('available'),
})

export const leadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
  carId: z.string().optional(),
  honeypot: z.string().max(0).optional(), // Anti-spam honeypot
})

export const carrosserieLeadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  chassisNumber: z.string().min(1, 'Chassis number is required'),
  serviceType: z.string().min(1, 'Service type is required'),
  message: z.string().optional(),
  honeypot: z.string().max(0).optional(), // Anti-spam honeypot
})

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

export type CarInput = z.infer<typeof carSchema>
export type LeadInput = z.infer<typeof leadSchema>
export type CarrosserieLeadInput = z.infer<typeof carrosserieLeadSchema>
export type CarrosserieLeadInput = z.infer<typeof carrosserieLeadSchema>
export type LoginInput = z.infer<typeof loginSchema>
