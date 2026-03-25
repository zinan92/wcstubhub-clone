import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import BankCardPage from '@/app/my/bank-card/page';
import SecurityCenterPage from '@/app/my/security/page';
import NotificationPage from '@/app/my/notification/page';
import LanguagePage from '@/app/my/language/page';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('Placeholder Pages', () => {
  const mockRouter = {
    back: vi.fn(),
    push: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue(mockRouter);
  });

  describe('BankCardPage', () => {
    it('renders header with back button and title', () => {
      render(<BankCardPage />);
      expect(screen.getByRole('heading', { name: /bank card binding/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/go back/i)).toBeInTheDocument();
    });

    it('back button navigates back', () => {
      render(<BankCardPage />);
      const backButton = screen.getByLabelText(/go back/i);
      backButton.click();
      expect(mockRouter.back).toHaveBeenCalledOnce();
    });
  });

  describe('SecurityCenterPage', () => {
    it('renders header with back button and title', () => {
      render(<SecurityCenterPage />);
      expect(screen.getByRole('heading', { name: /security center/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/go back/i)).toBeInTheDocument();
    });

    it('back button navigates back', () => {
      render(<SecurityCenterPage />);
      const backButton = screen.getByLabelText(/go back/i);
      backButton.click();
      expect(mockRouter.back).toHaveBeenCalledOnce();
    });
  });

  describe('NotificationPage', () => {
    it('renders header with back button and title', () => {
      render(<NotificationPage />);
      expect(screen.getByRole('heading', { name: /notification/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/go back/i)).toBeInTheDocument();
    });

    it('back button navigates back', () => {
      render(<NotificationPage />);
      const backButton = screen.getByLabelText(/go back/i);
      backButton.click();
      expect(mockRouter.back).toHaveBeenCalledOnce();
    });
  });

  describe('LanguagePage', () => {
    it('renders header with back button and title', () => {
      render(<LanguagePage />);
      expect(screen.getByRole('heading', { name: /language/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/go back/i)).toBeInTheDocument();
    });

    it('back button navigates back', () => {
      render(<LanguagePage />);
      const backButton = screen.getByLabelText(/go back/i);
      backButton.click();
      expect(mockRouter.back).toHaveBeenCalledOnce();
    });
  });
});
