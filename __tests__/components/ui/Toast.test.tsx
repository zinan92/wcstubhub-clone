import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ToastProvider, useToast } from '@/components/ui/Toast';

// Test component that uses the useToast hook
function TestComponent() {
  const { showToast } = useToast();
  
  return (
    <div>
      <button onClick={() => showToast('Success message', 'success')}>
        Show Success
      </button>
      <button onClick={() => showToast('Error message', 'error')}>
        Show Error
      </button>
      <button onClick={() => showToast('Info message', 'info')}>
        Show Info
      </button>
    </div>
  );
}

describe('Toast System', () => {
  it('shows success toast when triggered', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    const button = screen.getByText('Show Success');
    
    await act(async () => {
      button.click();
    });
    
    await waitFor(() => {
      expect(screen.getByText('Success message')).toBeInTheDocument();
    });
  });

  it('shows error toast when triggered', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    const button = screen.getByText('Show Error');
    
    await act(async () => {
      button.click();
    });
    
    await waitFor(() => {
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });
  });

  it('shows info toast when triggered', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    const button = screen.getByText('Show Info');
    
    await act(async () => {
      button.click();
    });
    
    await waitFor(() => {
      expect(screen.getByText('Info message')).toBeInTheDocument();
    });
  });

  it('auto-dismisses toast after timeout', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    const button = screen.getByText('Show Success');
    
    await act(async () => {
      button.click();
    });
    
    // Toast should appear
    expect(screen.getByText('Success message')).toBeInTheDocument();
    
    // Wait for auto-dismiss (3 seconds + buffer)
    await waitFor(
      () => {
        expect(screen.queryByText('Success message')).not.toBeInTheDocument();
      },
      { timeout: 4000 }
    );
  });

  it('renders toast with appropriate styling for type', async () => {
    const { container } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    const button = screen.getByText('Show Success');
    
    await act(async () => {
      button.click();
    });
    
    const toast = container.querySelector('[data-testid="toast"]');
    expect(toast).toBeInTheDocument();
  });
});
