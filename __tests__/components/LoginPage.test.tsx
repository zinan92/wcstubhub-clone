import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import LoginPage from '@/app/login/page';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(() => ({
    get: vi.fn(() => null),
  })),
}));

// Mock next-auth/react
vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
  useSession: vi.fn(() => ({
    data: null,
    status: 'unauthenticated',
  })),
}));

describe('LoginPage', () => {
  const mockPush = vi.fn();
  const mockRefresh = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });
  });

  it('renders login page with SAE-A Trading branding', () => {
    render(<LoginPage />);
    
    expect(screen.getByText('SAE-A Trading')).toBeInTheDocument();
    expect(screen.getByText('Sports Merchandise & Event Tickets')).toBeInTheDocument();
  });

  it('renders phone and email tabs', () => {
    render(<LoginPage />);
    
    expect(screen.getByRole('button', { name: 'Phone' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Email' })).toBeInTheDocument();
  });

  it('switches between phone and email tabs', () => {
    render(<LoginPage />);
    
    const phoneTab = screen.getByRole('button', { name: 'Phone' });
    const emailTab = screen.getByRole('button', { name: 'Email' });

    // Email tab should be active by default
    expect(emailTab).toHaveClass('bg-white');
    
    // Click phone tab
    fireEvent.click(phoneTab);
    expect(phoneTab).toHaveClass('bg-white');
    expect(screen.getByPlaceholderText('Enter your phone number')).toBeInTheDocument();

    // Click email tab
    fireEvent.click(emailTab);
    expect(emailTab).toHaveClass('bg-white');
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  });

  it('toggles password visibility', () => {
    render(<LoginPage />);
    
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    const toggleButton = screen.getByLabelText('Show password');

    expect(passwordInput.type).toBe('password');
    
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');
    
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  it('shows validation error for empty email', async () => {
    render(<LoginPage />);
    
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
  });

  it('shows validation error for empty password', async () => {
    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText('Email Address');
    const loginButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  it('shows error on invalid login credentials', async () => {
    (signIn as any).mockResolvedValue({ error: 'Invalid credentials' });

    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email/phone or password')).toBeInTheDocument();
    });
  });

  it('redirects to home on successful login', async () => {
    (signIn as any).mockResolvedValue({ error: null });

    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it('renders language selector with English default', () => {
    render(<LoginPage />);
    
    const languageSelect = screen.getByLabelText('Language') as HTMLSelectElement;
    expect(languageSelect).toBeInTheDocument();
    expect(languageSelect.value).toBe('en');
  });

  it('renders register link', () => {
    render(<LoginPage />);
    
    const registerLink = screen.getByRole('link', { name: 'Register now' });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute('href', '/register');
  });
});
