/**
 * Page Smoke Tests
 * Verifies that every page component renders without crashing
 * under the required provider context (Router, I18n, Wallet, Toast).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

// ── Mock heavy externals ──
vi.mock('../lib/stellar', () => ({
  fetchWorkerCredential: vi.fn(),
  mintWorkerCredential: vi.fn(),
  fetchAllWorkers: vi.fn().mockResolvedValue([]),
}));
vi.mock('../lib/freighter', () => ({
  getWalletAddress: vi.fn().mockResolvedValue(null),
  getFreighterNetwork: vi.fn().mockResolvedValue('TESTNET'),
  connectWallet: vi.fn().mockResolvedValue('GABCDE'),
}));
vi.mock('../assets/trustchain-logo.png', () => ({ default: 'mock-logo.png' }));
vi.mock('../lib/toast', () => ({ registerToastInstance: vi.fn() }));

// ── Provide all required contexts ──
import { WalletProvider } from '../context/WalletContext';
import { ToastProvider } from '../context/ToastContext';

const AllProviders = ({ children, initialRoute = '/' }) => (
  <MemoryRouter initialEntries={[initialRoute]}>
    <I18nextProvider i18n={i18n}>
      <WalletProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </WalletProvider>
    </I18nextProvider>
  </MemoryRouter>
);

const renderPage = (ui, route = '/') =>
  render(<AllProviders initialRoute={route}>{ui}</AllProviders>);

// ── Landing ──
describe('Page: Landing', () => {
  it('renders without crashing', async () => {
    // Polyfill IntersectionObserver for jsdom
    global.IntersectionObserver = class {
      constructor() {}
      observe() {}
      unobserve() {}
      disconnect() {}
    };
    const { default: Landing } = await import('../pages/Landing');
    const { container } = renderPage(<Landing />);
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });
});

// ── Dashboard ──
describe('Page: Dashboard', () => {
  it('renders without crashing', async () => {
    const { default: Dashboard } = await import('../pages/Dashboard');
    const { container } = renderPage(<Dashboard />);
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });
});

// ── Explorer ──
describe('Page: Explorer', () => {
  it('renders without crashing', async () => {
    const { default: Explorer } = await import('../pages/Explorer');
    const { container } = renderPage(<Explorer />, '/explorer');
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it('contains a search input', async () => {
    const { default: Explorer } = await import('../pages/Explorer');
    renderPage(<Explorer />, '/explorer');
    // Search input has role="search" on the form and textbox input inside
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThan(0);
  });
});

// ── Verify ──
describe('Page: Verify', () => {
  it('renders without crashing', async () => {
    const { default: Verify } = await import('../pages/Verify');
    const { container } = renderPage(<Verify />, '/verify');
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it('has search form', async () => {
    const { default: Verify } = await import('../pages/Verify');
    renderPage(<Verify />, '/verify');
    const form = screen.getByRole('search') || document.querySelector('form');
    expect(form).toBeTruthy();
  });
});

// ── WorkerRegistration (disconnected state) ──
describe('Page: WorkerRegistration', () => {
  it('renders connect prompt when wallet disconnected', async () => {
    const { default: WorkerRegistration } = await import('../pages/WorkerRegistration');
    renderPage(<WorkerRegistration />, '/worker');
    // Should show connect button
    const btn = screen.getByRole('button', { name: /connect/i });
    expect(btn).toBeTruthy();
  });
});

// ── WorkerProfile ──
describe('Page: WorkerProfile', () => {
  it('renders without crashing', async () => {
    const { default: WorkerProfile } = await import('../pages/WorkerProfile');
    const { container } = renderPage(<WorkerProfile />, '/profile/GABCDE');
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });
});

// ── Endorse ──
describe('Page: Endorse', () => {
  it('renders without crashing', async () => {
    const { default: Endorse } = await import('../pages/Endorse');
    const { container } = renderPage(<Endorse />, '/endorse');
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });
});
