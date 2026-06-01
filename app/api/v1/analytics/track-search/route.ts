import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/lib/analytics-service';

/**
 * POST /api/v1/analytics/track-search
 * Track search query event
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.sessionId || !body.query) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, query' },
        { status: 400 }
      );
    }

    await AnalyticsService.trackSearch({
      userId: body.userId,
      sessionId: body.sessionId,
      query: body.query,
      resultsCount: body.resultsCount,
      selectedResultId: body.selectedResultId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Track search error:', error);
    return NextResponse.json(
      { error: 'Failed to track search' },
      { status: 500 }
    );
  }
}
