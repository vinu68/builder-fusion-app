export interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
  timestamp?: number;
  userId?: string;
  sessionId?: string;
}

export interface AnalyticsConfig {
  enabled?: boolean;
  debug?: boolean;
  userId?: string;
  sessionId?: string;
  trackingId?: string;
  endpoint?: string;
  batchSize?: number;
  flushInterval?: number;
  providers?: AnalyticsProvider[];
}

export interface AnalyticsProvider {
  name: string;
  track: (event: AnalyticsEvent) => void | Promise<void>;
  page?: (path: string, title?: string) => void | Promise<void>;
  identify?: (userId: string, traits?: Record<string, any>) => void | Promise<void>;
  init?: (config: any) => void | Promise<void>;
}

export interface ComponentAnalytics {
  component: string;
  element?: string;
  section?: string;
  properties?: Record<string, any>;
}

// Predefined event categories
export const ANALYTICS_CATEGORIES = {
  NAVIGATION: 'navigation',
  USER_INTERACTION: 'user_interaction', 
  FORM: 'form',
  SEARCH: 'search',
  ECOMMERCE: 'ecommerce',
  ENGAGEMENT: 'engagement',
  ERROR: 'error',
} as const;

// Predefined actions
export const ANALYTICS_ACTIONS = {
  CLICK: 'click',
  VIEW: 'view',
  SUBMIT: 'submit',
  SEARCH: 'search',
  TOGGLE: 'toggle',
  NAVIGATE: 'navigate',
  HOVER: 'hover',
  FOCUS: 'focus',
  ERROR: 'error',
} as const;

export type AnalyticsCategory = typeof ANALYTICS_CATEGORIES[keyof typeof ANALYTICS_CATEGORIES];
export type AnalyticsAction = typeof ANALYTICS_ACTIONS[keyof typeof ANALYTICS_ACTIONS];
