import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/lib/analytics-service';

/**
 * POST /api/v1/analytics/track-product-view
 * Track product view event
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.sessionId) {
      return NextResponse.json(
        { error: 'Missing required field: sessionId' },
        { status: 400 }
      );
    }

    await AnalyticsService.trackProductView({
      userId: body.userId,
      sessionId: body.sessionId,
      productId: body.productId,
      productName: body.productName,
      productCategory: body.productCategory,
      productPrice: body.productPrice,
      viewDuration: body.viewDuration,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Track product view error:', error);
    return NextResponse.json(
      { error: 'Failed to track product view' },
      { status: 500 }
    );
  }
}
