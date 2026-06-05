import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { amount } = await req.json()

    if (!amount || amount < 1) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const keyId     = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: 'Razorpay keys not configured' }, { status: 500 })
    }

    // Call Razorpay API directly (no SDK needed — avoids install issues)
    const credentials = Buffer.from(`${keyId}:${keySecret}`).toString('base64')

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        amount:   Math.round(amount * 100), // paise
        currency: 'INR',
        receipt:  `wb_${Date.now()}`,
        payment_capture: 1,
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.error?.description || 'Razorpay order creation failed')
    }

    const order = await response.json()
    return NextResponse.json(order)

  } catch (err: any) {
    console.error('Razorpay error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
