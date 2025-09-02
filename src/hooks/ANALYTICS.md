# Analytics Hooks System

This system provides automatic analytics tracking for all user interactions using hooks instead of props. Components handle their own analytics internally without requiring external event handlers.

## Features

- **Automatic Tracking**: Components track clicks and interactions automatically
- **Hook-based**: No need to pass analytics handlers as props
- **Configurable**: Multiple analytics providers (Google Analytics, custom API, console)
- **Type-safe**: Full TypeScript support
- **Contextual**: Rich context data for every event
- **Performance**: Batching and efficient tracking

## Setup

### 1. Configure Analytics Provider

In your root layout or app component:

```tsx
import { AnalyticsProvider } from '../contexts/AnalyticsContext';

export default function RootLayout({ children }) {
  return (
    <AnalyticsProvider
      config={{
        enabled: true,
        debug: process.env.NODE_ENV === 'development',
        trackingId: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
        endpoint: process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT,
      }}
    >
      {children}
    </AnalyticsProvider>
  );
}
```

### 2. Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_GA_TRACKING_ID=GA_MEASUREMENT_ID
NEXT_PUBLIC_ANALYTICS_ENDPOINT=https://your-analytics-api.com/events
```

## Component Usage

Components automatically track interactions without any props:

### Before (with props):
```tsx
<Header 
  onSearch={(query) => trackSearch(query)}
  onNavigate={(path) => trackNavigation(path)}
  onLogoClick={() => trackClick('logo')}
/>
```

### After (with hooks):
```tsx
<Header />
```

The Header component now handles all analytics internally using hooks.

## Component Analytics

### Header Component
Automatically tracks:
- Logo clicks
- Navigation item clicks
- Search submissions
- Action button clicks (cart, favorites, stores, etc.)

```tsx
// Inside Header component
const {
  trackLogoClick,
  trackSearchSubmit,
  trackNavigationClick,
  trackActionClick,
} = useHeaderAnalytics();

// These are called automatically on user interactions
```

### Footer Component
Automatically tracks:
- Newsletter submissions
- Social link clicks
- Footer link clicks
- Benefit card interactions

```tsx
// Inside Footer component
const {
  trackNewsletterSubmit,
  trackSocialClick,
  trackFooterLinkClick,
  trackBenefitClick,
} = useFooterAnalytics();
```

### Button Component
Automatically tracks:
- Button clicks with context (variant, size, text)
- Button type and icon presence

```tsx
// Inside Button component
const { trackButtonClick } = useButtonAnalytics(variant, size);

// Called automatically on button click
```

### Theme Toggle Component
Automatically tracks:
- Theme changes (light/dark)
- Previous and new theme values

```tsx
// Inside ThemeToggle component
const { trackThemeToggle } = useThemeToggleAnalytics();

// Called automatically on theme toggle
```

## Custom Component Analytics

For your own components, use the generic hooks:

```tsx
import { useComponentAnalytics } from '../hooks/useAnalytics';

function MyComponent() {
  const analytics = useComponentAnalytics('MyComponent', 'section-name');

  const handleCustomAction = () => {
    analytics.trackClick('custom-button', {
      custom_property: 'value',
      user_action: 'special_click',
    });
  };

  return (
    <button onClick={handleCustomAction}>
      Custom Action
    </button>
  );
}
```

## Analytics Data Structure

Every event includes:

```typescript
interface AnalyticsEvent {
  event: string;           // 'click', 'search', 'navigation'
  category: string;        // 'user_interaction', 'navigation', 'form'
  action: string;          // 'click', 'submit', 'navigate'
  label?: string;          // 'logo', 'search-button', 'home'
  value?: number;          // numeric value if applicable
  properties?: {           // custom properties
    component: string;     // 'Header', 'Footer', 'Button'
    section?: string;      // 'navigation', 'footer'
    element: string;       // specific element clicked
    // ... additional context
  };
  timestamp: number;       // when the event occurred
  userId?: string;         // user identifier
  sessionId: string;       // session identifier
}
```

## Built-in Providers

### Console Provider (Development)
Logs events to console when `debug: true`:

```javascript
Analytics Event: {
  event: 'click',
  category: 'user_interaction',
  action: 'click',
  label: 'logo',
  properties: {
    component: 'Header',
    section: 'navigation',
    destination: 'home'
  }
}
```

### Google Analytics Provider
Automatically sends events to Google Analytics when `trackingId` is provided.

### Custom API Provider
Batches and sends events to your custom endpoint when `endpoint` is provided.

## Custom Providers

Create custom analytics providers:

```tsx
import { AnalyticsProvider as IAnalyticsProvider } from '../types/analytics';

class MixpanelProvider implements IAnalyticsProvider {
  name = 'mixpanel';

  track(event: AnalyticsEvent): void {
    mixpanel.track(event.event, event.properties);
  }

  page(path: string, title?: string): void {
    mixpanel.track('page_view', { path, title });
  }

  identify(userId: string, traits?: Record<string, any>): void {
    mixpanel.identify(userId);
    if (traits) mixpanel.people.set(traits);
  }
}

// Use in your app
<AnalyticsProvider providers={[new MixpanelProvider()]}>
  {children}
</AnalyticsProvider>
```

## Benefits

1. **No Props Pollution**: Components don't need analytics props
2. **Automatic Tracking**: All interactions are tracked by default
3. **Rich Context**: Every event includes component and interaction context
4. **Maintainable**: Analytics logic is centralized in hooks
5. **Testable**: Components can be tested without analytics concerns
6. **Flexible**: Multiple providers can be used simultaneously
7. **Performance**: Batching and efficient event handling

## Event Categories

- `navigation`: Navigation-related events
- `user_interaction`: General user interactions
- `form`: Form submissions and interactions
- `search`: Search-related events
- `ecommerce`: Shopping-related events
- `engagement`: Content engagement events
- `error`: Error events

## Testing

Components can be tested without analytics by providing a mock provider or disabling analytics:

```tsx
<AnalyticsProvider config={{ enabled: false }}>
  <Header />
</AnalyticsProvider>
```

Or test analytics separately:

```tsx
const mockTrack = jest.fn();
<AnalyticsProvider providers={[{ name: 'mock', track: mockTrack }]}>
  <Header />
</AnalyticsProvider>
```

This analytics system provides comprehensive tracking while keeping components clean and focused on their primary responsibilities.
