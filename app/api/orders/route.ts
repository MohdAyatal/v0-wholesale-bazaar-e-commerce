// app/api/orders/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Resend } from 'resend'; // or use Brevo/SendGrid

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const body = await request.json();
    const { 
      customer_name, 
      customer_email, 
      customer_phone, 
      shipping_address,
      items,
      total_amount,
      payment_method 
    } = body;

    // Generate Order ID
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const seg = (n: number) => Array.from({length: n}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const now = new Date();
    const order_number = `WB${now.getFullYear().toString().slice(-2)}${String(now.getMonth()+1).padStart(2,'0')}-${seg(3)}-${seg(4)}`;

    // Save to Supabase
    const { data, error } = await supabase
      .from('orders')
      .insert({
        order_number,
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        total_amount,
        payment_method,
        status: 'Pending',
        payment_status: payment_method === 'COD' ? 'pending' : 'paid',
        items: JSON.stringify(items),
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Send confirmation email via Brevo (SMTP)
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY!,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'Wholesale Baazar', email: 'wholesalebazaar.support@gmail.com' },
        to: [{ email: customer_email, name: customer_name }],
        subject: `Order Confirmation: ${order_number}`,
        htmlContent: `
          <h2>Thank you for your order!</h2>
          <p>Order ID: <strong>${order_number}</strong></p>
          <p>Total: ₹${total_amount.toLocaleString('en-IN')}</p>
          <p>We'll contact you at ${customer_phone} to confirm delivery.</p>
        `
      })
    });

    // Send WhatsApp notification (via your WhatsApp Business API)
    // await sendWhatsAppNotification(customer_phone, order_number);

    return NextResponse.json({ success: true, order_number, order: data });

  } catch (error) {
    console.error('Order creation failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
