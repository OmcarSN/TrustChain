# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev            # Vite dev server (localhost:5173)
npm run build          # Production build
npm run lint           # ESLint over the whole repo
npm test               # Run all Vitest suites once
npm run test:watch     # Vitest watch mode
npm run test:coverage  # Vitest with v8 coverage report
```

Run a single test file or test:

```bash
npx vitest run src/test/reputation.test.js
npx vitest run -t "calculateScore"     # by test name pattern
```

Soroban contracts (Rust, in `contracts/`) are built/deployed with the Stellar CLI outside npm:

```bash
cd contracts/credential && stellar contract build   # per-contract; also reputation, governance
```

## Architecture

TrustChain is a React 19 + Vite SPA that gives informal-economy workers an on-chain identity and reputation on **Stellar**. Data lives in two places: the **Stellar ledger** (immutable proof — credentials as ManageData entries, endorsements as transactions) and **Supabase** (fast queryable mirror of worker profiles and endorsements). Reads generally hit Supabase or Horizon; writes go to the ledger and are mirrored into Supabase.

### Network configuration — single source of truth
`src/lib/networkConfig.js` derives *everything* (Horizon URL, Soroban RPC, passphrase, explorer base, Freighter network name, contract IDs) from one env var: `VITE_STELLAR_NETWORK` (`testnet` | `mainnet`, defaults to testnet). Never hardcode network URLs or passphrases — import from here. `src/lib/stellar-config.js` is a thin backward-compat re-export; prefer `networkConfig` in new code. The serverless API layer (`api/`) has its own network resolution keyed off `STELLAR_NETWORK` (no `VITE_` prefix) and defaults to **mainnet**.

### Gasless transactions (fee sponsorship) — the core flow
Workers pay no fees. The sponsor's secret key (`SPONSOR_SECRET`) lives **only** in Vercel serverless functions (`api/`), never in the client bundle. Two patterns:
- **Sponsored mint** (`api/build-mint.js`): server builds a transaction sourced by the sponsor (fee payer), prepends a `CreateAccount` op if the worker's account doesn't exist, and enforces phone verification against Supabase `verified_phones` before building. Client then signs and submits.
- **Fee bump** (`api/fee-bump.js`): client signs an inner tx, server wraps it via `buildFeeBumpTransaction` (`src/utils/feeBump.js` — shared between client and API) so the sponsor pays the fee.

`src/lib/stellar.js` is the client-side orchestrator: `mintWorkerCredential`, `submitWorkerEndorsement`, `submitTransaction` (which polls Horizon via `waitForTransaction` to handle ledger indexing latency), plus Horizon result-code error extraction.

### Layering (`src/`)
- `lib/` — infrastructure: `freighter.js` (wallet API), `stellar.js` (tx orchestration), `supabase.js` + `supabaseData.js` (DB access, maps DB columns ↔ app shapes), `reputation.js` (pure `calculateScore`), `networkConfig.js`. `reputationContract.js` / `governanceContract.js` wrap Soroban contract calls.
- `context/WalletContext.jsx` — Freighter connection lifecycle, auto-reconnect, and a global wrong-network warning banner. Consume via `useWallet()`.
- `context/ToastContext.jsx` — app-wide toasts.
- `services/` — `eventParser.js` (Horizon tx → credential events), `indexer.js`.
- `hooks/` — `usePlatformStats`, `useHorizonMetrics` for live Horizon metrics.
- `pages/` — route components, all lazy-loaded in `App.jsx`. `utils/` — `validation.js`, `monitor.js` (logging), `stellar-errors.js`, `feeBump.js`.
- `i18n.js` — i18next with full English/Hindi localization; UI strings should be translated, not hardcoded.

### Serverless API (`api/`)
Vercel functions: `build-mint`, `fee-bump`, `send-otp`, `verify-otp` (Twilio phone verification → Supabase `verified_phones`). All share the same guards: POST-only, CORS locked to `ALLOWED_ORIGINS`, in-memory per-IP rate limiting, and `MAX_BODY_SIZE` checks. When adding an endpoint, follow this template.

### Data model (Supabase)
`workers` (keyed by `wallet_address`), `endorsements` (keyed by `worker_wallet` / `endorser_wallet`), `verified_phones` (phone↔wallet, 1-to-1). `supabaseData.js` translates snake_case DB columns to the camelCase shapes components expect — keep that mapping in one place. `src/scripts/migrate.js` is a one-time browser-console localStorage→Supabase migration.

## Conventions
- ESLint (`eslint.config.js`) has three scopes: browser globals for `src/`, Node globals for `api/`, Vitest+node globals for `src/test/`. `no-unused-vars` ignores capitalized/`motion` identifiers.
- The Stellar SDK, Supabase, recharts, and framer-motion are split into manual chunks in `vite.config.js` — the SDK is large, so avoid importing it into eagerly-loaded modules.
- CSP is defined in `vercel.json`; any new external origin (API, font, image host) must be added to `connect-src`/`font-src`/etc. there or requests will be blocked in production.
- Secrets: any `VITE_`-prefixed env var is embedded in the client bundle. Sponsor/Twilio/service secrets must **never** use the `VITE_` prefix.
