import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TopNavBar from '@/components/TopNavBar';

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => '/',
}));

// Mock next-auth
const mockSession = vi.fn();
vi.mock('next-auth/react', () => ({
  useSession: () => mockSession(),
}));

describe('TopNavBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the app logo and name', () => {
      mockSession.mockReturnValue({ data: null });
      render(<TopNavBar />);
      
      expect(screen.getByText('WC')).toBeInTheDocument();
      expect(screen.getByText('StubHub')).toBeInTheDocument();
    });

    it('renders logo link with correct href', () => {
      mockSession.mockReturnValue({ data: null });
      render(<TopNavBar />);
      
      const logoLink = screen.getByLabelText('Go to homepage');
      expect(logoLink).toHaveAttribute('href', '/');
    });

    it('renders search icon button', () => {
      mockSession.mockReturnValue({ data: null });
      render(<TopNavBar />);
      
      const searchButton = screen.getByLabelText('Open search');
      expect(searchButton).toBeInTheDocument();
    });

    it('has fixed positioning and proper z-index', () => {
      mockSession.mockReturnValue({ data: null });
      const { container } = render(<TopNavBar />);
      
      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('fixed', 'top-0', 'z-50');
    });

    it('has full width and spans viewport', () => {
      mockSession.mockReturnValue({ data: null });
      const { container } = render(<TopNavBar />);
      
      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('left-0', 'right-0', 'w-full');
    });

    it('has backdrop blur and border styling', () => {
      mockSession.mockReturnValue({ data: null });
      const { container } = render(<TopNavBar />);
      
      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('bg-white/80', 'backdrop-blur-xl', 'border-b');
    });
  });

  describe('Touch Targets', () => {
    it('logo link has minimum 44px touch target', () => {
      mockSession.mockReturnValue({ data: null });
      render(<TopNavBar />);
      
      const logoLink = screen.getByLabelText('Go to homepage');
      expect(logoLink).toHaveClass('min-h-[44px]', 'min-w-[44px]');
    });

    it('search button has minimum 44px touch target', () => {
      mockSession.mockReturnValue({ data: null });
      render(<TopNavBar />);
      
      const searchButton = screen.getByLabelText('Open search');
      expect(searchButton).toHaveClass('min-h-[44px]', 'min-w-[44px]');
    });

    it('user icon link has minimum 44px touch target', () => {
      mockSession.mockReturnValue({ data: null });
      render(<TopNavBar />);
      
      const userLink = screen.getByLabelText('Go to login');
      expect(userLink).toHaveClass('min-h-[44px]', 'min-w-[44px]');
    });
  });

  describe('Auth States - User Icon', () => {
    it('shows generic user icon when logged out', () => {
      mockSession.mockReturnValue({ data: null });
      render(<TopNavBar />);
      
      const userLink = screen.getByLabelText('Go to login');
      expect(userLink).toHaveAttribute('href', '/login');
      
      // Should have User icon SVG
      const svg = userLink.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('navigates to /login when user icon tapped while logged out', () => {
      mockSession.mockReturnValue({ data: null });
      render(<TopNavBar />);
      
      const userLink = screen.getByLabelText('Go to login');
      expect(userLink).toHaveAttribute('href', '/login');
    });

    it('shows avatar when logged in', () => {
      mockSession.mockReturnValue({
        data: {
          user: { email: 'test@example.com' },
        },
      });
      render(<TopNavBar />);
      
      const userLink = screen.getByLabelText('Go to profile');
      expect(userLink).toHaveAttribute('href', '/my');
      
      // Should have DefaultAvatar
      const avatar = userLink.querySelector('.rounded-full');
      expect(avatar).toBeInTheDocument();
    });

    it('navigates to /my when user icon tapped while logged in', () => {
      mockSession.mockReturnValue({
        data: {
          user: { email: 'test@example.com' },
        },
      });
      render(<TopNavBar />);
      
      const userLink = screen.getByLabelText('Go to profile');
      expect(userLink).toHaveAttribute('href', '/my');
    });

    it('changes aria-label based on auth state', () => {
      // Logged out
      mockSession.mockReturnValue({ data: null });
      const { rerender } = render(<TopNavBar />);
      expect(screen.getByLabelText('Go to login')).toBeInTheDocument();
      
      // Logged in
      mockSession.mockReturnValue({
        data: { user: { email: 'test@example.com' } },
      });
      rerender(<TopNavBar />);
      expect(screen.getByLabelText('Go to profile')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('does not show search overlay initially', () => {
      mockSession.mockReturnValue({ data: null });
      render(<TopNavBar />);
      
      // SearchOverlay is not visible when isOpen is false
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('opens search overlay when search icon clicked', () => {
      mockSession.mockReturnValue({ data: null });
      render(<TopNavBar />);
      
      const searchButton = screen.getByLabelText('Open search');
      fireEvent.click(searchButton);
      
      // SearchOverlay should now be visible
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('closes search overlay when onClose is called', () => {
      mockSession.mockReturnValue({ data: null });
      render(<TopNavBar />);
      
      // Open overlay
      const searchButton = screen.getByLabelText('Open search');
      fireEvent.click(searchButton);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      
      // Close overlay
      const closeButton = screen.getByLabelText('Close search');
      fireEvent.click(closeButton);
      
      // Overlay should be gone
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('logo link is clickable and navigates to homepage', () => {
      mockSession.mockReturnValue({ data: null });
      render(<TopNavBar />);
      
      const logoLink = screen.getByLabelText('Go to homepage');
      expect(logoLink).toHaveAttribute('href', '/');
    });
  });

  describe('Responsive Design', () => {
    it('applies max-width constraint for larger screens', () => {
      mockSession.mockReturnValue({ data: null });
      const { container } = render(<TopNavBar />);
      
      const innerContainer = container.querySelector('.max-w-\\[600px\\]');
      expect(innerContainer).toBeInTheDocument();
    });

    it('applies padding for mobile viewports', () => {
      mockSession.mockReturnValue({ data: null });
      const { container } = render(<TopNavBar />);
      
      const innerContainer = container.querySelector('.px-4');
      expect(innerContainer).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('all interactive elements have aria-labels', () => {
      mockSession.mockReturnValue({ data: null });
      render(<TopNavBar />);
      
      expect(screen.getByLabelText('Go to homepage')).toBeInTheDocument();
      expect(screen.getByLabelText('Open search')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to login')).toBeInTheDocument();
    });

    it('navigation landmark is present', () => {
      mockSession.mockReturnValue({ data: null });
      const { container } = render(<TopNavBar />);
      
      const nav = container.querySelector('nav');
      expect(nav).toBeInTheDocument();
    });

    it('buttons are keyboard accessible', () => {
      mockSession.mockReturnValue({ data: null });
      render(<TopNavBar />);
      
      const searchButton = screen.getByLabelText('Open search');
      expect(searchButton.tagName).toBe('BUTTON');
    });

    it('links are keyboard accessible', () => {
      mockSession.mockReturnValue({ data: null });
      render(<TopNavBar />);
      
      const logoLink = screen.getByLabelText('Go to homepage');
      expect(logoLink.tagName).toBe('A');
      
      const userLink = screen.getByLabelText('Go to login');
      expect(userLink.tagName).toBe('A');
    });
  });

  describe('Visual Feedback', () => {
    it('logo has active scale animation class', () => {
      mockSession.mockReturnValue({ data: null });
      render(<TopNavBar />);
      
      const logoLink = screen.getByLabelText('Go to homepage');
      expect(logoLink).toHaveClass('active:scale-95');
    });

    it('search button has hover and active states', () => {
      mockSession.mockReturnValue({ data: null });
      render(<TopNavBar />);
      
      const searchButton = screen.getByLabelText('Open search');
      expect(searchButton).toHaveClass('hover:bg-gray-100', 'active:scale-95');
    });

    it('user icon has hover and active states', () => {
      mockSession.mockReturnValue({ data: null });
      render(<TopNavBar />);
      
      const userLink = screen.getByLabelText('Go to login');
      expect(userLink).toHaveClass('hover:bg-gray-100', 'active:scale-95');
    });
  });
});
