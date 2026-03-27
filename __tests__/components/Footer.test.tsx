import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '@/components/Footer';

describe('Footer', () => {
  describe('Rendering', () => {
    it('renders the footer element', () => {
      const { container } = render(<Footer />);
      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
    });

    it('has proper spacing above bottom tab bar', () => {
      const { container } = render(<Footer />);
      const footer = container.querySelector('footer');
      // Should have bottom padding to prevent overlap with tab bar
      expect(footer).toHaveClass('pb-16');
    });

    it('has no horizontal overflow styling', () => {
      const { container } = render(<Footer />);
      const footer = container.querySelector('footer');
      expect(footer).toHaveClass('w-full');
    });
  });

  describe('Company Info Section', () => {
    it('displays app name', () => {
      render(<Footer />);
      // Use getAllByText since the name appears in both logo and copyright
      const elements = screen.getAllByText(/WCStubHub/i);
      expect(elements.length).toBeGreaterThan(0);
    });

    it('displays brief company description', () => {
      render(<Footer />);
      expect(screen.getByText(/marketplace/i)).toBeInTheDocument();
    });

    it('displays copyright information', () => {
      render(<Footer />);
      const currentYear = new Date().getFullYear();
      expect(screen.getByText(new RegExp(`${currentYear}`, 'i'))).toBeInTheDocument();
    });
  });

  describe('Quick Links Section', () => {
    it('renders About link', () => {
      render(<Footer />);
      const aboutLink = screen.getByRole('link', { name: /about/i });
      expect(aboutLink).toBeInTheDocument();
      expect(aboutLink).toHaveAttribute('href');
    });

    it('renders Help Center link', () => {
      render(<Footer />);
      const helpLink = screen.getByRole('link', { name: /help center/i });
      expect(helpLink).toBeInTheDocument();
      expect(helpLink).toHaveAttribute('href');
    });

    it('renders Contact link', () => {
      render(<Footer />);
      const contactLink = screen.getByRole('link', { name: /contact/i });
      expect(contactLink).toBeInTheDocument();
      expect(contactLink).toHaveAttribute('href');
    });

    it('has Quick Links section heading', () => {
      render(<Footer />);
      expect(screen.getByText(/quick links/i)).toBeInTheDocument();
    });
  });

  describe('Legal Links Section', () => {
    it('renders Terms of Service link', () => {
      render(<Footer />);
      const termsLink = screen.getByRole('link', { name: /terms of service/i });
      expect(termsLink).toBeInTheDocument();
      expect(termsLink).toHaveAttribute('href');
    });

    it('renders Privacy Policy link', () => {
      render(<Footer />);
      const privacyLink = screen.getByRole('link', { name: /privacy policy/i });
      expect(privacyLink).toBeInTheDocument();
      expect(privacyLink).toHaveAttribute('href');
    });

    it('renders Cookie Policy link', () => {
      render(<Footer />);
      const cookieLink = screen.getByRole('link', { name: /cookie policy/i });
      expect(cookieLink).toBeInTheDocument();
      expect(cookieLink).toHaveAttribute('href');
    });

    it('has Legal section heading', () => {
      render(<Footer />);
      expect(screen.getByText(/legal/i)).toBeInTheDocument();
    });
  });

  describe('Trust Banner Section', () => {
    it('displays Fan Protect Guarantee heading', () => {
      render(<Footer />);
      expect(screen.getByText(/fan protect guarantee/i)).toBeInTheDocument();
    });

    it('displays trust banner description', () => {
      render(<Footer />);
      // Should have some description about buyer protection
      expect(screen.getByText(/protected/i)).toBeInTheDocument();
    });

    it('displays trust icon', () => {
      render(<Footer />);
      const footer = render(<Footer />).container;
      // Check for SVG icon (Lucide Shield or similar)
      const svg = footer.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('trust banner is visually distinct with background', () => {
      const { container } = render(<Footer />);
      // Trust banner should have a distinct background
      const trustBanner = container.querySelector('.bg-primary-50, .bg-blue-50, .bg-gradient-to-r');
      expect(trustBanner).toBeInTheDocument();
    });
  });

  describe('Touch Targets', () => {
    it('all links have adequate tap targets (min 44px)', () => {
      render(<Footer />);
      const links = screen.getAllByRole('link');
      
      links.forEach((link) => {
        // Each link should have min-h-[44px] or equivalent padding
        const hasAdequateTapTarget = 
          link.classList.contains('min-h-[44px]') ||
          link.classList.contains('py-2') ||
          link.classList.contains('py-3');
        expect(hasAdequateTapTarget).toBe(true);
      });
    });
  });

  describe('Responsive Design', () => {
    it('applies max-width constraint for larger screens', () => {
      const { container } = render(<Footer />);
      const maxWidthContainer = container.querySelector('.max-w-\\[600px\\]');
      expect(maxWidthContainer).toBeInTheDocument();
    });

    it('applies horizontal padding for mobile viewports', () => {
      const { container } = render(<Footer />);
      const paddedContainer = container.querySelector('.px-4');
      expect(paddedContainer).toBeInTheDocument();
    });

    it('prevents horizontal overflow', () => {
      const { container } = render(<Footer />);
      const footer = container.querySelector('footer');
      expect(footer).toHaveClass('w-full');
      expect(footer).not.toHaveClass('min-w-');
    });
  });

  describe('Layout Structure', () => {
    it('organizes content in sections', () => {
      const { container } = render(<Footer />);
      const footer = container.querySelector('footer');
      
      // Should have multiple sections (company, quick links, legal, trust)
      const sections = footer?.querySelectorAll('div');
      expect(sections!.length).toBeGreaterThan(3);
    });

    it('uses appropriate spacing between sections', () => {
      const { container } = render(<Footer />);
      const footer = container.querySelector('footer');
      
      // Check the inner container that holds the sections
      const innerContainer = container.querySelector('.space-y-8');
      expect(innerContainer).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('footer has semantic footer tag', () => {
      const { container } = render(<Footer />);
      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
    });

    it('all links are accessible and have text content', () => {
      render(<Footer />);
      const links = screen.getAllByRole('link');
      
      links.forEach((link) => {
        expect(link.textContent).toBeTruthy();
      });
    });

    it('headings are properly structured', () => {
      render(<Footer />);
      // Section headings should be h3 or h4
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });
  });

  describe('Visual Design', () => {
    it('has background color or border to distinguish from content', () => {
      const { container } = render(<Footer />);
      const footer = container.querySelector('footer');
      
      const hasVisualSeparation = 
        footer?.classList.contains('bg-') ||
        footer?.classList.contains('border-t');
      expect(hasVisualSeparation).toBe(true);
    });

    it('uses appropriate text colors for readability', () => {
      const { container } = render(<Footer />);
      const footer = container.querySelector('footer');
      
      // Should have text color classes
      const hasTextColor = 
        footer?.querySelector('.text-gray-600') ||
        footer?.querySelector('.text-gray-700') ||
        footer?.querySelector('.text-gray-500');
      expect(hasTextColor).toBeInTheDocument();
    });
  });
});
