# CMS Integration Guide

This guide shows how to integrate the component library with any headless CMS platform including Strapi, Contentful, Sanity, and others.

## Overview

The component library is designed to work with any headless CMS by providing:

- **CMS-agnostic data interfaces** - Standard data structures that work with any CMS
- **Flexible adapters** - Transform CMS data to component-friendly formats
- **Ready-to-use CMS components** - Drop-in components that consume CMS data
- **Action handlers** - Manage user interactions and navigation

## Quick Start

### 1. Install and Configure

```typescript
import { createCMSManager, StrapiAdapter } from './lib/cms-adapters';

// For Strapi
const cmsManager = createCMSManager('strapi', {
  baseUrl: process.env.NEXT_PUBLIC_STRAPI_URL,
  apiToken: process.env.STRAPI_API_TOKEN,
});

// For Contentful
const cmsManager = createCMSManager('contentful', {
  spaceId: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
  environment: 'master',
});

// For Sanity
const cmsManager = createCMSManager('sanity', {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2023-05-03',
});
```

### 2. Use CMS Components

```tsx
import { HeaderCMS, FooterCMS, SectionCMS } from './components';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const headerData = await cmsManager.getHeaderConfig();
  const footerData = await cmsManager.getFooterConfig();

  const handlers = {
    onNavigate: (path: string) => router.push(path),
    onSearch: (query: string) => router.push(`/search?q=${query}`),
    onNewsletterSubmit: async (email: string) => {
      // Handle newsletter signup
    },
  };

  return (
    <html>
      <body>
        {headerData && <HeaderCMS data={headerData} handlers={handlers} />}
        <main>{children}</main>
        {footerData && <FooterCMS data={footerData} handlers={handlers} />}
      </body>
    </html>
  );
}
```

### 3. Create Dynamic Pages

```tsx
import { SectionCMS } from './components';

export default async function Page({ params }: { params: { slug: string } }) {
  const page = await cmsManager.getPage(params.slug);
  
  if (!page) {
    return <div>Page not found</div>;
  }

  const handlers = {
    onButtonClick: (actionId: string, data: any) => {
      // Handle button clicks
      console.log('Button clicked:', actionId, data);
    },
    onNavigate: (path: string) => router.push(path),
  };

  return (
    <div>
      <h1>{page.title}</h1>
      {page.sections.map((section) => (
        <SectionCMS 
          key={section.id} 
          data={section} 
          handlers={handlers} 
        />
      ))}
    </div>
  );
}
```

## Data Structures

### Header Configuration

```typescript
const headerConfig: CMSHeaderConfig = {
  logo: {
    url: "https://example.com/logo.svg",
    alt: "Company Logo",
    width: 150,
    height: 50
  },
  navigation: [
    {
      id: "home",
      label: "Home",
      url: "/",
      isActive: true
    },
    {
      id: "products",
      label: "Products",
      url: "/products",
      children: [
        {
          id: "category-1",
          label: "Category 1",
          url: "/products/category-1"
        }
      ]
    }
  ],
  showSearch: true,
  searchPlaceholder: "Search products...",
  userLocation: "New York, NY",
  favoritesCount: 5,
  cartItemsCount: 3,
  isLoggedIn: false,
  ctaButton: {
    type: "button",
    text: "Get Started",
    variant: "contained",
    size: "medium",
    onClick: "signup"
  }
};
```

### Footer Configuration

