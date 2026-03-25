import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BottomTabNavigation from '@/components/BottomTabNavigation';

// Mock next/navigation
const mockUsePathname = vi.fn(() => '/');
vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

beforeEach(() => {
  mockUsePathname.mockReturnValue('/');
});

describe('BottomTabNavigation', () => {
  it('renders all 5 tabs with correct labels', () => {
    render(<BottomTabNavigation />);
    
    expect(screen.getByText('Goods')).toBeInTheDocument();
    expect(screen.getByText('Football')).toBeInTheDocument();
    expect(screen.getByText('Basketball')).toBeInTheDocument();
    expect(screen.getByText('Concert')).toBeInTheDocument();
    expect(screen.getByText('My')).toBeInTheDocument();
  });

  it('renders all 5 tabs with icons', () => {
    const { container } = render(<BottomTabNavigation />);
    
    // Check that SVG icons are rendered (lucide icons render as SVGs)
    const svgIcons = container.querySelectorAll('svg');
    expect(svgIcons.length).toBeGreaterThanOrEqual(5);
  });

  it('highlights the active tab in blue', () => {
    mockUsePathname.mockReturnValue('/');
    
    const { container } = render(<BottomTabNavigation />);
    
    // Find the Goods link (should be active since pathname is '/')
    const goodsLink = screen.getByText('Goods').closest('a');
    expect(goodsLink).toHaveClass('text-[#0066FF]');
  });

  it('shows inactive tabs in gray', () => {
    mockUsePathname.mockReturnValue('/');
    
    const { container } = render(<BottomTabNavigation />);
    
    // Football tab should be inactive (gray)
    const footballLink = screen.getByText('Football').closest('a');
    expect(footballLink).toHaveClass('text-gray-500');
  });

  it('has correct navigation links for all tabs', () => {
    render(<BottomTabNavigation />);
    
    const goodsLink = screen.getByText('Goods').closest('a');
    const footballLink = screen.getByText('Football').closest('a');
    const basketballLink = screen.getByText('Basketball').closest('a');
    const concertLink = screen.getByText('Concert').closest('a');
    const myLink = screen.getByText('My').closest('a');
    
    expect(goodsLink).toHaveAttribute('href', '/');
    expect(footballLink).toHaveAttribute('href', '/football');
    expect(basketballLink).toHaveAttribute('href', '/basketball');
    expect(concertLink).toHaveAttribute('href', '/concert');
    expect(myLink).toHaveAttribute('href', '/my');
  });

  it('is fixed at the bottom of the viewport', () => {
    const { container } = render(<BottomTabNavigation />);
    
    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('fixed');
    expect(nav).toHaveClass('bottom-0');
  });

  it('spans full width of the screen', () => {
    const { container } = render(<BottomTabNavigation />);
    
    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('w-full');
  });

  it('highlights Football tab when on /football route', () => {
    mockUsePathname.mockReturnValue('/football');
    
    render(<BottomTabNavigation />);
    
    const footballLink = screen.getByText('Football').closest('a');
    expect(footballLink).toHaveClass('text-[#0066FF]');
  });

  it('highlights Basketball tab when on /basketball route', () => {
    mockUsePathname.mockReturnValue('/basketball');
    
    render(<BottomTabNavigation />);
    
    const basketballLink = screen.getByText('Basketball').closest('a');
    expect(basketballLink).toHaveClass('text-[#0066FF]');
  });

  it('highlights Concert tab when on /concert route', () => {
    mockUsePathname.mockReturnValue('/concert');
    
    render(<BottomTabNavigation />);
    
    const concertLink = screen.getByText('Concert').closest('a');
    expect(concertLink).toHaveClass('text-[#0066FF]');
  });

  it('highlights My tab when on /my route', () => {
    mockUsePathname.mockReturnValue('/my');
    
    render(<BottomTabNavigation />);
    
    const myLink = screen.getByText('My').closest('a');
    expect(myLink).toHaveClass('text-[#0066FF]');
  });
});
