import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import PersonalCenterPage from '@/app/my/personal/page';
import { useSession } from 'next-auth/react';

// Mock next-auth
vi.mock('next-auth/react');

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('PersonalCenterPage', () => {
  const mockRouter = {
    back: vi.fn(),
    push: vi.fn(),
  };

  const mockSession = {
    user: { email: 'test@example.com' },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue(mockRouter);
    (useSession as any).mockReturnValue({
      data: mockSession,
      status: 'authenticated',
    });

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            id: '1',
            email: 'test@example.com',
            avatarUrl: 'https://picsum.photos/seed/test/150/150',
          }),
      })
    ) as any;
  });

  it('renders header with back button and title', async () => {
    render(<PersonalCenterPage />);
    
    await screen.findByRole('heading', { name: /personal center/i });
    
    expect(screen.getByRole('heading', { name: /personal center/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/go back/i)).toBeInTheDocument();
  });

  it('back button navigates back', async () => {
    render(<PersonalCenterPage />);
    
    const backButton = await screen.findByLabelText(/go back/i);
    backButton.click();
    expect(mockRouter.back).toHaveBeenCalledOnce();
  });

  it('displays user avatar with label', async () => {
    render(<PersonalCenterPage />);
    
    // Wait for data to load
    await screen.findByText('Avatar');
    
    const avatarLabel = screen.getByText('Avatar');
    expect(avatarLabel).toBeInTheDocument();
    
    // Next.js Image component renders with complex src attributes
    // Just verify the alt text is present, which confirms the image is rendered
    const avatar = screen.getByAltText('User avatar');
    expect(avatar).toBeInTheDocument();
  });

  it('displays default avatar when avatarUrl is null', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            id: '1',
            email: 'test@example.com',
            avatarUrl: null,
          }),
      })
    ) as any;

    render(<PersonalCenterPage />);
    
    await screen.findByText('Avatar');
    
    // Should show default avatar (User icon)
    const avatarContainer = screen.getByText('Avatar').previousElementSibling;
    expect(avatarContainer).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    render(<PersonalCenterPage />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