```typescript
const footerConfig: CMSFooterConfig = {
  companyName: "Your Company",
  logo: {
    url: "https://example.com/logo.svg",
    alt: "Company Logo"
  },
  description: "We have clothes that suits your style and which you're proud to wear.",
  socialLinks: [
    {
      platform: "Twitter",
      url: "https://twitter.com/yourcompany",
      icon: "<svg>...</svg>"
    },
    {
      platform: "Facebook", 
      url: "https://facebook.com/yourcompany",
      icon: "<svg>...</svg>"
    }
  ],
  linkColumns: [
    {
      title: "Company",
      links: [
        { url: "/about", text: "About" },
        { url: "/careers", text: "Careers" },
        { url: "/contact", text: "Contact" }
      ]
    },
    {
      title: "Support",
      links: [
        { url: "/help", text: "Help Center" },
        { url: "/returns", text: "Returns" },
        { url: "/shipping", text: "Shipping Info" }
      ]
    }
  ],
  newsletter: {
    title: "JOIN OUR NEWSLETTER",
    subtitle: "Get monthly updates and offers",
    placeholder: "Enter your email address",
    buttonText: "SIGN UP"
  },
  benefits: [
    {
      icon: "<svg>...</svg>",
      title: "Free Shipping",
      description: "Free shipping on orders over $50",
      link: {
        url: "/shipping-info",
        text: "Learn more"
      }
    }
  ],
  paymentMethods: [
    "<svg>Visa</svg>",
    "<svg>Mastercard</svg>",
    "<svg>PayPal</svg>"
  ],
  copyright: "© 2024 Your Company. All rights reserved."
};
```

### Page Structure

```typescript
const page: CMSPage = {
  id: "home",
  title: "Welcome to Our Store",
  slug: "home",
  description: "Discover amazing products",
  sections: [
    {
      id: "hero",
      type: "hero",
      title: "Welcome to Our Store",
      subtitle: "Discover amazing products at great prices",
      content: [
        {
          type: "text",
          content: "Shop the latest trends and styles."
        },
        {
          type: "button",
          text: "Shop Now",
          variant: "contained",
          size: "large",
          url: "/products"
        }
      ],
      background: "default",
      padding: "large",
      textAlign: "center"
    },
    {
      id: "features",
      type: "features",
      title: "Why Choose Us?",
      content: [
        {
          type: "text",
          content: "Quality products, fast shipping, excellent service."
        }
      ],
      background: "alternate",
      padding: "medium"
    }
  ],
  seo: {
    metaTitle: "Welcome to Our Store - Best Products Online",
    metaDescription: "Discover amazing products at great prices. Shop now for the latest trends.",
    keywords: ["shopping", "products", "online store"]
  }
};
```

## CMS Platform Setup

### Strapi Setup

1. Create content types in Strapi admin:

```javascript
// Page content type
{
  "kind": "collectionType",
  "collectionName": "pages",
  "info": {
    "singularName": "page",
    "pluralName": "pages",
    "displayName": "Page"
  },
  "attributes": {
    "title": { "type": "string", "required": true },
    "slug": { "type": "uid", "targetField": "title" },
    "description": { "type": "text" },
    "sections": { "type": "dynamiczone", "components": ["layout.hero", "layout.content"] }
  }
}

// Header config content type  
{
  "kind": "singleType",
  "collectionName": "header_config",
  "info": {
    "singularName": "header-config",
    "pluralName": "header-configs",
    "displayName": "Header Configuration"
  },
  "attributes": {
    "logo": { "type": "media", "allowedTypes": ["images"] },
    "navigation": { "type": "json" },
    "showSearch": { "type": "boolean", "default": true },
    "searchPlaceholder": { "type": "string" }
  }
}
```

### Contentful Setup

1. Create content models in Contentful:

```json
{
  "name": "Page",
  "fields": [
    { "id": "title", "name": "Title", "type": "Symbol", "required": true },
    { "id": "slug", "name": "Slug", "type": "Symbol", "required": true },
    { "id": "description", "name": "Description", "type": "Text" },
    { "id": "sections", "name": "Sections", "type": "Array", "items": { "type": "Link", "linkType": "Entry" } }
  ]
}
```

### Sanity Setup

1. Create schemas in your Sanity studio:

```javascript
// schemas/page.js
export default {
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' }
    },
    {
      name: 'description',
      title: 'Description', 
      type: 'text'
    },
    {
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        { type: 'hero' },
        { type: 'content' },
        { type: 'features' }
      ]
    }
  ]
}
```

