import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import AdminDashboardPage from '@/app/admin/dashboard/page';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock fetch
global.fetch = vi.fn();

describe('AdminDashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render dashboard with stat cards', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        users: 10,
        products: 25,
        events: 15,
        orders: 50,
      }),
    } as Response);

    render(<AdminDashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/dashboard/i)).toBeTruthy();
    });
  });

  it('should display stat cards with correct counts', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        users: 10,
        products: 25,
        events: 15,
        orders: 50,
      }),
    } as Response);

    render(<AdminDashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText('10')).toBeTruthy(); // users
      expect(screen.getByText('25')).toBeTruthy(); // products
      expect(screen.getByText('15')).toBeTruthy(); // events
      expect(screen.getByText('50')).toBeTruthy(); // orders
    });
  });

  it('should show loading state initially', () => {
    vi.mocked(fetch).mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<AdminDashboardPage />);
    
    expect(screen.getByText(/loading/i)).toBeTruthy();
  });

  it('should handle fetch errors gracefully', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    render(<AdminDashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/error/i) || screen.getByText(/failed/i)).toBeTruthy();
    });
  });

  it('should have navigation links to admin sections', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        users: 10,
        products: 25,
        events: 15,
        orders: 50,
      }),
    } as Response);

    render(<AdminDashboardPage />);
    
    await waitFor(() => {
      const links = screen.getAllByRole('link');
      const linkTexts = links.map(link => link.textContent?.toLowerCase());
      
      expect(linkTexts.some(text => text?.includes('product'))).toBe(true);
      expect(linkTexts.some(text => text?.includes('event'))).toBe(true);
      expect(linkTexts.some(text => text?.includes('user'))).toBe(true);
      expect(linkTexts.some(text => text?.includes('order'))).toBe(true);
    });
  });

  it('should display stat card labels', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        users: 10,
        products: 25,
        events: 15,
        orders: 50,
      }),
    } as Response);

    render(<AdminDashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/total users/i)).toBeTruthy();
      expect(screen.getByText(/total products/i)).toBeTruthy();
      expect(screen.getByText(/total events/i)).toBeTruthy();
      expect(screen.getByText(/total orders/i)).toBeTruthy();
    });
  });
});
