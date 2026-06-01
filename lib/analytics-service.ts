import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Analytics Service
export class AnalyticsService {
  // Track Page View
  static async trackPageView(data: {
    userId?: string;
    sessionId: string;
    pageUrl: string;
    pageTitle?: string;
    referrer?: string;
    userAgent?: string;
    ipAddress?: string;
    country?: string;
    city?: string;
    viewDuration?: number;
  }) {
    try {
      const { error } = await supabase
        .from('analytics_page_views')
        .insert([
          {
            user_id: data.userId,
            session_id: data.sessionId,
            page_url: data.pageUrl,
            page_title: data.pageTitle,
            referrer: data.referrer,
            user_agent: data.userAgent,
            ip_address: data.ipAddress,
            country: data.country,
            city: data.city,
            view_duration_seconds: data.viewDuration,
          },
        ]);

      if (error) console.error('[Analytics] Page view error:', error);
    } catch (error) {
      console.error('[Analytics] Unexpected error:', error);
    }
  }

  // Track User Event
  static async trackEvent(data: {
    userId?: string;
    sessionId: string;
    eventType: string;
    eventName: string;
    eventValue?: number;
    eventCategory?: string;
    eventLabel?: string;
    properties?: Record<string, any>;
  }) {
    try {
      const { error } = await supabase
        .from('analytics_user_events')
        .insert([
          {
            user_id: data.userId,
            session_id: data.sessionId,
            event_type: data.eventType,
            event_name: data.eventName,
            event_value: data.eventValue,
            event_category: data.eventCategory,
            event_label: data.eventLabel,
            properties: data.properties,
          },
        ]);

      if (error) console.error('[Analytics] Event tracking error:', error);
    } catch (error) {
      console.error('[Analytics] Unexpected error:', error);
    }
  }

  // Track Product View
  static async trackProductView(data: {
    userId?: string;
    sessionId: string;
    productId?: string;
    productName?: string;
    productCategory?: string;
    productPrice?: number;
    viewDuration?: number;
  }) {
    try {
      const { error } = await supabase
        .from('analytics_product_views')
        .insert([
          {
            user_id: data.userId,
            session_id: data.sessionId,
            product_id: data.productId,
            product_name: data.productName,
            product_category: data.productCategory,
            product_price: data.productPrice,
            view_duration_seconds: data.viewDuration,
          },
        ]);

      if (error) console.error('[Analytics] Product view error:', error);
    } catch (error) {
      console.error('[Analytics] Unexpected error:', error);
    }
  }

  // Track Conversion (Purchase)
  static async trackConversion(data: {
    userId?: string;
    sessionId: string;
    orderId?: string;
    conversionType: string;
    revenue?: number;
    itemsCount?: number;
    conversionValue?: number;
    currency?: string;
  }) {
    try {
      const { error } = await supabase
        .from('analytics_conversions')
        .insert([
          {
            user_id: data.userId,
            session_id: data.sessionId,
            order_id: data.orderId,
            conversion_type: data.conversionType,
            revenue: data.revenue,
            items_count: data.itemsCount,
            conversion_value: data.conversionValue,
            currency: data.currency || 'INR',
          },
        ]);

      if (error) console.error('[Analytics] Conversion error:', error);
    } catch (error) {
      console.error('[Analytics] Unexpected error:', error);
    }
  }

  // Track Search Query
  static async trackSearch(data: {
    userId?: string;
    sessionId: string;
    query: string;
    resultsCount?: number;
    selectedResultId?: string;
  }) {
    try {
      const { error } = await supabase
        .from('analytics_search_queries')
        .insert([
          {
            user_id: data.userId,
            session_id: data.sessionId,
            query: data.query,
            results_count: data.resultsCount,
            selected_result_id: data.selectedResultId,
          },
        ]);

      if (error) console.error('[Analytics] Search tracking error:', error);
    } catch (error) {
      console.error('[Analytics] Unexpected error:', error);
    }
  }

  // Create or Update User Session
  static async createUserSession(data: {
    userId?: string;
    sessionId: string;
    deviceType?: string;
    os?: string;
    browser?: string;
    country?: string;
    city?: string;
    entryPage?: string;
    ipAddress?: string;
  }) {
    try {
      const { error } = await supabase
        .from('analytics_user_sessions')
        .insert([
          {
            user_id: data.userId,
            session_id: data.sessionId,
            device_type: data.deviceType,
            os: data.os,
            browser: data.browser,
            country: data.country,
            city: data.city,
            entry_page: data.entryPage,
            page_views_count: 0,
            events_count: 0,
            ip_address: data.ipAddress,
          },
        ]);

      if (error) console.error('[Analytics] Session creation error:', error);
    } catch (error) {
      console.error('[Analytics] Unexpected error:', error);
    }
  }

  // Track Device Info
  static async trackDeviceInfo(data: {
    userId?: string;
    sessionId: string;
    deviceType?: string;
    os?: string;
    osVersion?: string;
    browser?: string;
    browserVersion?: string;
    screenWidth?: number;
    screenHeight?: number;
    viewportWidth?: number;
    viewportHeight?: number;
    language?: string;
    timezone?: string;
  }) {
    try {
      const { error } = await supabase
        .from('analytics_device_info')
        .insert([
          {
            user_id: data.userId,
            session_id: data.sessionId,
            device_type: data.deviceType,
            os: data.os,
            os_version: data.osVersion,
            browser: data.browser,
            browser_version: data.browserVersion,
            screen_width: data.screenWidth,
            screen_height: data.screenHeight,
            viewport_width: data.viewportWidth,
            viewport_height: data.viewportHeight,
            language: data.language,
            timezone: data.timezone,
          },
        ]);

      if (error) console.error('[Analytics] Device info error:', error);
    } catch (error) {
      console.error('[Analytics] Unexpected error:', error);
    }
  }

  // Get Analytics Summary
  static async getAnalyticsSummary(days: number = 30) {
    try {
      const { data, error } = await supabase
        .from('analytics_summary')
        .select('*')
        .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[Analytics] Summary fetch error:', error);
      return [];
    }
  }

  // Get Session Statistics
  static async getSessionStats() {
    try {
      const { data, error } = await supabase
        .from('analytics_user_sessions')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[Analytics] Session stats error:', error);
      return [];
    }
  }

  // Get Revenue Data
  static async getRevenueData(days: number = 30) {
    try {
      const { data, error } = await supabase
        .from('analytics_conversions')
        .select('*')
        .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[Analytics] Revenue data error:', error);
      return [];
    }
  }
}
