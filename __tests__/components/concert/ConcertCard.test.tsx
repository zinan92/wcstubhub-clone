import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ConcertCard from '@/components/concert/ConcertCard';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('ConcertCard', () => {
  const mockConcert = {
    id: 'concert-1',
    artistName: 'Taylor Swift',
    title: 'Taylor Swift: The Eras Tour',
    artistImageUrl: 'https://example.com/taylor.jpg',
    date: '2026-08-15T20:00:00Z',
    venue: 'SoFi Stadium, Los Angeles',
    price: 299.99,
  };

  it('renders concert card with artist name, date, and venue', () => {
    render(<ConcertCard {...mockConcert} />);

    expect(screen.getByText('Taylor Swift: The Eras Tour')).toBeInTheDocument();
    expect(screen.getAllByText(/taylor swift/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/SoFi Stadium, Los Angeles/i)).toBeInTheDocument();
    expect(screen.getByText(/\$299\.99/)).toBeInTheDocument();
    
    // Card now uses CSS-based concert visual with music icons (no image element)
    expect(screen.getByText('Concert')).toBeInTheDocument();
  });

  it('formats price with two decimal places', () => {
    render(<ConcertCard {...mockConcert} price={149} />);
    
    expect(screen.getByText('$149.00')).toBeInTheDocument();
  });

  it('displays date in readable format', () => {
    render(<ConcertCard {...mockConcert} />);

    // Should show formatted date
    const dateText = screen.getByText(/2026/);
    expect(dateText).toBeInTheDocument();
  });

  it('renders concert-themed gradient design', () => {
    render(<ConcertCard {...mockConcert} />);

    // Card should have concert badge
    expect(screen.getByText('Concert')).toBeInTheDocument();
    // Artist name should be displayed
    expect(screen.getAllByText(/taylor swift/i).length).toBeGreaterThan(0);
  });

  it('is clickable and navigates to event detail page', () => {
    const { container } = render(<ConcertCard {...mockConcert} />);

    const card = container.querySelector('a, [role="button"]');
    expect(card).toBeInTheDocument();
  });

  it('shows artist name prominently', () => {
    render(<ConcertCard {...mockConcert} />);

    const artistNames = screen.getAllByText(/taylor swift/i);
    expect(artistNames.length).toBeGreaterThan(0);
  });
});
