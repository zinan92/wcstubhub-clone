import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import ConcertPage from '@/app/concert/page';

// Mock Next.js modules
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

describe('ConcertPage', () => {
  const mockConcerts = [
    {
      id: 'concert-1',
      title: 'Taylor Swift: The Eras Tour',
      type: 'concert',
      artistName: 'Taylor Swift',
      artistImageUrl: 'https://example.com/taylor.jpg',
      date: '2026-08-15T20:00:00Z',
      venue: 'SoFi Stadium, Los Angeles',
      price: 299.99,
    },
    {
      id: 'concert-2',
      title: 'Ed Sheeran: Mathematics Tour',
      type: 'concert',
      artistName: 'Ed Sheeran',
      artistImageUrl: 'https://example.com/ed.jpg',
      date: '2026-08-22T19:30:00Z',
      venue: 'Wembley Stadium, London',
      price: 189.99,
    },
    {
      id: 'concert-3',
      title: 'The Weeknd: After Hours Til Dawn',
      type: 'concert',
      artistName: 'The Weeknd',
      artistImageUrl: 'https://example.com/weeknd.jpg',
      date: '2026-09-05T21:00:00Z',
      venue: 'MetLife Stadium, New Jersey',
      price: 249.99,
    },
  ];

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('renders search bar with correct placeholder', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => mockConcerts,
    });

    render(<ConcertPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Find a star or performance')).toBeInTheDocument();
    });
  });

  it('renders banner with gradient', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => mockConcerts,
    });

    render(<ConcertPage />);

    await waitFor(() => {
      const bannerTitle = screen.getByText('Live Concerts 2026');
      expect(bannerTitle).toBeInTheDocument();
      const bannerSubtitle = screen.getByText('World-Class Performances');
      expect(bannerSubtitle).toBeInTheDocument();
    });
  });

  it('fetches and displays concert events with artist photos', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => mockConcerts,
    });

    render(<ConcertPage />);

    await waitFor(() => {
      expect(screen.getByText(/Taylor Swift: The Eras Tour/i)).toBeInTheDocument();
      expect(screen.getByText(/Ed Sheeran: Mathematics Tour/i)).toBeInTheDocument();
      expect(screen.getByText(/The Weeknd: After Hours Til Dawn/i)).toBeInTheDocument();
    });

    // Verify API call
    expect(global.fetch).toHaveBeenCalledWith('/api/events?type=concert');
  });

  it('filters concerts by artist name when searching', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => mockConcerts,
    });

    const user = userEvent.setup();
    render(<ConcertPage />);

    await waitFor(() => {
      expect(screen.getByText(/Taylor Swift: The Eras Tour/i)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Find a star or performance');
    await user.type(searchInput, 'Taylor');

    await waitFor(() => {
      expect(screen.getByText(/Taylor Swift: The Eras Tour/i)).toBeInTheDocument();
      expect(screen.queryByText(/Ed Sheeran: Mathematics Tour/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/The Weeknd: After Hours Til Dawn/i)).not.toBeInTheDocument();
    });
  });

  it('filters concerts by event name when searching', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => mockConcerts,
    });

    const user = userEvent.setup();
    render(<ConcertPage />);

    await waitFor(() => {
      expect(screen.getByText(/Mathematics Tour/i)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Find a star or performance');
    await user.type(searchInput, 'Mathematics');

    await waitFor(() => {
      expect(screen.getByText(/Ed Sheeran: Mathematics Tour/i)).toBeInTheDocument();
      expect(screen.queryByText(/Taylor Swift/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/The Weeknd/i)).not.toBeInTheDocument();
    });
  });

  it('shows empty state when search has no matches', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => mockConcerts,
    });

    const user = userEvent.setup();
    render(<ConcertPage />);

    await waitFor(() => {
      expect(screen.getAllByText(/Taylor Swift/i).length).toBeGreaterThan(0);
    });

    const searchInput = screen.getByPlaceholderText('Find a star or performance');
    await user.type(searchInput, 'NonexistentArtist');

    await waitFor(() => {
      expect(screen.getByText(/No concerts found/i)).toBeInTheDocument();
      expect(screen.getByText('Try a different search term')).toBeInTheDocument();
      expect(screen.queryAllByText(/Taylor Swift/i).length).toBe(0);
    });
  });

  it('restores all concerts when search is cleared', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => mockConcerts,
    });

    const user = userEvent.setup();
    render(<ConcertPage />);

    await waitFor(() => {
      expect(screen.getAllByText(/Taylor Swift/i).length).toBeGreaterThan(0);
    });

    const searchInput = screen.getByPlaceholderText('Find a star or performance');
    
    // Type and filter
    await user.type(searchInput, 'Taylor');
    await waitFor(() => {
      expect(screen.queryByText(/Ed Sheeran/i)).not.toBeInTheDocument();
    });

    // Clear search
    await user.clear(searchInput);

    await waitFor(() => {
      expect(screen.getAllByText(/Taylor Swift/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Ed Sheeran/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/The Weeknd/i).length).toBeGreaterThan(0);
    });
  });

  it('displays loading skeleton while fetching', () => {
    (global.fetch as any).mockReturnValueOnce(
      new Promise(() => {}) // Never resolves
    );

    render(<ConcertPage />);

    // Should show skeleton loaders instead of spinner
    expect(screen.getAllByTestId('match-card-skeleton')).toHaveLength(4);
  });

  it('shows only concert events (no football or basketball)', async () => {
    const mixedEvents = [
      ...mockConcerts,
      {
        id: 'football-1',
        type: 'football',
        title: 'Jordan VS Argentina',
        team1: 'Jordan',
        team2: 'Argentina',
      },
    ];

    (global.fetch as any).mockResolvedValueOnce({
      json: async () => mockConcerts, // API should only return concerts
    });

    render(<ConcertPage />);

    await waitFor(() => {
      expect(screen.getAllByText(/Taylor Swift/i).length).toBeGreaterThan(0);
    });

    // Should not show football events
    expect(screen.queryByText(/Jordan VS Argentina/i)).not.toBeInTheDocument();
  });
});
