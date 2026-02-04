# Velocità Motors - Car Dealership Website PRD

## Original Problem Statement
Build a very modern website for a secondhand car dealership with premium luxury feel, car inventory with filters, car detail pages with more images, and admin panel to manage cars.

## User Personas
1. **Car Buyer** - Browsing inventory, filtering cars, viewing details, sending inquiries
2. **Dealership Admin** - Managing inventory, responding to inquiries, tracking sales

## Core Requirements
- Premium luxury design with clean aesthetic
- Car inventory with filters (brand, price, year, mileage, fuel type, body type)
- Detailed car pages with image galleries
- Contact/inquiry forms
- Admin panel for CRUD operations

## What's Been Implemented (Feb 2025)

### Frontend Pages
- **Landing Page**: Hero section, featured cars, why choose us, contact form, footer
- **Inventory Page**: Full car listing with sidebar filters, search, sorting
- **Car Detail Page**: Image gallery, specifications, features list, inquiry form
- **Admin Login**: Glassmorphism login with credentials hint
- **Admin Dashboard**: Stats cards, recent vehicles, recent inquiries
- **Admin Cars**: Full CRUD - add/edit/delete cars with dialog form
- **Admin Inquiries**: View and manage customer inquiries with status updates

### Backend API Endpoints
- Cars: CRUD operations, filters, featured, brands, stats
- Inquiries: Create, list, update status, stats
- Contact: Store contact form messages
- Admin: Authentication endpoint
- Seed: Database seeding endpoint

### Design System
- Colors: Obsidian (#09090b), Platinum (#f4f4f5), Racing Red (#dc2626)
- Typography: Outfit (headings), Inter (body), JetBrains Mono (specs/prices)
- Theme: Dark mode for landing, light mode for inventory/admin
- Effects: Glassmorphism, noise texture, hover animations

## Prioritized Backlog

### P0 - Critical (Done)
- [x] Landing page with featured cars
- [x] Inventory with filters
- [x] Car detail pages
- [x] Admin CRUD operations
- [x] Contact/inquiry forms

### P1 - High Priority (Future)
- [ ] Image upload functionality (currently URL-based)
- [ ] Test drive booking system
- [ ] Email notifications for inquiries
- [ ] User favorites/wishlist

### P2 - Medium Priority (Future)
- [ ] Compare cars feature
- [ ] Finance calculator
- [ ] Car history reports
- [ ] Social sharing

### P3 - Nice to Have
- [ ] AI chatbot for customer assistance
- [ ] Virtual car tours (360°)
- [ ] Customer reviews
- [ ] Analytics dashboard

## Technical Stack
- Frontend: React, Tailwind CSS, Shadcn/UI, Framer Motion
- Backend: FastAPI, MongoDB
- Authentication: Simple admin auth (localStorage + backend validation)

## Admin Credentials
- Username: admin
- Password: velocita2024
