import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, eventType, location, description } = body;

    const { data, error } = await supabase
      .from('order_tracking_events')
      .insert({
        order_id: orderId,
        event_type: eventType,
        location: location,
        description: description,
        timestamp: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ event: data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add tracking event' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'orderId is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('order_tracking_events')
      .select('*')
      .eq('order_id', orderId)
      .order('timestamp', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ events: data || [] });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tracking events' },
      { status: 500 }
    );
  }
}
