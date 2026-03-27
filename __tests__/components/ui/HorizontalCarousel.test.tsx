import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HorizontalCarousel, { HorizontalCarouselSkeleton } from '@/components/ui/HorizontalCarousel';

describe('HorizontalCarousel', () => {
  const mockChildren = (
    <>
      <div data-testid="card-1">Card 1</div>
      <div data-testid="card-2">Card 2</div>
      <div data-testid="card-3">Card 3</div>
    </>
  );

  it('renders section heading', () => {
    render(
      <HorizontalCarousel title="Popular Events">
        {mockChildren}
      </HorizontalCarousel>
    );
    
    expect(screen.getByText('Popular Events')).toBeInTheDocument();
  });

  it('renders See All link when seeAllHref is provided', () => {
    render(
      <HorizontalCarousel title="Popular Events" seeAllHref="/events">
        {mockChildren}
      </HorizontalCarousel>
    );
    
    const seeAllLink = screen.getByRole('link', { name: /see all/i });
    expect(seeAllLink).toBeInTheDocument();
    expect(seeAllLink).toHaveAttribute('href', '/events');
  });

  it('does not render See All link when seeAllHref is not provided', () => {
    render(
      <HorizontalCarousel title="Popular Events">
        {mockChildren}
      </HorizontalCarousel>
    );
    
    const seeAllLink = screen.queryByRole('link', { name: /see all/i });
    expect(seeAllLink).not.toBeInTheDocument();
  });

  it('renders children in horizontal scroll container', () => {
    render(
      <HorizontalCarousel title="Popular Events">
        {mockChildren}
      </HorizontalCarousel>
    );
    
    expect(screen.getByTestId('card-1')).toBeInTheDocument();
    expect(screen.getByTestId('card-2')).toBeInTheDocument();
    expect(screen.getByTestId('card-3')).toBeInTheDocument();
  });

  it('has scroll container with overflow-x auto', () => {
    const { container } = render(
      <HorizontalCarousel title="Popular Events">
        {mockChildren}
      </HorizontalCarousel>
    );
    
    const scrollContainer = container.querySelector('[data-testid="carousel-scroll-container"]');
    expect(scrollContainer).toBeInTheDocument();
    expect(scrollContainer).toHaveClass('overflow-x-auto');
  });

  it('has scroll-snap styling on container', () => {
    const { container } = render(
      <HorizontalCarousel title="Popular Events">
        {mockChildren}
      </HorizontalCarousel>
    );
    
    const scrollContainer = container.querySelector('[data-testid="carousel-scroll-container"]');
    expect(scrollContainer).toHaveStyle({ scrollSnapType: 'x mandatory' });
  });

  it('children have scroll-snap-align start', () => {
    const { container } = render(
      <HorizontalCarousel title="Popular Events">
        <div data-testid="snap-child">Card 1</div>
      </HorizontalCarousel>
    );
    
    const child = container.querySelector('[data-snap-child]');
    expect(child).toHaveStyle({ scrollSnapAlign: 'start' });
  });

  it('has smooth scroll behavior', () => {
    const { container } = render(
      <HorizontalCarousel title="Popular Events">
        {mockChildren}
      </HorizontalCarousel>
    );
    
    const scrollContainer = container.querySelector('[data-testid="carousel-scroll-container"]');
    expect(scrollContainer).toHaveClass('scroll-smooth');
  });

  it('is keyboard accessible with proper tabindex', () => {
    const { container } = render(
      <HorizontalCarousel title="Popular Events">
        {mockChildren}
      </HorizontalCarousel>
    );
    
    const scrollContainer = container.querySelector('[data-testid="carousel-scroll-container"]');
    expect(scrollContainer).toHaveAttribute('tabIndex', '0');
  });
});

describe('HorizontalCarouselSkeleton', () => {
  it('renders skeleton with section heading', () => {
    render(<HorizontalCarouselSkeleton title="Loading Events" />);
    
    expect(screen.getByText('Loading Events')).toBeInTheDocument();
  });

  it('renders skeleton cards', () => {
    const { container } = render(<HorizontalCarouselSkeleton title="Loading Events" />);
    
    const skeletonCards = container.querySelectorAll('[data-testid="carousel-skeleton-card"]');
    expect(skeletonCards.length).toBeGreaterThan(0);
  });

  it('has same scroll container structure as real carousel', () => {
    const { container } = render(<HorizontalCarouselSkeleton title="Loading Events" />);
    
    const scrollContainer = container.querySelector('[data-testid="carousel-scroll-container"]');
    expect(scrollContainer).toBeInTheDocument();
    expect(scrollContainer).toHaveClass('overflow-x-auto');
  });
});
