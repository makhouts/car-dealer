import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { loginSchema } from '@/lib/validations'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = loginSchema.parse(body)

    const adminPassword = process.env.ADMIN_PASSWORD || 'admin'

    if (username === 'admin' && password === adminPassword) {
      const session = await getSession()
      session.isLoggedIn = true
      session.username = username
      await session.save()

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 400 })
  }
}
