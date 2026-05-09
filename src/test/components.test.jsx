/**
 * Component Smoke Tests
 * Verifies that core UI components render without crashing
 * and display expected content.
 */
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

// ── Components ──
import ErrorBoundary from '../components/ErrorBoundary';
import TrustChainLogo from '../components/TrustChainLogo';

// Mock image imports for Vitest/jsdom
vi.mock('../assets/trustchain-logo.png', () => ({ default: 'mock-logo.png' }));

const renderWithProviders = (ui) =>
  render(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        {ui}
      </I18nextProvider>
    </BrowserRouter>
  );

describe('ErrorBoundary', () => {
  it('renders children when no error occurs', () => {
    renderWithProviders(
      <ErrorBoundary>
        <div data-testid="child">Hello</div>
      </ErrorBoundary>
    );
    expect(screen.getByTestId('child')).toBeTruthy();
    expect(screen.getByText('Hello')).toBeTruthy();
  });

  it('renders error fallback when child throws', () => {
    const ThrowError = () => { throw new Error('test error'); };
    // Suppress console.error for expected error
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    renderWithProviders(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(screen.getByText('System Fault')).toBeTruthy();
    spy.mockRestore();
  });
});

describe('TrustChainLogo', () => {
  it('renders with default size', () => {
    renderWithProviders(<TrustChainLogo />);
    const img = screen.getByAltText('TrustChain Logo');
    expect(img).toBeTruthy();
    expect(img.getAttribute('width')).toBe('40');
  });

  it('renders with custom size', () => {
    renderWithProviders(<TrustChainLogo size={64} />);
    const img = screen.getByAltText('TrustChain Logo');
    expect(img.getAttribute('width')).toBe('64');
  });
});
