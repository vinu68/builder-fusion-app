# Storybook Quick Start Guide

Get up and running with Storybook for component development in under 5 minutes.

## 🚀 Starting Storybook

```bash
# Start the development server
npm run storybook
```

Your Storybook will be available at: `http://localhost:6006`

## 📝 Creating Stories for a New Component

### Step 1: Copy the Template
```bash
# Copy the story template
cp docs/component-story.template.tsx src/components/YourComponent/YourComponent.stories.tsx
```

### Step 2: Update the Template
Open your new `.stories.tsx` file and update:

1. **Component Import**: Replace `ComponentName` with your actual component name
2. **Title**: Update the Storybook navigation path
3. **Props**: Configure `argTypes` to match your component's props
4. **Stories**: Remove irrelevant stories, add component-specific ones

### Step 3: Basic Configuration
```typescript
// Minimal story setup
import type { Meta, StoryObj } from '@storybook/react';
import YourComponent from './YourComponent';

const meta = {
  title: 'Components/YourComponent',
  component: YourComponent,
  tags: ['autodocs'],
} satisfies Meta<typeof YourComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Your component's default props
  },
};
```

### Step 4: Test Your Stories
1. Save the file
2. Check Storybook browser - your component should appear in the sidebar
3. Test all controls and interactions

## 🎯 Essential Stories to Include

Every component should have these stories:

### ✅ Default
Shows the component in its basic state
```typescript
export const Default: Story = {
  args: {
    children: 'Default content',
  },
};
```

### ✅ Variants (if applicable)
One story per variant:
```typescript
export const Primary: Story = {
  args: { variant: 'primary' },
};
```

### ✅ Disabled State (if applicable)
```typescript
export const Disabled: Story = {
  args: { disabled: true },
};
```

### ✅ Showcase
All variants together for comparison:
```typescript
export const Showcase: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <YourComponent variant="primary">Primary</YourComponent>
      <YourComponent variant="secondary">Secondary</YourComponent>
    </div>
  ),
};
```

## 🎛️ Adding Controls

Controls let users interact with component props in Storybook:

```typescript
argTypes: {
  variant: {
    control: 'select',
    options: ['primary', 'secondary'],
    description: 'Visual style variant',
  },
  disabled: {
    control: 'boolean',
    description: 'Disable the component',
  },
  size: {
    control: 'select',
    options: ['small', 'medium', 'large'],
  },
},
```

## 📚 Common Control Types

| Prop Type | Control | Example |
|-----------|---------|---------|
| Boolean | `'boolean'` | `control: 'boolean'` |
| String | `'text'` | `control: 'text'` |
| Number | `'number'` | `control: 'number'` |
| Enum/Select | `'select'` | `control: { type: 'select', options: [...] }` |
| Color | `'color'` | `control: 'color'` |

## 🏃‍♂️ 5-Minute Component Story

For a quick setup, use this minimal template:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { YourComponent } from './YourComponent';

const meta: Meta<typeof YourComponent> = {
  title: 'Components/YourComponent',
  component: YourComponent,
  tags: ['autodocs'],
  argTypes: {
    // Add your main props here
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
```

## 🔧 Troubleshooting

### Story Not Showing Up?
- Check file is named `*.stories.tsx`
- Verify it's in the `src/` directory
- Restart Storybook if needed

### CSS Not Loading?
- Ensure CSS is imported in your component file
- Check that CSS file path is correct

### Controls Not Working?
- Verify `argTypes` configuration
- Check prop names match exactly

### Need Help?
- Check existing component stories for examples
- Read the full [Storybook Guidelines](./storybook-guidelines.md)
- Review the [component template](./component-story.template.tsx)

## 🎉 That's It!

You now have a working Storybook setup for your component. The more stories and documentation you add, the more valuable it becomes for your team!

## 📖 Next Steps

1. **Add More Stories**: Cover edge cases and different use scenarios
2. **Improve Documentation**: Add descriptions and usage examples  
3. **Test Accessibility**: Use the a11y addon to check accessibility
4. **Share with Team**: Use Storybook as a component showcase and documentation

Happy component building! 🚀
