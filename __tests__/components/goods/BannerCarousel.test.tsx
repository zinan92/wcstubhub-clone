import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BannerCarousel from '@/components/goods/BannerCarousel';

describe('BannerCarousel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders banner images', () => {
    render(<BannerCarousel />);
    
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('renders dot indicators', () => {
    const { container } = render(<BannerCarousel />);
    
    const dots = container.querySelectorAll('button[aria-label^="Go to banner"]');
    expect(dots.length).toBeGreaterThan(0);
  });

  it('renders navigation arrows', () => {
    render(<BannerCarousel />);
    
    expect(screen.getByLabelText('Previous banner')).toBeInTheDocument();
    expect(screen.getByLabelText('Next banner')).toBeInTheDocument();
  });

  it('navigates to next slide on next button click', () => {
    const { container } = render(<BannerCarousel />);
    
    const nextButton = screen.getByLabelText('Next banner');
    fireEvent.click(nextButton);
    
    // Check that the transform has changed to show second slide
    const slideContainer = container.querySelector('.flex.transition-transform');
    expect(slideContainer).toBeInTheDocument();
    expect(slideContainer?.getAttribute('style')).toContain('translateX(-100%)');
  });

  it('navigates to previous slide on previous button click', () => {
    const { container } = render(<BannerCarousel />);
    
    const prevButton = screen.getByLabelText('Previous banner');
    fireEvent.click(prevButton);
    
    // Check that transform shows last slide (wraps around)
    const slideContainer = container.querySelector('.flex.transition-transform');
    expect(slideContainer).toBeInTheDocument();
    expect(slideContainer?.getAttribute('style')).toContain('translateX(-200%)');
  });
});
