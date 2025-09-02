# Button Component

A versatile button component that supports multiple variants, sizes, and icon combinations.

## Features

- **Multiple Variants**: `contained`, `outline`, `text`
- **Flexible Sizing**: `small`, `medium`, `large`
- **Icon Support**: Start and end icon positioning
- **Accessibility**: Full keyboard navigation and screen reader support
- **Disabled State**: Proper disabled styling and behavior
- **Dark Mode**: Automatic color scheme adaptation

## Usage

### Basic Usage

```tsx
import { Button } from '@/components';

// Default contained button
<Button onClick={handleClick}>
  Save Changes
</Button>
```

### Variants

```tsx
// Primary action - filled background
<Button variant="contained">
  Save
</Button>

// Secondary action - outlined
<Button variant="outline">
  Cancel
</Button>

// Tertiary action - text only
<Button variant="text">
  Learn More
</Button>
```

### Sizes

```tsx
<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>
```

### With Icons

```tsx
import { SaveIcon, ArrowIcon } from '@/icons';

// Start icon
<Button startIcon={<SaveIcon />}>
  Save Document
</Button>

// End icon
<Button endIcon={<ArrowIcon />}>
  Continue
</Button>

// Both icons
<Button 
  startIcon={<SaveIcon />}
  endIcon={<ArrowIcon />}
>
  Save and Continue
</Button>
```

### Disabled State

```tsx
<Button disabled>
  Processing...
</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'contained' \| 'outline' \| 'text'` | `'contained'` | Visual style variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Button size |
| `startIcon` | `ReactNode` | - | Icon displayed before text |
| `endIcon` | `ReactNode` | - | Icon displayed after text |
| `disabled` | `boolean` | `false` | Disable button interaction |
| `children` | `ReactNode` | - | Button text content |
| `className` | `string` | - | Additional CSS classes |

All standard HTML button attributes are also supported (`onClick`, `type`, `aria-label`, etc.).

## Accessibility

- Uses semantic `<button>` element
- Supports keyboard navigation (Enter, Space)
- Provides proper focus indicators
- Includes `aria-disabled` for disabled state
- Compatible with screen readers

## Styling

The component uses CSS custom properties for theming and supports both light and dark color schemes automatically.

### CSS Classes

- `.button` - Base button styles
- `.button--contained` - Filled variant
- `.button--outline` - Outlined variant  
- `.button--text` - Text-only variant
- `.button--small` - Small size
- `.button--medium` - Medium size
- `.button--large` - Large size
- `.is-disabled` - Disabled state
