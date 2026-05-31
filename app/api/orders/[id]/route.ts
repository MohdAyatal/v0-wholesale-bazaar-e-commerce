import { createClient } from '@supabase/supabase-js';
import { NextResponse, NextRequest } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;  // <-- await the params

    // Fetch order with items
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Fetch order items
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 400 });
    }

    // Fetch status history
    const { data: statusHistory } = await supabase
      .from('order_status_history')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false });

    // Fetch tracking events
    const { data: trackingEvents } = await supabase
      .from('order_tracking_events')
      .select('*')
      .eq('order_id', orderId)
      .order('timestamp', { ascending: false });

    return NextResponse.json({
      order: {
        ...order,
        items: items || [],
        statusHistory: statusHistory || [],
        trackingEvents: trackingEvents || []
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch order details' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;  // <-- await the params
    const body = await request.json();

    const { data, error } = await supabase
      .from('orders')
      .update({
        status: body.status,
        admin_notes: body.adminNotes,
        tracking_number: body.trackingNumber,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Log status change
    if (body.status) {
      await supabase.from('order_status_history').insert({
        order_id: orderId,
        old_status: body.oldStatus,
        new_status: body.status,
        changed_by: body.changedBy || 'admin',
        notes: body.statusChangeReason
      });
    }

    return NextResponse.json({ order: data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
