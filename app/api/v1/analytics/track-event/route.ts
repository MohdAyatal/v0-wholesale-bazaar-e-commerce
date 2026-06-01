import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/lib/analytics-service';

/**
 * POST /api/v1/analytics/track-event
 * Track a custom user event
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.sessionId || !body.eventType || !body.eventName) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, eventType, eventName' },
        { status: 400 }
      );
    }

    await AnalyticsService.trackEvent({
      userId: body.userId,
      sessionId: body.sessionId,
      eventType: body.eventType,
      eventName: body.eventName,
      eventValue: body.eventValue,
      eventCategory: body.eventCategory,
      eventLabel: body.eventLabel,
      properties: body.properties,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Track event error:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}
