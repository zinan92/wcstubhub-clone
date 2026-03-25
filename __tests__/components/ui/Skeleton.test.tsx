import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Skeleton, { ProductCardSkeleton, MatchCardSkeleton } from '@/components/ui/Skeleton';

describe('Skeleton', () => {
  it('renders base skeleton component', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.querySelector('[data-testid="skeleton"]');
    
    expect(skeleton).toBeInTheDocument();
    expect(skeleton?.className).toContain('animate-pulse');
  });

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="h-20 w-40" />);
    const skeleton = container.querySelector('[data-testid="skeleton"]');
    
    expect(skeleton?.className).toContain('h-20');
    expect(skeleton?.className).toContain('w-40');
  });

  it('has shimmer effect with gradient background', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.querySelector('[data-testid="skeleton"]');
    
    expect(skeleton?.className).toContain('bg-');
  });
});

describe('ProductCardSkeleton', () => {
  it('renders product card skeleton structure', () => {
    const { container } = render(<ProductCardSkeleton />);
    
    // Should have multiple skeleton elements (image, title, price)
    const skeletons = container.querySelectorAll('[data-testid="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(1);
  });

  it('has proper card container', () => {
    const { container } = render(<ProductCardSkeleton />);
    const card = container.querySelector('[data-testid="product-card-skeleton"]');
    
    expect(card).toBeInTheDocument();
  });
});

describe('MatchCardSkeleton', () => {
  it('renders match card skeleton structure', () => {
    const { container } = render(<MatchCardSkeleton />);
    
    // Should have multiple skeleton elements (teams, flags, venue)
    const skeletons = container.querySelectorAll('[data-testid="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(1);
  });

  it('has proper card container', () => {
    const { container } = render(<MatchCardSkeleton />);
    const card = container.querySelector('[data-testid="match-card-skeleton"]');
    
    expect(card).toBeInTheDocument();
  });
});
