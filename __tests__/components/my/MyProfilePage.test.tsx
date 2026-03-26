import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSession, signOut } from 'next-auth/react';
import MyPage from '@/app/my/page';
import { ToastProvider } from '@/components/ui/Toast';

// Mock next-auth/react
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
  signOut: vi.fn(),
}));

// Mock fetch
global.fetch = vi.fn();

const mockUserProfile = {
  id: 'test-user-id',
  email: 'test@example.com',
  vipLevel: 2,
  inviteCode: 'ABC123',
  creditPoints: 1500,
  balance: 35640,
  sharesHeld: 300,
  integrationPoints: 3240,
  avatarUrl: 'https://example.com/avatar.jpg',
};

describe('MyProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock authenticated session
    (useSession as any).mockReturnValue({
      data: {
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          role: 'user',
        },
      },
      status: 'authenticated',
    });
    
    // Mock successful profile fetch
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockUserProfile,
    });
  });

  it('displays user email and VIP level', async () => {
    render(
      <ToastProvider>
        <MyPage />
      </ToastProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText(/VIP:2/)).toBeInTheDocument();
    });
  });

  it('displays invite code and credit points', async () => {
    render(
      <ToastProvider>
        <MyPage />
      </ToastProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/ABC123/)).toBeInTheDocument();
      expect(screen.getByText(/1500/)).toBeInTheDocument();
    });
  });

  it('displays balance dashboard with formatted values', async () => {
    render(
      <ToastProvider>
        <MyPage />
      </ToastProvider>
    );
    
    await waitFor(() => {
      // Balance formatted as currency
      expect(screen.getByText(/\$35,640\.00/)).toBeInTheDocument();
      // Shares held
      expect(screen.getByText('300')).toBeInTheDocument();
      // Integration points
      expect(screen.getByText('3240')).toBeInTheDocument();
    });
  });

  it('renders all menu items with navigation', async () => {
    render(
      <ToastProvider>
        <MyPage />
      </ToastProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Order record')).toBeInTheDocument();
      expect(screen.getByText('Personal information')).toBeInTheDocument();
      expect(screen.getByText('Bank card binding')).toBeInTheDocument();
      expect(screen.getByText('Security center')).toBeInTheDocument();
      expect(screen.getByText('Notification')).toBeInTheDocument();
      expect(screen.getByText('VIP')).toBeInTheDocument();
      expect(screen.getByText('Company Profile')).toBeInTheDocument();
      expect(screen.getByText('Language')).toBeInTheDocument();
    });
  });

  it('renders logout button', async () => {
    render(
      <ToastProvider>
        <MyPage />
      </ToastProvider>
    );
    
    await waitFor(() => {
      const logoutButton = screen.getByRole('button', { name: /log out/i });
      expect(logoutButton).toBeInTheDocument();
    });
  });

  it('calls signOut with correct redirect on logout click', async () => {
    render(
      <ToastProvider>
        <MyPage />
      </ToastProvider>
    );
    
    await waitFor(() => {
      const logoutButton = screen.getByRole('button', { name: /log out/i });
      fireEvent.click(logoutButton);
    });

    expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/login' });
  });

  it('displays loading state initially', () => {
    render(
      <ToastProvider>
        <MyPage />
      </ToastProvider>
    );
    
    // Should show some loading indicator or skeleton
    expect(screen.queryByText('test@example.com')).not.toBeInTheDocument();
  });

  it('handles profile fetch error gracefully', async () => {
    // Mock fetch error
    (global.fetch as any).mockRejectedValue(new Error('Failed to fetch'));
    
    render(
      <ToastProvider>
        <MyPage />
      </ToastProvider>
    );
    
    await waitFor(() => {
      // Should handle error without crashing - shows error message
      expect(screen.getByText('Failed to load profile')).toBeInTheDocument();
    });
  });

  it('menu items have correct href attributes', async () => {
    render(
      <ToastProvider>
        <MyPage />
      </ToastProvider>
    );
    
    await waitFor(() => {
      const orderRecordLink = screen.getByRole('link', { name: /order record/i });
      expect(orderRecordLink).toHaveAttribute('href', '/my/orders');
      
      const vipLink = screen.getByRole('link', { name: /VIP/ });
      expect(vipLink).toHaveAttribute('href', '/my/vip');
      
      const companyLink = screen.getByRole('link', { name: /company profile/i });
      expect(companyLink).toHaveAttribute('href', '/my/company');
    });
  });
});
