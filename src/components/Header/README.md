# Header Component

A comprehensive e-commerce header component featuring logo, search functionality, navigation, and user actions. Built with responsive design, accessibility, and theme support.

## Features

- **🔍 Search Functionality**: Integrated search bar with keyboard navigation
- **🛍️ E-commerce Ready**: Cart, favorites, and user account integration
- **📱 Fully Responsive**: Optimized layouts for mobile, tablet, and desktop
- **🎨 Theme Support**: Automatic light/dark theme adaptation using CSS variables
- **♿ Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **🗺️ Location Services**: Store locator and services integration
- **📊 Dynamic Counters**: Real-time cart and favorites counters

## Usage

### Basic Implementation

```tsx
import { Header } from '@/components';

function App() {
  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // Implement your search logic
  };

  const handleNavigate = (section: string) => {
    console.log('Navigate to:', section);
    // Implement your navigation logic
  };

  return (
    <Header
      favoritesCount={3}
      cartItemsCount={2}
      userLocation="Laurent, Jakarta"
      isLoggedIn={true}
      onSearch={handleSearch}
      onNavigate={handleNavigate}
    />
  );
}
```

### Advanced Configuration

```tsx
<Header
  favoritesCount={12}
  cartItemsCount={5}
  userLocation="New York, NY"
  isLoggedIn={true}
  className="custom-header"
  onSearch={(query) => {
    // Custom search implementation
    searchProducts(query);
  }}
  onNavigate={(section) => {
    // Custom navigation with analytics
    trackNavigation(section);
    router.push(`/${section}`);
  }}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `favoritesCount` | `number` | `0` | Number of items in user's favorites |
| `cartItemsCount` | `number` | `0` | Number of items in shopping cart |
| `userLocation` | `string` | `"Laurent, Jakarta"` | User's current location for store services |
| `isLoggedIn` | `boolean` | `false` | Whether user is authenticated |
| `className` | `string` | `""` | Additional CSS classes |
| `onSearch` | `(query: string) => void` | - | Callback when user searches |
| `onNavigate` | `(section: string) => void` | - | Callback when user navigates |

## Navigation Items

The header includes these navigation sections:

- **New** - Latest arrivals and trending items
- **Brands** - Brand catalog and featured brands
- **Men** - Men's clothing and accessories
- **Women** - Women's clothing and accessories
- **Kids** - Children's clothing and items
- **Home & Living** - Home decor and lifestyle products
- **Beauty** - Cosmetics and beauty products
- **Studio** - Creative and artistic items
- **Gifts & Gift Cards** - Gift options and cards
- **Shop Under $80** - Budget-friendly selections
- **Sale & Offers** - Discounted items and promotions

## Responsive Behavior

### Desktop (1024px+)
- Full layout with all elements visible
- Detailed text labels and descriptions
- Spacious padding and large touch targets

### Tablet (768px - 1024px)
- Condensed layout with abbreviated text
- Hidden secondary text elements
- Optimized spacing for touch interaction

### Mobile (Below 768px)
- Simplified layout with essential elements only
- Hamburger menu for navigation
- Hidden search bar (can be accessed via mobile menu)
- Optimized for one-handed use

## Theme Integration

The Header component uses CSS custom properties for seamless theme integration:

```css
/* Light theme (default) */
:root {
  --header-bg: #ffffff;
  --header-text: #000000;
  --header-nav-bg: #000000;
  --header-nav-text: #ffffff;
}

/* Dark theme */
:root.dark-theme {
  --header-bg: var(--background);
  --header-text: var(--foreground);
  /* ... other theme variables */
}
```

### Custom Theme Colors

You can customize header colors by overriding the CSS variables:

```css
:root {
  --header-logo-bg: #your-brand-color;
  --header-counter-bg: #your-accent-color;
  --header-nav-bg: #your-nav-color;
}
```

## Accessibility Features

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Logical tab order throughout the header
- Enter/Space activation for buttons and links
- Escape key closes mobile menu

### Screen Reader Support
- Semantic HTML structure (`header`, `nav`, `search`)
- ARIA labels for complex interactions
- Descriptive button labels with context
- Live regions for dynamic content updates

### Visual Accessibility
- High contrast focus indicators
- Sufficient color contrast ratios (WCAG AA compliant)
- Scalable text and icons
- Respects user motion preferences

## Event Handling

### Search Events
```tsx
const handleSearch = (query: string) => {
  // Validate search query
  if (query.trim().length < 2) return;
  
  // Implement search logic
  searchAPI.query(query);
  
  // Track search analytics
  analytics.track('header_search', { query });
};
```

### Navigation Events
```tsx
const handleNavigate = (section: string) => {
  // Map section to routes
  const routes = {
    'new': '/collections/new',
    'men': '/collections/men',
    'women': '/collections/women',
    // ... other mappings
  };
  
  // Navigate to section
  router.push(routes[section] || '/');
  
  // Track navigation
  analytics.track('header_navigation', { section });
};
```

## Integration Examples

### With React Router

```tsx
import { useNavigate } from 'react-router-dom';

function AppHeader() {
  const navigate = useNavigate();
  
  return (
    <Header
      onNavigate={(section) => {
        navigate(`/${section}`);
      }}
      onSearch={(query) => {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }}
    />
  );
}
```

### With Next.js

```tsx
import { useRouter } from 'next/router';

function AppHeader() {
  const router = useRouter();
  
  return (
    <Header
      onNavigate={(section) => {
        router.push(`/${section}`);
      }}
      onSearch={(query) => {
        router.push(`/search?q=${encodeURIComponent(query)}`);
      }}
    />
  );
}
```

### With State Management

```tsx
import { useSelector, useDispatch } from 'react-redux';

function AppHeader() {
  const dispatch = useDispatch();
  const { user, cart, favorites } = useSelector(state => state);
  
  return (
    <Header
      isLoggedIn={user.isAuthenticated}
      cartItemsCount={cart.items.length}
      favoritesCount={favorites.items.length}
      userLocation={user.location}
      onSearch={(query) => {
        dispatch(searchActions.performSearch(query));
      }}
    />
  );
}
```

## Customization

### Custom Styling

```css
/* Override specific header styles */
.custom-header {
  border-bottom: 3px solid #your-brand-color;
}

.custom-header .header__logo svg {
  filter: hue-rotate(45deg);
}

.custom-header .header__nav {
  background: linear-gradient(90deg, #color1, #color2);
}
```

### Custom Logo

Replace the SVG logo with your own:

```tsx
// Create a custom header with your logo
const CustomHeader = (props) => (
  <Header {...props}>
    <img src="/your-logo.svg" alt="Your Brand" />
  </Header>
);
```

## Performance Considerations

- Uses CSS-only hover effects for better performance
- Minimal JavaScript for interaction handling
- Optimized SVG icons with proper viewBox settings
- Efficient CSS selectors to minimize repaints

## Browser Support

- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Progressive enhancement for older browsers
- Graceful degradation of advanced features

## Testing

The Header component includes comprehensive testing:

```bash
# Run component tests
npm test Header

# Run accessibility tests
npm run test:a11y Header

# Run visual regression tests
npm run test:visual Header
```

## Contributing

When modifying the Header component:

1. Ensure responsive behavior across all breakpoints
2. Test keyboard navigation thoroughly
3. Verify theme compatibility
4. Update Storybook stories for new features
5. Add appropriate TypeScript types
6. Include accessibility testing

## Related Components

- **Button** - Used for interactive elements
- **ThemeToggle** - Theme switching functionality
- **SearchInput** - Standalone search component
- **Navigation** - Standalone navigation component
