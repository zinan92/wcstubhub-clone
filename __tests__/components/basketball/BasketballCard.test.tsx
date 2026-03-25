import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import BasketballCard from '@/components/basketball/BasketballCard';

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('BasketballCard', () => {
  const mockEvent = {
    id: '1',
    team1: 'Phoenix Suns',
    team2: 'Los Angeles Lakers',
    date: '2026-05-20T19:30:00Z',
    venue: 'Footprint Center, Phoenix',
    price: 145.00,
  };

  it('renders team names in Team1 VS Team2 format', () => {
    render(<BasketballCard {...mockEvent} />);
    
    expect(screen.getByText('Phoenix Suns')).toBeDefined();
    expect(screen.getByText('VS')).toBeDefined();
    expect(screen.getByText('Los Angeles Lakers')).toBeDefined();
  });

  it('displays formatted date and time', () => {
    render(<BasketballCard {...mockEvent} />);
    
    // Should display date (could be May 20 or 21 depending on timezone)
    const dateText = screen.getByText(/May 2[01], 2026/);
    expect(dateText).toBeDefined();
  });

  it('displays venue with location emoji', () => {
    render(<BasketballCard {...mockEvent} />);
    
    expect(screen.getByText(/📍 Footprint Center, Phoenix/)).toBeDefined();
  });

  it('displays price formatted as $XXX.XX', () => {
    render(<BasketballCard {...mockEvent} />);
    
    expect(screen.getByText('$145.00')).toBeDefined();
  });

  it('links to event detail page', () => {
    const { container } = render(<BasketballCard {...mockEvent} />);
    
    const link = container.querySelector('a');
    expect(link?.getAttribute('href')).toBe('/events/1');
  });

  it('has centered layout for team names', () => {
    const { container } = render(<BasketballCard {...mockEvent} />);
    
    const teamsContainer = container.querySelector('.flex.items-center.justify-center');
    expect(teamsContainer).toBeDefined();
  });
});
