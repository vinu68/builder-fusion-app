// Analytics hooks
export {
  useAnalytics,
  useComponentAnalytics,
  useHeaderAnalytics,
  useFooterAnalytics,
  useButtonAnalytics,
  useThemeToggleAnalytics,
} from './useAnalytics';

// Analytics context
export { AnalyticsProvider, useAnalyticsContext } from '../contexts/AnalyticsContext';

// Analytics types
export type {
  AnalyticsEvent,
  AnalyticsConfig,
  AnalyticsProvider as IAnalyticsProvider,
  ComponentAnalytics,
  AnalyticsCategory,
  AnalyticsAction,
} from '../types/analytics';

export {
  ANALYTICS_CATEGORIES,
  ANALYTICS_ACTIONS,
} from '../types/analytics';
