# Storybook Guidelines for Component Development

This document provides guidelines and templates for creating consistent Storybook stories for all components in the design system.

## Getting Started

### Running Storybook

```bash
# Start Storybook development server
npm run storybook

# Build static Storybook for deployment
npm run build-storybook
```

Storybook will be available at `http://localhost:6006`

## Story File Structure

Each component should have a corresponding `.stories.tsx` file in the same directory:

```
src/components/ComponentName/
├── index.tsx
├── ComponentName.tsx
├── ComponentName.css
├── ComponentName.stories.tsx  ← Story file
├── ComponentName.test.tsx
├── types.ts
└── README.md
```

## Story Template

Use this template for creating new component stories:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import ComponentName from './ComponentName';

const meta = {
  title: 'Components/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Brief description of what this component does and when to use it.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Define controls for each prop
    propName: {
      control: 'select', // or 'boolean', 'text', 'number', etc.
      options: ['option1', 'option2'],
      description: 'Description of what this prop does',
    },
    // Add more props as needed
  },
  args: {
    // Default args for all stories
    onClick: fn(), // For event handlers
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    // Default props
  },
};

// Add more stories as needed...
```

## Required Stories

Every component should include these basic stories:

### 1. Default Story
Shows the component in its most basic state.

```typescript
export const Default: Story = {
  args: {
    children: 'Default content',
  },
};
```

### 2. All Variants (if applicable)
If your component has variants, show each one:

```typescript
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary variant',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary variant',
  },
};
```

### 3. All Sizes (if applicable)
If your component has different sizes:

```typescript
export const Small: Story = {
  args: {
    size: 'small',
    children: 'Small size',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    children: 'Large size',
  },
};
```

### 4. Disabled State (if applicable)
Show the disabled state:

```typescript
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled state',
  },
};
```

### 5. Showcase Story
A comprehensive example showing multiple variations:

```typescript
export const Showcase: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <ComponentName variant="primary">Primary</ComponentName>
      <ComponentName variant="secondary">Secondary</ComponentName>
      <ComponentName disabled>Disabled</ComponentName>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All component variations displayed together for comparison.',
      },
    },
  },
};
```

## Control Types

Use appropriate control types for different prop types:

| Prop Type | Control Type | Example |
|-----------|--------------|---------|
| String | `'text'` | `control: 'text'` |
| Boolean | `'boolean'` | `control: 'boolean'` |
| Number | `'number'` | `control: 'number'` |
| Select/Enum | `'select'` | `control: { type: 'select', options: ['option1', 'option2'] }` |
| Color | `'color'` | `control: 'color'` |
| Date | `'date'` | `control: 'date'` |
| Object | `'object'` | `control: 'object'` |
| Function | N/A | Use `fn()` from `@storybook/test` |

## Documentation Guidelines

### Component Description
Always include a clear description of:
- What the component does
- When to use it
- Key features or capabilities

### Story Descriptions
Add descriptions to complex stories:

```typescript
export const ComplexExample: Story = {
  render: () => (/* complex JSX */),
  parameters: {
    docs: {
      description: {
        story: 'This story demonstrates how to use the component in a complex scenario.',
      },
    },
  },
};
```

### ArgTypes Documentation
Document each prop:

```typescript
argTypes: {
  variant: {
    control: 'select',
    options: ['primary', 'secondary'],
    description: 'Visual style variant of the component',
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'primary' },
    },
  },
},
```

## Accessibility Testing

Include accessibility testing in your stories by using the a11y addon:

```typescript
export const AccessibilityTest: Story = {
  args: {
    'aria-label': 'Accessible component',
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
  },
};
```

## Best Practices

### 1. Use Semantic Props
Use props that match the actual component API, not just for Storybook.

### 2. Provide Realistic Content
Use realistic text content and data rather than "Lorem ipsum" or "test".

### 3. Show Edge Cases
Include stories that show how the component behaves with:
- Very long text
- No content
- Unusual combinations of props

### 4. Use Consistent Naming
- Story names should be clear and descriptive
- Use PascalCase for story names
- Group related stories with consistent naming

### 5. Include Interactive Examples
Show components in realistic contexts:

```typescript
export const InForm: Story = {
  render: () => (
    <form>
      <label htmlFor="input">Label</label>
      <ComponentName id="input" />
      <button type="submit">Submit</button>
    </form>
  ),
};
```

## Troubleshooting

### Common Issues

1. **CSS not loading**: Ensure CSS imports are in the component file
2. **Controls not working**: Check argTypes configuration
3. **Stories not appearing**: Verify file naming (*.stories.tsx)

### Getting Help

- Check the [Storybook documentation](https://storybook.js.org/docs)
- Review existing component stories for examples
- Ask team members for guidance on complex scenarios

## Checklist for New Components

- [ ] Create `.stories.tsx` file in component directory
- [ ] Include all required stories (Default, variants, sizes, disabled)
- [ ] Add proper argTypes with descriptions
- [ ] Include comprehensive documentation
- [ ] Test accessibility with a11y addon
- [ ] Add showcase story for comparison
- [ ] Verify all controls work correctly
- [ ] Add realistic content and examples

This ensures consistency and quality across all component stories in the design system.
