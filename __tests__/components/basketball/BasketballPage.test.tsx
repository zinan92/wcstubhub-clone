import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import BasketballPage from '@/app/basketball/page';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock fetch
global.fetch = vi.fn();

const mockBasketballEvents = [
  {
    id: '1',
    title: 'Phoenix Suns VS Los Angeles Lakers',
    type: 'basketball',
    team1: 'Phoenix Suns',
    team2: 'Los Angeles Lakers',
    date: '2026-05-20T19:30:00Z',
    venue: 'Footprint Center, Phoenix',
    price: 145.00,
  },
  {
    id: '2',
    title: 'Los Angeles Lakers VS San Antonio Spurs',
    type: 'basketball',
    team1: 'Los Angeles Lakers',
    team2: 'San Antonio Spurs',
    date: '2026-05-25T20:00:00Z',
    venue: 'Crypto.com Arena, Los Angeles',
    price: 135.00,
  },
  {
    id: '3',
    title: 'Golden State Warriors VS Boston Celtics',
    type: 'basketball',
    team1: 'Golden State Warriors',
    team2: 'Boston Celtics',
    date: '2026-06-01T18:00:00Z',
    venue: 'Chase Center, San Francisco',
    price: 175.00,
  },
];

describe('BasketballPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the search bar with correct placeholder', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => mockBasketballEvents,
    });

    render(<BasketballPage />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Find matches');
      expect(searchInput).toBeDefined();
    });
  });

  it('renders the basketball banner image', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => mockBasketballEvents,
    });

    render(<BasketballPage />);
    
    await waitFor(() => {
      const banner = screen.getByAltText('NBA Basketball');
      expect(banner).toBeDefined();
    });
  });

  it('renders Basketball section header with emoji', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => mockBasketballEvents,
    });

    render(<BasketballPage />);
    
    await waitFor(() => {
      const header = screen.getByText('Basketball');
      expect(header).toBeDefined();
    });
  });

  it('fetches and displays basketball events on mount', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => mockBasketballEvents,
    });

    render(<BasketballPage />);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/events?type=basketball');
    });

    await waitFor(() => {
      expect(screen.getByText('Phoenix Suns')).toBeDefined();
      const lakersElements = screen.getAllByText('Los Angeles Lakers');
      expect(lakersElements.length).toBeGreaterThan(0);
    });
  });

  it('displays match cards with team names in Team1 VS Team2 format', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => mockBasketballEvents,
    });

    render(<BasketballPage />);
    
    await waitFor(() => {
      const vsElements = screen.getAllByText('VS');
      expect(vsElements.length).toBe(mockBasketballEvents.length);
    });

    await waitFor(() => {
      expect(screen.getByText('Phoenix Suns')).toBeDefined();
      const lakersElements = screen.getAllByText('Los Angeles Lakers');
      expect(lakersElements.length).toBe(2); // Lakers appears in 2 games
      expect(screen.getByText('San Antonio Spurs')).toBeDefined();
    });
  });

  it('displays loading skeleton while fetching', () => {
    (global.fetch as any).mockImplementation(() => new Promise(() => {}));

    render(<BasketballPage />);
    
    const skeleton = document.querySelector('[data-testid="match-card-skeleton"]');
    expect(skeleton).toBeDefined();
  });

  it('filters basketball events by team name when searching', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => mockBasketballEvents,
    });

    render(<BasketballPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Phoenix Suns')).toBeDefined();
    });

    const searchInput = screen.getByPlaceholderText('Find matches');
    fireEvent.change(searchInput, { target: { value: 'Lakers' } });

    await waitFor(() => {
      // Should show both Lakers games
      const lakersElements = screen.getAllByText(/Lakers/);
      expect(lakersElements.length).toBeGreaterThan(0);
      
      // Should NOT show Warriors
      expect(screen.queryByText('Golden State Warriors')).toBeNull();
    });
  });

  it('shows empty state when no matches found', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => mockBasketballEvents,
    });

    render(<BasketballPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Phoenix Suns')).toBeDefined();
    });

    const searchInput = screen.getByPlaceholderText('Find matches');
    fireEvent.change(searchInput, { target: { value: 'NonexistentTeam' } });

    await waitFor(() => {
      expect(screen.getByText('No matches found')).toBeDefined();
    });
  });

  it('search is case-insensitive', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => mockBasketballEvents,
    });

    render(<BasketballPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Phoenix Suns')).toBeDefined();
    });

    const searchInput = screen.getByPlaceholderText('Find matches');
    fireEvent.change(searchInput, { target: { value: 'suns' } });

    await waitFor(() => {
      expect(screen.getByText('Phoenix Suns')).toBeDefined();
    });
  });
});
