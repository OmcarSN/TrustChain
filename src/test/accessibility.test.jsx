/**
 * Accessibility (a11y) Integration Tests
 * Verifies WCAG compliance across the application:
 *   - ARIA labels present on interactive elements
 *   - Keyboard navigation support (Skip-to-content, role assignments)
 *   - Proper landmark roles
 */
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

// Components
import SkipToContent from '../components/SkipToContent';
import { StarInput } from '../components/StarRating';

// Mocks
vi.mock('../assets/transparent-logo.webp', () => ({ default: 'mock-logo.png' }));

// Mock WalletContext for Navbar tests
vi.mock('../context/WalletContext', () => ({
  useWallet: () => ({
    walletAddress: null,
    isConnected: false,
    connect: vi.fn(),
    disconnect: vi.fn(),
  }),
}));

const renderWithProviders = (ui) =>
  render(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        {ui}
      </I18nextProvider>
    </BrowserRouter>
  );

const starInputProps = {
  rating: 3,
  hoveredStar: 0,
  onRate: vi.fn(),
  onHover: vi.fn(),
  onLeave: vi.fn(),
};

// ── Skip-to-Content Link ───────────────────────────────────
describe('Accessibility: Skip-to-Content', () => {
  it('renders a skip link that targets #main-content', () => {
    renderWithProviders(<SkipToContent />);
    const link = screen.getByText(/skip to main content/i);
    expect(link.getAttribute('href')).toBe('#main-content');
  });

  it('skip link is rendered in the DOM', () => {
    renderWithProviders(<SkipToContent />);
    const link = screen.getByText(/skip to main content/i);
    expect(link).toBeTruthy();
  });
});

// ── Navbar ARIA Compliance ──────────────────────────────────
describe('Accessibility: Navbar', () => {
  it('has aria-label on nav element', async () => {
    const { default: Navbar } = await import('../components/Navbar');
    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <Navbar />
        </I18nextProvider>
      </BrowserRouter>
    );
    const nav = screen.getByRole('navigation');
    expect(nav.getAttribute('aria-label')).toBe('Main navigation');
  });

  it('has aria-expanded on mobile menu button', async () => {
    const { default: Navbar } = await import('../components/Navbar');
    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <Navbar />
        </I18nextProvider>
      </BrowserRouter>
    );
    const menuButton = screen.getByLabelText(/open navigation menu/i);
    expect(menuButton.getAttribute('aria-expanded')).toBe('false');
  });
});

// ── StarInput ARIA Compliance ───────────────────────────────
describe('Accessibility: StarInput', () => {
  it('has radiogroup role', () => {
    const { container } = renderWithProviders(
      <StarInput {...starInputProps} />
    );
    const group = container.querySelector('[role="radiogroup"]');
    expect(group).toBeTruthy();
  });

  it('each star button has role=radio', () => {
    const { container } = renderWithProviders(
      <StarInput {...starInputProps} />
    );
    const radios = container.querySelectorAll('[role="radio"]');
    expect(radios.length).toBe(5);
  });

  it('only the selected star has aria-checked=true', () => {
    const { container } = renderWithProviders(
      <StarInput {...starInputProps} rating={3} />
    );
    const radios = container.querySelectorAll('[role="radio"]');
    let checkedCount = 0;
    radios.forEach((radio) => {
      if (radio.getAttribute('aria-checked') === 'true') checkedCount++;
    });
    expect(checkedCount).toBe(1);
    expect(radios[2].getAttribute('aria-checked')).toBe('true');
  });

  it('star buttons have descriptive aria-labels', () => {
    const { container } = renderWithProviders(
      <StarInput {...starInputProps} rating={0} />
    );
    const radios = container.querySelectorAll('[role="radio"]');
    expect(radios[0].getAttribute('aria-label')).toContain('1 star');
    expect(radios[4].getAttribute('aria-label')).toContain('5 star');
  });
});

// ── Toast Container ARIA ────────────────────────────────────
describe('Accessibility: Toast Container', () => {
  it('has role=alert and aria-live=assertive', async () => {
    const { ToastProvider } = await import('../context/ToastContext');
    const { container } = render(
      <ToastProvider>
        <div>child</div>
      </ToastProvider>
    );
    const alertDiv = container.querySelector('[role="alert"]');
    expect(alertDiv).toBeTruthy();
    expect(alertDiv.getAttribute('aria-live')).toBe('assertive');
    expect(alertDiv.getAttribute('aria-atomic')).toBe('true');
  });
});
