import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import CompanyProfilePage from '@/app/my/company/page';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('CompanyProfilePage', () => {
  const mockRouter = {
    back: vi.fn(),
    push: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue(mockRouter);
  });

  it('renders header with back button and title', () => {
    render(<CompanyProfilePage />);
    expect(screen.getByRole('heading', { name: /company profile/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/go back/i)).toBeInTheDocument();
  });

  it('back button navigates back', () => {
    render(<CompanyProfilePage />);
    const backButton = screen.getByLabelText(/go back/i);
    backButton.click();
    expect(mockRouter.back).toHaveBeenCalledOnce();
  });

  it('displays SAE-A Trading company name', () => {
    render(<CompanyProfilePage />);
    expect(screen.getByRole('heading', { name: /sae-a trading/i })).toBeInTheDocument();
  });

  it('displays comprehensive company description', () => {
    render(<CompanyProfilePage />);
    
    // Check for key phrases in the company description
    expect(screen.getByText(/international trade/i, { selector: 'p' })).toBeInTheDocument();
    expect(screen.getAllByText(/apparel/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/textiles/i).length).toBeGreaterThan(0);
  });

  it('displays quality philosophy section', () => {
    render(<CompanyProfilePage />);
    expect(screen.getByRole('heading', { name: /quality philosophy/i })).toBeInTheDocument();
  });

  it('is read-only with no editable fields', () => {
    render(<CompanyProfilePage />);
    
    // Should not have any input fields
    const inputs = screen.queryAllByRole('textbox');
    expect(inputs).toHaveLength(0);
    
    const textareas = screen.queryAllByRole('textarea');
    expect(textareas).toHaveLength(0);
  });
});
