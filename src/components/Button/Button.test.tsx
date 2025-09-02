import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Button variant="contained">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--contained');

    rerender(<Button variant="outline">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--outline');

    rerender(<Button variant="text">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--text');
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<Button size="small">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--small');

    rerender(<Button size="medium">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--medium');

    rerender(<Button size="large">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--large');
  });

  it('handles disabled state correctly', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('is-disabled');
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders start and end icons', () => {
    render(
      <Button 
        startIcon={<span data-testid="start-icon">→</span>}
        endIcon={<span data-testid="end-icon">←</span>}
      >
        With Icons
      </Button>
    );
    
    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});
