import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import VipUpgradeSystemPage from '@/app/my/vip/page';
import { useSession } from 'next-auth/react';

// Mock next-auth
vi.mock('next-auth/react');

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('VipUpgradeSystemPage', () => {
  const mockRouter = {
    back: vi.fn(),
    push: vi.fn(),
  };

  const mockSession = {
    user: { email: 'test@example.com' },
  };

  const mockVipTiers = [
    { id: '1', level: 1, name: 'VIP1', threshold: 1000 },
    { id: '2', level: 2, name: 'VIP2', threshold: 5000 },
    { id: '3', level: 3, name: 'VIP3', threshold: 10000 },
    { id: '4', level: 4, name: 'VIP4', threshold: 50000 },
    { id: '5', level: 5, name: 'VIP5', threshold: 100000 },
    { id: '6', level: 6, name: 'VIP6', threshold: 500000 },
    { id: '7', level: 7, name: 'VIP7', threshold: 1000000 },
    { id: '8', level: 8, name: 'VIP8', threshold: 10000000 },
  ];

  const mockUserProfile = {
    id: '1',
    email: 'test@example.com',
    vipLevel: 2,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue(mockRouter);
    (useSession as any).mockReturnValue({
      data: mockSession,
      status: 'authenticated',
    });

    global.fetch = vi.fn((url) => {
      if (url.includes('/api/vip-tiers')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockVipTiers),
        });
      }
      if (url.includes('/api/user/profile')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockUserProfile),
        });
      }
      return Promise.resolve({
        ok: false,
        json: () => Promise.resolve({}),
      });
    }) as any;
  });

  it('renders header with back button and title', async () => {
    render(<VipUpgradeSystemPage />);
    
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    expect(screen.getByRole('heading', { name: /vip tiers/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/go back/i)).toBeInTheDocument();
  });

  it('back button navigates back', async () => {
    render(<VipUpgradeSystemPage />);
    
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    const backButton = screen.getByLabelText(/go back/i);
    backButton.click();
    expect(mockRouter.back).toHaveBeenCalledOnce();
  });

  it('displays all 8 VIP tiers in ascending order', async () => {
    render(<VipUpgradeSystemPage />);
    
    await waitFor(() => {
      expect(screen.getByText('VIP1')).toBeInTheDocument();
    });

    // Check all 8 tiers are displayed
    for (let i = 1; i <= 8; i++) {
      expect(screen.getByText(`VIP${i}`)).toBeInTheDocument();
    }
  });

  it('displays tier thresholds with correct format', async () => {
    render(<VipUpgradeSystemPage />);
    
    await waitFor(() => {
      expect(screen.getAllByText(/VIP1/)[0]).toBeInTheDocument();
    });

    // Check threshold descriptions (text is split across elements with span, use getAllByText)
    const tier1Text = screen.getAllByText((content, element) => {
      return (element?.tagName === 'P' && element?.textContent?.includes('spending over $1K')) ?? false;
    });
    expect(tier1Text[0]).toBeInTheDocument();
    
    const tier2Text = screen.getAllByText((content, element) => {
      return (element?.tagName === 'P' && element?.textContent?.includes('spending over $5K')) ?? false;
    });
    expect(tier2Text[0]).toBeInTheDocument();
    
    const tier3Text = screen.getAllByText((content, element) => {
      return (element?.tagName === 'P' && element?.textContent?.includes('spending over $10K')) ?? false;
    });
    expect(tier3Text[0]).toBeInTheDocument();
    
    const tier8Text = screen.getAllByText((content, element) => {
      return (element?.tagName === 'P' && element?.textContent?.includes('spending over $10M')) ?? false;
    });
    expect(tier8Text[0]).toBeInTheDocument();
  });

  it('indicates current user VIP tier', async () => {
    render(<VipUpgradeSystemPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/current/i)).toBeInTheDocument();
    });

    // VIP2 should be marked as current tier
    const vip2Section = screen.getByText('VIP2').closest('div');
    expect(vip2Section).toHaveTextContent(/current/i);
  });

  it('displays VIP tiers in correct ascending order', async () => {
    render(<VipUpgradeSystemPage />);
    
    await waitFor(() => {
      expect(screen.getAllByText(/VIP1/)[0]).toBeInTheDocument();
    });

    // Check that all VIP levels appear in the heading tags
    const vipHeadings = screen.getAllByText(/^VIP\d$/);
    const vipLevels = vipHeadings.map(el => el.textContent);
    
    // Verify order
    expect(vipLevels).toEqual([
      'VIP1', 'VIP2', 'VIP3', 'VIP4', 
      'VIP5', 'VIP6', 'VIP7', 'VIP8'
    ]);
  });

  it('displays loading state initially', () => {
    render(<VipUpgradeSystemPage />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('handles API error gracefully', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({}),
      })
    ) as any;

    render(<VipUpgradeSystemPage />);
    
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Should show error state or empty state
    expect(screen.queryByText('VIP1')).not.toBeInTheDocument();
  });
});
