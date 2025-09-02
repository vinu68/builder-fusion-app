import { useState, useCallback } from 'react';
import type { NavigationItem } from './types';

export interface HeaderBehaviorConfig {
  // Navigation handlers
  onNavigateToHome?: () => void;
  onNavigateToSearch?: (query: string, results?: number) => void;
  onNavigateToSection?: (section: string, href: string) => void;
  onNavigateToStores?: () => void;
  onNavigateToCommunity?: () => void;
  onNavigateToSignIn?: () => void;
  onNavigateToFavorites?: () => void;
  onNavigateToCart?: () => void;
  
  // Search behavior
  onSearchSubmit?: (query: string) => Promise<number> | number | void;
  onSearchQueryChange?: (query: string) => void;
  
  // User interaction handlers
  onUserAction?: (action: string, data?: any) => void;
  
  // Mobile behavior
  onMobileMenuToggle?: (isOpen: boolean) => void;
  
  // Settings
  enableRouting?: boolean;
  enableAnalytics?: boolean;
  searchDebounceMs?: number;
}

export interface HeaderBehaviorState {
  searchQuery: string;
  isSearching: boolean;
  isMobileMenuOpen: boolean;
  searchResults?: number;
  lastSearchQuery?: string;
}

export interface HeaderBehaviors {
  // State
  state: HeaderBehaviorState;
  
  // Search behaviors
  handleSearchSubmit: (e: React.FormEvent) => Promise<void>;
  handleSearchQueryChange: (query: string) => void;
  clearSearch: () => void;
  
  // Navigation behaviors
  handleLogoClick: () => void;
  handleNavigationItemClick: (item: NavigationItem, e: React.MouseEvent) => void;
  
  // Action behaviors
  handleStoresServicesClick: () => void;
  handleCommunityClick: () => void;
  handleSignInClick: () => void;
  handleFavoritesClick: () => void;
  handleCartClick: () => void;
  
  // Mobile behaviors
  handleMobileMenuToggle: () => void;
  closeMobileMenu: () => void;
  
  // Utility functions
  updateSearchQuery: (query: string) => void;
  resetBehaviorState: () => void;
}

const DEFAULT_CONFIG: HeaderBehaviorConfig = {
  enableRouting: true,
  enableAnalytics: true,
  searchDebounceMs: 300,
};

const INITIAL_STATE: HeaderBehaviorState = {
  searchQuery: '',
  isSearching: false,
  isMobileMenuOpen: false,
};

