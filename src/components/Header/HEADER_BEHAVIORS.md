# Header Component Behaviors

The Header component uses the `useHeaderBehaviors` hook to manage all user interactions and behaviors. This system provides a clean separation between UI and behavior logic, making the component testable and configurable.

## Overview

The behavior system consists of:
- **useHeaderBehaviors hook**: Core behavior logic
- **HeaderBehaviorConfig**: Configuration interface
- **Analytics integration**: Automatic event tracking
- **State management**: Internal state for UI interactions

## Features

### 🔍 Search Behaviors
- **Query Management**: Real-time search query updates
- **Async Search**: Support for asynchronous search operations
- **Loading States**: Built-in loading indicators
- **Error Handling**: Graceful error recovery
- **Results Tracking**: Optional result count tracking

### 🧭 Navigation Behaviors
- **Logo Navigation**: Configurable home navigation
- **Menu Navigation**: Section-based navigation
- **Route Management**: Optional automatic routing
- **Mobile Menu**: State-managed mobile navigation

### 🎯 Action Behaviors
- **Store Services**: Location-based store navigation
- **Community**: Community page navigation
- **Authentication**: Sign-in/account management
- **Favorites**: Wishlist management
- **Shopping Cart**: Cart navigation

### 📱 Mobile Behaviors
- **Menu Toggle**: Mobile menu state management
- **Overlay Handling**: Backdrop click handling
- **Responsive State**: Mobile-specific behaviors

## Configuration

### Basic Configuration

```typescript
const behaviorConfig: HeaderBehaviorConfig = {
  enableRouting: true,
  enableAnalytics: true,
  onNavigateToHome: () => router.push('/'),
  onSearchSubmit: async (query) => {
    const results = await searchAPI(query);
    return results.length;
  },
};

<Header behaviorConfig={behaviorConfig} />
```

### Advanced Configuration

```typescript
const behaviorConfig: HeaderBehaviorConfig = {
  // Routing configuration
  enableRouting: true,
  enableAnalytics: true,
  searchDebounceMs: 300,
  
  // Navigation handlers
  onNavigateToHome: () => router.push('/'),
  onNavigateToSearch: (query, results) => router.push(`/search?q=${query}`),
  onNavigateToSection: (section, href) => router.push(href),
  onNavigateToStores: () => router.push('/stores'),
  onNavigateToCommunity: () => router.push('/community'),
  onNavigateToSignIn: () => router.push('/auth/signin'),
  onNavigateToFavorites: () => router.push('/favorites'),
  onNavigateToCart: () => router.push('/cart'),
  
  // Search behavior
  onSearchSubmit: async (query) => {
    try {
      const response = await fetch(`/api/search?q=${query}`);
      const data = await response.json();
      return data.total;
    } catch (error) {
      console.error('Search failed:', error);
      throw error;
    }
  },
  onSearchQueryChange: (query) => {
    // Real-time search suggestions
    updateSearchSuggestions(query);
  },
  
  // User interaction tracking
  onUserAction: (action, data) => {
    analytics.track(action, data);
  },
  
  // Mobile behavior
  onMobileMenuToggle: (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  },
};
```

## State Management

The hook manages internal state for UI interactions:

```typescript
interface HeaderBehaviorState {
  searchQuery: string;        // Current search input
  isSearching: boolean;       // Search loading state
  isMobileMenuOpen: boolean;  // Mobile menu state
  searchResults?: number;     // Last search result count
  lastSearchQuery?: string;   // Last successful search
}
```

## Testing

### Unit Testing

```typescript
import { renderHook, act } from '@testing-library/react';
import { useHeaderBehaviors } from './useHeaderBehaviors';

test('should handle search submission', async () => {
  const onSearchSubmit = jest.fn().mockResolvedValue(5);
  const onUserAction = jest.fn();
  
  const { result } = renderHook(() => 
    useHeaderBehaviors({ onSearchSubmit, onUserAction })
  );
  
  // Set search query
  act(() => {
    result.current.handleSearchQueryChange('test');
  });
  
  // Submit search
  const mockEvent = { preventDefault: jest.fn() };
  await act(async () => {
    await result.current.handleSearchSubmit(mockEvent);
  });
  
  expect(onSearchSubmit).toHaveBeenCalledWith('test');
  expect(onUserAction).toHaveBeenCalledWith('search', {
    query: 'test',
    results: 5,
  });
});
```

### Component Testing

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Header from './Header';

