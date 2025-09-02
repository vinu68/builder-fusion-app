# CMS Integration - LAUREATE Component Library

Your component library is now fully compatible with any headless CMS! 🎉

## What's New

All components have been refactored to work seamlessly with popular headless CMS platforms including:

- **Strapi** - Open-source headless CMS
- **Contentful** - Cloud-first content platform
- **Sanity** - Real-time content platform
- **Any REST/GraphQL CMS** - Custom adapters supported

## Quick Start

### 1. Basic Setup

```tsx
import { createCMSManager } from './src/lib/cms-adapters';
import { HeaderCMS, FooterCMS, SectionCMS } from './src/components';

// Initialize CMS manager
const cmsManager = createCMSManager('strapi', {
  baseUrl: process.env.NEXT_PUBLIC_STRAPI_URL,
  apiToken: process.env.STRAPI_API_TOKEN,
});

// Use in your app
export default async function Layout({ children }) {
  const headerData = await cmsManager.getHeaderConfig();
  const footerData = await cmsManager.getFooterConfig();

  return (
    <html>
      <body>
        <HeaderCMS data={headerData} />
        <main>{children}</main>
        <FooterCMS data={footerData} />
      </body>
    </html>
  );
}
```

### 2. Dynamic Pages

```tsx
import { SectionCMS } from './src/components';

export default async function Page({ params }) {
  const page = await cmsManager.getPage(params.slug);
  
  return (
    <div>
      <h1>{page.title}</h1>
      {page.sections.map((section) => (
        <SectionCMS key={section.id} data={section} />
      ))}
    </div>
  );
}
```

## Key Features

### ✅ **CMS-Agnostic Architecture**
- Works with any headless CMS
- Standardized data interfaces
- Built-in adapters for popular platforms

### ✅ **Type-Safe Integration**
- Full TypeScript support
- Comprehensive type definitions
- IntelliSense for all CMS data structures

### ✅ **Flexible Content Blocks**
- Text, headings, images, buttons, links
- Extensible block system
- Custom content types supported

### ✅ **Action Handling**
- Navigation management
- Search functionality
- Newsletter subscriptions
- Custom button actions

### ✅ **Performance Optimized**
- Built-in caching (5 minutes default)
- Preload critical data
- Efficient data transformation

### ✅ **Developer Experience**
- Mock data for development
- Comprehensive documentation
- Example implementations

## Available Components

| Component | Purpose | CMS Compatible |
|-----------|---------|----------------|
| `HeaderCMS` | Site navigation and branding | ✅ |
| `FooterCMS` | Site footer with links and info | ✅ |
| `SectionCMS` | Content sections and layouts | ✅ |
| `ButtonCMS` | Interactive buttons with actions | ✅ |
| `Button` | Standard button component | ✅ |
| `Section` | Standard section component | ✅ |
| `ThemeToggle` | Theme switching | ✅ |

## Data Flow

```
CMS Platform → Adapter → Standardized Data → Components → UI
```

1. **CMS Platform**: Your chosen headless CMS (Strapi, Contentful, etc.)
2. **Adapter**: Transforms platform-specific data to standard format
3. **Standardized Data**: Type-safe interfaces that work with all platforms
4. **Components**: CMS-aware React components
5. **UI**: Rendered user interface

## Example Data Structures

### Header Configuration
```typescript
const headerConfig = {
  logo: { url: "/logo.svg", alt: "Company Logo" },
  navigation: [
    { id: "home", label: "Home", url: "/" },
    { id: "products", label: "Products", url: "/products" }
  ],
  showSearch: true,
  cartItemsCount: 3,
  isLoggedIn: false
};
```

### Page Structure
```typescript
const page = {
  title: "Welcome",
  slug: "home",
  sections: [
    {
      type: "hero",
      title: "Welcome to Our Store",
      content: [
        { type: "text", content: "Discover amazing products" },
        { type: "button", text: "Shop Now", variant: "contained" }
      ]
    }
  ]
};
```

## Getting Started

1. **Choose your CMS platform** (Strapi, Contentful, Sanity, etc.)
2. **Set up content models** using our provided schemas
3. **Configure the adapter** with your CMS credentials
4. **Replace existing components** with CMS-compatible versions
5. **Add action handlers** for user interactions

## Documentation

- 📖 **[Complete Integration Guide](./docs/cms-integration-guide.md)** - Detailed setup instructions
- 🔧 **[API Reference](./src/types/cms.ts)** - TypeScript interfaces and types
- 🧪 **[Mock Data](./src/lib/mock-cms-data.ts)** - Development and testing data
- 🎨 **[Component Examples](./src/components/)** - CMS component implementations

## Support

Need help integrating with your specific CMS? Check our documentation or create an issue for platform-specific guidance.

## Benefits for Your Project

- ✅ **Content Management**: Non-technical users can manage all content
- ✅ **Multi-Platform**: Deploy to web, mobile, and other platforms
- ✅ **Scalability**: Handle enterprise-level content needs
- ✅ **Performance**: Optimized data fetching and caching
- ✅ **SEO**: Dynamic meta tags and structured data
- ✅ **Developer Experience**: Type-safe, well-documented APIs

Your component library is now ready for any headless CMS integration! 🚀
