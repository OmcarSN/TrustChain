/**
 * Shared Component Unit Tests
 * Tests for all extracted shared components:
 *   PageBackground, ConnectWalletPrompt, StarRating, TransactionSuccess, SkipToContent
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

// ── Components ──
import PageBackground from '../components/PageBackground';
import { StarDisplay, StarInput } from '../components/StarRating';
import TransactionSuccess from '../components/TransactionSuccess';
import SkipToContent from '../components/SkipToContent';

// Mock image imports for Vitest/jsdom
vi.mock('../assets/transparent-logo.webp', () => ({ default: 'mock-logo.png' }));

// Mock WalletContext for ConnectWalletPrompt
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

// ── PageBackground ─────────────────────────────────────────
describe('PageBackground', () => {
  it('renders grid and orb containers', () => {
    const { container } = renderWithProviders(<PageBackground />);
    expect(container.firstChild).toBeTruthy();
  });
});

// ── ConnectWalletPrompt ─────────────────────────────────────
describe('ConnectWalletPrompt', () => {
  let ConnectWalletPrompt;
  
  beforeEach(async () => {
    const mod = await import('../components/ConnectWalletPrompt');
    ConnectWalletPrompt = mod.default;
  });

  it('renders title and subtitle text', () => {
    renderWithProviders(
      <ConnectWalletPrompt
        icon={<span data-testid="icon">🔒</span>}
        title="Connect Required"
        subtitle="Please connect wallet"
        features={['Feature A', 'Feature B']}
      />
    );
    expect(screen.getByText('Connect Required')).toBeTruthy();
    expect(screen.getByText('Please connect wallet')).toBeTruthy();
    expect(screen.getByTestId('icon')).toBeTruthy();
  });

  it('renders all feature badges', () => {
    renderWithProviders(
      <ConnectWalletPrompt
        icon={<span>🔒</span>}
        title="Test"
        subtitle="Test"
        features={['ON-CHAIN', 'PERMANENT', 'STELLAR']}
      />
    );
    expect(screen.getByText('ON-CHAIN')).toBeTruthy();
    expect(screen.getByText('PERMANENT')).toBeTruthy();
    expect(screen.getByText('STELLAR')).toBeTruthy();
  });
});

// ── StarRating: StarDisplay ─────────────────────────────────
describe('StarDisplay', () => {
  it('renders correct number of stars (5 total)', () => {
    const { container } = renderWithProviders(<StarDisplay rating={3} />);
    const stars = container.querySelectorAll('svg');
    expect(stars.length).toBe(5);
  });

  it('renders 0 stars without crashing', () => {
    const { container } = renderWithProviders(<StarDisplay rating={0} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('accepts custom size prop', () => {
    const { container } = renderWithProviders(<StarDisplay rating={4} size={24} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('has proper ARIA label', () => {
    const { container } = renderWithProviders(<StarDisplay rating={3} />);
    const ratingGroup = container.querySelector('[role="img"]');
    expect(ratingGroup).toBeTruthy();
    expect(ratingGroup.getAttribute('aria-label')).toBe('3 out of 5 stars');
  });
});

// ── StarRating: StarInput ───────────────────────────────────
describe('StarInput', () => {
  const defaultProps = {
    rating: 0,
    hoveredStar: 0,
    onRate: vi.fn(),
    onHover: vi.fn(),
    onLeave: vi.fn(),
  };

  it('renders 5 interactive star buttons', () => {
    const { container } = renderWithProviders(
      <StarInput {...defaultProps} />
    );
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(5);
  });

  it('calls onRate when a star is clicked', () => {
    const onRate = vi.fn();
    const { container } = renderWithProviders(
      <StarInput {...defaultProps} onRate={onRate} />
    );
    const buttons = container.querySelectorAll('button');
    fireEvent.click(buttons[2]); // click 3rd star
    expect(onRate).toHaveBeenCalledWith(3);
  });

  it('has proper ARIA role for radiogroup', () => {
    const { container } = renderWithProviders(
      <StarInput {...defaultProps} rating={3} />
    );
    const group = container.querySelector('[role="radiogroup"]');
    expect(group).toBeTruthy();
  });

  it('marks correct star as aria-checked', () => {
    const { container } = renderWithProviders(
      <StarInput {...defaultProps} rating={4} />
    );
    const buttons = container.querySelectorAll('[role="radio"]');
    // aria-checked is true only for the exact rating value
    expect(buttons[3].getAttribute('aria-checked')).toBe('true');
    // Others should be false
    expect(buttons[0].getAttribute('aria-checked')).toBe('false');
  });
});

// ── TransactionSuccess ──────────────────────────────────────
describe('TransactionSuccess', () => {
  it('renders transaction hash and explorer link', () => {
    renderWithProviders(
      <TransactionSuccess
        txHash="ABC123TXHASH"
        title="Endorsement Sealed"
        subtitle="Recorded on Stellar"
      />
    );
    expect(screen.getByText('Endorsement Sealed')).toBeTruthy();
    expect(screen.getByText('ABC123TXHASH')).toBeTruthy();
  });

  it('renders explorer link with correct href', () => {
    renderWithProviders(
      <TransactionSuccess
        txHash="HASH_XYZ"
        title="Success"
        subtitle="Done"
      />
    );
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toContain('HASH_XYZ');
  });
});

// ── SkipToContent ───────────────────────────────────────────
describe('SkipToContent', () => {
  it('renders a skip link targeting #main-content', () => {
    renderWithProviders(<SkipToContent />);
    const link = screen.getByText(/skip to main content/i);
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('#main-content');
  });
});
