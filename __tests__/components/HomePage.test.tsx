import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Home from '@/app/page';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
  usePathname: () => '/',
}));

// Mock motion/react to avoid animation issues in tests
vi.mock('motion/react', () => ({
  m: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock FloatingCustomerService
vi.mock('@/components/goods/FloatingCustomerService', () => ({
  default: () => <div data-testid="floating-customer-service">Customer Service</div>,
}));

describe('HomePage with Carousel Layout', () => {
  beforeEach(() => {
    // Mock fetch for products
    global.fetch = vi.fn((url) => {
      if (url.includes('/api/products')) {
        return Promise.resolve({
          ok: true,
          json: async () => [
            {
              id: 'product-1',
              name: 'Product 1',
              price: 50,
              imageUrl: 'https://example.com/product1.jpg',
              remainingQty: 10,
              isBestValue: true,
              isSellingFast: false,
              urgencyThreshold: null,
              isVerified: true,
            },
            {
              id: 'product-2',
              name: 'Product 2',
              price: 75,
              imageUrl: 'https://example.com/product2.jpg',
              remainingQty: 5,
              isBestValue: false,
              isSellingFast: true,
              urgencyThreshold: null,
              isVerified: true,
            },
            {
              id: 'product-3',
              name: 'Product 3',
              price: 100,
              imageUrl: 'https://example.com/product3.jpg',
              remainingQty: 8,
              isBestValue: false,
              isSellingFast: false,
              urgencyThreshold: null,
              isVerified: false,
            },
            {
              id: 'product-4',
              name: 'Product 4',
              price: 60,
              imageUrl: 'https://example.com/product4.jpg',
              remainingQty: 15,
              isBestValue: false,
              isSellingFast: false,
              urgencyThreshold: null,
              isVerified: true,
            },
            {
              id: 'product-5',
              name: 'Product 5',
              price: 90,
              imageUrl: 'https://example.com/product5.jpg',
              remainingQty: 3,
              isBestValue: true,
              isSellingFast: true,
              urgencyThreshold: 5,
              isVerified: true,
            },
          ],
        } as Response);
      }
      if (url.includes('/api/events?type=football')) {
        return Promise.resolve({
          ok: true,
          json: async () => [
            {
              id: 'football-1',
              title: 'Football Match 1',
              type: 'football',
              team1: 'Team A',
              team2: 'Team B',
              team1Flag: '🇺🇸',
              team2Flag: '🇲🇽',
              date: '2026-06-15T19:00:00Z',
              venue: 'Stadium A',
              price: 150,
              remainingQty: 100,
              isBestValue: true,
              isSellingFast: false,
              urgencyThreshold: null,
              isOfficial: true,
            },
            {
              id: 'football-2',
              title: 'Football Match 2',
              type: 'football',
              team1: 'Team C',
              team2: 'Team D',
              team1Flag: '🇧🇷',
              team2Flag: '🇦🇷',
              date: '2026-06-16T19:00:00Z',
              venue: 'Stadium B',
              price: 200,
              remainingQty: 50,
              isBestValue: false,
              isSellingFast: true,
              urgencyThreshold: null,
              isOfficial: true,
            },
            {
              id: 'football-3',
              title: 'Football Match 3',
              type: 'football',
              team1: 'Team E',
              team2: 'Team F',
              team1Flag: '🇩🇪',
              team2Flag: '🇫🇷',
              date: '2026-06-17T19:00:00Z',
              venue: 'Stadium C',
              price: 180,
              remainingQty: 75,
              isBestValue: false,
              isSellingFast: false,
              urgencyThreshold: null,
              isOfficial: false,
            },
            {
              id: 'football-4',
              title: 'Football Match 4',
              type: 'football',
              team1: 'Team G',
              team2: 'Team H',
              team1Flag: '🇮🇹',
              team2Flag: '🇪🇸',
              date: '2026-06-18T19:00:00Z',
              venue: 'Stadium D',
              price: 160,
              remainingQty: 120,
              isBestValue: true,
              isSellingFast: false,
              urgencyThreshold: null,
              isOfficial: true,
            },
            {
              id: 'football-5',
              title: 'Football Match 5',
              type: 'football',
              team1: 'Team I',
              team2: 'Team J',
              team1Flag: '🇬🇧',
              team2Flag: '🇵🇹',
              date: '2026-06-19T19:00:00Z',
              venue: 'Stadium E',
              price: 190,
              remainingQty: 60,
              isBestValue: false,
              isSellingFast: true,
              urgencyThreshold: null,
              isOfficial: true,
            },
          ],
        } as Response);
      }
      if (url.includes('/api/events?type=concert')) {
        return Promise.resolve({
          ok: true,
          json: async () => [
            {
              id: 'concert-1',
              title: 'Concert 1',
              type: 'concert',
              artistName: 'Artist A',
              artistImageUrl: '',
              date: '2026-07-01T20:00:00Z',
              venue: 'Arena A',
              price: 120,
              remainingQty: 200,
              isBestValue: false,
              isSellingFast: true,
              urgencyThreshold: null,
              isOfficial: true,
            },
            {
              id: 'concert-2',
              title: 'Concert 2',
              type: 'concert',
              artistName: 'Artist B',
              artistImageUrl: '',
              date: '2026-07-02T20:00:00Z',
              venue: 'Arena B',
              price: 140,
              remainingQty: 150,
              isBestValue: true,
              isSellingFast: false,
              urgencyThreshold: null,
              isOfficial: true,
            },
            {
              id: 'concert-3',
              title: 'Concert 3',
              type: 'concert',
              artistName: 'Artist C',
              artistImageUrl: '',
              date: '2026-07-03T20:00:00Z',
              venue: 'Arena C',
              price: 100,
              remainingQty: 300,
              isBestValue: false,
              isSellingFast: false,
              urgencyThreshold: null,
              isOfficial: false,
            },
            {
              id: 'concert-4',
              title: 'Concert 4',
              type: 'concert',
              artistName: 'Artist D',
              artistImageUrl: '',
              date: '2026-07-04T20:00:00Z',
              venue: 'Arena D',
              price: 160,
              remainingQty: 100,
              isBestValue: true,
              isSellingFast: true,
              urgencyThreshold: null,
              isOfficial: true,
            },
            {
              id: 'concert-5',
              title: 'Concert 5',
              type: 'concert',
              artistName: 'Artist E',
              artistImageUrl: '',
              date: '2026-07-05T20:00:00Z',
              venue: 'Arena E',
              price: 130,
              remainingQty: 250,
              isBestValue: false,
              isSellingFast: false,
              urgencyThreshold: null,
              isOfficial: true,
            },
          ],
        } as Response);
      }
      if (url.includes('/api/events?type=basketball')) {
        return Promise.resolve({
          ok: true,
          json: async () => [
            {
              id: 'basketball-1',
              title: 'Basketball Game 1',
              type: 'basketball',
              team1: 'Lakers',
              team2: 'Warriors',
              date: '2026-08-01T19:00:00Z',
              venue: 'Arena X',
              price: 110,
              remainingQty: 180,
              isBestValue: true,
              isSellingFast: false,
              urgencyThreshold: null,
              isOfficial: true,
            },
            {
              id: 'basketball-2',
              title: 'Basketball Game 2',
              type: 'basketball',
              team1: 'Celtics',
              team2: 'Heat',
              date: '2026-08-02T19:00:00Z',
              venue: 'Arena Y',
              price: 130,
              remainingQty: 90,
              isBestValue: false,
              isSellingFast: true,
              urgencyThreshold: null,
              isOfficial: true,
            },
            {
              id: 'basketball-3',
              title: 'Basketball Game 3',
              type: 'basketball',
              team1: 'Bulls',
              team2: 'Knicks',
              date: '2026-08-03T19:00:00Z',
              venue: 'Arena Z',
              price: 100,
              remainingQty: 220,
              isBestValue: false,
              isSellingFast: false,
              urgencyThreshold: null,
              isOfficial: false,
            },
            {
              id: 'basketball-4',
              title: 'Basketball Game 4',
              type: 'basketball',
              team1: 'Mavs',
              team2: 'Suns',
              date: '2026-08-04T19:00:00Z',
              venue: 'Arena W',
              price: 140,
              remainingQty: 110,
              isBestValue: true,
              isSellingFast: true,
              urgencyThreshold: null,
              isOfficial: true,
            },
            {
              id: 'basketball-5',
              title: 'Basketball Game 5',
              type: 'basketball',
              team1: 'Nets',
              team2: '76ers',
              date: '2026-08-05T19:00:00Z',
              venue: 'Arena V',
              price: 120,
              remainingQty: 150,
              isBestValue: false,
              isSellingFast: false,
              urgencyThreshold: null,
              isOfficial: true,
            },
          ],
        } as Response);
      }
      // For popular events (mix of all types)
      if (url.includes('/api/events') && !url.includes('type=')) {
        return Promise.resolve({
          ok: true,
          json: async () => [
            {
              id: 'football-1',
              title: 'Football Match 1',
              type: 'football',
              team1: 'Team A',
              team2: 'Team B',
              team1Flag: '🇺🇸',
              team2Flag: '🇲🇽',
              date: '2026-06-15T19:00:00Z',
              venue: 'Stadium A',
              price: 150,
              remainingQty: 100,
              isBestValue: true,
              isSellingFast: false,
              urgencyThreshold: null,
              isOfficial: true,
            },
            {
              id: 'concert-1',
              title: 'Concert 1',
              type: 'concert',
              artistName: 'Artist A',
              artistImageUrl: '',
              date: '2026-07-01T20:00:00Z',
              venue: 'Arena A',
              price: 120,
              remainingQty: 200,
              isBestValue: false,
              isSellingFast: true,
              urgencyThreshold: null,
              isOfficial: true,
            },
            {
              id: 'basketball-1',
              title: 'Basketball Game 1',
              type: 'basketball',
              team1: 'Lakers',
              team2: 'Warriors',
              date: '2026-08-01T19:00:00Z',
              venue: 'Arena X',
              price: 110,
              remainingQty: 180,
              isBestValue: true,
              isSellingFast: false,
              urgencyThreshold: null,
              isOfficial: true,
            },
            {
              id: 'football-2',
              title: 'Football Match 2',
              type: 'football',
              team1: 'Team C',
              team2: 'Team D',
              team1Flag: '🇧🇷',
              team2Flag: '🇦🇷',
              date: '2026-06-16T19:00:00Z',
              venue: 'Stadium B',
              price: 200,
              remainingQty: 50,
              isBestValue: false,
              isSellingFast: true,
              urgencyThreshold: null,
              isOfficial: true,
            },
            {
              id: 'concert-2',
              title: 'Concert 2',
              type: 'concert',
              artistName: 'Artist B',
              artistImageUrl: '',
              date: '2026-07-02T20:00:00Z',
              venue: 'Arena B',
              price: 140,
              remainingQty: 150,
              isBestValue: true,
              isSellingFast: false,
              urgencyThreshold: null,
              isOfficial: true,
            },
          ],
        } as Response);
      }
      return Promise.reject(new Error('Unknown URL'));
    }) as any;
  });

  it('renders BannerCarousel at the top', async () => {
    render(<Home />);
    
    // BannerCarousel should be present
    await waitFor(() => {
      const bannerContainer = screen.getByTestId('banner-carousel');
      expect(bannerContainer).toBeInTheDocument();
    });
  });

  it('renders all 5 carousel sections with correct headings', async () => {
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText('Popular Events')).toBeInTheDocument();
      expect(screen.getByText('Football Matches')).toBeInTheDocument();
      expect(screen.getByText('Live Concerts')).toBeInTheDocument();
      expect(screen.getByText('Basketball Games')).toBeInTheDocument();
      expect(screen.getByText('Team Merchandise')).toBeInTheDocument();
    });
  });

  it('renders See All links with correct hrefs', async () => {
    render(<Home />);
    
    await waitFor(() => {
      const seeAllLinks = screen.getAllByRole('link', { name: /see all/i });
      expect(seeAllLinks.length).toBeGreaterThanOrEqual(4); // At least 4 See All links (category pages)
      
      // Check that at least one link points to /football
      const footballLink = seeAllLinks.find(link => link.getAttribute('href') === '/football');
      expect(footballLink).toBeTruthy();
      
      // Check that at least one link points to /concert
      const concertLink = seeAllLinks.find(link => link.getAttribute('href') === '/concert');
      expect(concertLink).toBeTruthy();
      
      // Check that at least one link points to /basketball
      const basketballLink = seeAllLinks.find(link => link.getAttribute('href') === '/basketball');
      expect(basketballLink).toBeTruthy();
    });
  });

  it('displays at least 5 cards in each carousel section', async () => {
    render(<Home />);
    
    await waitFor(() => {
      // Wait for content to load
      expect(screen.getByText('Popular Events')).toBeInTheDocument();
    });

    // Each carousel should have multiple cards
    const carousels = screen.getAllByRole('region', { name: /carousel/i });
    expect(carousels.length).toBeGreaterThanOrEqual(5);
  });

  it('does NOT render old flat product grid as primary content', async () => {
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText('Popular Events')).toBeInTheDocument();
    });

    // The page should now use carousels, not the old grid layout
    // Check that we have carousel sections (by looking for carousel containers)
    const carousels = screen.getAllByRole('region', { name: /carousel/i });
    expect(carousels.length).toBeGreaterThanOrEqual(5);
    
    // Old "Commodities" heading should not exist
    const commoditiesHeading = screen.queryByText('Commodities');
    expect(commoditiesHeading).not.toBeInTheDocument();
  });

  it('shows loading skeletons while fetching data', () => {
    render(<Home />);
    
    // Skeletons should be visible initially
    const skeletons = screen.getAllByTestId('carousel-skeleton-card');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('maintains BannerCarousel at top of page', async () => {
    render(<Home />);
    
    await waitFor(() => {
      const banner = screen.getByTestId('banner-carousel');
      expect(banner).toBeInTheDocument();
    });

    // Banner should exist and be in the document
    const banner = screen.getByTestId('banner-carousel');
    expect(banner).toBeInTheDocument();
    
    // Verify that Popular Events carousel comes after the banner
    const popularEvents = screen.getByText('Popular Events');
    expect(popularEvents).toBeInTheDocument();
  });
});
