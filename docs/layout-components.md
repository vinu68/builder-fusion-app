# Layout Components Guide

This document explains the layout component structure implemented in the application.

## Overview

The application now uses a structured layout system where:

- **Header** and **Footer** components are included in the root layout and appear on every page
- **Section** component provides consistent spacing and styling for content areas
- **Main content** changes based on the current page while header and footer remain constant

## Components

### Header Component
- Location: `src/components/Header/`
- Included in: `src/app/layout.tsx`
- Features:
  - Navigation menu
  - Search functionality
  - User actions (favorites, cart, profile)
  - Responsive mobile menu
  - Theme-aware styling

### Footer Component
- Location: `src/components/Footer/`
- Included in: `src/app/layout.tsx`
- Features:
  - Company information
  - Newsletter signup
  - Footer links organized in sections
  - Social media links
  - Legal links (privacy, terms)
  - Responsive design

### Section Component
- Location: `src/components/Section/`
- Purpose: Provides consistent layout structure for content
- Features:
  - Background variants (default, alternate, primary, secondary)
  - Padding options (none, small, medium, large)
  - Max-width controls (small, medium, large, full)
  - Text alignment options
  - Semantic HTML element selection

## Layout Structure

```
┌─────────────────────────────────────┐
│              Header                 │ ← Always visible
├─────────────────────────────────────┤
│                                     │
│            Main Content             │ ← Changes per page
│         (using Sections)            │
│                                     │
├─────────────────────────────────────┤
│              Footer                 │ ← Always visible
└─────────────────────────────────────┘
```

## Root Layout (`src/app/layout.tsx`)

The root layout is a client component that:
- Includes Header and Footer components
- Provides default props for Header and Footer
- Handles user interactions (search, navigation, newsletter signup)
- Maintains the overall app structure

## Page Implementation (`src/app/page.tsx`)

Individual pages now:
- Use Section components for consistent layout
- Focus only on main content
- No longer include Header (handled by layout)
- Benefit from automatic header/footer inclusion

## Section Component Usage

```tsx
import { Section } from '../components';

// Basic usage
<Section>
  <h1>Content goes here</h1>
</Section>

// With styling options
<Section 
  background="alternate" 
  padding="large" 
  textAlign="center"
  maxWidth="medium"
>
  <h1>Styled content</h1>
</Section>

// Different semantic element
<Section as="article" background="primary">
  <h1>Article content</h1>
</Section>
```

## Section Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `background` | `'default' \| 'alternate' \| 'primary' \| 'secondary'` | `'default'` | Background styling variant |
| `padding` | `'none' \| 'small' \| 'medium' \| 'large'` | `'medium'` | Internal padding amount |
| `maxWidth` | `'small' \| 'medium' \| 'large' \| 'full'` | `'large'` | Maximum container width |
| `textAlign` | `'left' \| 'center' \| 'right'` | `'left'` | Text alignment |
| `as` | `'section' \| 'div' \| 'article' \| 'aside' \| 'main'` | `'section'` | HTML element type |
| `className` | `string` | `''` | Additional CSS classes |
| `id` | `string` | `undefined` | Element ID |

## Benefits

1. **Consistency**: Header and Footer appear on every page automatically
2. **Maintainability**: Layout changes only need to be made in one place
3. **Reusability**: Section component provides consistent spacing and styling
4. **Flexibility**: Pages can focus on content while layout handles structure
5. **Responsive**: All components are mobile-friendly
6. **Theme Support**: Components adapt to light/dark themes

## Dynamic Routes Integration

This layout structure works seamlessly with the Builder.io dynamic routing:

- Header and Footer remain consistent across all dynamic routes
- Builder.io content renders in the main content area
- Section components can be used within Builder.io content for consistent styling

## Customization

### Header Customization
Edit the `defaultHeaderProps` in `src/app/layout.tsx` to change:
- User location
- Cart/favorites counts
- Login state
- Event handlers

### Footer Customization
Edit the `defaultFooterProps` in `src/app/layout.tsx` to change:
- Company name
- Footer sections and links
- Social media links
- Newsletter functionality

### Section Styling
Modify `src/components/Section/Section.css` to:
- Add new background variants
- Adjust padding values
- Change max-width breakpoints
- Customize responsive behavior

## Best Practices

1. **Use Section components** for all major content areas
2. **Alternate backgrounds** between sections for visual separation
3. **Consistent padding** using Section's padding props
4. **Semantic HTML** by choosing appropriate `as` prop values
5. **Responsive design** is handled automatically by the components

This layout system provides a solid foundation for building consistent, maintainable pages while keeping the header and footer persistent across all routes.
