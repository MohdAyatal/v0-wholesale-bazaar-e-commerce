// Google Analytics 4 Event Tracker
// This is a placeholder/wrapper for GA4 tracking with proper TypeScript types

export interface GA4Event {
  name: string;
  params?: Record<string, string | number | boolean>;
}

export interface GA4PageViewEvent extends GA4Event {
  name: 'page_view';
  params?: {
    page_title?: string;
    page_location?: string;
    page_path?: string;
    referrer?: string;
  };
}

export interface GA4PurchaseEvent extends GA4Event {
  name: 'purchase';
  params?: {
    value: number;
    currency: string;
    transaction_id?: string;
    affiliation?: string;
    tax?: number;
    shipping?: number;
    items?: GA4Item[];
  };
}

export interface GA4ViewItemEvent extends GA4Event {
  name: 'view_item';
  params?: {
    currency?: string;
    value?: number;
    items?: GA4Item[];
  };
}

export interface GA4AddToCartEvent extends GA4Event {
  name: 'add_to_cart';
  params?: {
    currency?: string;
    value?: number;
    items?: GA4Item[];
  };
}

export interface GA4SearchEvent extends GA4Event {
  name: 'search';
  params?: {
    search_term: string;
    results?: number;
  };
}

export interface GA4Item {
  item_id?: string;
  item_name?: string;
  affiliation?: string;
  discount?: number;
  index?: number;
  item_brand?: string;
  item_category?: string;
  item_category2?: string;
  item_category3?: string;
  item_category4?: string;
  item_category5?: string;
  item_list_id?: string;
  item_list_name?: string;
  item_variant?: string;
  price?: number;
  quantity?: number;
}

export interface CustomEvent extends GA4Event {
  name: string;
  params?: Record<string, any>;
}

export class GoogleAnalytics4 {
  private static GA_ID = process.env.NEXT_PUBLIC_GA4_ID || '';

  /**
   * Initialize Google Analytics 4
   * Place this in your root layout
   */
  static getGtag() {
    if (typeof window !== 'undefined') {
      return (window as any).gtag;
    }
    return null;
  }

  /**
   * Track a page view
   */
  static trackPageView(pageData: GA4PageViewEvent['params']) {
    const gtag = this.getGtag();
    if (gtag) {
      gtag('event', 'page_view', {
        page_title: pageData?.page_title,
        page_location: pageData?.page_location || window.location.href,
        page_path: pageData?.page_path || window.location.pathname,
        referrer: pageData?.referrer || document.referrer,
      });
    }
  }

  /**
   * Track a purchase/conversion
   */
  static trackPurchase(purchaseData: GA4PurchaseEvent['params']) {
    const gtag = this.getGtag();
    if (gtag) {
      gtag('event', 'purchase', {
        value: purchaseData?.value,
        currency: purchaseData?.currency || 'INR',
        transaction_id: purchaseData?.transaction_id,
        affiliation: purchaseData?.affiliation,
        tax: purchaseData?.tax,
        shipping: purchaseData?.shipping,
        items: purchaseData?.items,
      });
    }
  }

  /**
   * Track a product view
   */
  static trackViewItem(itemData: GA4ViewItemEvent['params']) {
    const gtag = this.getGtag();
    if (gtag) {
      gtag('event', 'view_item', {
        currency: itemData?.currency || 'INR',
        value: itemData?.value,
        items: itemData?.items,
      });
    }
  }

  /**
   * Track add to cart
   */
  static trackAddToCart(cartData: GA4AddToCartEvent['params']) {
    const gtag = this.getGtag();
    if (gtag) {
      gtag('event', 'add_to_cart', {
        currency: cartData?.currency || 'INR',
        value: cartData?.value,
        items: cartData?.items,
      });
    }
  }

  /**
   * Track search
   */
  static trackSearch(searchData: GA4SearchEvent['params']) {
    const gtag = this.getGtag();
    if (gtag) {
      gtag('event', 'search', {
        search_term: searchData?.search_term,
        results: searchData?.results,
      });
    }
  }

  /**
   * Track custom event
   */
  static trackEvent(event: CustomEvent) {
    const gtag = this.getGtag();
    if (gtag) {
      gtag('event', event.name, event.params);
    }
  }

  /**
   * Track user properties (e.g., user ID, user type)
   */
  static setUserProperties(properties: Record<string, string | number | boolean>) {
    const gtag = this.getGtag();
    if (gtag) {
      gtag('set', 'user_properties', properties);
    }
  }

  /**
   * Get GA4 Measurement ID
   */
  static getMeasurementId() {
    return this.GA_ID;
  }
}

// Export for ease of use
export const trackPageView = (pageData?: GA4PageViewEvent['params']) =>
  GoogleAnalytics4.trackPageView(pageData);

export const trackPurchase = (purchaseData: GA4PurchaseEvent['params']) =>
  GoogleAnalytics4.trackPurchase(purchaseData);

export const trackViewItem = (itemData: GA4ViewItemEvent['params']) =>
  GoogleAnalytics4.trackViewItem(itemData);

export const trackAddToCart = (cartData: GA4AddToCartEvent['params']) =>
  GoogleAnalytics4.trackAddToCart(cartData);

export const trackSearch = (searchData: GA4SearchEvent['params']) =>
  GoogleAnalytics4.trackSearch(searchData);

export const trackEvent = (event: CustomEvent) => GoogleAnalytics4.trackEvent(event);

export const setUserProperties = (properties: Record<string, string | number | boolean>) =>
  GoogleAnalytics4.setUserProperties(properties);
