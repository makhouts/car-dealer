'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Home, ArrowLeft, Car } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center noise-overlay relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center px-6">
        {/* 404 Number */}
        <div className="relative mb-8">
          <h1 className="text-[180px] md:text-[250px] font-bold text-zinc-800 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Car className="w-24 h-24 md:w-32 md:h-32 text-red-500 animate-pulse" />
          </div>
        </div>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Oops! Road not found
        </h2>
        <p className="text-lg text-zinc-400 mb-10 max-w-md mx-auto">
          Looks like this route doesn't exist. The page you're looking for might have been moved or deleted.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="pill-button-secondary px-8 py-6 text-lg gap-2 h-auto border-zinc-700"
            data-testid="go-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </Button>
          <Link href="/nl">
            <Button
              className="pill-button-primary px-8 py-6 text-lg gap-2 h-auto"
              data-testid="go-home-btn"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-16 pt-8 border-t border-zinc-800">
          <p className="text-sm text-zinc-500 mb-4">Or check out these pages:</p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link href="/nl/cars" className="text-zinc-400 hover:text-white transition-colors">
              Browse Cars
            </Link>
            <Link href="/nl/about" className="text-zinc-400 hover:text-white transition-colors">
              About Us
            </Link>
            <Link href="/nl/contact" className="text-zinc-400 hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
