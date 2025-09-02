# Builder.io Dynamic Routing Integration

This document explains how to set up and use Builder.io dynamic routing in your Next.js application.

## Overview

The integration provides:
- Dynamic routes that fetch content from Builder.io based on URL slugs
- SEO metadata generation from Builder.io content
- Preview mode support for draft content
- Proper error handling with 404 pages
- Loading states for better UX

## Setup

### 1. Environment Variables

Create a `.env.local` file in your project root:

```bash
# Required: Your Builder.io API key
NEXT_PUBLIC_BUILDER_API_KEY=your_builder_io_api_key_here

# Optional: Preview mode secret
BUILDER_PREVIEW_SECRET=your_preview_secret_here
```

Get your API key from [Builder.io Account Settings](https://builder.io/account/space).

### 2. Builder.io Content Models

The integration uses the following default models:
- `page` (default) - General pages
- `blog-post` - Blog posts
- `product` - Product pages
- `landing-page` - Landing pages

You can customize these in `src/lib/builder.ts`.

## How It Works

### Dynamic Routing

The catch-all route `src/app/[...slug]/page.tsx` handles all dynamic URLs:

- `/about` → Fetches content with URL `/about`
- `/blog/my-post` → Fetches content with URL `/blog/my-post`
- `/products/item-1` → Fetches content with URL `/products/item-1`

### Content Fetching

Content is fetched server-side for:
- Better SEO
- Faster initial page loads
- Proper metadata generation

### Caching

- Production: Content is cached for 60 seconds
- Preview mode: No caching for real-time updates

## Usage

### Creating Content in Builder.io

1. Go to your Builder.io space
2. Create a new page in the `page` model
3. Set the URL field to match your desired route (e.g., `/about`, `/contact`)
4. Design your page using Builder.io's visual editor
5. Publish the page

The page will automatically be available at the specified URL.

### Preview Mode

To preview draft content, add `?preview=true` to any URL:
```
https://yoursite.com/about?preview=true
```

### Custom Data

You can pass custom data to Builder.io content by modifying the `data` prop in the dynamic page component.

## API Reference

### Key Files

- `src/lib/builder.ts` - Builder.io configuration
- `src/lib/builder-utils.ts` - Utility functions for fetching content
- `src/types/builder.ts` - TypeScript types
- `src/components/BuilderContent/` - Content renderer component
- `src/app/[...slug]/page.tsx` - Dynamic route handler

### Utility Functions

#### `getBuilderContent(urlPath, options)`
Fetch content for a specific URL path.

#### `getAllBuilderContent(model)`
Get all content for a model (useful for static generation).

#### `generateMetadataFromContent(content)`
Extract SEO metadata from Builder.io content.

### Components

#### `<BuilderContent>`
Renders Builder.io content with the visual editor components.

```tsx
<BuilderContent 
  content={content} 
  model="page"
  data={{ customData: 'value' }}
/>
```

## Troubleshooting

### Content Not Loading
1. Check your API key is set correctly
2. Verify the URL in Builder.io matches your route
3. Ensure the content is published (not draft)

### Preview Mode Not Working
1. Check the preview URL parameter
2. Verify content exists in draft state
3. Check browser console for errors

### 404 Errors
1. Verify the URL field in Builder.io content
2. Check for trailing slashes in URLs
3. Ensure content is published

## Performance Optimization

### Static Generation (Optional)

Uncomment the `generateStaticParams` function in the dynamic page to enable static generation:

```tsx
export async function generateStaticParams() {
  const allContent = await getAllBuilderContent(DEFAULT_MODEL);
  
  return allContent
    .filter(content => content.data?.url && content.data.url !== '/')
    .map(content => ({
      slug: content.data.url.split('/').filter(Boolean),
    }));
}
```

### ISR (Incremental Static Regeneration)

The route is configured with `revalidate = 60` for ISR. Adjust this value based on your content update frequency.

## Advanced Usage

### Multiple Models

To use different Builder.io models for different routes, modify the dynamic page component to determine the model based on the URL pattern:

```tsx
function getModelFromPath(path: string): BuilderModel {
  if (path.startsWith('/blog')) return 'blog-post';
  if (path.startsWith('/products')) return 'product';
  return 'page';
}
```

### Custom Components

Register custom React components in Builder.io to use in your content. See [Builder.io documentation](https://www.builder.io/c/docs/custom-components-setup) for details.
