# Data Service Layer

This data service layer provides a flexible, configurable way to fetch content from any endpoint or CDN. It supports multiple adapters, data transformation, caching, and error handling.

## Features

- **Multiple Adapters**: HTTP, CDN, and Mock adapters
- **Configurable**: Each adapter can be configured independently
- **Data Transformation**: Transform data before it reaches your components
- **Error Handling**: Built-in error handling with fallbacks
- **Caching**: Memory-based caching with TTL
- **Type Safe**: Full TypeScript support

## Basic Usage

### 1. Configure Adapters

```typescript
import { dataService } from './data-service';

// Configure HTTP adapter for API calls
dataService.configureAdapter('http', {
  baseUrl: 'https://api.example.com',
  headers: {
    'Authorization': 'Bearer your-token',
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Configure CDN adapter for static assets
dataService.configureAdapter('cdn', {
  baseUrl: 'https://cdn.example.com',
  headers: {
    'Cache-Control': 'max-age=3600',
  },
});
```

### 2. Fetch Data

```typescript
// Basic fetch
const headerData = await dataService.get('/header-config');

// Fetch with specific adapter
const images = await dataService.fetch({
  endpoint: '/images/hero.json',
  adapter: 'cdn',
});

// Fetch with transformation
const products = await dataService.fetch({
  endpoint: '/products',
  transform: transformers.extractData('items'),
});
```

### 3. Use in Components

```typescript
import { HeaderConfig } from '../types';
import { dataService, transformers } from '../services';

// Header configuration from API
export async function getHeaderConfig(): Promise<HeaderConfig> {
  return dataService.get('/config/header', undefined, {
    fallback: {
      logo: { src: '/default-logo.png' },
      navigation: [],
      texts: { searchPlaceholder: 'Search...' },
    },
    transform: transformers.pickFields(['logo', 'navigation', 'texts']),
  });
}

// Footer configuration from CDN
export async function getFooterConfig() {
  return dataService.fetch({
    endpoint: '/config/footer.json',
    adapter: 'cdn',
    cache: 'force-cache',
    next: { revalidate: 3600 }, // Cache for 1 hour
  });
}
```

## Advanced Usage

### Data Transformation

```typescript
import { transformers } from './data-utils';

// Chain multiple transformers
const processedData = await dataService.fetch({
  endpoint: '/products',
  transform: (data) => 
    transformers.limitArray(10)(
      transformers.sortArray((a, b) => b.rating - a.rating)(
        transformers.filterArray(item => item.available)(data.products)
      )
    ),
});

// Custom transformer
const customTransform = (data: any) => ({
  ...data,
  processedAt: new Date().toISOString(),
  items: data.items?.map(item => ({
    ...item,
    slug: item.title.toLowerCase().replace(/\s+/g, '-'),
  })),
});
```

### Error Handling and Fallbacks

```typescript
// With fallback data
const config = await dataService.fetch({
  endpoint: '/config',
  fallback: defaultConfig,
  onError: (error) => console.warn('Config fetch failed:', error.message),
});

// With retry logic
import { dataUtils } from './data-utils';

const criticalData = await dataUtils.fetchWithRetry({
  endpoint: '/critical-data',
}, 3, 1000); // 3 retries with exponential backoff
```

### Caching

```typescript
import { dataUtils } from './data-utils';

// Memory cache
const cachedData = await dataUtils.cache.fetchCached(
  'header-config',
  { endpoint: '/header-config' },
  300000 // 5 minutes TTL
);

// Manual cache operations
dataUtils.cache.set('user-data', userData, 600000); // 10 minutes
const userData = dataUtils.cache.get('user-data');
```

### Multiple Requests

```typescript
// Parallel requests
const { header, footer, navigation } = await dataUtils.fetchMultiple({
  header: { endpoint: '/config/header' },
  footer: { endpoint: '/config/footer' },
  navigation: { endpoint: '/config/navigation' },
});
```

### Mock Data for Development

```typescript
// Configure mock adapter
dataService.configureAdapter('mock', {
  mockData: {
    '/config/header': {
      logo: { src: '/mock-logo.png' },
      navigation: [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
      ],
    },
    '/config/footer': {
      sections: [
        {
          title: 'Company',
          links: [
            { label: 'About', href: '/about' },
            { label: 'Careers', href: '/careers' },
          ],
        },
      ],
    },
  },
});

// Use mock adapter in development
const headerConfig = await dataService.fetch({
  endpoint: '/config/header',
  adapter: process.env.NODE_ENV === 'development' ? 'mock' : 'http',
});
```

## Component Integration Examples

### Header Component with Dynamic Configuration

```typescript
// services/header-service.ts
export class HeaderService {
  static async getConfiguration() {
    return dataService.fetch({
      endpoint: '/api/header-config',
      fallback: {
        texts: {
          searchPlaceholder: 'Search products...',
          signInTitle: 'Sign In',
          communityLabel: 'Community',
        },
        navigation: [],
        showSearch: true,
        showCart: true,
      },
      transform: (data) => ({
        ...data,
        navigation: data.navigation?.map(item => ({
          ...item,
          isActive: item.href === window.location.pathname,
        })),
      }),
    });
  }
}

// components/Header/Header.tsx
export default function Header() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    HeaderService.getConfiguration().then(setConfig);
  }, []);

  if (!config) return <div>Loading...</div>;

  return <HeaderComponent config={config} />;
}
```

### Environment-based Configuration

```typescript
// Configure different adapters for different environments
const configureDataService = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isProduction) {
    dataService.configureAdapter('http', {
      baseUrl: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        'Authorization': `Bearer ${process.env.API_TOKEN}`,
      },
    });
    dataService.setDefaultAdapter('http');
  } else if (isDevelopment) {
    dataService.setDefaultAdapter('mock');
  }
};
```

## Best Practices

1. **Configure adapters early** in your application lifecycle
2. **Use fallback data** for critical UI components
3. **Implement proper error handling** to gracefully handle failures
4. **Cache frequently accessed data** to improve performance
5. **Use transformers** to normalize data from different sources
6. **Test with mock adapter** during development
7. **Set appropriate cache policies** for different types of content

## Type Safety

```typescript
interface HeaderConfig {
  logo: { src: string; alt?: string };
  navigation: NavigationItem[];
  texts: HeaderTexts;
}

// Type-safe data fetching
const headerConfig = await dataService.get<HeaderConfig>('/header-config');
```

This data service layer separates concerns, making your components testable and your data fetching configurable and maintainable.
