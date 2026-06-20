import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      items,
      total_amount,
      payment_method,
      payment_status,
      razorpay_order_id,
      razorpay_payment_id,
      user_id,
    } = body

    // Generate order number
    const order_number = `WB${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { data, error } = await supabase
      .from('orders')
      .insert([{
        order_number,
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        billing_address: shipping_address,
        items: JSON.stringify(items),
        total_amount,
        status: 'pending',
        payment_method: payment_method || 'cod',
        payment_status: payment_status || 'pending',
        notes: razorpay_order_id
          ? `Razorpay Order: ${razorpay_order_id} | Payment: ${razorpay_payment_id}`
          : null,
      }])
      .select()
      .single()

    if (error) {
      console.error('Supabase order error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ order_number, id: data.id }, { status: 201 })

  } catch (err: any) {
    console.error('Order API error:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const order_number = searchParams.get('order_number')

    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    let query = supabase.from('orders').select('*').order('created_at', { ascending: false })

    if (order_number) query = query.eq('order_number', order_number)
    else if (email) query = query.eq('customer_email', email)

    const { data, error } = await query

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ orders: data })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
