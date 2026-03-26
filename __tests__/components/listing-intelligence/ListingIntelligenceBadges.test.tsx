import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ListingIntelligenceBadges } from '@/components/listing-intelligence/ListingIntelligenceBadges';

describe('ListingIntelligenceBadges', () => {
  it('renders nothing when no badges are enabled', () => {
    const { container } = render(<ListingIntelligenceBadges />);
    expect(container.firstChild).toBeNull();
  });

  it('renders Best Value badge when isBestValue is true', () => {
    render(<ListingIntelligenceBadges isBestValue={true} />);
    expect(screen.getByText('Best Value')).toBeInTheDocument();
  });

  it('does not render Best Value badge when isBestValue is false', () => {
    render(<ListingIntelligenceBadges isBestValue={false} />);
    expect(screen.queryByText('Best Value')).not.toBeInTheDocument();
  });

  it('renders Selling Fast badge when isSellingFast is true', () => {
    render(<ListingIntelligenceBadges isSellingFast={true} />);
    expect(screen.getByText('Selling Fast')).toBeInTheDocument();
  });

  it('does not render Selling Fast badge when isSellingFast is false', () => {
    render(<ListingIntelligenceBadges isSellingFast={false} />);
    expect(screen.queryByText('Selling Fast')).not.toBeInTheDocument();
  });

  it('renders urgency badge when remainingQty is at urgency threshold', () => {
    render(<ListingIntelligenceBadges remainingQty={5} urgencyThreshold={5} />);
    expect(screen.getByText('Only 5 left')).toBeInTheDocument();
  });

  it('renders urgency badge when remainingQty is below urgency threshold', () => {
    render(<ListingIntelligenceBadges remainingQty={3} urgencyThreshold={5} />);
    expect(screen.getByText('Only 3 left')).toBeInTheDocument();
  });

  it('does not render urgency badge when remainingQty is above urgency threshold', () => {
    render(<ListingIntelligenceBadges remainingQty={10} urgencyThreshold={5} />);
    expect(screen.queryByText(/Only.*left/)).not.toBeInTheDocument();
  });

  it('does not render urgency badge when remainingQty is 0', () => {
    render(<ListingIntelligenceBadges remainingQty={0} urgencyThreshold={5} />);
    expect(screen.queryByText(/Only.*left/)).not.toBeInTheDocument();
  });

  it('does not render urgency badge when urgencyThreshold is not provided', () => {
    render(<ListingIntelligenceBadges remainingQty={3} />);
    expect(screen.queryByText(/Only.*left/)).not.toBeInTheDocument();
  });

  it('renders Verified Listing badge when isVerified is true', () => {
    render(<ListingIntelligenceBadges isVerified={true} />);
    expect(screen.getByText('Verified Listing')).toBeInTheDocument();
  });

  it('renders Verified Listing badge when isOfficial is true', () => {
    render(<ListingIntelligenceBadges isOfficial={true} />);
    expect(screen.getByText('Verified Listing')).toBeInTheDocument();
  });

  it('does not render Verified Listing badge when both isVerified and isOfficial are false', () => {
    render(<ListingIntelligenceBadges isVerified={false} isOfficial={false} />);
    expect(screen.queryByText('Verified Listing')).not.toBeInTheDocument();
  });

  it('renders multiple badges when multiple conditions are true', () => {
    render(
      <ListingIntelligenceBadges
        isBestValue={true}
        isSellingFast={true}
        remainingQty={3}
        urgencyThreshold={5}
        isVerified={true}
      />
    );
    expect(screen.getByText('Best Value')).toBeInTheDocument();
    expect(screen.getByText('Selling Fast')).toBeInTheDocument();
    expect(screen.getByText('Only 3 left')).toBeInTheDocument();
    expect(screen.getByText('Verified Listing')).toBeInTheDocument();
  });

  it('renders only enabled badges when some conditions are true', () => {
    render(
      <ListingIntelligenceBadges
        isBestValue={true}
        isSellingFast={false}
        remainingQty={10}
        urgencyThreshold={5}
        isVerified={false}
      />
    );
    expect(screen.getByText('Best Value')).toBeInTheDocument();
    expect(screen.queryByText('Selling Fast')).not.toBeInTheDocument();
    expect(screen.queryByText(/Only.*left/)).not.toBeInTheDocument();
    expect(screen.queryByText('Verified Listing')).not.toBeInTheDocument();
  });

  it('correctly displays urgency count in badge text', () => {
    render(<ListingIntelligenceBadges remainingQty={1} urgencyThreshold={5} />);
    expect(screen.getByText('Only 1 left')).toBeInTheDocument();
  });

  it('urgency badge shows exact remaining quantity', () => {
    render(<ListingIntelligenceBadges remainingQty={2} urgencyThreshold={10} />);
    expect(screen.getByText('Only 2 left')).toBeInTheDocument();
  });

  it('renders with small size by default', () => {
    const { container } = render(<ListingIntelligenceBadges isBestValue={true} />);
    const badge = container.querySelector('.text-xs');
    expect(badge).toBeInTheDocument();
  });

  it('renders with medium size when specified', () => {
    const { container } = render(<ListingIntelligenceBadges isBestValue={true} size="md" />);
    const badge = container.querySelector('.text-sm');
    expect(badge).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(
      <ListingIntelligenceBadges isBestValue={true} className="custom-class" />
    );
    const wrapper = container.querySelector('.custom-class');
    expect(wrapper).toBeInTheDocument();
  });
});
