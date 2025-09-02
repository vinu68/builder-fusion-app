'use client';

import React, { createContext, useContext, useCallback, useRef, useEffect } from 'react';
import type { 
  AnalyticsConfig, 
  AnalyticsEvent, 
  AnalyticsProvider as IAnalyticsProvider 
} from '../types/analytics';

interface AnalyticsContextValue {
  track: (event: AnalyticsEvent) => void;
  page: (path: string, title?: string) => void;
  identify: (userId: string, traits?: Record<string, any>) => void;
  config: AnalyticsConfig;
}

export const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

// Built-in providers
class ConsoleAnalyticsProvider implements IAnalyticsProvider {
  name = 'console';

  track(event: AnalyticsEvent): void {
    console.log('Analytics Event:', event);
  }

  page(path: string, title?: string): void {
    console.log('Analytics Page:', { path, title });
  }

  identify(userId: string, traits?: Record<string, any>): void {
    console.log('Analytics Identify:', { userId, traits });
  }
}

class GoogleAnalyticsProvider implements IAnalyticsProvider {
  name = 'google-analytics';
  private trackingId?: string;

  init(config: { trackingId: string }): void {
    this.trackingId = config.trackingId;
    
    // Load gtag if not already loaded
    if (typeof window !== 'undefined' && !window.gtag) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', this.trackingId);
    }
  }

  track(event: AnalyticsEvent): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        custom_parameters: event.properties,
      });
    }
  }

  page(path: string, title?: string): void {
    if (typeof window !== 'undefined' && window.gtag && this.trackingId) {
      window.gtag('config', this.trackingId, {
        page_path: path,
        page_title: title,
      });
    }
  }

  identify(userId: string, traits?: Record<string, any>): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', this.trackingId, {
        user_id: userId,
        custom_map: traits,
      });
    }
  }
}

class CustomAPIProvider implements IAnalyticsProvider {
  name = 'custom-api';
  private endpoint?: string;
  private batchSize: number = 10;
  private flushInterval: number = 5000;
  private eventQueue: AnalyticsEvent[] = [];
  private timer?: NodeJS.Timeout;

  init(config: { endpoint: string; batchSize?: number; flushInterval?: number }): void {
    this.endpoint = config.endpoint;
    this.batchSize = config.batchSize || 10;
    this.flushInterval = config.flushInterval || 5000;
    this.startTimer();
  }

  track(event: AnalyticsEvent): void {
    this.eventQueue.push(event);
    
    if (this.eventQueue.length >= this.batchSize) {
      this.flush();
    }
  }

  page(path: string, title?: string): void {
    this.track({
      event: 'page_view',
      category: 'navigation',
      action: 'view',
      label: path,
      properties: { path, title },
      timestamp: Date.now(),
    });
  }

  identify(userId: string, traits?: Record<string, any>): void {
    this.track({
      event: 'identify',
      category: 'user',
      action: 'identify',
      label: userId,
      properties: traits,
      userId,
      timestamp: Date.now(),
    });
  }

  private startTimer(): void {
    this.timer = setInterval(() => {
      if (this.eventQueue.length > 0) {
        this.flush();
      }
    }, this.flushInterval);
  }

  private async flush(): void {
    if (!this.endpoint || this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events }),
      });
    } catch (error) {
      console.error('Failed to send analytics events:', error);
      // Re-queue events on failure
      this.eventQueue.unshift(...events);
    }
  }
}

interface AnalyticsProviderProps {
  children: React.ReactNode;
  config?: Partial<AnalyticsConfig>;
  providers?: IAnalyticsProvider[];
}

export function AnalyticsProvider({ 
  children, 
  config = {}, 
  providers: customProviders = [] 
}: AnalyticsProviderProps) {
  const configRef = useRef<AnalyticsConfig>({
    enabled: true,
    debug: false,
    batchSize: 10,
    flushInterval: 5000,
    providers: [],
    ...config,
  });

  const providersRef = useRef<IAnalyticsProvider[]>([]);

  // Initialize providers
  useEffect(() => {
    const builtInProviders: IAnalyticsProvider[] = [];
    
    // Add console provider in debug mode
    if (configRef.current.debug) {
      builtInProviders.push(new ConsoleAnalyticsProvider());
    }

    // Add Google Analytics if tracking ID is provided
    if (configRef.current.trackingId) {
      const gaProvider = new GoogleAnalyticsProvider();
      gaProvider.init({ trackingId: configRef.current.trackingId });
      builtInProviders.push(gaProvider);
    }

    // Add custom API provider if endpoint is provided
    if (configRef.current.endpoint) {
      const apiProvider = new CustomAPIProvider();
      apiProvider.init({
        endpoint: configRef.current.endpoint,
        batchSize: configRef.current.batchSize,
        flushInterval: configRef.current.flushInterval,
      });
      builtInProviders.push(apiProvider);
    }

    // Combine with custom providers
    providersRef.current = [...builtInProviders, ...customProviders];

    // Initialize custom providers
    customProviders.forEach(provider => {
      if (provider.init) {
        provider.init(configRef.current);
      }
    });
  }, [customProviders]);

  // Generate session ID
  useEffect(() => {
    if (!configRef.current.sessionId) {
      configRef.current.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
  }, []);

  const track = useCallback((event: AnalyticsEvent) => {
    if (!configRef.current.enabled) return;

    const enhancedEvent = {
      ...event,
      timestamp: event.timestamp || Date.now(),
      userId: event.userId || configRef.current.userId,
      sessionId: event.sessionId || configRef.current.sessionId,
    };

    providersRef.current.forEach(provider => {
      try {
        provider.track(enhancedEvent);
      } catch (error) {
        console.error(`Analytics provider ${provider.name} failed:`, error);
      }
    });
  }, []);

  const page = useCallback((path: string, title?: string) => {
    if (!configRef.current.enabled) return;

    providersRef.current.forEach(provider => {
      try {
        if (provider.page) {
          provider.page(path, title);
        }
      } catch (error) {
        console.error(`Analytics provider ${provider.name} page tracking failed:`, error);
      }
    });
  }, []);

  const identify = useCallback((userId: string, traits?: Record<string, any>) => {
    if (!configRef.current.enabled) return;

    configRef.current.userId = userId;

    providersRef.current.forEach(provider => {
      try {
        if (provider.identify) {
          provider.identify(userId, traits);
        }
      } catch (error) {
        console.error(`Analytics provider ${provider.name} identify failed:`, error);
      }
    });
  }, []);

  const value: AnalyticsContextValue = {
    track,
    page,
    identify,
    config: configRef.current,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

// Hook to use analytics context
export function useAnalyticsContext() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider');
  }
  return context;
}

// Declare global gtag for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}
