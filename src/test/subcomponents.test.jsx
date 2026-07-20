/**
 * Sub-Component Tests
 * Verifies that all extracted sub-components render without crashing
 * and contain correct ARIA attributes.
 */
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

vi.mock('../assets/transparent-logo.webp', () => ({ default: 'mock-logo.png' }));

const wrap = (ui) =>
  render(
    <MemoryRouter>
      <I18nextProvider i18n={i18n}>{ui}</I18nextProvider>
    </MemoryRouter>
  );

// Passthrough t function for components that receive it as prop
const t = (key, fallback) => fallback || key;

// ── Verify Sub-Components ──
describe('VerifySearchHeader', () => {
  it('renders search form with ARIA role', async () => {
    const { default: VerifySearchHeader } = await import(
      '../components/verify/VerifySearchHeader'
    );
    wrap(
      <VerifySearchHeader
        workerSearch=""
        setWorkerSearch={() => {}}
        isSearching={false}
        error={null}
        handleSearchSubmit={(e) => e.preventDefault()}
        t={t}
      />
    );
    expect(screen.getByRole('search')).toBeTruthy();
  });

  it('shows error message when error is provided', async () => {
    const { default: VerifySearchHeader } = await import(
      '../components/verify/VerifySearchHeader'
    );
    wrap(
      <VerifySearchHeader
        workerSearch=""
        setWorkerSearch={() => {}}
        isSearching={false}
        error="Worker not found"
        handleSearchSubmit={(e) => e.preventDefault()}
        t={t}
      />
    );
    expect(screen.getByRole('alert')).toBeTruthy();
    expect(screen.getByText('Worker not found')).toBeTruthy();
  });
});

// ── Explorer Sub-Components ──
describe('ExplorerSearchHero', () => {
  it('renders search input with ARIA label', async () => {
    const { default: ExplorerSearchHero } = await import(
      '../components/explorer/ExplorerSearchHero'
    );
    wrap(
      <ExplorerSearchHero
        searchQuery=""
        setSearchQuery={() => {}}
        isValidAddress={false}
        loading={false}
        handleSearch={(e) => e.preventDefault()}
        placeholderText="Search..."
        t={t}
      />
    );
    const searchRegion = screen.getByRole('search');
    expect(searchRegion).toBeTruthy();
  });
});

describe('ExplorerHowTo', () => {
  it('renders how-to region', async () => {
    const { default: ExplorerHowTo } = await import(
      '../components/explorer/ExplorerHowTo'
    );
    wrap(<ExplorerHowTo t={t} />);
    const region = screen.getByRole('region');
    expect(region).toBeTruthy();
  });
});

// ── Registration Sub-Components ──
describe('RegistrationConnectPrompt', () => {
  it('renders connect button', async () => {
    const { default: RegistrationConnectPrompt } = await import(
      '../components/registration/RegistrationConnectPrompt'
    );
    wrap(<RegistrationConnectPrompt connect={() => {}} t={t} />);
    const btn = screen.getByRole('button');
    expect(btn).toBeTruthy();
  });
});

describe('RegistrationForm', () => {
  it('renders form fields', async () => {
    const { default: RegistrationForm } = await import(
      '../components/registration/RegistrationForm'
    );
    wrap(
      <RegistrationForm
        formData={{ fullName: '', skillCategory: '', experience: '', city: '', bio: '' }}
        errors={{}}
        isMinting={false}
        txResult={null}
        filled={0}
        handleInputChange={() => {}}
        handleMint={() => {}}
        t={t}
      />
    );
    // Should have labeled form fields
    expect(screen.getByLabelText(/name/i) || document.getElementById('reg-fullName')).toBeTruthy();
  });
});

// ── WorkerProfile Sub-Components ──
describe('ProfileSidebar', () => {
  it('renders profile info', async () => {
    const { default: ProfileSidebar } = await import(
      '../components/worker-profile/ProfileSidebar'
    );
    wrap(
      <ProfileSidebar
        profile={{ name: 'Test Worker', skill: 'Plumber', city: 'Mumbai', experience: '5', bio: 'Test bio' }}
        address="GABCDE"
        endorsements={[]}
        copiedAddr={false}
        copiedShare={false}
        copyAddr={() => {}}
        shareProfile={() => {}}
        t={t}
      />
    );
    expect(screen.getByText('Test Worker')).toBeTruthy();
  });
});

describe('ProfileStatsRow', () => {
  it('renders stat region', async () => {
    const { default: ProfileStatsRow } = await import(
      '../components/worker-profile/ProfileStatsRow'
    );
    wrap(
      <ProfileStatsRow
        statAvgRating={4.5}
        statTotalReviews={10}
        statHighestScore={5}
        statWeightedScore={4.2}
        t={t}
      />
    );
    // The AnimatedStat component animates from 0, so just check the region renders
    expect(screen.getByRole('region')).toBeTruthy();
  });
});

// ── Navbar Sub-Components ──
describe('DesktopNavLinks', () => {
  it('renders nav links with menubar role', async () => {
    const { default: DesktopNavLinks } = await import(
      '../components/navbar/DesktopNavLinks'
    );
    wrap(
      <DesktopNavLinks
        navLinks={[
          { name: 'Home', path: '/' },
          { name: 'Discover', path: '/discover' },
        ]}
        location={{ pathname: '/' }}
      />
    );
    expect(screen.getByRole('menubar')).toBeTruthy();
    expect(screen.getAllByRole('menuitem')).toHaveLength(2);
  });
});