## Advanced Usage

### Custom Content Blocks

You can extend the content block system:

```typescript
// Add custom block type
interface CMSVideoBlock {
  type: 'video';
  url: string;
  thumbnail?: CMSImage;
  autoplay?: boolean;
  controls?: boolean;
}

type CustomContentBlock = CMSContentBlock | CMSVideoBlock;

// Handle in render function
function renderCustomBlocks(blocks: CustomContentBlock[]) {
  return blocks.map((block, index) => {
    if (block.type === 'video') {
      return (
        <video
          key={index}
          src={block.url}
          poster={block.thumbnail?.url}
          autoPlay={block.autoplay}
          controls={block.controls}
        />
      );
    }
    // ... handle other types
  });
}
```

### Custom Adapters

Create adapters for other CMS platforms:

```typescript
class CustomCMSAdapter implements CMSAdapter {
  async getPage(slug: string): Promise<CMSPage | null> {
    // Your custom implementation
    const response = await fetch(`/api/pages/${slug}`);
    const data = await response.json();
    return this.transformPage(data);
  }

  private transformPage(data: any): CMSPage {
    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      // ... transform other fields
    };
  }
}
```

### Performance Optimization

```typescript
// Preload critical data
await cmsManager.preloadEssentials();

// Cache configuration
const cmsManager = new CMSManager(adapter);
// Data is automatically cached for 5 minutes

// Clear cache when needed
cmsManager.clearCache(); // Clear all
cmsManager.clearCache('header'); // Clear specific key
```

## Component API Reference

### HeaderCMS

```typescript
interface HeaderCMSProps {
  data: CMSHeaderConfig;
  handlers?: CMSActionHandlers;
  className?: string;
}
```

### FooterCMS  

```typescript
interface FooterCMSProps {
  data: CMSFooterConfig;
  handlers?: CMSActionHandlers;
  className?: string;
}
```

### SectionCMS

```typescript
interface SectionCMSProps {
  data: CMSSection;
  handlers?: CMSActionHandlers;
  className?: string;
  children?: React.ReactNode; // Override content blocks
}
```

### ButtonCMS

```typescript
interface ButtonCMSProps {
  data: CMSButtonBlock;
  handlers?: CMSActionHandlers;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}
```

## Action Handlers

```typescript
const handlers: CMSActionHandlers = {
  onNavigate: (path: string) => {
    // Handle navigation
    router.push(path);
  },
  
  onSearch: (query: string) => {
    // Handle search
    router.push(`/search?q=${encodeURIComponent(query)}`);
  },
  
  onNewsletterSubmit: async (email: string) => {
    // Handle newsletter signup
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      toast.success('Successfully subscribed!');
    } catch (error) {
      toast.error('Subscription failed');
    }
  },
  
  onButtonClick: (actionId: string, data?: any) => {
    // Handle custom button actions
    switch (actionId) {
      case 'signup':
        router.push('/signup');
        break;
      case 'add-to-cart':
        addToCart(data.productId);
        break;
      case 'share':
        navigator.share({ url: window.location.href });
        break;
    }
  },
  
  onLinkClick: (url: string, target?: string) => {
    // Handle link clicks
    if (target === '_blank') {
      window.open(url, '_blank');
    } else {
      router.push(url);
    }
  }
};
```

## Best Practices

1. **Type Safety**: Always use TypeScript interfaces for CMS data
2. **Error Handling**: Implement proper error handling in adapters
3. **Performance**: Cache CMS data and preload critical content
4. **SEO**: Use CMS data for meta tags and structured data
5. **Accessibility**: Ensure CMS content includes proper alt text and labels
6. **Testing**: Test components with mock CMS data
7. **Security**: Validate and sanitize CMS content before rendering

## Examples

See the `/examples` directory for complete implementation examples with different CMS platforms.
