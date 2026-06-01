import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/lib/analytics-service';

/**
 * POST /api/v1/analytics/track-conversion
 * Track conversion/purchase event
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.sessionId || !body.conversionType) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, conversionType' },
        { status: 400 }
      );
    }

    await AnalyticsService.trackConversion({
      userId: body.userId,
      sessionId: body.sessionId,
      orderId: body.orderId,
      conversionType: body.conversionType,
      revenue: body.revenue,
      itemsCount: body.itemsCount,
      conversionValue: body.conversionValue,
      currency: body.currency || 'INR',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Track conversion error:', error);
    return NextResponse.json(
      { error: 'Failed to track conversion' },
      { status: 500 }
    );
  }
}
