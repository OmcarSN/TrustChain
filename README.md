# 🛡️ TrustChain — Verified Economy
### *Your Work. Your Reputation. On-Chain Forever.*

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
| 📝 **Feedback Form** | [Google Form](https://docs.google.com/forms/d/e/1FAIpQLSdCP50NOzA3ppCr9hLYw_ZbJRXzGiJzKT7aPVDLxz365czW_Q/viewform?usp=publish-editor) |
| 🌐 **Credential Explorer** | [trust-chain-mocha.vercel.app/explorer](https://trust-chain-mocha.vercel.app/explorer) |

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

- **Google Form:** [TrustChain Feedback Form](https://docs.google.com/forms/d/e/1FAIpQLSdCP50NOzA3ppCr9hLYw_ZbJRXzGiJzKT7aPVDLxz365czW_Q/viewform?usp=publish-editor)
- **Exported Data:** [user-feedback.xlsx](./user-feedback.xlsx)

### Feedback Summary

| User | Rating | What They Liked | Improvement Suggestion |
|------|--------|----------------|----------------------|
| Yash Annadate | ⭐⭐⭐⭐⭐ | Overall best experience | Keep building and improving |
| Mrunal Ghorpade | ⭐⭐⭐⭐⭐ | Excellent UI | Nothing, everything is perfect |
| Thanchan Bhumij | ⭐⭐⭐⭐⭐ | Secure and transparent | UI can be improved |
| Priyanka Nanavare | ⭐⭐⭐⭐⭐ | Solves real world problems | Nothing |
| Anuj Patil | ⭐⭐⭐⭐⭐ | Everything is good | Some minor changes |
| Sarthak Kharat | ⭐⭐⭐⭐⭐ | Intuitive interface + robust verification | Add analytics and notifications |

> **Note:** Additional user feedback will be added as onboarding continues towards 30+ users.

---

## 👛 Testnet User Wallet Addresses

| # | Name | Wallet Address | Explorer Link |
|---|------|---------------|---------------|
| 1 | Yash Annadate | `GBWDGDXAN4AW22OBEQADIOSK2GE7EFNDLZDTBJV6AP33SEPTGNNGFDAE` | [View](https://stellar.expert/explorer/testnet/account/GBWDGDXAN4AW22OBEQADIOSK2GE7EFNDLZDTBJV6AP33SEPTGNNGFDAE) |
| 2 | Mrunal Ghorpade | `GAGKWDKAZYZ7GSK2K6YZGGEDEZXL2GEHDU2NMOAU4AVHSFAVZH336FFX` | [View](https://stellar.expert/explorer/testnet/account/GAGKWDKAZYZ7GSK2K6YZGGEDEZXL2GEHDU2NMOAU4AVHSFAVZH336FFX) |
| 3 | Thanchan Bhumij | `GDHPNSQINMCUNO6DOWO7HSAW5NTNO2MDY6LDHGKPJMGLUSUMLVWBJKJ6` | [View](https://stellar.expert/explorer/testnet/account/GDHPNSQINMCUNO6DOWO7HSAW5NTNO2MDY6LDHGKPJMGLUSUMLVWBJKJ6) |
| 4 | Priyanka Nanavare | `GCM5HJ6PGNITCR26FIWDQ62OQ4LTF7HDSMQTXH5GIVOFY7RKM5WR4PC6` | [View](https://stellar.expert/explorer/testnet/account/GCM5HJ6PGNITCR26FIWDQ62OQ4LTF7HDSMQTXH5GIVOFY7RKM5WR4PC6) |
| 5 | Anuj Patil | `GCFMMVOUOIAMWPOSA4354VADBAW3JFVMGOCJDZWSRDNVR5T6NXY3YAMN` | [View](https://stellar.expert/explorer/testnet/account/GCFMMVOUOIAMWPOSA4354VADBAW3JFVMGOCJDZWSRDNVR5T6NXY3YAMN) |
| 6 | Sarthak Kharat | `GBZVSOQ3M4VFC46JFB6I7IHSSU76MNUDLI62S7KWLTGFGPHHIEVBQEOU` | [View](https://stellar.expert/explorer/testnet/account/GBZVSOQ3M4VFC46JFB6I7IHSSU76MNUDLI62S7KWLTGFGPHHIEVBQEOU) |

> **🔄 More users being onboarded — target: 30+ verified wallet addresses**

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

### Iteration 2 — Based on User Feedback

| Improvement | Feedback Source | Status |
|------------|----------------|--------|
| Analytics Dashboard | Sarthak Kharat: "Add analytics" | ✅ Implemented |
| Toast Notifications | Sarthak Kharat: "Add notifications" | ✅ Implemented |
| UI Polish | Thanchan Bhumij: "UI can be improved" | ✅ Premium redesign completed |

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
