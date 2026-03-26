import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import ProductDetailPage from '@/app/products/[id]/page';

// Mock next/navigation
const mockBack = vi.fn();
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    back: mockBack,
    push: mockPush,
  }),
}));

// Mock fetch
global.fetch = vi.fn();

const mockProduct = {
  id: 'prod123',
  name: 'Argentina Home Jersey 2026',
  price: 29.99,
  imageUrl: 'https://flagcdn.com/w640/ar.png',
  description: 'Official FIFA World Cup 2026 Argentina national team home jersey. Iconic blue and white stripes with AFA badge.',
  remainingQty: 25,
};

const renderWithSession = (component: React.ReactElement, session: any = { user: { email: 'test@example.com' }, expires: '2099-01-01' }) => {
  return render(
    <SessionProvider session={session}>
      {component}
    </SessionProvider>
  );
};

describe('ProductDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockProduct,
    });
  });

  it('renders product details after loading', async () => {
    renderWithSession(<ProductDetailPage params={Promise.resolve({ id: 'prod123' })} />);

    // Wait for product to load
    await waitFor(() => {
      expect(screen.getByText('Argentina Home Jersey 2026')).toBeDefined();
    });

    expect(screen.getByText('$29.99')).toBeDefined();
    expect(screen.getByText('25 units remaining')).toBeDefined();
    expect(screen.getByText(/Official FIFA World Cup 2026/)).toBeDefined();
  });

  it('displays product image with correct alt text', async () => {
    renderWithSession(<ProductDetailPage params={Promise.resolve({ id: 'prod123' })} />);

    await waitFor(() => {
      const img = screen.getByAltText('Argentina Home Jersey 2026');
      expect(img).toBeDefined();
      // Next.js Image component transforms the src attribute
      // Just verify the image is present with correct alt text
    });
  });

  it('shows Purchase and For sale buttons', async () => {
    renderWithSession(<ProductDetailPage params={Promise.resolve({ id: 'prod123' })} />);

    await waitFor(() => {
      expect(screen.getByText('Purchase')).toBeDefined();
      expect(screen.getByText('For sale')).toBeDefined();
    });
  });

  it('opens Purchase dialog when Purchase button clicked', async () => {
    renderWithSession(<ProductDetailPage params={Promise.resolve({ id: 'prod123' })} />);

    await waitFor(() => {
      expect(screen.getByText('Purchase')).toBeDefined();
    });

    const purchaseButton = screen.getByText('Purchase');
    fireEvent.click(purchaseButton);

    await waitFor(() => {
      expect(screen.getByText('Purchase request submitted successfully')).toBeDefined();
    });
  });

  it('opens For sale dialog when For sale button clicked', async () => {
    renderWithSession(<ProductDetailPage params={Promise.resolve({ id: 'prod123' })} />);

    await waitFor(() => {
      expect(screen.getByText('For sale')).toBeDefined();
    });

    const forSaleButton = screen.getByText('For sale');
    fireEvent.click(forSaleButton);

    await waitFor(() => {
      expect(screen.getByText('Listing request submitted successfully')).toBeDefined();
    });
  });

  it('closes Purchase dialog when OK clicked', async () => {
    renderWithSession(<ProductDetailPage params={Promise.resolve({ id: 'prod123' })} />);

    await waitFor(() => {
      expect(screen.getByText('Purchase')).toBeDefined();
    });

    // Open dialog
    fireEvent.click(screen.getByText('Purchase'));

    await waitFor(() => {
      expect(screen.getByText('Purchase request submitted successfully')).toBeDefined();
    });

    // Close dialog
    const okButtons = screen.getAllByText('OK');
    fireEvent.click(okButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText('Purchase request submitted successfully')).toBeNull();
    });
  });

  it('closes For sale dialog when OK clicked', async () => {
    renderWithSession(<ProductDetailPage params={Promise.resolve({ id: 'prod123' })} />);

    await waitFor(() => {
      expect(screen.getByText('For sale')).toBeDefined();
    });

    // Open dialog
    fireEvent.click(screen.getByText('For sale'));

    await waitFor(() => {
      expect(screen.getByText('Listing request submitted successfully')).toBeDefined();
    });

    // Close dialog
    const okButtons = screen.getAllByText('OK');
    fireEvent.click(okButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText('Listing request submitted successfully')).toBeNull();
    });
  });

  it('calls router.back() when back button clicked', async () => {
    renderWithSession(<ProductDetailPage params={Promise.resolve({ id: 'prod123' })} />);

    await waitFor(() => {
      expect(screen.getByLabelText('Go back')).toBeDefined();
    });

    const backButton = screen.getByLabelText('Go back');
    fireEvent.click(backButton);

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('shows not found message when product does not exist', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Product not found' }),
    });

    renderWithSession(<ProductDetailPage params={Promise.resolve({ id: 'invalid' })} />);

    await waitFor(() => {
      expect(screen.getByText('Product not found')).toBeDefined();
    });
  });
});
