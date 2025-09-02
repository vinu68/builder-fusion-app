import { useState, useEffect, useCallback } from 'react';
import { dataService, transformers } from './data-utils';
import type { HeaderConfig, NavigationItem } from '../components/Header/types';

/**
 * Header Service - Example of using the data service layer
 * to fetch and manage header configuration data
 */
export class HeaderService {
  private static readonly CACHE_KEY = 'header-config';
  private static readonly CACHE_TTL = 300000; // 5 minutes

  /**
   * Get header configuration from API or cache
   */
  static async getConfiguration(): Promise<HeaderConfig> {
    try {
      return await dataService.fetch<HeaderConfig>({
        endpoint: '/api/config/header',
        cache: 'default',
        next: { revalidate: 300 }, // Revalidate every 5 minutes
        fallback: this.getDefaultConfig(),
        transform: this.transformHeaderData,
        onError: (error) => {
          console.warn('Failed to fetch header config:', error.message);
        },
      });
    } catch (error) {
      console.error('Header service error:', error);
      return this.getDefaultConfig();
    }
  }

  /**
   * Get cached header configuration
   */
  static async getCachedConfiguration(): Promise<HeaderConfig> {
    const { cache } = await import('./data-utils');
    
    return cache.fetchCached(
      this.CACHE_KEY,
      {
        endpoint: '/api/config/header',
        transform: this.transformHeaderData,
        fallback: this.getDefaultConfig(),
      },
      this.CACHE_TTL
    );
  }

  /**
   * Get header configuration from CDN
   */
  static async getConfigurationFromCDN(): Promise<HeaderConfig> {
    return await dataService.fetch<HeaderConfig>({
      endpoint: '/config/header.json',
      adapter: 'cdn',
      cache: 'force-cache',
      next: { revalidate: 3600 }, // Cache for 1 hour
      fallback: this.getDefaultConfig(),
      transform: this.transformHeaderData,
    });
  }

  /**
   * Update header configuration
   */
  static async updateConfiguration(config: Partial<HeaderConfig>): Promise<HeaderConfig> {
    return await dataService.put<HeaderConfig>('/api/config/header', config, {
      onSuccess: (data) => {
        // Clear cache on successful update
        const { cache } = require('./data-utils');
        cache.delete(this.CACHE_KEY);
      },
    });
  }

  /**
   * Get navigation items only
   */
  static async getNavigation(): Promise<NavigationItem[]> {
    return await dataService.fetch<NavigationItem[]>({
      endpoint: '/api/config/navigation',
      transform: (data: any) => {
        // Handle different response structures
        if (Array.isArray(data)) return data;
        if (data.navigation) return data.navigation;
        if (data.items) return data.items;
        return [];
      },
      fallback: [],
    });
  }

  /**
   * Get user-specific header configuration
   */
  static async getUserConfiguration(userId: string): Promise<HeaderConfig> {
    return await dataService.fetch<HeaderConfig>({
      endpoint: `/api/users/${userId}/header-config`,
      fallback: this.getDefaultConfig(),
      transform: (data) => ({
        ...this.getDefaultConfig(),
        ...data,
        // Add user-specific modifications
        texts: {
          ...this.getDefaultConfig().texts,
          ...data.texts,
          signInTitle: data.userName ? `Hi, ${data.userName}` : 'Sign In',
        },
      }),
    });
  }

  /**
   * Transform raw API data to header configuration
   */
  private static transformHeaderData = (data: any): HeaderConfig => {
    return {
      logo: {
        src: data.logo?.url || data.logoUrl,
        alt: data.logo?.alt || data.logoAlt || 'Logo',
        width: data.logo?.width || 150,
        height: data.logo?.height || 46,
        href: data.logo?.href || '/',
      },
      navigation: Array.isArray(data.navigation) 
        ? data.navigation.map(transformNavigationItem)
        : [],
      texts: {
        searchPlaceholder: data.texts?.searchPlaceholder || data.searchPlaceholder || 'Search',
        storesServicesTitle: data.texts?.storesServicesTitle || 'Stores & Services',
        communityLabel: data.texts?.communityLabel || 'Community',
        signInTitle: data.texts?.signInTitle || 'Sign In',
        signInSubtitle: data.texts?.signInSubtitle || 'for FREE Shipping 🚚',
        myAccountTitle: data.texts?.myAccountTitle || 'My Account',
        welcomeBackText: data.texts?.welcomeBackText || 'Welcome back!',
      },
      showSearch: data.showSearch !== false,
      showStoresServices: data.showStoresServices !== false,
      showCommunity: data.showCommunity !== false,
      showFavorites: data.showFavorites !== false,
      showCart: data.showCart !== false,
    };
  };

  /**
   * Get default header configuration
   */
  private static getDefaultConfig(): HeaderConfig {
    return {
      logo: {
        alt: 'Logo',
        width: 150,
        height: 46,
        href: '/',
      },
      navigation: [
        { label: 'New', href: '/new' },
        { label: 'Brands', href: '/brands' },
        { label: 'Men', href: '/men' },
        { label: 'Women', href: '/women' },
        { label: 'Kids', href: '/kids' },
        { label: 'Home & Living', href: '/home-living' },
        { label: 'Beauty', href: '/beauty' },
        { label: 'Studio', href: '/studio' },
        { label: 'Gifts & Gift Cards', href: '/gifts' },
        { label: 'Shop Under $80', href: '/shop-under-80' },
        { label: 'Sale & Offers', href: '/sale' },
      ],
      texts: {
        searchPlaceholder: 'Search',
        storesServicesTitle: 'Stores & Services',
        communityLabel: 'Community',
        signInTitle: 'Sign In',
        signInSubtitle: 'for FREE Shipping 🚚',
        myAccountTitle: 'My Account',
        welcomeBackText: 'Welcome back!',
      },
      showSearch: true,
      showStoresServices: true,
      showCommunity: true,
      showFavorites: true,
      showCart: true,
    };
  }
}

/**
 * Transform navigation item from API format
 */
function transformNavigationItem(item: any): NavigationItem {
  return {
    label: item.label || item.title || item.name,
    href: item.href || item.url || item.path,
    isActive: item.isActive || item.active || false,
  };
}

/**
 * React hook for using header configuration
 */
export function useHeaderConfig() {
  const [config, setConfig] = useState<HeaderConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    HeaderService.getCachedConfiguration()
      .then(setConfig)
      .catch((err) => {
        setError(err.message);
        setConfig(HeaderService.getDefaultConfig());
      })
      .finally(() => setLoading(false));
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const newConfig = await HeaderService.getConfiguration();
      setConfig(newConfig);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh config');
    } finally {
      setLoading(false);
    }
  }, []);

  return { config, loading, error, refresh };
}

// Named exports
export default HeaderService;

// Re-export for convenience
export { HeaderService as default };
