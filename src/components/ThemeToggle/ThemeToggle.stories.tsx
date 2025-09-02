import type { Meta, StoryObj } from '@storybook/react';
import ThemeToggle from './ThemeToggle';

const meta = {
  title: 'Components/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A theme toggle component that switches between light and dark themes. Uses CSS custom properties to provide seamless theme switching for all components.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {};

// Usage example
export const InHeader: Story = {
  render: () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      width: '400px',
      padding: '20px',
      border: '1px solid var(--button-border)',
      borderRadius: '8px',
      backgroundColor: 'var(--background)'
    }}>
      <h2 style={{ margin: 0, color: 'var(--foreground)' }}>App Header</h2>
      <ThemeToggle />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of how the theme toggle might be used in an application header.',
      },
    },
  },
};

// With other components to show theme effect
export const WithComponents: Story = {
  render: () => (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      gap: '20px',
      padding: '20px',
      border: '1px solid var(--button-border)',
      borderRadius: '8px',
      backgroundColor: 'var(--background)',
      minWidth: '300px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: 'var(--foreground)' }}>Theme Demo</h3>
        <ThemeToggle />
      </div>
      
      <p style={{ color: 'var(--foreground)', margin: 0 }}>
        Toggle the theme to see how all components adapt automatically.
      </p>
      
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button 
          style={{
            backgroundColor: 'var(--button-primary)',
            color: 'var(--button-primary-text)',
            border: '1px solid var(--button-primary)',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Primary Button
        </button>
        <button 
          style={{
            backgroundColor: 'var(--button-secondary)',
            color: 'var(--button-secondary-text)',
            border: '1px solid var(--button-secondary-border)',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Outline Button
        </button>
        <button 
          style={{
            backgroundColor: 'var(--button-text)',
            color: 'var(--button-text-color)',
            border: '1px solid transparent',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Text Button
        </button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstration of how the theme toggle affects multiple components simultaneously. All components use the same CSS custom properties for consistent theming.',
      },
    },
  },
};

export const ThemeExplanation: Story = {
  render: () => (
    <div style={{ 
      maxWidth: '500px',
      padding: '24px',
      border: '1px solid var(--button-border)',
      borderRadius: '8px',
      backgroundColor: 'var(--background)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, color: 'var(--foreground)' }}>How Theme Switching Works</h3>
        <ThemeToggle />
      </div>
      
      <div style={{ color: 'var(--foreground)', lineHeight: 1.6 }}>
        <p style={{ margin: '0 0 12px 0' }}>
          <strong>🎨 CSS Custom Properties:</strong> All colors are defined as CSS variables in the global stylesheet.
        </p>
        <p style={{ margin: '0 0 12px 0' }}>
          <strong>🔄 Automatic Switching:</strong> The theme toggle adds/removes a CSS class that overrides the color variables.
        </p>
        <p style={{ margin: '0 0 12px 0' }}>
          <strong>⚡ Instant Updates:</strong> All components using these variables update immediately without re-rendering.
        </p>
        <p style={{ margin: '0' }}>
          <strong>💾 Persistence:</strong> Theme preference is saved to localStorage and restored on page load.
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Technical explanation of how the theme system works using CSS custom properties.',
      },
    },
  },
};
