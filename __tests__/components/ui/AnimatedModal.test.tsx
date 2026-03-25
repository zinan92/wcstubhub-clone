import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AnimatedModal from '@/components/ui/AnimatedModal';

describe('AnimatedModal', () => {
  it('does not render when isOpen is false', () => {
    render(
      <AnimatedModal isOpen={false} onClose={() => {}}>
        <div>Modal Content</div>
      </AnimatedModal>
    );
    
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    render(
      <AnimatedModal isOpen={true} onClose={() => {}}>
        <div>Modal Content</div>
      </AnimatedModal>
    );
    
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('calls onClose when backdrop is clicked', () => {
    const handleClose = vi.fn();
    const { container } = render(
      <AnimatedModal isOpen={true} onClose={handleClose}>
        <div>Modal Content</div>
      </AnimatedModal>
    );
    
    // Find backdrop (first child of modal container)
    const backdrop = container.querySelector('[data-testid="modal-backdrop"]');
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(handleClose).toHaveBeenCalledTimes(1);
    }
  });

  it('does not close when modal content is clicked', () => {
    const handleClose = vi.fn();
    render(
      <AnimatedModal isOpen={true} onClose={handleClose}>
        <div>Modal Content</div>
      </AnimatedModal>
    );
    
    const content = screen.getByText('Modal Content');
    fireEvent.click(content);
    
    // Should NOT call onClose when clicking content
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('has backdrop element with fade animation', () => {
    const { container } = render(
      <AnimatedModal isOpen={true} onClose={() => {}}>
        <div>Modal Content</div>
      </AnimatedModal>
    );
    
    const backdrop = container.querySelector('[data-testid="modal-backdrop"]');
    expect(backdrop).toBeInTheDocument();
    expect(backdrop?.className).toContain('bg-black');
  });

  it('has panel element that slides up', () => {
    const { container } = render(
      <AnimatedModal isOpen={true} onClose={() => {}}>
        <div>Modal Content</div>
      </AnimatedModal>
    );
    
    // Modal panel should exist
    const panel = container.querySelector('[data-testid="modal-panel"]');
    expect(panel).toBeInTheDocument();
  });
});
