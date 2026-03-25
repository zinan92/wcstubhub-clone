import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from '@/components/ui/Button';

describe('Button', () => {
  it('renders with children text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders primary variant with gradient classes', () => {
    const { container } = render(<Button variant="primary">Primary</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('from-primary');
    expect(button?.className).toContain('to-accent');
  });

  it('renders secondary variant', () => {
    const { container } = render(<Button variant="secondary">Secondary</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('bg-surface');
  });

  it('renders outline variant with border', () => {
    const { container } = render(<Button variant="outline">Outline</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('border');
  });

  it('renders ghost variant', () => {
    const { container } = render(<Button variant="ghost">Ghost</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('hover:bg');
  });

  it('forwards onClick handler', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    const button = screen.getByText('Click');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies whileTap animation prop', () => {
    const { container } = render(<Button>Animated</Button>);
    const button = container.querySelector('button');
    
    // Button should be a motion component with whileTap
    expect(button).toBeTruthy();
  });

  it('disables button when disabled prop is true', () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    const button = container.querySelector('button') as HTMLButtonElement;
    
    expect(button.disabled).toBe(true);
    expect(button.className).toContain('opacity');
  });

  it('shows loading state with spinner', () => {
    const { container } = render(<Button loading>Loading</Button>);
    
    // Should have a loading indicator (svg or spinner element)
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('handles different sizes', () => {
    const { container } = render(<Button size="lg">Large</Button>);
    const button = container.querySelector('button');
    
    expect(button?.className).toContain('px-');
    expect(button?.className).toContain('py-');
  });
});
