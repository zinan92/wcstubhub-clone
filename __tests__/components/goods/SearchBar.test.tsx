import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '@/components/goods/SearchBar';

describe('SearchBar', () => {
  it('renders with placeholder text', () => {
    render(<SearchBar value="" onChange={() => {}} placeholder="Find products" />);
    
    expect(screen.getByPlaceholderText('Find products')).toBeInTheDocument();
  });

  it('displays current value', () => {
    render(<SearchBar value="Messi" onChange={() => {}} />);
    
    const input = screen.getByDisplayValue('Messi');
    expect(input).toBeInTheDocument();
  });

  it('calls onChange when user types', () => {
    const handleChange = vi.fn();
    render(<SearchBar value="" onChange={handleChange} />);
    
    const input = screen.getByPlaceholderText('Find products');
    fireEvent.change(input, { target: { value: 'test' } });
    
    expect(handleChange).toHaveBeenCalledWith('test');
  });

  it('renders search icon', () => {
    const { container } = render(<SearchBar value="" onChange={() => {}} />);
    
    const searchIcon = container.querySelector('svg');
    expect(searchIcon).toBeInTheDocument();
  });
});
