import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/lib/analytics-service';

/**
 * POST /api/v1/analytics/track-page-view
 * Track a page view event
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.sessionId || !body.pageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, pageUrl' },
        { status: 400 }
      );
    }

    await AnalyticsService.trackPageView({
      userId: body.userId,
      sessionId: body.sessionId,
      pageUrl: body.pageUrl,
      pageTitle: body.pageTitle,
      referrer: body.referrer,
      userAgent: request.headers.get('user-agent') || undefined,
      ipAddress: request.headers.get('x-forwarded-for') || 
                 request.headers.get('x-real-ip') || 
                 'unknown',
      country: body.country,
      city: body.city,
      viewDuration: body.viewDuration,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Track page view error:', error);
    return NextResponse.json(
      { error: 'Failed to track page view' },
      { status: 500 }
    );
  }
}
