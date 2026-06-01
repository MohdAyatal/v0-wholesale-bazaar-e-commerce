// Session Management Utility
import { v4 as uuidv4 } from 'uuid';

const SESSION_ID_KEY = 'wb_session_id';
const SESSION_STORAGE_KEY = 'wb_session_data';

export interface SessionData {
  sessionId: string;
  userId?: string;
  createdAt: number;
  deviceType: string;
  os: string;
  browser: string;
  screenWidth: number;
  screenHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  language: string;
  timezone: string;
}

export class SessionManager {
  /**
   * Get or create a session ID
   */
  static getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return '';

    let sessionId = localStorage.getItem(SESSION_ID_KEY);
    
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem(SESSION_ID_KEY, sessionId);
    }
    
    return sessionId;
  }

  /**
   * Clear session ID
   */
  static clearSessionId(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_ID_KEY);
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }

  /**
   * Get device information
   */
  static getDeviceInfo() {
    if (typeof window === 'undefined') {
      return {
        deviceType: 'unknown',
        os: 'unknown',
        browser: 'unknown',
        screenWidth: 0,
        screenHeight: 0,
        viewportWidth: 0,
        viewportHeight: 0,
        language: 'en',
        timezone: 'UTC',
      };
    }

    const userAgent = navigator.userAgent;
    let deviceType = 'desktop';
    let os = 'unknown';
    let browser = 'unknown';

    // Detect device type
    if (/mobile|android|iphone|ipod|opera mini/i.test(userAgent.toLowerCase())) {
      deviceType = 'mobile';
    } else if (/ipad|tablet/i.test(userAgent.toLowerCase())) {
      deviceType = 'tablet';
    }

    // Detect OS
    if (/windows/i.test(userAgent)) os = 'Windows';
    else if (/macintosh/i.test(userAgent)) os = 'macOS';
    else if (/linux/i.test(userAgent)) os = 'Linux';
    else if (/android/i.test(userAgent)) os = 'Android';
    else if (/iphone|ipad|ipod/i.test(userAgent)) os = 'iOS';

    // Detect Browser
    if (/chrome/i.test(userAgent)) browser = 'Chrome';
    else if (/firefox/i.test(userAgent)) browser = 'Firefox';
    else if (/safari/i.test(userAgent)) browser = 'Safari';
    else if (/edge/i.test(userAgent)) browser = 'Edge';
    else if (/trident/i.test(userAgent)) browser = 'Internet Explorer';

    return {
      deviceType,
      os,
      browser,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      language: navigator.language || 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  /**
   * Create and store session data
   */
  static createSessionData(userId?: string): SessionData {
    const deviceInfo = this.getDeviceInfo();
    const sessionId = this.getOrCreateSessionId();

    const sessionData: SessionData = {
      sessionId,
      userId,
      createdAt: Date.now(),
      ...deviceInfo,
    };

    if (typeof window !== 'undefined') {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
    }

    return sessionData;
  }

  /**
   * Get current session data
   */
  static getSessionData(): SessionData | null {
    if (typeof window === 'undefined') return null;

    const data = sessionStorage.getItem(SESSION_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Get session duration in seconds
   */
  static getSessionDuration(): number {
    const sessionData = this.getSessionData();
    if (!sessionData) return 0;
    return Math.floor((Date.now() - sessionData.createdAt) / 1000);
  }

  /**
   * Update session user ID
   */
  static updateSessionUserId(userId: string): void {
    const sessionData = this.getSessionData();
    if (sessionData && typeof window !== 'undefined') {
      sessionData.userId = userId;
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
    }
  }
}

/**
 * Custom hook for session management (for React components)
 */
export function useSession() {
  const sessionId = SessionManager.getOrCreateSessionId();
  const sessionData = SessionManager.getSessionData();

  return {
    sessionId,
    sessionData,
    getDeviceInfo: () => SessionManager.getDeviceInfo(),
    getSessionDuration: () => SessionManager.getSessionDuration(),
    clearSession: () => SessionManager.clearSessionId(),
  };
}
