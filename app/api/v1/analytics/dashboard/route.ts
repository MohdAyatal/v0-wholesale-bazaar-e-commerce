import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/lib/analytics-service';

/**
 * GET /api/v1/analytics/dashboard
 * Get analytics dashboard data
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '30');

    const [summary, sessions, revenue] = await Promise.all([
      AnalyticsService.getAnalyticsSummary(days),
      AnalyticsService.getSessionStats(),
      AnalyticsService.getRevenueData(days),
    ]);

    // Calculate aggregated metrics
    const totalRevenue = revenue.reduce((sum, item) => sum + (item.revenue || 0), 0);
    const totalConversions = revenue.length;
    const avgOrderValue = totalConversions > 0 ? totalRevenue / totalConversions : 0;

    return NextResponse.json({
      summary,
      sessions,
      revenue,
      metrics: {
        totalRevenue,
        totalConversions,
        avgOrderValue,
        totalSessions: sessions.length,
      },
    });
  } catch (error) {
    console.error('[API] Dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