export function useHeaderBehaviors(config: HeaderBehaviorConfig = {}): HeaderBehaviors {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const [state, setState] = useState<HeaderBehaviorState>(INITIAL_STATE);

  // Search behaviors
  const handleSearchSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.searchQuery.trim() || state.isSearching) return;

    setState(prev => ({ ...prev, isSearching: true }));

    try {
      let results: number | undefined;
      
      if (finalConfig.onSearchSubmit) {
        const searchResult = await finalConfig.onSearchSubmit(state.searchQuery.trim());
        if (typeof searchResult === 'number') {
          results = searchResult;
        }
      }

      setState(prev => ({
        ...prev,
        isSearching: false,
        searchResults: results,
        lastSearchQuery: state.searchQuery.trim(),
      }));

      // Navigate to search if routing is enabled
      if (finalConfig.enableRouting && finalConfig.onNavigateToSearch) {
        finalConfig.onNavigateToSearch(state.searchQuery.trim(), results);
      }

      // Track user action
      if (finalConfig.onUserAction) {
        finalConfig.onUserAction('search', {
          query: state.searchQuery.trim(),
          results,
        });
      }
    } catch (error) {
      setState(prev => ({ ...prev, isSearching: false }));
      console.error('Search failed:', error);
      
      if (finalConfig.onUserAction) {
        finalConfig.onUserAction('search_error', {
          query: state.searchQuery.trim(),
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  }, [state.searchQuery, state.isSearching, finalConfig]);

  const handleSearchQueryChange = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
    
    if (finalConfig.onSearchQueryChange) {
      finalConfig.onSearchQueryChange(query);
    }
  }, [finalConfig]);

  const clearSearch = useCallback(() => {
    setState(prev => ({
      ...prev,
      searchQuery: '',
      searchResults: undefined,
      lastSearchQuery: undefined,
    }));
  }, []);

  // Navigation behaviors
  const handleLogoClick = useCallback(() => {
    if (finalConfig.onNavigateToHome) {
      finalConfig.onNavigateToHome();
    } else if (finalConfig.enableRouting) {
      // Default routing behavior
      window.location.href = '/';
    }

    if (finalConfig.onUserAction) {
      finalConfig.onUserAction('logo_click', { destination: 'home' });
    }
  }, [finalConfig]);

  const handleNavigationItemClick = useCallback((item: NavigationItem, e: React.MouseEvent) => {
    e.preventDefault();
    
    if (finalConfig.onNavigateToSection) {
      finalConfig.onNavigateToSection(item.label, item.href);
    } else if (finalConfig.enableRouting) {
      // Default routing behavior
      window.location.href = item.href;
    }

    // Close mobile menu if open
    setState(prev => ({ ...prev, isMobileMenuOpen: false }));

    if (finalConfig.onUserAction) {
      finalConfig.onUserAction('navigation_click', {
        label: item.label,
        href: item.href,
        isActive: item.isActive,
      });
    }
  }, [finalConfig]);

  // Action behaviors
  const handleStoresServicesClick = useCallback(() => {
    if (finalConfig.onNavigateToStores) {
      finalConfig.onNavigateToStores();
    }

    if (finalConfig.onUserAction) {
      finalConfig.onUserAction('stores_services_click');
    }
  }, [finalConfig]);

  const handleCommunityClick = useCallback(() => {
    if (finalConfig.onNavigateToCommunity) {
      finalConfig.onNavigateToCommunity();
    }

    if (finalConfig.onUserAction) {
      finalConfig.onUserAction('community_click');
    }
  }, [finalConfig]);

  const handleSignInClick = useCallback(() => {
    if (finalConfig.onNavigateToSignIn) {
      finalConfig.onNavigateToSignIn();
    }

    if (finalConfig.onUserAction) {
      finalConfig.onUserAction('sign_in_click');
    }
  }, [finalConfig]);

  const handleFavoritesClick = useCallback(() => {
    if (finalConfig.onNavigateToFavorites) {
      finalConfig.onNavigateToFavorites();
    }

    if (finalConfig.onUserAction) {
      finalConfig.onUserAction('favorites_click');
    }
  }, [finalConfig]);

  const handleCartClick = useCallback(() => {
    if (finalConfig.onNavigateToCart) {
      finalConfig.onNavigateToCart();
    }

    if (finalConfig.onUserAction) {
      finalConfig.onUserAction('cart_click');
    }
  }, [finalConfig]);

  // Mobile behaviors
  const handleMobileMenuToggle = useCallback(() => {
    setState(prev => {
      const newIsOpen = !prev.isMobileMenuOpen;
      
      if (finalConfig.onMobileMenuToggle) {
        finalConfig.onMobileMenuToggle(newIsOpen);
      }

      if (finalConfig.onUserAction) {
        finalConfig.onUserAction('mobile_menu_toggle', { isOpen: newIsOpen });
      }

      return { ...prev, isMobileMenuOpen: newIsOpen };
    });
  }, [finalConfig]);

  const closeMobileMenu = useCallback(() => {
    setState(prev => {
      if (!prev.isMobileMenuOpen) return prev;

      if (finalConfig.onMobileMenuToggle) {
        finalConfig.onMobileMenuToggle(false);
      }

      return { ...prev, isMobileMenuOpen: false };
    });
  }, [finalConfig]);

  // Utility functions
  const updateSearchQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const resetBehaviorState = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return {
    state,
    handleSearchSubmit,
    handleSearchQueryChange,
    clearSearch,
    handleLogoClick,
    handleNavigationItemClick,
    handleStoresServicesClick,
    handleCommunityClick,
    handleSignInClick,
    handleFavoritesClick,
    handleCartClick,
    handleMobileMenuToggle,
    closeMobileMenu,
    updateSearchQuery,
    resetBehaviorState,
  };
}

// Export types
export type { HeaderBehaviorConfig, HeaderBehaviorState, HeaderBehaviors };
