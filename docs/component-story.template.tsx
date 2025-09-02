import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import ComponentName from './ComponentName'; // Replace with actual component
import type { ComponentNameProps } from './types'; // Replace with actual types

const meta = {
  title: 'Components/ComponentName', // Update component name
  component: ComponentName,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Brief description of what this component does and when to use it.', // Update description
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Example prop configurations - update based on your component's props
    variant: {
      control: 'select',
      options: ['primary', 'secondary'], // Update options
      description: 'Visual style variant of the component',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'], // Update options
      description: 'Size of the component',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled',
    },
    children: {
      control: 'text',
      description: 'Content of the component',
    },
    // Add more props as needed
  },
  args: {
    // Default args for all stories
    onClick: fn(), // For event handlers
    children: 'Default Content', // Update default content
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

// 1. Default story - shows the component in its most basic state
export const Default: Story = {
  args: {
    children: 'Default Component',
  },
};

// 2. Variant stories - show each variant if applicable
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Variant',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Variant',
  },
};

// 3. Size stories - show each size if applicable
export const Small: Story = {
  args: {
    size: 'small',
    children: 'Small Size',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
    children: 'Medium Size',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    children: 'Large Size',
  },
};

// 4. State stories
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled State',
  },
};

// 5. Interactive example
export const Interactive: Story = {
  args: {
    children: 'Click me!',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example showing component behavior.',
      },
    },
  },
};

// 6. Showcase story - displays multiple variations together
export const Showcase: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      <ComponentName variant="primary">Primary</ComponentName>
      <ComponentName variant="secondary">Secondary</ComponentName>
      <ComponentName size="small">Small</ComponentName>
      <ComponentName size="large">Large</ComponentName>
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

// 7. Complex example showing real-world usage
export const RealWorldExample: Story = {
  render: () => (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      maxWidth: '400px'
    }}>
      <h3 style={{ marginTop: 0 }}>Real World Context</h3>
      <p>This shows how the component might be used in a real application.</p>
      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
        <ComponentName variant="primary">Save</ComponentName>
        <ComponentName variant="secondary">Cancel</ComponentName>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example showing the component in a realistic application context.',
      },
    },
  },
};

// 8. Edge cases - test component with unusual inputs
export const EdgeCases: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '300px' }}>
      <div>
        <h4>Very Long Text</h4>
        <ComponentName>
          This is a very long text that might cause layout issues if not handled properly
        </ComponentName>
      </div>
      <div>
        <h4>Empty Content</h4>
        <ComponentName>{''}</ComponentName>
      </div>
      <div>
        <h4>Special Characters</h4>
        <ComponentName>Special chars: @#$%^&*()_+</ComponentName>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Testing component behavior with edge cases and unusual inputs.',
      },
    },
  },
};

// 9. Accessibility example
export const Accessibility: Story = {
  args: {
    'aria-label': 'Accessible component example',
    children: 'Accessible Component',
  },
  parameters: {
    docs: {
      description: {
        story: 'Example demonstrating proper accessibility attributes.',
      },
    },
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

/*
TODO: Replace the following placeholders when creating a new component story:

1. Replace "ComponentName" with your actual component name throughout the file
2. Update the title in meta to match your component path
3. Update the component description
4. Configure argTypes to match your component's actual props
5. Update variant and size options to match your component
6. Replace default content with appropriate examples
7. Add any component-specific stories
8. Remove stories that don't apply to your component
9. Update examples to show realistic usage of your component
10. Test all stories work correctly in Storybook

Remember to:
- Keep story names descriptive and consistent
- Include proper documentation for each story
- Test accessibility with the a11y addon
- Provide realistic content and examples
- Cover edge cases and error states
*/
