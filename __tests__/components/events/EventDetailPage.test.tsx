import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import EventDetailPage from '@/app/events/[id]/page';

// Mock next/navigation
const mockBack = vi.fn();
const mockPush = vi.fn();
const mockReplace = vi.fn();
const mockGet = vi.fn(() => null);
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    back: mockBack,
    push: mockPush,
    replace: mockReplace,
  }),
  useSearchParams: () => ({
    get: mockGet,
  }),
}));

// Mock event data
const mockFootballEvent = {
  id: 'football-1',
  title: 'World Cup 2026 Qualifier',
  type: 'football',
  team1: 'Jordan',
  team2: 'Argentina',
  team1Flag: '🇯🇴',
  team2Flag: '🇦🇷',
  date: '2026-06-15T19:00:00.000Z',
  venue: 'Khalifa International Stadium',
  price: 89.99,
  remainingQty: 250,
  description: 'Exciting World Cup qualifier match between Jordan and Argentina.',
};

const mockConcertEvent = {
  id: 'concert-1',
  title: 'Taylor Swift - The Eras Tour',
  type: 'concert',
  artistName: 'Taylor Swift',
  artistImageUrl: '',
  date: '2026-07-20T20:00:00.000Z',
  venue: 'Madison Square Garden',
  price: 199.99,
  remainingQty: 150,
  description: 'Experience Taylor Swift live on The Eras Tour!',
};

// Mock fetch
global.fetch = vi.fn();

const renderWithSession = (component: React.ReactElement, session: any = { user: { email: 'test@example.com' }, expires: '2099-01-01' }) => {
  return render(
    <SessionProvider session={session}>
      {component}
    </SessionProvider>
  );
};

describe('EventDetailPage', () => {
  beforeEach(() => {
    mockBack.mockClear();
    mockPush.mockClear();
    vi.clearAllMocks();
  });

  it('renders football event details correctly', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFootballEvent,
    });

    renderWithSession(<EventDetailPage params={Promise.resolve({ id: 'football-1' })} />);

    await waitFor(() => {
      expect(screen.getByText('Jordan')).toBeInTheDocument();
    });

    expect(screen.getByText('Argentina')).toBeInTheDocument();
    // Flags appear multiple times (banner and content), so use getAllByText
    expect(screen.getAllByText('🇯🇴').length).toBeGreaterThan(0);
    expect(screen.getAllByText('🇦🇷').length).toBeGreaterThan(0);
    expect(screen.getByText('Khalifa International Stadium')).toBeInTheDocument();
    expect(screen.getByText('$89.99')).toBeInTheDocument();
    expect(screen.getByText('250 tickets remaining')).toBeInTheDocument();
    expect(screen.getByText(/Exciting World Cup qualifier match/)).toBeInTheDocument();
  });

  it('back button calls router.back()', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFootballEvent,
    });

    renderWithSession(<EventDetailPage params={Promise.resolve({ id: 'football-1' })} />);

    await waitFor(() => {
      expect(screen.getByText('Jordan')).toBeInTheDocument();
    });

    const backButton = screen.getByLabelText('Go back');
    fireEvent.click(backButton);

    expect(mockBack).toHaveBeenCalled();
  });

  it('renders Purchase and For sale buttons', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFootballEvent,
    });

    renderWithSession(<EventDetailPage params={Promise.resolve({ id: 'football-1' })} />);

    await waitFor(() => {
      expect(screen.getByText('Jordan')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /Purchase/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /For sale/i })).toBeInTheDocument();
  });

  it('shows Purchase dialog when button clicked', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFootballEvent,
    });

    renderWithSession(<EventDetailPage params={Promise.resolve({ id: 'football-1' })} />);

    await waitFor(() => {
      expect(screen.getByText('Jordan')).toBeInTheDocument();
    });

    const purchaseButton = screen.getByRole('button', { name: /Purchase/i });
    fireEvent.click(purchaseButton);

    await waitFor(() => {
      expect(screen.getByText('Purchase Tickets')).toBeInTheDocument();
    });
  });

  it('shows For sale dialog when button clicked', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFootballEvent,
    });

    renderWithSession(<EventDetailPage params={Promise.resolve({ id: 'football-1' })} />);

    await waitFor(() => {
      expect(screen.getByText('Jordan')).toBeInTheDocument();
    });

    const forSaleButton = screen.getByRole('button', { name: /For sale/i });
    fireEvent.click(forSaleButton);

    await waitFor(() => {
      expect(screen.getByText('Create Listing')).toBeInTheDocument();
    });
  });
});
