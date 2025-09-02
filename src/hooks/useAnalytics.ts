'use client';

import { useContext, useCallback, useRef, useEffect } from 'react';
import { AnalyticsContext } from '../contexts/AnalyticsContext';
import type { 
  AnalyticsEvent, 
  ComponentAnalytics, 
  AnalyticsCategory, 
  AnalyticsAction 
} from '../types/analytics';
import { ANALYTICS_CATEGORIES, ANALYTICS_ACTIONS } from '../types/analytics';

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  
  if (!context) {
    console.warn('useAnalytics must be used within an AnalyticsProvider');
    return {
      track: () => {},
      trackClick: () => {},
      trackView: () => {},
      trackSearch: () => {},
      trackNavigation: () => {},
      trackFormSubmit: () => {},
      trackError: () => {},
      page: () => {},
      identify: () => {},
    };
  }

  const { track, page, identify, config } = context;

  // Generic track function
  const trackEvent = useCallback((event: Partial<AnalyticsEvent>) => {
    if (!config.enabled) return;

    const fullEvent: AnalyticsEvent = {
      event: event.event || 'custom_event',
      category: event.category || ANALYTICS_CATEGORIES.USER_INTERACTION,
      action: event.action || ANALYTICS_ACTIONS.CLICK,
      label: event.label,
      value: event.value,
      properties: event.properties || {},
      timestamp: Date.now(),
      userId: event.userId || config.userId,
      sessionId: event.sessionId || config.sessionId,
    };

    track(fullEvent);
  }, [track, config]);

  // Specific tracking functions
  const trackClick = useCallback((
    element: string, 
    componentAnalytics?: ComponentAnalytics,
    additionalProperties?: Record<string, any>
  ) => {
    trackEvent({
      event: 'click',
      category: ANALYTICS_CATEGORIES.USER_INTERACTION,
      action: ANALYTICS_ACTIONS.CLICK,
      label: element,
      properties: {
        element,
        component: componentAnalytics?.component,
        section: componentAnalytics?.section,
        ...componentAnalytics?.properties,
        ...additionalProperties,
      },
    });
  }, [trackEvent]);

  const trackView = useCallback((
    element: string,
    componentAnalytics?: ComponentAnalytics,
    additionalProperties?: Record<string, any>
  ) => {
    trackEvent({
      event: 'view',
      category: ANALYTICS_CATEGORIES.ENGAGEMENT,
      action: ANALYTICS_ACTIONS.VIEW,
      label: element,
      properties: {
        element,
        component: componentAnalytics?.component,
        section: componentAnalytics?.section,
        ...componentAnalytics?.properties,
        ...additionalProperties,
      },
    });
  }, [trackEvent]);

  const trackSearch = useCallback((
    query: string,
    results?: number,
    componentAnalytics?: ComponentAnalytics
  ) => {
    trackEvent({
      event: 'search',
      category: ANALYTICS_CATEGORIES.SEARCH,
      action: ANALYTICS_ACTIONS.SEARCH,
      label: query,
      value: results,
      properties: {
        search_query: query,
        results_count: results,
        component: componentAnalytics?.component,
        section: componentAnalytics?.section,
        ...componentAnalytics?.properties,
      },
    });
  }, [trackEvent]);

  const trackNavigation = useCallback((
    destination: string,
    source?: string,
    componentAnalytics?: ComponentAnalytics
  ) => {
    trackEvent({
      event: 'navigation',
      category: ANALYTICS_CATEGORIES.NAVIGATION,
      action: ANALYTICS_ACTIONS.NAVIGATE,
      label: destination,
      properties: {
        destination,
        source,
        component: componentAnalytics?.component,
        section: componentAnalytics?.section,
        ...componentAnalytics?.properties,
      },
    });
  }, [trackEvent]);

  const trackFormSubmit = useCallback((
    formName: string,
    success: boolean,
    componentAnalytics?: ComponentAnalytics,
    additionalProperties?: Record<string, any>
  ) => {
    trackEvent({
      event: 'form_submit',
      category: ANALYTICS_CATEGORIES.FORM,
      action: ANALYTICS_ACTIONS.SUBMIT,
      label: formName,
      properties: {
        form_name: formName,
        success,
        component: componentAnalytics?.component,
        section: componentAnalytics?.section,
        ...componentAnalytics?.properties,
        ...additionalProperties,
      },
    });
  }, [trackEvent]);

  const trackError = useCallback((
    error: string,
    context?: string,
    componentAnalytics?: ComponentAnalytics
  ) => {
    trackEvent({
      event: 'error',
      category: ANALYTICS_CATEGORIES.ERROR,
      action: ANALYTICS_ACTIONS.ERROR,
      label: error,
      properties: {
        error_message: error,
        error_context: context,
        component: componentAnalytics?.component,
        section: componentAnalytics?.section,
        ...componentAnalytics?.properties,
      },
    });
  }, [trackEvent]);

  return {
    track: trackEvent,
    trackClick,
    trackView,
    trackSearch,
    trackNavigation,
    trackFormSubmit,
    trackError,
    page,
    identify,
  };
}

