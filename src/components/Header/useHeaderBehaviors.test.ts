import { renderHook, act } from '@testing-library/react';
import { useHeaderBehaviors } from './useHeaderBehaviors';
import type { NavigationItem } from './types';

// Mock window.location for navigation tests
const mockLocation = {
  href: '',
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

describe('useHeaderBehaviors', () => {
  beforeEach(() => {
    mockLocation.href = '';
    jest.clearAllMocks();
  });

  describe('Initial state', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useHeaderBehaviors());
      
      expect(result.current.state).toEqual({
        searchQuery: '',
        isSearching: false,
        isMobileMenuOpen: false,
      });
    });
  });

  describe('Search behaviors', () => {
    it('should update search query', () => {
      const { result } = renderHook(() => useHeaderBehaviors());
      
      act(() => {
        result.current.handleSearchQueryChange('test query');
      });
      
      expect(result.current.state.searchQuery).toBe('test query');
    });

    it('should clear search query and results', () => {
      const { result } = renderHook(() => useHeaderBehaviors());
      
      // Set up initial state
      act(() => {
        result.current.handleSearchQueryChange('test query');
      });
      
      act(() => {
        result.current.clearSearch();
      });
      
      expect(result.current.state.searchQuery).toBe('');
      expect(result.current.state.searchResults).toBeUndefined();
      expect(result.current.state.lastSearchQuery).toBeUndefined();
    });

    it('should handle search submit with user action callback', async () => {
      const onUserAction = jest.fn();
      const onSearchSubmit = jest.fn().mockReturnValue(5);
      
      const { result } = renderHook(() => 
        useHeaderBehaviors({
          onUserAction,
          onSearchSubmit,
        })
      );
      
      // Set search query
      act(() => {
        result.current.handleSearchQueryChange('test query');
      });
      
      // Submit search
      const mockEvent = {
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent;
      
      await act(async () => {
        await result.current.handleSearchSubmit(mockEvent);
      });
      
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(onSearchSubmit).toHaveBeenCalledWith('test query');
      expect(onUserAction).toHaveBeenCalledWith('search', {
        query: 'test query',
        results: 5,
      });
      expect(result.current.state.searchResults).toBe(5);
      expect(result.current.state.lastSearchQuery).toBe('test query');
    });

    it('should not submit empty search', async () => {
      const onSearchSubmit = jest.fn();
      const { result } = renderHook(() => 
        useHeaderBehaviors({ onSearchSubmit })
      );
      
      const mockEvent = {
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent;
      
      await act(async () => {
        await result.current.handleSearchSubmit(mockEvent);
      });
      
      expect(onSearchSubmit).not.toHaveBeenCalled();
    });

    it('should handle search errors', async () => {
      const onUserAction = jest.fn();
      const onSearchSubmit = jest.fn().mockRejectedValue(new Error('Search failed'));
      
      const { result } = renderHook(() => 
        useHeaderBehaviors({
          onUserAction,
          onSearchSubmit,
        })
      );
      
      // Set search query
      act(() => {
        result.current.handleSearchQueryChange('test query');
      });
      
      const mockEvent = {
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent;
      
      await act(async () => {
        await result.current.handleSearchSubmit(mockEvent);
      });
      
      expect(onUserAction).toHaveBeenCalledWith('search_error', {
        query: 'test query',
        error: 'Search failed',
      });
      expect(result.current.state.isSearching).toBe(false);
    });

    it('should call onSearchQueryChange callback', () => {
      const onSearchQueryChange = jest.fn();
      const { result } = renderHook(() => 
        useHeaderBehaviors({ onSearchQueryChange })
      );
      
      act(() => {
        result.current.handleSearchQueryChange('test');
      });
      
      expect(onSearchQueryChange).toHaveBeenCalledWith('test');
    });
  });

  describe('Navigation behaviors', () => {
    it('should handle logo click with default routing', () => {
      const onUserAction = jest.fn();
      const { result } = renderHook(() => 
        useHeaderBehaviors({ onUserAction, enableRouting: true })
      );
      
      act(() => {
        result.current.handleLogoClick();
      });
      
      expect(mockLocation.href).toBe('/');
      expect(onUserAction).toHaveBeenCalledWith('logo_click', { destination: 'home' });
    });

    it('should handle logo click with custom handler', () => {
      const onNavigateToHome = jest.fn();
      const onUserAction = jest.fn();
      const { result } = renderHook(() => 
        useHeaderBehaviors({ onNavigateToHome, onUserAction })
      );
      
      act(() => {
        result.current.handleLogoClick();
      });
      
      expect(onNavigateToHome).toHaveBeenCalled();
      expect(onUserAction).toHaveBeenCalledWith('logo_click', { destination: 'home' });
      expect(mockLocation.href).toBe(''); // Should not use default routing
    });

    it('should handle navigation item click', () => {
      const onNavigateToSection = jest.fn();
      const onUserAction = jest.fn();
      const { result } = renderHook(() => 
        useHeaderBehaviors({ onNavigateToSection, onUserAction })
      );
      
      const navItem: NavigationItem = {
        label: 'Products',
        href: '/products',
        isActive: false,
      };
      
      const mockEvent = {
        preventDefault: jest.fn(),
      } as unknown as React.MouseEvent;
      
      act(() => {
        result.current.handleNavigationItemClick(navItem, mockEvent);
      });
      
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(onNavigateToSection).toHaveBeenCalledWith('Products', '/products');
      expect(onUserAction).toHaveBeenCalledWith('navigation_click', {
        label: 'Products',
        href: '/products',
        isActive: false,
      });
    });

    it('should close mobile menu on navigation click', () => {
      const { result } = renderHook(() => useHeaderBehaviors());
      
      // Open mobile menu first
      act(() => {
        result.current.handleMobileMenuToggle();
      });
      
      expect(result.current.state.isMobileMenuOpen).toBe(true);
      
      // Navigate
      const navItem: NavigationItem = { label: 'Test', href: '/test' };
      const mockEvent = {
        preventDefault: jest.fn(),
      } as unknown as React.MouseEvent;
      
      act(() => {
        result.current.handleNavigationItemClick(navItem, mockEvent);
      });
      
      expect(result.current.state.isMobileMenuOpen).toBe(false);
    });
  });

  describe('Action behaviors', () => {
    it('should handle stores services click', () => {
      const onNavigateToStores = jest.fn();
      const onUserAction = jest.fn();
      const { result } = renderHook(() => 
        useHeaderBehaviors({ onNavigateToStores, onUserAction })
      );
      
      act(() => {
        result.current.handleStoresServicesClick();
      });
      
      expect(onNavigateToStores).toHaveBeenCalled();
      expect(onUserAction).toHaveBeenCalledWith('stores_services_click');
    });

    it('should handle community click', () => {
      const onNavigateToCommunity = jest.fn();
      const onUserAction = jest.fn();
      const { result } = renderHook(() => 
        useHeaderBehaviors({ onNavigateToCommunity, onUserAction })
      );
      
      act(() => {
        result.current.handleCommunityClick();
      });
      
      expect(onNavigateToCommunity).toHaveBeenCalled();
      expect(onUserAction).toHaveBeenCalledWith('community_click');
    });

    it('should handle sign in click', () => {
      const onNavigateToSignIn = jest.fn();
      const onUserAction = jest.fn();
      const { result } = renderHook(() => 
        useHeaderBehaviors({ onNavigateToSignIn, onUserAction })
      );
      
      act(() => {
        result.current.handleSignInClick();
      });
      
      expect(onNavigateToSignIn).toHaveBeenCalled();
      expect(onUserAction).toHaveBeenCalledWith('sign_in_click');
    });

    it('should handle favorites click', () => {
      const onNavigateToFavorites = jest.fn();
      const onUserAction = jest.fn();
      const { result } = renderHook(() => 
        useHeaderBehaviors({ onNavigateToFavorites, onUserAction })
      );
      
      act(() => {
        result.current.handleFavoritesClick();
      });
      
      expect(onNavigateToFavorites).toHaveBeenCalled();
      expect(onUserAction).toHaveBeenCalledWith('favorites_click');
    });

    it('should handle cart click', () => {
      const onNavigateToCart = jest.fn();
      const onUserAction = jest.fn();
      const { result } = renderHook(() => 
        useHeaderBehaviors({ onNavigateToCart, onUserAction })
      );
      
      act(() => {
        result.current.handleCartClick();
      });
      
      expect(onNavigateToCart).toHaveBeenCalled();
      expect(onUserAction).toHaveBeenCalledWith('cart_click');
    });
  });

  describe('Mobile behaviors', () => {
    it('should toggle mobile menu', () => {
      const onMobileMenuToggle = jest.fn();
      const onUserAction = jest.fn();
      const { result } = renderHook(() => 
        useHeaderBehaviors({ onMobileMenuToggle, onUserAction })
      );
      
      // Open menu
      act(() => {
        result.current.handleMobileMenuToggle();
      });
      
      expect(result.current.state.isMobileMenuOpen).toBe(true);
      expect(onMobileMenuToggle).toHaveBeenCalledWith(true);
      expect(onUserAction).toHaveBeenCalledWith('mobile_menu_toggle', { isOpen: true });
      
      // Close menu
      act(() => {
        result.current.handleMobileMenuToggle();
      });
      
      expect(result.current.state.isMobileMenuOpen).toBe(false);
      expect(onMobileMenuToggle).toHaveBeenCalledWith(false);
      expect(onUserAction).toHaveBeenCalledWith('mobile_menu_toggle', { isOpen: false });
    });

    it('should close mobile menu explicitly', () => {
      const onMobileMenuToggle = jest.fn();
      const { result } = renderHook(() => 
        useHeaderBehaviors({ onMobileMenuToggle })
      );
      
      // Open menu first
      act(() => {
        result.current.handleMobileMenuToggle();
      });
      
      expect(result.current.state.isMobileMenuOpen).toBe(true);
      
      // Close menu explicitly
      act(() => {
        result.current.closeMobileMenu();
      });
      
      expect(result.current.state.isMobileMenuOpen).toBe(false);
      expect(onMobileMenuToggle).toHaveBeenCalledWith(false);
    });

    it('should not call callback when closing already closed menu', () => {
      const onMobileMenuToggle = jest.fn();
      const { result } = renderHook(() => 
        useHeaderBehaviors({ onMobileMenuToggle })
      );
      
      // Menu starts closed
      expect(result.current.state.isMobileMenuOpen).toBe(false);
      
      // Try to close already closed menu
      act(() => {
        result.current.closeMobileMenu();
      });
      
      expect(onMobileMenuToggle).not.toHaveBeenCalled();
    });
  });

  describe('Utility functions', () => {
    it('should update search query directly', () => {
      const { result } = renderHook(() => useHeaderBehaviors());
      
      act(() => {
        result.current.updateSearchQuery('direct update');
      });
      
      expect(result.current.state.searchQuery).toBe('direct update');
    });

    it('should reset behavior state', () => {
      const { result } = renderHook(() => useHeaderBehaviors());
      
      // Set up some state
      act(() => {
        result.current.updateSearchQuery('test');
        result.current.handleMobileMenuToggle();
      });
      
      expect(result.current.state.searchQuery).toBe('test');
      expect(result.current.state.isMobileMenuOpen).toBe(true);
      
      // Reset state
      act(() => {
        result.current.resetBehaviorState();
      });
      
      expect(result.current.state).toEqual({
        searchQuery: '',
        isSearching: false,
        isMobileMenuOpen: false,
      });
    });
  });

  describe('Configuration', () => {
    it('should use default configuration when none provided', () => {
      const { result } = renderHook(() => useHeaderBehaviors());
      
      // Test default routing behavior
      act(() => {
        result.current.handleLogoClick();
      });
      
      expect(mockLocation.href).toBe('/'); // enableRouting: true by default
    });

    it('should disable routing when configured', () => {
      const { result } = renderHook(() => 
        useHeaderBehaviors({ enableRouting: false })
      );
      
      act(() => {
        result.current.handleLogoClick();
      });
      
      expect(mockLocation.href).toBe(''); // No routing
    });

    it('should respect custom configuration', () => {
      const config = {
        enableRouting: false,
        enableAnalytics: false,
        searchDebounceMs: 500,
      };
      
      const { result } = renderHook(() => useHeaderBehaviors(config));
      
      // Configuration is private, but we can test its effects
      act(() => {
        result.current.handleLogoClick();
      });
      
      expect(mockLocation.href).toBe(''); // Routing disabled
    });
  });

  describe('Error handling', () => {
    it('should handle navigation callback errors gracefully', () => {
      const onNavigateToHome = jest.fn().mockImplementation(() => {
        throw new Error('Navigation failed');
      });
      
      const { result } = renderHook(() => 
        useHeaderBehaviors({ onNavigateToHome })
      );
      
      // Should not throw
      expect(() => {
        act(() => {
          result.current.handleLogoClick();
        });
      }).not.toThrow();
    });

    it('should handle user action callback errors gracefully', () => {
      const onUserAction = jest.fn().mockImplementation(() => {
        throw new Error('Tracking failed');
      });
      
      const { result } = renderHook(() => 
        useHeaderBehaviors({ onUserAction })
      );
      
      // Should not throw
      expect(() => {
        act(() => {
          result.current.handleLogoClick();
        });
      }).not.toThrow();
    });
  });
});
