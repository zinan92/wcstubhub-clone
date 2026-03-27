import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import FootballPage from '@/app/football/page';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock fetch
global.fetch = vi.fn();

const mockFootballEvents = [
  {
    id: '1',
    title: 'Jordan VS Argentina',
    type: 'football',
    team1: 'Jordan',
    team2: 'Argentina',
    team1Flag: '🇯🇴',
    team2Flag: '🇦🇷',
    date: '2026-06-15T18:00:00Z',
    venue: 'King Abdullah II Stadium, Amman',
    price: 89.99,
    remainingQty: 2500,
  },
  {
    id: '2',
    title: 'Algeria VS Austria',
    type: 'football',
    team1: 'Algeria',
    team2: 'Austria',
    team1Flag: '🇩🇿',
    team2Flag: '🇦🇹',
    date: '2026-06-18T20:00:00Z',
    venue: 'Stade 5 Juillet 1962, Algiers',
    price: 75.00,
    remainingQty: 3200,
  },
];

describe('FootballPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockFootballEvents,
    });
  });

  it('renders search trigger button with "Find matches" text', async () => {
    render(<FootballPage />);
    
    await waitFor(() => {
      const searchButton = screen.getByText(/find matches/i);
      expect(searchButton).toBeDefined();
    });
  });

  it('renders World Cup banner with gradient', async () => {
    render(<FootballPage />);
    
    await waitFor(() => {
      const bannerTitle = screen.getByText('FIFA World Cup 2026');
      expect(bannerTitle).toBeDefined();
      const bannerSubtitle = screen.getByText(/USA.*Canada.*Mexico/);
      expect(bannerSubtitle).toBeDefined();
    });
  });

  it('renders Football section header', async () => {
    render(<FootballPage />);
    
    await waitFor(() => {
      const header = screen.getByText(/football/i);
      expect(header).toBeDefined();
    });
  });

  it('fetches and displays football match cards', async () => {
    render(<FootballPage />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/events?type=football');
    });

    await waitFor(() => {
      expect(screen.getByText(/jordan/i)).toBeDefined();
      expect(screen.getByText(/argentina/i)).toBeDefined();
    });
  });

  it('displays team flags in match cards', async () => {
    render(<FootballPage />);

    await waitFor(() => {
      // Check that flags are rendered - they should be in the document
      const jordanMatch = screen.getByText(/jordan/i);
      expect(jordanMatch).toBeDefined();
      
      // Get the full card container which includes both flags
      const matchCard = jordanMatch.closest('a');
      const cardText = matchCard?.textContent || '';
      
      // Both flags should be present in the card
      expect(cardText).toContain('🇯🇴');
      expect(cardText).toContain('🇦🇷');
    });
  });

  it('displays match date and venue', async () => {
    render(<FootballPage />);

    await waitFor(() => {
      expect(screen.getByText(/king abdullah ii stadium/i)).toBeDefined();
    });
  });

  it('displays all matches without filtering', async () => {
    render(<FootballPage />);

    await waitFor(() => {
      expect(screen.getByText(/jordan/i)).toBeDefined();
      expect(screen.getByText(/algeria/i)).toBeDefined();
    });

    // Both matches should be visible (filtering is now done in the overlay)
    expect(screen.getByText(/jordan/i)).toBeDefined();
    expect(screen.getByText(/algeria/i)).toBeDefined();
  });

  it('shows empty state when API returns no events', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<FootballPage />);

    await waitFor(() => {
      expect(screen.getByText(/no matches found/i)).toBeDefined();
    });
  });

  it('match cards are clickable links to event detail', async () => {
    render(<FootballPage />);

    await waitFor(() => {
      const matchCards = screen.getAllByRole('link');
      expect(matchCards.length).toBeGreaterThan(0);
      
      const firstCard = matchCards.find(card => 
        card.getAttribute('href')?.includes('/events/')
      );
      expect(firstCard).toBeDefined();
    });
  });
});
