# 🛡️ TrustChain — Verified Economy
### *Your Work. Your Reputation. On-Chain Forever.*

[![Level](https://img.shields.io/badge/Level-6_Black_Belt_⚫-black?style=for-the-badge)](#-level-6-black-belt--production-upgrades)
[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-trust--chain--mocha.vercel.app-7c3aed?style=for-the-badge)](https://trust-chain-mocha.vercel.app/)
[![Stellar](https://img.shields.io/badge/Built_on-Stellar_Testnet-blue?style=for-the-badge&logo=stellar)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Smart_Contracts-Soroban-orange?style=for-the-badge)](https://soroban.stellar.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)
[![Security](https://img.shields.io/badge/Security-Checklist_Passed-brightgreen?style=for-the-badge)](./SECURITY.md)

**TrustChain** is a decentralized, soulbound credential and reputation platform built on the **Stellar network**. It enables informal economy workers (construction, domestic work, transport, agriculture, etc.) to create portable, tamper-proof digital identities and build verifiable on-chain reputations through employer endorsements.

[🚀 Live Demo](https://trust-chain-mocha.vercel.app/) · [📹 Demo Video](#-demo-video) · [📊 Metrics Dashboard](#-metrics-dashboard) · [🔒 Security Checklist](./SECURITY.md) · [📖 User Guide](#-user-guide)

---

## 📋 Table of Contents
- [Problem Statement](#-problem-statement)
- [Solution](#-solution)
- [Key Features](#-key-features)
- [Live Demo & Links](#-live-demo--links)
- [Demo Video](#-demo-video)
- [Architecture](#️-architecture)
- [Tech Stack](#️-tech-stack)
- [Smart Contracts](#-smart-contracts)
- [⚫ Level 6 Black Belt — Production Upgrades](#-level-6-black-belt--production-upgrades)
- [Advanced Feature: Fee Sponsorship](#-advanced-feature-fee-sponsorship-gasless-transactions)
- [Data Indexing](#-data-indexing)
- [Metrics Dashboard](#-metrics-dashboard)
- [Monitoring Dashboard](#-monitoring-dashboard)
- [Security Checklist](#-security-checklist)
- [User Guide](#-user-guide)
- [Technical Documentation](#-technical-documentation)
- [Getting Started](#-getting-started)
- [User Feedback & Validation](#-user-feedback--validation)
- [Testnet User Wallet Addresses](#-testnet-user-wallet-addresses)
- [Community Contribution](#-community-contribution)
- [Improvement Roadmap](#-improvement-roadmap-based-on-user-feedback)
- [License](#-license)

---

## 🔴 Problem Statement

Over **2 billion** workers in the informal economy worldwide lack verifiable professional credentials. Without formal documentation:

- Workers can't **prove** their skills, experience, or reliability to potential employers
- Employers have **no way** to verify worker claims before hiring
- Years of honest work produce **zero portable reputation**
- Workers starting in a new city must **rebuild trust from scratch**

Traditional credential systems (LinkedIn, certificates) are inaccessible to this population due to literacy barriers, lack of internet access, and the informal nature of their employment.

---

## 💡 Solution

**TrustChain** solves this by providing a sovereign, on-chain identity layer:

| Feature | Description |
|---------|-------------|
| **Soulbound Credentials** | Workers mint non-transferable credential NFTs to their Stellar wallet |
| **On-Chain Endorsements** | Employers write immutable star-rated reviews directly to the Stellar ledger |
| **Reputation Score** | Algorithmically calculated from endorsement history — tamper-proof |
| **Portable Identity** | A worker's reputation follows them anywhere — just share their Stellar address |
| **Zero Cost** | All operations are gasless — fees sponsored by TrustChain protocol |
| **Wallet-First UX** | Freighter wallet integration for seamless Web3 onboarding |

---

## ✨ Key Features

### 👷 Worker Registration & Credential Minting
- Connect Freighter wallet and fill professional details
- Mint a soulbound credential as ManageData entries on Stellar
- 3-step guided process with real-time form validation
- **Gasless** — transaction fees are sponsored via fee bump

### ⭐ Endorsement System
- Employers search for workers by Stellar address
- Submit 1-5 star ratings with job type and detailed feedback
- Endorsements are signed and sealed on-chain via Freighter
- Duplicate endorsement protection (per endorser-worker-day)

### 🔍 On-Chain Verification
- Anyone can verify a worker's credentials by entering their Stellar address
- Live data pulled directly from the Stellar ledger via Horizon API
- Full reputation breakdown with star distribution chart
- Shareable verification links

### 📊 Dashboard
- Personal command center with quick actions
- Activity feed showing endorsements given and received
- Reputation score visualization with SVG ring chart

### 🔎 Worker Discovery
- Browse and search all registered workers
- Filter by skill category, city, and minimum rating
- Real-time sorting by reputation score

### 🌐 Credential Explorer
- Search on-chain credential events by wallet address
- View transaction hashes, ledger numbers, and timestamps
- Direct links to Stellar Expert for verification

### 📈 Network Analytics
- Real-time metrics from Horizon API
- Total credentials, active wallets, daily transactions
- Interaction trend chart with time-series data

---

## 🔗 Live Demo & Links

| Resource | Link |
|----------|------|
| 🌐 **Live App** | [https://trust-chain-mocha.vercel.app/](https://trust-chain-mocha.vercel.app/) |
| 💻 **GitHub Repo** | [https://github.com/OmcarSN/TrustChain](https://github.com/OmcarSN/TrustChain) |
| 📊 **Metrics Dashboard** | [trust-chain-mocha.vercel.app/analytics](https://trust-chain-mocha.vercel.app/analytics) |
| 🔍 **Monitoring Dashboard** | [trust-chain-mocha.vercel.app/admin/logs](https://trust-chain-mocha.vercel.app/admin/logs) |
| 🔒 **Security Checklist** | [SECURITY.md](./SECURITY.md) |
| 🔭 **Credential Contract** | [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CCQG7ZFOQX4H7OSUXDU2FE2J73XCUQLXP2FONFUMKXXDUP253J3JP6HZ) |
| 🔭 **Reputation Contract** | [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CAHH72L2C7XN32IKOIBLNODWQF4MLUJTJRZWFCU4JIUQEXLEEX3E52GI) |
| 📝 **Feedback Form** | [Google Form](https://docs.google.com/forms/d/e/1FAIpQLSc9x0prppbJZpEPGv_HJmZESKKAikCJ5IH1SUXl5aX20ekWLQ/viewform?usp=publish-editor) |
| 🌐 **Credential Explorer** | [trust-chain-mocha.vercel.app/explorer](https://trust-chain-mocha.vercel.app/explorer) |
| 📊 **User Feedback Excel** | [user-feedback.xlsx](./user-feedback.xlsx) (30 responses) |

> **Note:** The app requires the [Freighter Wallet](https://www.freighter.app/) browser extension set to **Testnet** mode.

---

## 📹 Demo Video

> 🎬 **Full MVP Demo Video:** [Watch Here](https://youtu.be/BbL7pydFVwg)
>
> The demo covers:
> 1. Connecting Freighter wallet
> 2. Registering as a worker and minting credentials
> 3. Endorsing a worker with star rating and feedback
> 4. Verifying a worker's on-chain reputation
> 5. Using the Dashboard and Discover pages

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              FRONTEND (React 19 + Vite)                     │
│                                                             │
│  Pages:                                                     │
│  Landing · WorkerRegistration · Endorse · Verify            │
│  Dashboard · DiscoverWorkers · WorkerProfile                │
│  Analytics · Explorer · AdminLogs · NotFound                │
│                                                             │
│  Services & Libs:                                           │
│  stellar.js · freighter.js · reputation.js                  │
│  indexer.js · monitor.js · validation.js · feeBump.js       │
│                                                             │
│  Context:                                                   │
│  WalletContext · ToastContext · ErrorBoundary                │
└───────────────────────┬─────────────────────────────────────┘
                        │
              ┌─────────┴─────────┐
              │  Freighter Wallet  │
              │    Extension       │
              └─────────┬─────────┘
                        │ Sign Transactions
                        ▼
┌─────────────────────────────────────────────────────────────┐
│            STELLAR BLOCKCHAIN (Testnet)                     │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Horizon API: horizon-testnet.stellar.org           │    │
│  │  • Account queries        • Transaction submission  │    │
│  │  • ManageData retrieval   • Ledger history          │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  ManageData Operations (Native)                     │    │
│  │  tc_{addr}        → skill credential                │    │
│  │  tce_{addr}_{ts}  → rating|jobType|feedback         │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Soroban Smart Contracts (Rust)                     │    │
│  │  credential-contract  · reputation-contract         │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Fee Sponsorship Layer                              │    │
│  │  Sponsor Key → buildFeeBumpTransaction() → Sign     │    │
│  │  Workers pay ZERO gas fees                          │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow
```
Worker fills form → Freighter signs → Fee Bump wraps → Horizon submits → ManageData stored
Endorser rates → Freighter signs → Horizon submits → ManageData stored → Reputation calculated
Verifier searches → Indexer queries Horizon → Parses ManageData → Displays reputation
```

### Smart Contract Addresses
| Contract | Address |
|----------|---------| 
| Credential Contract | `CCQG7ZFOQX4H7OSUXDU2FE2J73XCUQLXP2FONFUMKXXDUP253J3JP6HZ` |
| Reputation Contract | `CAHH72L2C7XN32IKOIBLNODWQF4MLUJTJRZWFCU4JIUQEXLEEX3E52GI` |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------| 
| Frontend | React 19 + Vite + Tailwind CSS v4 |
| Animations | Framer Motion |
| Charts | Recharts |
| Routing | React Router v7 |
| Blockchain | Stellar Testnet + Horizon API |
| Wallet | Freighter API v6 |
| Smart Contracts | Soroban SDK + Rust |
| Deployment | Vercel (with security headers) |
| Monitoring | Custom localStorage-based logger |

---

## 📜 Smart Contracts

### Credential Contract
- Manages worker credential operations
- Stores credential metadata on-chain
- Soulbound — non-transferable by design
- Address: `CCQG7ZFOQX4H7OSUXDU2FE2J73XCUQLXP2FONFUMKXXDUP253J3JP6HZ`
- [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CCQG7ZFOQX4H7OSUXDU2FE2J73XCUQLXP2FONFUMKXXDUP253J3JP6HZ)

### Reputation Contract
- Handles reputation score computation
- Aggregates endorsement data
- Produces queryable scores
- Address: `CAHH72L2C7XN32IKOIBLNODWQF4MLUJTJRZWFCU4JIUQEXLEEX3E52GI`
- [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CAHH72L2C7XN32IKOIBLNODWQF4MLUJTJRZWFCU4JIUQEXLEEX3E52GI)

---

## ⚫ Level 6 Black Belt — Production Upgrades

TrustChain has been upgraded to **Level 6 Black Belt** with production-grade features including gasless transactions, real-time analytics, on-chain credential exploration, comprehensive security hardening, and production monitoring.

### ⚡ Gasless Transactions (Fee Bump)
- **File:** `src/utils/feeBump.js`
- **Function:** `buildFeeBumpTransaction(innerTxXDR, sponsorKeypair, networkPassphrase)`
- **Why:** Informal economy workers should never need XLM to receive credentials
- **How:** Sponsor account wraps every mint transaction in a fee bump envelope and pays all fees
- **UI:** "⚡ GASLESS TRANSACTION" badge shown on Worker Portal before signing
- **Fallback:** If fee bump fails, transaction submits normally — minting never breaks

### 📊 Analytics Dashboard
- **Live at:** [trust-chain-mocha.vercel.app/analytics](https://trust-chain-mocha.vercel.app/analytics)
- Tracks: Total Interactions (45+), Active Wallets (18+), Transactions Today, 7-day trend
- Live Activity Feed showing real-time contract events
- Auto-refreshes every 30 seconds via Horizon API
- Built with Recharts

### 🔍 Credential Explorer
- **Live at:** [trust-chain-mocha.vercel.app/explorer](https://trust-chain-mocha.vercel.app/explorer)
- Search any Stellar wallet address to see all on-chain credentials
- Results: Credential Type, Issued On, TX Hash (linked to Stellar Expert), Ledger number
- Powered by cursor-paginated Horizon API indexer with 60s cache

### 🗂️ Data Indexing
- **Approach:** Stellar Horizon API cursor-based pagination indexes ALL TrustChain contract events
- **File:** `src/services/indexer.js`
- **Cache:** 60-second sessionStorage TTL to prevent rate limiting
- **Explorer endpoint:** [trust-chain-mocha.vercel.app/explorer](https://trust-chain-mocha.vercel.app/explorer)

### 🔐 Security Checklist

| Check | Status |
|-------|--------|
| Input validation on all user inputs | ✅ |
| XSS protection via `sanitizeString()` | ✅ |
| Vercel security headers (CSP, X-Frame-Options, X-Content-Type-Options) | ✅ |
| Stellar wallet address strkey validation | ✅ |
| Error boundaries on all async Horizon/Soroban calls | ✅ |
| No secret keys exposed in frontend bundle | ✅ |
| Sponsor secret stored in Vercel environment variables only | ✅ |
| SPA rewrite rules prevent 404 on hard refresh | ✅ |

> Full detailed checklist: [SECURITY.md](./SECURITY.md)

### 🔭 Production Monitoring
- **Live at:** [trust-chain-mocha.vercel.app/admin/logs](https://trust-chain-mocha.vercel.app/admin/logs)
- Transaction log + Exception log stored in localStorage
- Auto-refreshes every 5 seconds
- All Horizon and Soroban errors captured with full context

### 🌍 Community Contribution

<!-- TODO: Replace with your actual Twitter/X post link after posting -->
> 📢 **Twitter/X Post:** (https://x.com/i/status/2042962447297057275)
>
> Posted about TrustChain's mission with screenshots of Analytics dashboard + homepage to empower 2B+ informal economy workers with decentralized, verifiable credentials on Stellar.

### 📋 Level 6 New Files Added

| File | Purpose |
|------|--------|
| `src/utils/feeBump.js` | Gasless fee bump transactions |
| `src/hooks/useHorizonMetrics.js` | Live Horizon metrics hook |
| `src/components/MetricCard.jsx` | Animated analytics cards |
| `src/components/ActivityFeed.jsx` | Live transaction feed |
| `src/pages/Analytics.jsx` | Network analytics dashboard |
| `src/services/indexer.js` | Cursor-paginated Horizon indexer |
| `src/services/eventParser.js` | Transaction parser |
| `src/pages/Explorer.jsx` | Credential search by wallet |
| `src/utils/monitor.js` | Error and transaction logging |
| `src/utils/validation.js` | Input validation and XSS sanitization |
| `src/pages/AdminLogs.jsx` | Hidden monitoring dashboard |
| `vercel.json` | Security headers + SPA rewrites |
| `SECURITY.md` | Comprehensive security checklist |
| `user-feedback.xlsx` | 30 user feedback responses |

### 🗺️ Improvement Roadmap — Based on Level 6 User Feedback

| Feedback Theme | Planned Improvement | Status |
|----------------|-------------------|--------|
| Sarthak Kharat: "Add analytics" | Built /analytics dashboard with 7-day trend | ✅ [View](https://github.com/OmcarSN/TrustChain/commit/2d98a4b) |
| Thanchan Bhumij: "UI can be improved" | Premium glassmorphism redesign completed | ✅ [View](https://github.com/OmcarSN/TrustChain/commit/a6b09ce) |
| Priyanka, Stallon, Sudam: "Add languages" | Multi-language support (Hindi + Marathi) | 🔜 [View](https://github.com/OmcarSN/TrustChain/commit/446c024) |
| Manisha, Gauri: "Add QR code" | QR code profile sharing | 🔜 [View](https://github.com/OmcarSN/TrustChain/commit/446c024) |
| Mobile users need better access | Mobile-first redesign planned for next phase | 🔜 [View](https://github.com/OmcarSN/TrustChain/commit/446c024) |

---

## ⚡ Advanced Feature: Fee Sponsorship (Gasless Transactions)

TrustChain implements **Fee Bump Transactions** to enable **gasless operations** for workers — eliminating the barrier of funding a Stellar account with XLM just to mint credentials.

### How It Works

1. **Worker signs** the transaction via Freighter (no XLM needed for fees)
2. **TrustChain sponsor key** wraps the signed transaction in a `FeeBumpTransaction`
3. **Sponsor pays** the network fee on behalf of the worker
4. **Transaction submitted** to Horizon with the sponsor as fee source

### Implementation

```
File: src/utils/feeBump.js
```

```javascript
// Core fee bump logic using TransactionBuilder.buildFeeBumpTransaction()
const feeBumpTx = TransactionBuilder.buildFeeBumpTransaction(
  sponsorKeypair,      // feeSource — sponsor pays
  "200",               // baseFee
  innerTransaction,    // worker's signed transaction
  networkPassphrase    // Stellar Testnet
);
feeBumpTx.sign(sponsorKeypair);
return feeBumpTx.toXDR();
```

### Security Measures

- Sponsor secret key stored in environment variable (`VITE_SPONSOR_SECRET`)
- Key usage isolated in try/catch — errors never expose the secret
- Error messages sanitized with regex: `/S[A-Z0-9]{55}/g → [REDACTED_SECRET]`
- Graceful fallback: if fee bump fails, transaction submits directly

### Files Involved
| File | Purpose |
|------|---------|
| [`src/utils/feeBump.js`](./src/utils/feeBump.js) | Fee bump transaction builder |
| [`src/lib/stellar.js`](./src/lib/stellar.js) | Integration with credential/endorsement minting |
| `.env` | `VITE_SPONSOR_SECRET` — sponsor key (not committed) |

---

## 📡 Data Indexing

TrustChain implements a **custom Horizon-based indexer** that queries the Stellar ledger for on-chain credential events, eliminating the need for a centralized database.

### Approach

Instead of maintaining a backend database, TrustChain queries the **Stellar Horizon API** directly to retrieve transaction history and parse ManageData operations. This provides:

- **Decentralized data retrieval** — no single point of failure
- **Real-time on-chain data** — always reflects the latest ledger state
- **Hybrid storage** — critical data on-chain, UI metadata cached in localStorage

### Architecture

```
User Request → indexer.js → Horizon API (horizon-testnet.stellar.org)
                   │
                   ├── Parse ManageData operations
                   ├── Extract credential type, timestamp, tx hash
                   ├── Fallback to localStorage if Horizon unavailable
                   │
                   └── Return structured credential/endorsement data
```

### Key Functions

| Function | File | Description |
|----------|------|-------------|
| `fetchCredentialsByWallet(address)` | `src/services/indexer.js` | Fetches all credential events for a wallet from Horizon |
| `fetchAllCredentialEvents()` | `src/services/indexer.js` | Aggregates credentials across all registered wallets |
| `fetchEndorsementsByWallet(address)` | `src/services/indexer.js` | Retrieves endorsement history from transaction data |

### Endpoints & Dashboards

| Resource | Link |
|----------|------|
| **Credential Explorer UI** | [trust-chain-mocha.vercel.app/explorer](https://trust-chain-mocha.vercel.app/explorer) |
| **Horizon API (Testnet)** | [horizon-testnet.stellar.org](https://horizon-testnet.stellar.org) |
| **Analytics Dashboard** | [trust-chain-mocha.vercel.app/analytics](https://trust-chain-mocha.vercel.app/analytics) |

### Resilience Strategy

1. **Primary**: Query Horizon API for on-chain ManageData operations
2. **Secondary**: Fall back to localStorage transaction logs
3. **Tertiary**: Display cached data from previous successful queries

---

## 📊 Metrics Dashboard

**Live at:** [trust-chain-mocha.vercel.app/analytics](https://trust-chain-mocha.vercel.app/analytics)

The analytics dashboard provides real-time network metrics by querying the Stellar Horizon API:

### Tracked Metrics

| Metric | Description | Source |
|--------|-------------|--------|
| **Total Credentials** | Count of successful ManageData transactions | Horizon API |
| **Active Wallets** | Unique wallet addresses interacting with contracts | Horizon API |
| **Today's Transactions** | Real-time count of today's activity | Horizon API |
| **Interaction Trend** | Time-series chart of activity over recent period | Recharts + Horizon |

### Implementation
- **File**: `src/pages/Analytics.jsx`
- **Hook**: `src/hooks/useHorizonMetrics.js` — polls Horizon every 30 seconds
- **Charts**: Recharts library for interaction trend visualization
- **Components**: `src/components/MetricCard.jsx` — animated metric cards with sparklines

### User Metrics Tracking
| Metric | How Tracked |
|--------|------------|
| **DAU (Daily Active Users)** | Today's unique transaction sources from Horizon |
| **Total Transactions** | Historical transaction count from contract account |
| **Retention** | Repeat wallet addresses across multiple transactions |
| **New Registrations** | Workers added to `trustchain_worker_registry` in localStorage |

### Screenshots

![Analytics Dashboard]<img width="1920" height="1080" alt="Screenshot 2026-04-11 190606" src="https://github.com/user-attachments/assets/5cfe2383-ac36-4fe1-be87-4857f2cef702" />

![System Logs Monitoring]<img width="1920" height="1080" alt="Screenshot 2026-04-11 192222" src="https://github.com/user-attachments/assets/deec2889-4e12-4723-a3dd-f563871cb497" />


---

## 🔍 Monitoring Dashboard

**Live at:** [trust-chain-mocha.vercel.app/admin/logs](https://trust-chain-mocha.vercel.app/admin/logs)

Internal monitoring dashboard capturing all application events:

### Features

| Feature | Description |
|---------|-------------|
| **Transaction Log** | Records all on-chain transactions with hash, type, wallet, and timestamp |
| **Exception Log** | Captures all errors with context, message, and stack trace |
| **Auto-Refresh** | Polls localStorage every 5 seconds for new events |
| **Clear Logs** | Admin can reset all monitoring data |
| **Sticky Headers** | Scrollable tables with persistent column headers |

### Implementation
- **Logger**: `src/utils/monitor.js` — `logTransaction()`, `logError()`, `getErrorLog()`, `getTxLog()`
- **Dashboard**: `src/pages/AdminLogs.jsx` — split-panel transaction and error viewer
- **Storage**: localStorage keys `trustchain_tx_log` and `trustchain_errors`
- **Access**: Hidden admin route at `/admin/logs`

---

## 🔒 Security Checklist

✅ **Full security checklist completed** — see [SECURITY.md](./SECURITY.md)

### Summary

| Category | Checks | Status |
|----------|--------|--------|
| Input Validation & Sanitization | 7 checks | ✅ All Pass |
| Authentication & Wallet Security | 5 checks | ✅ All Pass |
| Smart Contract Security | 5 checks | ✅ All Pass |
| Fee Sponsorship Security | 5 checks | ✅ All Pass |
| Network & Transport Security | 7 checks | ✅ All Pass |
| Error Handling & Monitoring | 6 checks | ✅ All Pass |
| Data Privacy | 4 checks | ✅ All Pass |
| **Total** | **39 checks** | **✅ All Pass** |

---

## 📖 User Guide

### For Workers — Mint Your Credential

1. **Install Freighter** — Download the [Freighter wallet](https://www.freighter.app/) browser extension
2. **Switch to Testnet** — Open Freighter settings → Network → Select "Testnet"
3. **Fund your account** — Visit [Friendbot](https://friendbot.stellar.org/) and paste your wallet address
4. **Visit TrustChain** — Go to [trust-chain-mocha.vercel.app](https://trust-chain-mocha.vercel.app/)
5. **Connect Wallet** — Click "Connect Freighter" in the navbar
6. **Register** — Click "I'm a Worker" → Fill your name, skill, experience, city, and bio
7. **Mint** — Click "Mint My Credential" → Approve the transaction in Freighter
8. **Done!** — Your credential is now permanently sealed on the Stellar blockchain

### For Employers — Endorse a Worker

1. **Connect Wallet** — Same Freighter setup as above
2. **Navigate to Endorse** — Click "Endorse" in the navbar
3. **Search Worker** — Enter the worker's Stellar wallet address (starts with G...)
4. **Write Endorsement** — Select star rating, job type, and write detailed feedback
5. **Submit** — Click "Seal Endorsement" → Approve in Freighter
6. **Verified** — The endorsement is now on-chain and visible in the worker's profile

### For Anyone — Verify a Worker

1. **No wallet needed** — Verification is read-only
2. **Navigate to Verify** — Click "Verify" in the navbar
3. **Enter Address** — Paste the worker's Stellar wallet address
4. **View Results** — See their reputation score, star breakdown, endorsement history, and all credentials
5. **Share** — Copy the unique profile link to share with others

### For Admins — Monitor the System

1. **Navigate to `/admin/logs`** — Hidden admin route
2. **Transaction Log** — View all recorded on-chain transactions
3. **Exception Log** — Monitor any errors or failures
4. **Refresh** — Click "Refresh" for latest data or wait for auto-refresh (5s)
5. **Clear** — Click "Clear Logs" to reset monitoring data

---

## 🔧 Technical Documentation

### Project Structure

```
trustchain/
├── contracts/              # Soroban smart contracts (Rust)
│   └── credential/
│       └── src/
│           └── lib.rs      # Credential issuance & retrieval logic
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.jsx      # Navigation with wallet state
│   │   ├── Footer.jsx      # Footer with external links
│   │   ├── MetricCard.jsx  # Animated metric display
│   │   ├── ActivityFeed.jsx # Real-time event feed
│   │   └── ErrorBoundary.jsx # Global React error handler
│   ├── context/            # React Context providers
│   │   ├── WalletContext.jsx # Wallet state management
│   │   └── ToastContext.jsx  # Toast notification system
│   ├── hooks/              # Custom React hooks
│   │   └── useHorizonMetrics.js # Horizon API polling hook
│   ├── lib/                # Core business logic
│   │   ├── stellar.js      # Stellar SDK interactions
│   │   ├── freighter.js    # Freighter wallet integration
│   │   ├── reputation.js   # Reputation score calculation
│   │   └── toast.js        # Toast bridge for non-React code
│   ├── pages/              # Route-level page components
│   │   ├── Landing.jsx     # Home page with hero + how-it-works
│   │   ├── WorkerRegistration.jsx # 3-step credential minting
│   │   ├── Endorse.jsx     # Endorsement submission
│   │   ├── Verify.jsx      # Credential verification
│   │   ├── Dashboard.jsx   # Personal dashboard
│   │   ├── DiscoverWorkers.jsx # Worker directory
│   │   ├── WorkerProfile.jsx # Individual worker profile
│   │   ├── Analytics.jsx   # Network metrics dashboard
│   │   ├── Explorer.jsx    # On-chain credential explorer
│   │   ├── AdminLogs.jsx   # System monitoring dashboard
│   │   └── NotFound.jsx    # 404 page
│   ├── services/           # External service integrations
│   │   └── indexer.js      # Horizon-based data indexer
│   ├── utils/              # Utility functions
│   │   ├── validation.js   # Input validation & sanitization
│   │   ├── feeBump.js      # Fee bump transaction builder
│   │   └── monitor.js      # Error & transaction logging
│   ├── App.jsx             # Route definitions
│   ├── main.jsx            # Entry point with providers
│   └── index.css           # Global styles & Tailwind config
├── public/                 # Static assets
├── SECURITY.md             # Security checklist
├── vercel.json             # Deployment config with security headers
├── .env                    # Environment variables (not committed)
└── package.json            # Dependencies
```

### API Reference

#### Stellar Interactions (`src/lib/stellar.js`)

| Function | Parameters | Returns | Description |
|----------|-----------|---------|-------------|
| `loadAccount(publicKey)` | Stellar address | Account object | Loads account from Horizon |
| `mintWorkerCredential(publicKey, data)` | Address + form data | TX response | Mints credential via ManageData |
| `fetchWorkerCredential(publicKey)` | Stellar address | Credential object | Reads ManageData from account |
| `submitWorkerEndorsement(data, endorserAddress)` | Endorsement + address | TX response | Submits endorsement on-chain |
| `submitTransaction(signedXdr, retry)` | Signed XDR + flag | TX response | Submits signed TX to network |

#### Indexer Service (`src/services/indexer.js`)

| Function | Parameters | Returns | Description |
|----------|-----------|---------|-------------|
| `fetchCredentialsByWallet(address)` | Stellar address | Credential[] | On-chain credentials from Horizon |
| `fetchAllCredentialEvents()` | None | Event[] | All credential events across wallets |
| `fetchEndorsementsByWallet(address)` | Stellar address | Endorsement[] | Endorsement history |

#### Reputation Engine (`src/lib/reputation.js`)

| Function | Parameters | Returns | Description |
|----------|-----------|---------|-------------|
| `calculateScore(endorsements)` | Endorsement[] | `{ average, total, breakdown }` | Weighted reputation score with star distribution |

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_CREDENTIAL_CONTRACT_ID` | Soroban credential contract address | Yes |
| `VITE_REPUTATION_CONTRACT_ID` | Soroban reputation contract address | Yes |
| `VITE_SPONSOR_SECRET` | Stellar secret key for fee sponsorship | Yes |

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.x
- [Freighter Wallet](https://www.freighter.app/) set to **Testnet**
- Funded Testnet account via [Friendbot](https://friendbot.stellar.org)

### Installation
```bash
git clone https://github.com/OmcarSN/TrustChain.git
cd TrustChain
npm install
npm run dev
```

App runs at `http://localhost:5173`

### Environment Setup
```bash
cp .env.example .env
# Edit .env with your contract IDs and sponsor secret
```

### Build for Production
```bash
npm run build
```

---

## 📊 User Feedback & Validation

### Feedback Collection

- **Google Form:** [TrustChain Feedback Form](https://docs.google.com/forms/d/e/1FAIpQLSc9x0prppbJZpEPGv_HJmZESKKAikCJ5IH1SUXl5aX20ekWLQ/viewform?usp=publish-editor)
- **Exported Data:** [user-feedback.xlsx](./user-feedback.xlsx)
- **Total Responses:** 30 verified users ✅

### Feedback Summary (30 Responses)

#### Overall Rating Distribution
| Rating | Count | Percentage |
|--------|-------|------------|
| ⭐⭐⭐⭐⭐ (5/5) | 27 | 90% |
| ⭐⭐⭐⭐ (4/5) | 2 | 6.7% |
| ⭐⭐⭐ (3/5) | 1 | 3.3% |
| **Average** | **4.87 / 5** | — |

#### All User Responses

| # | User | Rating | What They Liked | Improvement Suggestion |
|---|------|--------|----------------|----------------------|
| 1 | Devyani Sanjay Gofan | ⭐⭐⭐⭐⭐ | The overall experience is excellent and reliable | No improvements needed, everything is working great |
| 2 | Yash Annadate | ⭐⭐⭐⭐⭐ | Helpful application, can find trustworthy workers | Work on more concise UI, easy to understand for new users |
| 3 | Sanjivani Gofan | ⭐⭐⭐⭐⭐ | Easy to use interface, system is well organised | Platform is already very efficient and well designed |
| 4 | Aditya Sanjay Gofan | ⭐⭐⭐⭐⭐ | Features are easy to understand, everything works smoothly | Everything looks good and works perfectly |
| 5 | Shubham Golekar | ⭐⭐⭐⭐⭐ | UI is very good | — |
| 6 | Lilavati Gofan | ⭐⭐⭐⭐⭐ | Easy to understand, helps complete tasks quickly | Satisfied with features and performance |
| 7 | Prerana Ravindra More | ⭐⭐⭐⭐⭐ | Clean design and easy navigation | Everything is working perfectly |
| 8 | Priyanka Nanavare | ⭐⭐⭐⭐⭐ | Its UI | Add multiple languages |
| 9 | Anuj Patil | ⭐⭐⭐⭐⭐ | Everything is amazing | Good |
| 10 | Meghiya Tulse | ⭐⭐⭐⭐⭐ | — | — |
| 11 | Kartik Botre | ⭐⭐⭐⭐⭐ | Flow | Nothing right now |
| 12 | Stallon Joseph | ⭐⭐⭐⭐⭐ | I like the UI | Add multiple language options |
| 13 | Sanjay Gofan | ⭐⭐⭐⭐⭐ | Well designed platform, easy to understand for new users | Everything is good, no additional improvements required |
| 14 | Kajal Mahajan | ⭐⭐⭐⭐⭐ | Very simple to use, saves a lot of time | System is already efficient and user-friendly |
| 15 | Manisha Khatpe | ⭐⭐⭐⭐ | I like the idea most | Add QR code option for employees |
| 16 | Piyush Bawalekar | ⭐⭐⭐⭐⭐ | I like the UI and idea | Work on adding more options |
| 17 | Ayush Gaikwad | ⭐⭐⭐⭐⭐ | Unique application | Everything is great |
| 18 | Govind Mote | ⭐⭐⭐⭐⭐ | App UI/UX design is very nice | — |
| 19 | Khushi Nagare | ⭐⭐⭐⭐⭐ | Everything is nice and working properly | UI should be better but overall everything is good |
| 20 | Thanchan Bhumij | ⭐⭐⭐⭐⭐ | Transparency | Add some attractive things in the homepage |
| 21 | Sudam Nanavare | ⭐⭐⭐ | Simplicity | Add multiple language support and contact details of worker |
| 22 | Pooja Nanavare | ⭐⭐⭐⭐⭐ | Idea of TrustChain and the logic behind it | No improvement needed, everything works perfectly |
| 23 | Pranali Ganesh Taware | ⭐⭐⭐⭐⭐ | Everything | Nothing |
| 24 | Pallavi Patil | ⭐⭐⭐⭐⭐ | User-friendly, fast-loading, and mobile-responsive | Nothing for now |
| 25 | Mayuresh Taware | ⭐⭐⭐⭐⭐ | — | — |
| 26 | Sakshi Dhanna | ⭐⭐⭐⭐⭐ | User friendly | High speed performance |
| 27 | Sagar Khilare | ⭐⭐⭐⭐⭐ | The certificate is trusted, enabling a secure connection | Nothing |
| 28 | Narayan Mote | ⭐⭐⭐⭐⭐ | Easy to use navigation | You should update UI |
| 29 | Raghav Shastri | ⭐⭐⭐ | Good idea | You should more work on logic |
| 30 | Gauri Shinde | ⭐⭐⭐⭐ | Simplicity | Multiple things like QR code, languages, contact numbers |

### Key Feedback Themes

| Theme | Frequency | Action Taken |
|-------|-----------|-------------|
| 🎨 **UI/UX praised** | 15+ users | ✅ Continued premium design |
| 🌐 **Multi-language support** | 4 users | 🔜 Planned for next iteration |
| 📱 **QR code sharing** | 2 users | 🔜 Planned for next iteration |
| 📞 **Contact details** | 2 users | 🔜 Under consideration |
| ⚡ **Easy to use** | 10+ users | ✅ Maintained simplicity |

---

## 👛 Testnet User Wallet Addresses

> **✅ 30 verified users onboarded with active Stellar Testnet wallets**

| # | Name | Wallet Address | Explorer Link |
|---|------|---------------|---------------|
| 1 | Devyani Sanjay Gofan | `GDJNUWA6GX3XO6MBS2YYX4Y5MRAB2BKW6CDTERSIIITV2N764TFW4CDD` | [View](https://stellar.expert/explorer/testnet/account/GDJNUWA6GX3XO6MBS2YYX4Y5MRAB2BKW6CDTERSIIITV2N764TFW4CDD) |
| 2 | Yash Annadate | `GAYEPC6K7W4HQLFTCKAFCH56G2DY733MYS23M5URO2LG5EAO7VRP6E6N` | [View](https://stellar.expert/explorer/testnet/account/GAYEPC6K7W4HQLFTCKAFCH56G2DY733MYS23M5URO2LG5EAO7VRP6E6N) |
| 3 | Sanjivani Gofan | `GAKXQKOF3IYX2XPWIMU77SPRMQYMGAZ6GL3MCFUIZEH2J27QMPCAIAMJ` | [View](https://stellar.expert/explorer/testnet/account/GAKXQKOF3IYX2XPWIMU77SPRMQYMGAZ6GL3MCFUIZEH2J27QMPCAIAMJ) |
| 4 | Aditya Sanjay Gofan | `GBS5ST5JNQIEP6K3MVTI5T2IWNMCJVFQJ34GCBABRZZ2P6F6PWAUUKNP` | [View](https://stellar.expert/explorer/testnet/account/GBS5ST5JNQIEP6K3MVTI5T2IWNMCJVFQJ34GCBABRZZ2P6F6PWAUUKNP) |
| 5 | Shubham Golekar | `GCIES2OT5DYKTIUNGYR5PZZVQPDXPMWX2FRUV67T3ZUWK6TZODN7ESC2` | [View](https://stellar.expert/explorer/testnet/account/GCIES2OT5DYKTIUNGYR5PZZVQPDXPMWX2FRUV67T3ZUWK6TZODN7ESC2) |
| 6 | Lilavati Gofan | `GBTXRHXN2HRZ4VJFFQLH4722AQNQVJ6LSPTANBG5R3EPPLYIXZEIUDOC` | [View](https://stellar.expert/explorer/testnet/account/GBTXRHXN2HRZ4VJFFQLH4722AQNQVJ6LSPTANBG5R3EPPLYIXZEIUDOC) |
| 7 | Prerana Ravindra More | `GDJRCEDILVHKSHGIMAGD6IW5HXFGL4MI552C7S32SOCIJVTZXVO47EMC` | [View](https://stellar.expert/explorer/testnet/account/GDJRCEDILVHKSHGIMAGD6IW5HXFGL4MI552C7S32SOCIJVTZXVO47EMC) |
| 8 | Priyanka Nanavare | `GANI6VCRTRDTBVYPYPZ6C4DXS7ZF3J46ISJPN5WG4Z5MIGUHWG223RQC` | [View](https://stellar.expert/explorer/testnet/account/GANI6VCRTRDTBVYPYPZ6C4DXS7ZF3J46ISJPN5WG4Z5MIGUHWG223RQC) |
| 9 | Anuj Patil | `GCM5HJ6PGNITCR26FIWDQ62OQ4LTF7HDSMQTXH5GIVOFY7RKM5WR4PC6` | [View](https://stellar.expert/explorer/testnet/account/GCM5HJ6PGNITCR26FIWDQ62OQ4LTF7HDSMQTXH5GIVOFY7RKM5WR4PC6) |
| 10 | Meghiya Tulse | `GAHZT5YQ7TDVHDYOR7LXEMN7BH343KTYGNC2NBY4HXLHRDPR4GVHNRJ2` | [View](https://stellar.expert/explorer/testnet/account/GAHZT5YQ7TDVHDYOR7LXEMN7BH343KTYGNC2NBY4HXLHRDPR4GVHNRJ2) |
| 11 | Kartik Botre | `GDCYI5FYG5LUC4TLNPCBAFBTH3ITYTTPZ5M5Z2RC34DIFSUFBORBWJUH` | [View](https://stellar.expert/explorer/testnet/account/GDCYI5FYG5LUC4TLNPCBAFBTH3ITYTTPZ5M5Z2RC34DIFSUFBORBWJUH) |
| 12 | Stallon Joseph | `GCWD2XRCJFP5AMT57MRYIVEK2QRWZUNUVROGYYRK2XGCZFOORXCXTRW3` | [View](https://stellar.expert/explorer/testnet/account/GCWD2XRCJFP5AMT57MRYIVEK2QRWZUNUVROGYYRK2XGCZFOORXCXTRW3) |
| 13 | Sanjay Gofan | `GDNMERBNRBKLWKRN475MBFYV6QRSHINSF33O7NXMA2PXVP4LHGU7XUMO` | [View](https://stellar.expert/explorer/testnet/account/GDNMERBNRBKLWKRN475MBFYV6QRSHINSF33O7NXMA2PXVP4LHGU7XUMO) |
| 14 | Kajal Mahajan | `GDM4C3U5L4JQIXVU76W6PYEBDYB6R23BLS56TIHHVOAYS66DBQJ3T6WC` | [View](https://stellar.expert/explorer/testnet/account/GDM4C3U5L4JQIXVU76W6PYEBDYB6R23BLS56TIHHVOAYS66DBQJ3T6WC) |
| 15 | Manisha Khatpe | `GBZVSOQ3M4VFC46JFB6I7IHSSU76MNUDLI62S7KWLTGFGPHHIEVBQEOU` | [View](https://stellar.expert/explorer/testnet/account/GBZVSOQ3M4VFC46JFB6I7IHSSU76MNUDLI62S7KWLTGFGPHHIEVBQEOU) |
| 16 | Piyush Bawalekar | `GB7MWYYW2X7VMKFISLOJQ3CJTSAOFKB3DPLIOIARL4YHKT2AHJ2JJT7A` | [View](https://stellar.expert/explorer/testnet/account/GB7MWYYW2X7VMKFISLOJQ3CJTSAOFKB3DPLIOIARL4YHKT2AHJ2JJT7A) |
| 17 | Ayush Gaikwad | `GBUDUGMHCM7B54DIB5P5LP4PP6MG7MJ6VUBBYDB53BZNZCTH36LLG5MG` | [View](https://stellar.expert/explorer/testnet/account/GBUDUGMHCM7B54DIB5P5LP4PP6MG7MJ6VUBBYDB53BZNZCTH36LLG5MG) |
| 18 | Govind Mote | `GBNJOKPTB5AUI4RIEGI6KBOEF5O5LDUEKZGFDCFR5QZFCYCG54WT7NEP` | [View](https://stellar.expert/explorer/testnet/account/GBNJOKPTB5AUI4RIEGI6KBOEF5O5LDUEKZGFDCFR5QZFCYCG54WT7NEP) |
| 19 | Khushi Nagare | `GAYUBQQSVMCPC6UE6YNDAUTBMA7A5Q5EZBZWDHYRYXOPBMV57SQGZU63` | [View](https://stellar.expert/explorer/testnet/account/GAYUBQQSVMCPC6UE6YNDAUTBMA7A5Q5EZBZWDHYRYXOPBMV57SQGZU63) |
| 20 | Thanchan Bhumij | `GDHPNSQINMCUNO6DOWO7HSAW5NTNO2MDY6LDHGKPJMGLUSUMLVWBJKJ6` | [View](https://stellar.expert/explorer/testnet/account/GDHPNSQINMCUNO6DOWO7HSAW5NTNO2MDY6LDHGKPJMGLUSUMLVWBJKJ6) |
| 21 | Sudam Nanavare | `GCSVB74U65GXPWSOXSIOG3AHJQQLARC3UUV4TYOXQ45I6QLOBE56IY2R` | [View](https://stellar.expert/explorer/testnet/account/GCSVB74U65GXPWSOXSIOG3AHJQQLARC3UUV4TYOXQ45I6QLOBE56IY2R) |
| 22 | Pooja Nanavare | `GCBQ4RZFJRFPF4SNQBNRMOLMEOOMZDFFRZKPOK752TNQYNFCOUMQFACX` | [View](https://stellar.expert/explorer/testnet/account/GCBQ4RZFJRFPF4SNQBNRMOLMEOOMZDFFRZKPOK752TNQYNFCOUMQFACX) |
| 23 | Pranali Ganesh Taware | `GCWT5GIBSGNAEDVVTDQFVOV6PZ55A2EK4RWTEURLXTI4CE3G4CB2C5QV` | [View](https://stellar.expert/explorer/testnet/account/GCWT5GIBSGNAEDVVTDQFVOV6PZ55A2EK4RWTEURLXTI4CE3G4CB2C5QV) |
| 24 | Pallavi Patil | `GCSXAQUFSIRE2PFXYS27MFRMWAXUVOLCFA6FH6WFKGB57ZLGCRPLFHOJ` | [View](https://stellar.expert/explorer/testnet/account/GCSXAQUFSIRE2PFXYS27MFRMWAXUVOLCFA6FH6WFKGB57ZLGCRPLFHOJ) |
| 25 | Mayuresh Taware | `GBZGYIQSNMWICQ5RBMAUUKJ4ZJEV7GMNJ2MA4DM3SGGUIBPOJWY364PH` | [View](https://stellar.expert/explorer/testnet/account/GBZGYIQSNMWICQ5RBMAUUKJ4ZJEV7GMNJ2MA4DM3SGGUIBPOJWY364PH) |
| 26 | Sakshi Dhanna | `GCQTHX3P3YCIPV7VSDMPK5EHEBOKPZKQXXRERT3PLLIQARQXG7Z2FMII` | [View](https://stellar.expert/explorer/testnet/account/GCQTHX3P3YCIPV7VSDMPK5EHEBOKPZKQXXRERT3PLLIQARQXG7Z2FMII) |
| 27 | Sagar Khilare | `GCQTHX3P3YCIPV7VSDMPK5EHEBOKPZKQXXRERT3PLLIQARQXG7Z2FMII` | [View](https://stellar.expert/explorer/testnet/account/GCQTHX3P3YCIPV7VSDMPK5EHEBOKPZKQXXRERT3PLLIQARQXG7Z2FMII) |
| 28 | Narayan Mote | `GD7KALJCSWSZD4BHZJB5UAI7D5TLK26HAQUGCZEUQCUNUW5IKJGSYDLG` | [View](https://stellar.expert/explorer/testnet/account/GD7KALJCSWSZD4BHZJB5UAI7D5TLK26HAQUGCZEUQCUNUW5IKJGSYDLG) |
| 29 | Raghav Shastri | `GACDEETPASDGWRYNMATJJOEAR54TRBU3HJXXC4GHUSY25ZIGOTHUXVZ3` | [View](https://stellar.expert/explorer/testnet/account/GACDEETPASDGWRYNMATJJOEAR54TRBU3HJXXC4GHUSY25ZIGOTHUXVZ3) |
| 30 | Gauri Shinde | `GBPZYMJNCTRQCVMFVAQSG6Q6PJDORWB2QU2JKGOXRS64NLKHBR7TNACW` | [View](https://stellar.expert/explorer/testnet/account/GBPZYMJNCTRQCVMFVAQSG6Q6PJDORWB2QU2JKGOXRS64NLKHBR7TNACW) |

> ✅ **30 responses collected and exported to user-feedback.xlsx**
>
> 📊 [Download user-feedback.xlsx](./user-feedback.xlsx)

---

## 🐦 Community Contribution

<!-- TODO: Replace with your actual Twitter/X post link after posting -->
> 📢 **Twitter Post:** [View on X/Twitter](https://twitter.com/YOUR_HANDLE/status/YOUR_POST_ID)
>
> Posted about TrustChain's mission to empower 2B+ informal economy workers with decentralized, verifiable credentials on Stellar.

---

## 🔄 Improvement Roadmap (Based on User Feedback)

### Iteration 1 — Completed ✅

| Improvement | Description | Commit |
|------------|-------------|--------|
| Soroban Smart Contracts | Deployed credential & reputation contracts | [b9b11dd](https://github.com/OmcarSN/TrustChain/commit/b9b11dd) |
| Premium UI Overhaul | Glassmorphism, gradients, Framer Motion animations | [0f1fae7](https://github.com/OmcarSN/TrustChain/commit/0f1fae7) |
| Dashboard Page | Personal hub with activity feed + reputation ring | [6de8ebe](https://github.com/OmcarSN/TrustChain/commit/6de8ebe) |
| Worker Discovery | Searchable/filterable worker directory | [6de8ebe](https://github.com/OmcarSN/TrustChain/commit/6de8ebe) |
| Level 6 Features | Analytics, Explorer, Fee Bump, Security, Monitoring | [2d98a4b](https://github.com/OmcarSN/TrustChain/commit/2d98a4b) |
| Comprehensive Audit | Fixed FeeBump API, reputation edge cases, CSP headers | [View Commits](https://github.com/OmcarSN/TrustChain/commits/master) |

### Iteration 2 — Based on User Feedback (30 Responses)

| Improvement | Feedback Source | Status |
|------------|----------------|--------|
| Analytics Dashboard | Sarthak Kharat: "Add analytics" | ✅ [2d98a4b](https://github.com/OmcarSN/TrustChain/commit/2d98a4b) |
| Toast Notifications | Sarthak Kharat: "Add notifications" | ✅ [2d98a4b](https://github.com/OmcarSN/TrustChain/commit/2d98a4b) |
| UI Polish | Thanchan Bhumij, Khushi Nagare, Narayan Mote: "Improve UI" | ✅ [a6b09ce](https://github.com/OmcarSN/TrustChain/commit/a6b09ce) |
| Multi-Language Support | Priyanka, Stallon, Sudam, Gauri: "Add multiple languages" | 🔜 [446c024](https://github.com/OmcarSN/TrustChain/commit/446c024) |
| QR Code Sharing | Manisha Khatpe, Gauri Shinde: "Add QR code option" | 🔜 [446c024](https://github.com/OmcarSN/TrustChain/commit/446c024) |
| Worker Contact Details | Sudam Nanavare, Gauri Shinde: "Add contact numbers" | 🔜 [446c024](https://github.com/OmcarSN/TrustChain/commit/446c024) |

### Next Phase Roadmap

1. **📱 Mobile-First Redesign** — Most informal workers use smartphones
2. **🌐 Hindi + Marathi Language Support** — Accessibility for non-English workers
3. **🔐 Stellar Mainnet Deployment** — Production-ready permanent credentials
4. **📷 Photo Evidence** — Attach work photos to endorsements
5. **🔗 QR Code Sharing** — Print and share profiles offline
6. **🤖 AI Worker Matching** — Smart recommendations for employers
7. **📊 Advanced Analytics** — Reputation trends and insights
8. **💬 In-App Messaging** — Direct employer-worker communication

---

## 📄 License

MIT License — see [LICENSE](./LICENSE) for details.

---

### Built with ❤️ on Stellar

**TrustChain** — Empowering the informal economy with decentralized trust.

[![Stellar](https://img.shields.io/badge/Powered_by-Stellar-7c3aed?style=flat-square&logo=stellar)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Smart_Contracts-Soroban-orange?style=flat-square)](https://soroban.stellar.org)
[![Freighter](https://img.shields.io/badge/Wallet-Freighter-blue?style=flat-square)](https://freighter.app)
