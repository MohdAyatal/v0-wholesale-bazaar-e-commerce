// app/api/orders/route.ts
import { NextResponse } from 'next/server'

// Use your existing Supabase credentials from lib/supabase/client.ts
const SUPABASE_URL = 'https://lpjlgwvjspfujjcfatww.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwamxnd3Zqc3BmdWpqY2ZhdHd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDIwOTQsImV4cCI6MjA5NTMxODA5NH0.Zy0Fw2-cv86Xw_1-PvnST4G2Jnlg1BfAv9dFKfQGqTI'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { customer_name, customer_email, customer_phone, shipping_address, items, total_amount, payment_method } = body

    // Generate Order ID
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    const seg = (n: number) => Array.from({length: n}, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    const now = new Date()
    const order_number = `WB${now.getFullYear().toString().slice(-2)}${String(now.getMonth()+1).padStart(2,'0')}-${seg(3)}-${seg(4)}`

    // Save to Supabase via REST API
    const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        order_number,
        customer_name: customer_name.trim(),
        customer_email: customer_email.toLowerCase().trim(),
        customer_phone: customer_phone.trim(),
        shipping_address: shipping_address?.trim(),
        total_amount: Math.round(total_amount),
        status: 'Pending',
        payment_method: payment_method || 'COD',
        payment_status: payment_method === 'razorpay' ? 'paid' : 'pending',
        items: JSON.stringify(items),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to save order')
    }

    const data = await response.json()

    return NextResponse.json({ success: true, order_number, order: data[0] })

  } catch (error: any) {
    console.error('Order creation failed:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const order_number = searchParams.get('order_number')
  const email = searchParams.get('email')

  let url = `${SUPABASE_URL}/rest/v1/orders?select=*`
  if (order_number) {
    url += `&order_number=eq.${order_number.toUpperCase()}`
  }
  if (email) {
    url += `&customer_email=eq.${email.toLowerCase()}`
  }
  url += '&order=created_at.desc'

  const response = await fetch(url, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  })

  const data = await response.json()
  return NextResponse.json({ orders: data || [] })
}