// Component-specific analytics hooks
export function useComponentAnalytics(componentName: string, section?: string) {
  const analytics = useAnalytics();
  const componentRef = useRef<ComponentAnalytics>({
    component: componentName,
    section,
  });

  // Track component view on mount
  useEffect(() => {
    analytics.trackView(`${componentName}_component`, componentRef.current);
  }, [analytics, componentName]);

  const trackClick = useCallback((
    element: string,
    additionalProperties?: Record<string, any>
  ) => {
    analytics.trackClick(element, componentRef.current, additionalProperties);
  }, [analytics]);

  const trackInteraction = useCallback((
    action: AnalyticsAction,
    element: string,
    additionalProperties?: Record<string, any>
  ) => {
    analytics.track({
      event: `${componentName}_${action}`,
      category: ANALYTICS_CATEGORIES.USER_INTERACTION,
      action,
      label: element,
      properties: {
        element,
        component: componentRef.current.component,
        section: componentRef.current.section,
        ...additionalProperties,
      },
    });
  }, [analytics, componentName]);

  return {
    ...analytics,
    trackClick,
    trackInteraction,
    componentInfo: componentRef.current,
  };
}

// Header-specific analytics hook
export function useHeaderAnalytics() {
  const analytics = useComponentAnalytics('Header', 'navigation');

  const trackLogoClick = useCallback(() => {
    analytics.trackClick('logo', { destination: 'home' });
  }, [analytics]);

  const trackSearchSubmit = useCallback((query: string, results?: number) => {
    analytics.trackSearch(query, results, analytics.componentInfo);
  }, [analytics]);

  const trackNavigationClick = useCallback((label: string, href: string) => {
    analytics.trackNavigation(href, 'header_navigation', analytics.componentInfo);
    analytics.trackClick('navigation_item', { label, href });
  }, [analytics]);

  const trackActionClick = useCallback((action: string, additionalProps?: Record<string, any>) => {
    analytics.trackClick(`header_${action}`, additionalProps);
  }, [analytics]);

  return {
    trackLogoClick,
    trackSearchSubmit,
    trackNavigationClick,
    trackActionClick,
  };
}

// Footer-specific analytics hook
export function useFooterAnalytics() {
  const analytics = useComponentAnalytics('Footer', 'footer');

  const trackNewsletterSubmit = useCallback((email: string, success: boolean) => {
    analytics.trackFormSubmit('newsletter', success, analytics.componentInfo, {
      email_domain: email.split('@')[1],
    });
  }, [analytics]);

  const trackSocialClick = useCallback((platform: string, href: string) => {
    analytics.trackClick('social_link', { platform, href });
  }, [analytics]);

  const trackFooterLinkClick = useCallback((label: string, href: string, section?: string) => {
    analytics.trackClick('footer_link', { label, href, section });
  }, [analytics]);

  const trackBenefitClick = useCallback((benefit: string, href?: string) => {
    analytics.trackClick('benefit_card', { benefit, href });
  }, [analytics]);

  return {
    trackNewsletterSubmit,
    trackSocialClick,
    trackFooterLinkClick,
    trackBenefitClick,
  };
}

// Button-specific analytics hook
export function useButtonAnalytics(variant?: string, size?: string) {
  const analytics = useComponentAnalytics('Button');

  const trackButtonClick = useCallback((
    label?: string, 
    context?: string,
    additionalProps?: Record<string, any>
  ) => {
    analytics.trackClick('button', {
      button_text: label,
      button_variant: variant,
      button_size: size,
      context,
      ...additionalProps,
    });
  }, [analytics, variant, size]);

  return {
    trackButtonClick,
  };
}

// Theme toggle analytics hook
export function useThemeToggleAnalytics() {
  const analytics = useComponentAnalytics('ThemeToggle', 'settings');

  const trackThemeToggle = useCallback((newTheme: 'light' | 'dark') => {
    analytics.trackInteraction(ANALYTICS_ACTIONS.TOGGLE, 'theme_toggle', {
      new_theme: newTheme,
      previous_theme: newTheme === 'light' ? 'dark' : 'light',
    });
  }, [analytics]);

  return {
    trackThemeToggle,
  };
}
