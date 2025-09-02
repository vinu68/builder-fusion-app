import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import Button from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component that supports multiple variants, sizes, and icon combinations.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['contained', 'outline', 'text'],
      description: 'Visual style variant of the button',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    children: {
      control: 'text',
      description: 'Button text content',
    },
    startIcon: {
      control: 'text',
      description: 'Icon displayed before text (use emoji for demo)',
    },
    endIcon: {
      control: 'text',
      description: 'Icon displayed after text (use emoji for demo)',
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'HTML button type',
    },
  },
  args: {
    onClick: fn(),
    children: 'Button',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    children: 'Default Button',
  },
};

// Variant stories
export const Contained: Story = {
  args: {
    variant: 'contained',
    children: 'Contained Button',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
};

export const Text: Story = {
  args: {
    variant: 'text',
    children: 'Text Button',
  },
};

// Size stories
export const Small: Story = {
  args: {
    size: 'small',
    children: 'Small Button',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
    children: 'Medium Button',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    children: 'Large Button',
  },
};

// State stories
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};

export const DisabledOutline: Story = {
  args: {
    variant: 'outline',
    disabled: true,
    children: 'Disabled Outline',
  },
};

export const DisabledText: Story = {
  args: {
    variant: 'text',
    disabled: true,
    children: 'Disabled Text',
  },
};

// Icon stories
export const WithStartIcon: Story = {
  args: {
    startIcon: '💾',
    children: 'Save',
  },
};

export const WithEndIcon: Story = {
  args: {
    endIcon: '→',
    children: 'Continue',
  },
};

export const WithBothIcons: Story = {
  args: {
    variant: 'outline',
    startIcon: '📁',
    endIcon: '↗',
    children: 'Open File',
  },
};

export const IconOnly: Story = {
  args: {
    children: '❤️',
    'aria-label': 'Like button',
  },
};

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button variant="contained">Contained</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="text">Text</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All button variants displayed together for comparison.',
      },
    },
  },
};

// All sizes showcase
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All button sizes displayed together for comparison.',
      },
    },
  },
};

// Complex example
export const ComplexExample: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexDirection: 'column', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Button variant="contained" startIcon="💾" size="large">
          Save Document
        </Button>
        <Button variant="outline" endIcon="→">
          Continue
        </Button>
        <Button variant="text" size="small">
          Cancel
        </Button>
      </div>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Button disabled>Processing...</Button>
        <Button variant="outline" disabled>
          Disabled Outline
        </Button>
        <Button variant="text" disabled>
          Disabled Text
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A complex example showing various combinations of button props in realistic scenarios.',
      },
    },
  },
};

// Form example
export const FormButtons: Story = {
  render: () => (
    <form style={{ display: 'flex', gap: '12px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <Button type="submit" variant="contained" startIcon="✓">
        Submit
      </Button>
      <Button type="reset" variant="outline">
        Reset
      </Button>
      <Button type="button" variant="text">
        Cancel
      </Button>
    </form>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of buttons used in a form context with different HTML types.',
      },
    },
  },
};