test('should track search interactions', async () => {
  const mockSearchSubmit = jest.fn().mockResolvedValue(3);
  const mockUserAction = jest.fn();
  
  render(
    <Header
      behaviorConfig={{
        onSearchSubmit: mockSearchSubmit,
        onUserAction: mockUserAction,
      }}
    />
  );
  
  const searchInput = screen.getByRole('searchbox');
  const searchForm = searchInput.closest('form');
  
  fireEvent.change(searchInput, { target: { value: 'shoes' } });
  fireEvent.submit(searchForm);
  
  await waitFor(() => {
    expect(mockSearchSubmit).toHaveBeenCalledWith('shoes');
  });
});
```

### Storybook Testing

Use the Storybook stories to test behaviors interactively:

1. **BehaviorTesting**: Test all behavior configurations
2. **InteractiveDemo**: See real-time event tracking
3. **SearchBehavior**: Focus on search functionality
4. **ErrorHandling**: Test error scenarios

## Integration Patterns

### Next.js Router Integration

```typescript
import { useRouter } from 'next/router';

const router = useRouter();

const behaviorConfig = {
  onNavigateToHome: () => router.push('/'),
  onNavigateToSection: (section, href) => router.push(href),
  onNavigateToSearch: (query) => router.push(`/search?q=${query}`),
};
```

### React Router Integration

```typescript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

const behaviorConfig = {
  onNavigateToHome: () => navigate('/'),
  onNavigateToSection: (section, href) => navigate(href),
  onNavigateToSearch: (query) => navigate(`/search?q=${query}`),
};
```

### Custom Analytics Integration

```typescript
const behaviorConfig = {
  onUserAction: (action, data) => {
    // Google Analytics
    gtag('event', action, data);
    
    // Custom analytics
    analytics.track(action, data);
    
    // Multiple providers
    analyticsProviders.forEach(provider => {
      provider.track(action, data);
    });
  },
};
```

## Best Practices

### 1. Separation of Concerns
```typescript
// ✅ Good: Separate behavior configuration
const behaviorConfig = {
  onSearchSubmit: searchService.search,
  onNavigateToHome: navigationService.goHome,
};

// ❌ Bad: Mixed responsibilities
<Header 
  onSearch={(query) => {
    analytics.track('search', { query });
    router.push(`/search?q=${query}`);
    updateSearchHistory(query);
  }}
/>
```

### 2. Error Handling
```typescript
// ✅ Good: Proper error handling
const behaviorConfig = {
  onSearchSubmit: async (query) => {
    try {
      return await searchAPI(query);
    } catch (error) {
      errorService.log(error);
      throw error; // Let the hook handle UI state
    }
  },
};
```

### 3. Performance
```typescript
// ✅ Good: Memoized configuration
const behaviorConfig = useMemo(() => ({
  onSearchSubmit: searchService.search,
  onNavigateToHome: () => router.push('/'),
}), [router]);
```

### 4. Testing
```typescript
// ✅ Good: Testable configuration
const createBehaviorConfig = (dependencies) => ({
  onSearchSubmit: dependencies.searchService.search,
  onNavigateToHome: dependencies.router.push,
});

// Easy to mock in tests
const mockDependencies = {
  searchService: { search: jest.fn() },
  router: { push: jest.fn() },
};
```

## Common Patterns

### E-commerce Integration
```typescript
const ecommerceBehaviorConfig = {
  onNavigateToCart: () => {
    analytics.track('cart_viewed');
    router.push('/cart');
  },
  onNavigateToFavorites: () => {
    analytics.track('wishlist_viewed');
    router.push('/wishlist');
  },
  onSearchSubmit: async (query) => {
    const results = await productSearch(query);
    analytics.track('product_search', { 
      query, 
      results: results.length 
    });
    return results.length;
  },
};
```

### Authentication Integration
```typescript
const authBehaviorConfig = {
  onNavigateToSignIn: () => {
    if (isLoggedIn) {
      router.push('/account');
    } else {
      router.push('/auth/signin');
    }
  },
};
```

### Multi-language Support
```typescript
const i18nBehaviorConfig = {
  onNavigateToSection: (section, href) => {
    const localizedHref = `/${currentLocale}${href}`;
    router.push(localizedHref);
  },
};
```

## Troubleshooting

### Common Issues

1. **Search not working**: Check `onSearchSubmit` configuration
2. **Navigation not working**: Verify routing configuration
3. **Mobile menu stuck**: Check `onMobileMenuToggle` handler
4. **Analytics missing**: Ensure `onUserAction` is configured

### Debug Mode

Enable debug mode to see all behavior events:

```typescript
const behaviorConfig = {
  onUserAction: (action, data) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Header behavior:', action, data);
    }
    analytics.track(action, data);
  },
};
```

This behavior system provides a robust, testable, and maintainable way to handle all Header component interactions while keeping the UI logic separate from business logic.
