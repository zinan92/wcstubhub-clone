import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminLoginPage from '@/app/admin/login/page';
import { signIn } from 'next-auth/react';

// Mock next-auth
vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));

describe('AdminLoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render admin login page with branding', () => {
    render(<AdminLoginPage />);
    
    // Check for admin branding
    expect(screen.getByText('Admin Portal')).toBeTruthy();
    expect(screen.getByLabelText('Email')).toBeTruthy();
    expect(screen.getByLabelText('Password')).toBeTruthy();
    expect(screen.getByRole('button', { name: /login/i })).toBeTruthy();
  });

  it('should have email and password input fields', () => {
    render(<AdminLoginPage />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    
    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(passwordInput.getAttribute('type')).toBe('password');
  });

  it('should show validation errors for empty fields', async () => {
    render(<AdminLoginPage />);
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      const errorMessages = screen.queryAllByText(/required/i);
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });

  it('should call signIn with credentials on form submit', async () => {
    vi.mocked(signIn).mockResolvedValue({ ok: true, error: null } as any);
    
    render(<AdminLoginPage />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    fireEvent.change(emailInput, { target: { value: 'admin@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'admin123' } });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', expect.objectContaining({
        emailOrPhone: 'admin@example.com',
        password: 'admin123',
        redirect: false,
      }));
    });
  });

  it('should show error message on invalid credentials', async () => {
    vi.mocked(signIn).mockResolvedValue({ ok: false, error: 'Invalid credentials' } as any);
    
    render(<AdminLoginPage />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    fireEvent.change(emailInput, { target: { value: 'admin@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      const errorMessage = screen.getByText(/invalid/i);
      expect(errorMessage).toBeTruthy();
    });
  });

  it('should have password visibility toggle', () => {
    render(<AdminLoginPage />);
    
    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput.getAttribute('type')).toBe('password');
    
    // Look for toggle button (eye icon)
    const toggleButton = screen.getByLabelText('Toggle password visibility');
    
    fireEvent.click(toggleButton);
    expect(passwordInput.getAttribute('type')).toBe('text');
    
    fireEvent.click(toggleButton);
    expect(passwordInput.getAttribute('type')).toBe('password');
  });
});
