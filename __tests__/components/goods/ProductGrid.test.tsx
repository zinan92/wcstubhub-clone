import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProductGrid from '@/components/goods/ProductGrid';

const mockProducts = [
  {
    id: '1',
    name: 'Messi #10 Argentina Jersey',
    price: 149.99,
    imageUrl: 'https://example.com/messi.jpg'
  },
  {
    id: '2',
    name: 'Cristiano Ronaldo #7 Portugal Jersey',
    price: 139.99,
    imageUrl: 'https://example.com/ronaldo.jpg'
  }
];

describe('ProductGrid', () => {
  it('renders product cards when products are provided', () => {
    render(<ProductGrid products={mockProducts} />);
    
    expect(screen.getByText('Messi #10 Argentina Jersey')).toBeInTheDocument();
    expect(screen.getByText('Cristiano Ronaldo #7 Portugal Jersey')).toBeInTheDocument();
    expect(screen.getByText('$149.99')).toBeInTheDocument();
    expect(screen.getByText('$139.99')).toBeInTheDocument();
  });

  it('displays empty state when no products', () => {
    render(<ProductGrid products={[]} />);
    
    expect(screen.getByText('No products found')).toBeInTheDocument();
    expect(screen.getByText('Try a different search term')).toBeInTheDocument();
  });

  it('renders correct number of product cards', () => {
    const { container } = render(<ProductGrid products={mockProducts} />);
    const productCards = container.querySelectorAll('a[href^="/products/"]');
    
    expect(productCards.length).toBe(2);
  });
});
