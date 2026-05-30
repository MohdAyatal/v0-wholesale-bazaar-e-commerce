import { NextRequest, NextResponse } from 'next/server'

// Admin credentials (in production, store these securely)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@wholesalebaazar.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Generate a simple token (in production, use JWT with proper signing)
      const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')
      
      return NextResponse.json({
        success: true,
        token,
        email
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
