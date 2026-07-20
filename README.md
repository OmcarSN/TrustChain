# ðŸ›¡ï¸ TrustChain â€” Verified Economy
### *Your Work. Your Reputation. On-Chain Forever.*

[![Level](https://img.shields.io/badge/Level-7_Master_Belt_ðŸ†-gold?style=for-the-badge)](#-level-7--startup-track)
[![Live Demo](https://img.shields.io/badge/ðŸŒ_Live_Demo-trust--chain--mocha.vercel.app-7c3aed?style=for-the-badge)](https://trust-chain-mocha.vercel.app/)
[![Demo Video](https://img.shields.io/badge/ðŸŽ¥_Demo_Video-YouTube-red?style=for-the-badge&logo=youtube)](https://youtu.be/3d4YxGwsK0U?si=grqwJ_fMEf4PFf07)
[![Stellar](https://img.shields.io/badge/Built_on-Stellar_Mainnet-blue?style=for-the-badge&logo=stellar)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Smart_Contracts-Soroban-orange?style=for-the-badge)](https://soroban.stellar.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)
[![Security](https://img.shields.io/badge/Security-Checklist_Passed-brightgreen?style=for-the-badge)](./SECURITY.md)

> **Note:** Demo video shows full feature set â€” UI refresh in progress, updated video coming in final submission.

**TrustChain** is a decentralized identity and reputation platform for the informal economy, built on **Stellar Mainnet**. It gives daily wage workers (construction workers, house help, drivers, plumbers) a tamper-proof digital identity and a portable reputation score â€” powered by soulbound credentials, on-chain endorsements, and gasless UX.

## Why I Built This

In India, crores of daily wage workers have no way to show their work history or skills. If they move to a new city, they start from zero. No LinkedIn, no resume, nothing. I built TrustChain so these workers can have a digital identity on blockchain that nobody can fake or delete. Employers can leave ratings, and anyone can verify a worker's reputation by just checking their wallet address.

[ðŸš€ Live Demo](https://trust-chain-mocha.vercel.app/) Â· [ðŸ“Š Metrics Dashboard](#-metrics-dashboard) Â· [ðŸ”’ Security Checklist](./SECURITY.md) Â· [ðŸ“– User Guide](#-user-guide)

---

## ðŸ“‹ Table of Contents
- [Problem Statement](#-problem-statement)
- [Solution](#-solution)
- [Key Features](#-key-features)
- [ðŸ† Level 7 â€” Startup Track](#-level-7--startup-track)
- [Live Demo & Links](#-live-demo--links)
- [Architecture](#ï¸-architecture)
- [Tech Stack](#ï¸-tech-stack)
- [Smart Contracts](#-smart-contracts)
- [âš« Level 6 Black Belt â€” Production Upgrades](#-level-6-black-belt--production-upgrades)
- [Advanced Feature: Fee Sponsorship](#-advanced-feature-fee-sponsorship-gasless-transactions)
- [Data Indexing](#-data-indexing)
- [Metrics Dashboard](#-metrics-dashboard)
- [Monitoring Dashboard](#-monitoring-dashboard)
- [Security Checklist](#-security-checklist)
- [User Guide](#-user-guide)
- [Technical Documentation](#-technical-documentation)
- [Getting Started](#-getting-started)
- [User Feedback & Validation](#-user-feedback--validation)
- [User Wallet Addresses (Bootcamp Phase)](#-user-wallet-addresses-bootcamp-phase)
- [Community Contribution](#-community-contribution)
- [Startup Roadmap & Milestones](#-startup-roadmap--milestones)
- [License](#-license)

---

## ðŸ”´ Problem Statement

Over **2 billion** workers in the informal economy worldwide lack verifiable professional credentials. Without formal documentation:

- Workers can't **prove** their skills, experience, or reliability to potential employers
- Employers have **no way** to verify worker claims before hiring
- Years of honest work produce **zero portable reputation**
- Workers starting in a new city must **rebuild trust from scratch**

Most of these workers don't use LinkedIn or have paper certificates to show their skills.

---

## ðŸ’¡ Solution

**TrustChain** solves this by providing a sovereign, on-chain identity layer:

| Feature | Description |
|---------|-------------|
| **Soulbound Credentials** | Workers mint non-transferable credential NFTs to their Stellar wallet |
| **On-Chain Endorsements** | Employers write immutable star-rated reviews directly to the Stellar ledger |
| **Reputation Score** | Algorithmically calculated from endorsement history â€” tamper-proof |
| **Portable Identity** | A worker's reputation follows them anywhere â€” just share their Stellar address |
| **Zero Cost** | All operations are gasless â€” fees sponsored by TrustChain protocol |
| **Wallet-First UX** | Freighter wallet integration for seamless Web3 onboarding |

---

## âœ¨ Key Features

### ðŸ“± Sybil-Resistant Phone Verification
- **Twilio OTP Integration** â€” prevents bots and duplicate accounts
- **Supabase Backend** â€” securely stores verified `phone <-> wallet` mappings
- **1-to-1 Mapping** â€” each worker can only register one wallet address per phone number
- Ensures enterprise-grade trust in the worker registry

### ðŸ‘· Worker Registration & Credential Minting
- Connect Freighter wallet and fill professional details
- Mint a soulbound credential as ManageData entries on Stellar
- 3-step guided process with real-time form validation
- **Gasless** â€” transaction fees are sponsored via fee bump

### â­ Endorsement System
- Employers search for workers by Stellar address
- Submit 1-5 star ratings with job type and detailed feedback
- Endorsements are signed and sealed on-chain via Freighter
- Duplicate endorsement protection (per endorser-worker-day)

### ðŸ” On-Chain Verification
- Anyone can verify a worker's credentials by entering their Stellar address
- Live data pulled directly from the Stellar ledger via Horizon API
- Full reputation breakdown with star distribution chart
- Shareable verification links

### ðŸ“Š Dashboard
- Personal command center with quick actions
- Activity feed showing endorsements given and received
- Reputation score visualization with SVG ring chart

### ðŸ”Ž Worker Discovery
- Browse and search all registered workers
- Filter by skill category, city, and minimum rating
- Real-time sorting by reputation score

### ðŸŒ Credential Explorer
- Search on-chain credential events by wallet address
- View transaction hashes, ledger numbers, and timestamps
- Direct links to Stellar Expert for verification

### ðŸ“ˆ Network Analytics
- Real-time metrics from Horizon API
- Total credentials, active wallets, daily transactions
- Interaction trend chart with time-series data

### ðŸŒ Multi-Language Support (Localization)
- Full Hindi language localization for informal economy workers
- Seamless toggle between English and Hindi across the entire platform
- Culturally relevant translations replacing hardcoded text

---

## ðŸ† Level 7 â€” Startup Track

TrustChain is applying to the **Stellar Startup Track (Level 7 â€” Master Belt)** as a scalable identity and reputation platform targeting **Financial Inclusion** and **Identity & Compliance** within the Stellar ecosystem.

### ðŸŽ¯ Ecosystem Alignment

| Focus Area | How TrustChain Fits |
|---|---|
| **Financial Inclusion** | Gives 2B+ unbanked informal workers a verifiable digital identity â€” the first step to accessing financial services |
| **Identity & Compliance** | Soulbound credentials create a tamper-proof KYW (Know Your Worker) layer for employers and microfinance institutions |
| **Consumer dApps** | Mobile-friendly, gasless UX designed for workers who've never used crypto |
| **Wallet Infrastructure** | Gasless onboarding via sponsor wallet â€” workers get funded accounts automatically |

### ðŸ“Š Traction & Milestones Achieved

| Milestone | Status |
|---|---|
| MVP completed | âœ… Full-featured product live |
| Testnet launch | âœ… Completed (migrated to Mainnet) |
| Mainnet deployment | âœ… 2 Soroban contracts deployed on Stellar Mainnet |
| User validation | âœ… 30+ user feedback responses collected (4.8/5 avg rating) |
| Mainnet users | âœ… 11 registered workers, 5 verified phones, 2 endorsements |
| Security hardening | âœ… Rate limiting, CORS, phone verification, 93 automated tests |
| CI/CD pipeline | âœ… 8-stage GitHub Actions workflow |
| Demo video | âœ… [YouTube](https://youtu.be/3d4YxGwsK0U?si=grqwJ_fMEf4PFf07) |

### ðŸ’¼ Business Model

TrustChain is designed to be sustainable through a **B2B2C model** â€” free for workers, monetized through employers and institutions:

| Revenue Stream | Description | Target Launch |
|---|---|---|
| **Verification API** | Employers and HR platforms pay per-query to verify worker credentials via API. Pricing: ~â‚¹5-10 per verification | Q1 2027 |
| **Premium Employer Accounts** | Businesses get bulk verification, analytics dashboards, and priority support. SaaS subscription: â‚¹999-4999/month | Q2 2027 |
| **Microfinance Partnerships** | Banks and NBFCs use TrustChain reputation scores as an alternative credit signal for microloans to unbanked workers | Q3 2027 |
| **Staffing Platform Licensing** | White-label TrustChain for staffing agencies (UrbanClap, Apna.co model) who need verified worker profiles | Q4 2027 |

> **Unit Economics:** At â‚¹5/verification Ã— 1,000 verifications/day = â‚¹1.5L/month revenue. Stellar transaction costs are near-zero (0.00001 XLM/tx â‰ˆ â‚¹0.0003), so margins are 99%+.

### ðŸš€ Go-to-Market Strategy

**Phase 1 â€” Grassroots (Current)**
- Onboard workers through direct field outreach in Pune and Mumbai
- Partner with local labor unions and worker cooperatives
- Target: 500 registered workers in 3 months

**Phase 2 â€” Platform Partnerships**
- Integrate with staffing apps (Apna, WorkIndia, QuikrJobs) as a verification layer
- Partner with microfinance institutions for reputation-based micro-lending
- Target: 5,000 workers, 50 employer accounts

**Phase 3 â€” Scale**
- Expand to other Indian cities (Delhi, Bangalore, Hyderabad)
- Launch Verification API for B2B integrations
- Add regional languages (Marathi, Tamil, Telugu)
- Target: 50,000 workers, 500 employer accounts

### ðŸ”Ž Competitive Analysis

| Feature | TrustChain | LinkedIn | Apna.co | Paper Certificates |
|---|---|---|---|---|
| Works for informal workers | âœ… | âŒ | Partial | âœ… |
| Tamper-proof credentials | âœ… (on-chain) | âŒ | âŒ | âŒ (easily forged) |
| Zero cost for workers | âœ… (gasless) | âœ… | âœ… | âŒ |
| Portable across cities | âœ… (blockchain) | âœ… | âŒ | âŒ |
| Employer verification | âœ… (on-chain) | âŒ | âŒ | âŒ |
| No app download needed | âœ… (PWA) | âŒ | âŒ | N/A |
| Decentralized | âœ… | âŒ | âŒ | N/A |
| Sybil resistant | âœ… (phone OTP) | Partial | Partial | âŒ |

> **Key Differentiator:** TrustChain is the only platform that combines soulbound on-chain credentials + gasless UX + phone-based Sybil resistance specifically designed for workers who have never used crypto.

### ðŸ‘¥ Team

| Role | Name | Contribution |
|---|---|---|
| **Founder & Full-Stack Developer** | Omkar Nanaware | Architecture, smart contracts (Rust/Soroban), React frontend, Vercel backend, UX design, user research |

> Open to onboarding co-founders with expertise in growth, partnerships, and mobile development.

---

## ðŸ”— Live Demo & Links

| Resource | Link |
|----------|------|
| ðŸŒ **Live App** | [https://trust-chain-mocha.vercel.app/](https://trust-chain-mocha.vercel.app/) |
| ðŸŽ¥ **Demo Video** | [Watch on YouTube](https://youtu.be/3d4YxGwsK0U?si=grqwJ_fMEf4PFf07) |
| ðŸ’» **GitHub Repo** | [https://github.com/OmcarSN/TrustChain](https://github.com/OmcarSN/TrustChain) |
| ðŸ“Š **Metrics Dashboard** | [trust-chain-mocha.vercel.app/analytics](https://trust-chain-mocha.vercel.app/analytics) |
| ðŸ” **Monitoring Dashboard** | [trust-chain-mocha.vercel.app/admin/logs](https://trust-chain-mocha.vercel.app/admin/logs) |
| ðŸ”’ **Security Checklist** | [SECURITY.md](./SECURITY.md) |
| ðŸ”­ **Credential Contract** | [View on Stellar Expert](https://stellar.expert/explorer/public/contract/CCBIIOQMO4BOHZ7RTL7FQDQJCLNRUR7JMNWHDBO4L6QMISLB3UZHDTU4) |
| ðŸ”­ **Reputation Contract** | [View on Stellar Expert](https://stellar.expert/explorer/public/contract/CBSGD23P6GB4BJBB3ZM5CPTN6EPV2FUWXKC72SMOITNWPCGLMLLSDLYT) |
| ðŸ“ **Feedback Form** | [Google Form](https://docs.google.com/forms/d/e/1FAIpQLSc9x0prppbJZpEPGv_HJmZESKKAikCJ5IH1SUXl5aX20ekWLQ/viewform?usp=publish-editor) |
| ðŸŒ **Credential Explorer** | [trust-chain-mocha.vercel.app/explorer](https://trust-chain-mocha.vercel.app/explorer) |
| ðŸ“Š **User Feedback Excel** | [user-feedback.xlsx](./user-feedback.xlsx) (30 responses) |

> **Note:** The app requires the [Freighter Wallet](https://www.freighter.app/) browser extension set to **Mainnet (Pubnet)** mode.

---


## ðŸ—ï¸ Architecture

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚              FRONTEND (React 19 + Vite)                     â”‚
â”‚                                                             â”‚
â”‚  Pages:                                                     â”‚
â”‚  Landing Â· WorkerRegistration Â· Endorse Â· Verify            â”‚
â”‚  Dashboard Â· DiscoverWorkers Â· WorkerProfile                â”‚
â”‚  Analytics Â· Explorer Â· AdminLogs Â· NotFound                â”‚
â”‚                                                             â”‚
â”‚  Services & Libs:                                           â”‚
â”‚  stellar.js Â· freighter.js Â· reputation.js                  â”‚
â”‚  indexer.js Â· monitor.js Â· validation.js Â· feeBump.js       â”‚
â”‚                                                             â”‚
â”‚  Context:                                                   â”‚
â”‚  WalletContext Â· ToastContext Â· ErrorBoundary                â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                        â”‚
              â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
              â”‚  Freighter Wallet  â”‚
              â”‚    Extension       â”‚
              â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                        â”‚ Sign Transactions
                        â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚         VERCEL SERVERLESS (api/fee-bump.js)                  â”‚
â”‚  Signed TX XDR â†’ Fee Bump wrap â†’ Sponsor signs â†’ Return     â”‚
â”‚  SPONSOR_SECRET stored server-side only (not in browser)     â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                        â”‚
                        â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚            STELLAR BLOCKCHAIN (Mainnet)                     â”‚
â”‚                                                             â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”    â”‚
â”‚  â”‚  Horizon API: horizon.stellar.org                         â”‚    â”‚
â”‚  â”‚  â€¢ Account queries        â€¢ Transaction submission  â”‚    â”‚
â”‚  â”‚  â€¢ ManageData retrieval   â€¢ Ledger history          â”‚    â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜    â”‚
â”‚                                                             â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”    â”‚
â”‚  â”‚  ManageData Operations (Native)                     â”‚    â”‚
â”‚  â”‚  tc_{addr}        â†’ skill credential                â”‚    â”‚
â”‚  â”‚  tce_{addr}_{ts}  â†’ rating|jobType|feedback         â”‚    â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜    â”‚
â”‚                                                             â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”    â”‚
â”‚  â”‚  Soroban Smart Contracts (Rust)                     â”‚    â”‚
â”‚  â”‚  credential-contract  Â· reputation-contract         â”‚    â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜    â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### Data Flow
```
Worker fills form â†’ Freighter signs â†’ /api/fee-bump wraps â†’ Horizon submits â†’ ManageData stored
Endorser rates â†’ Freighter signs â†’ Horizon submits â†’ ManageData stored â†’ Reputation calculated
Verifier searches â†’ Indexer queries Horizon â†’ Parses ManageData â†’ Displays reputation
```

### Smart Contract Addresses
| Contract | Address |
|----------|---------| 
| Credential Contract | `CCBIIOQMO4BOHZ7RTL7FQDQJCLNRUR7JMNWHDBO4L6QMISLB3UZHDTU4` |
| Reputation Contract | `CBSGD23P6GB4BJBB3ZM5CPTN6EPV2FUWXKC72SMOITNWPCGLMLLSDLYT` |

---

## ðŸ› ï¸ Tech Stack

| Layer | Technology |
|-------|-----------| 
| Frontend | React 19 + Vite + Vanilla CSS |
| Animations | Framer Motion |
| Charts | Recharts |
| Routing | React Router v7 |
| Type Safety | PropTypes (runtime) + JSDoc (IDE) |
| Testing | Vitest + @testing-library/react (93 tests) |
| Blockchain | Stellar Mainnet + Horizon API |
| Wallet | Freighter API v6 |
| Smart Contracts | Soroban SDK + Rust |
| Database | Supabase (PostgreSQL) |
| SMS Verification | Twilio OTP |
| Localization | i18next (English + Hindi) |
| Deployment | Vercel (with security headers) |
| Monitoring | Custom localStorage-based logger |

---

## ðŸ“œ Smart Contracts

### Credential Contract
- Manages worker credential operations
- Stores credential metadata on-chain
- Soulbound â€” non-transferable by design
- Address: `CCBIIOQMO4BOHZ7RTL7FQDQJCLNRUR7JMNWHDBO4L6QMISLB3UZHDTU4`
- [View on Stellar Expert](https://stellar.expert/explorer/public/contract/CCBIIOQMO4BOHZ7RTL7FQDQJCLNRUR7JMNWHDBO4L6QMISLB3UZHDTU4)

### Reputation Contract
- Handles reputation score computation
- Aggregates endorsement data
- Produces queryable scores
- Address: `CBSGD23P6GB4BJBB3ZM5CPTN6EPV2FUWXKC72SMOITNWPCGLMLLSDLYT`
- [View on Stellar Expert](https://stellar.expert/explorer/public/contract/CBSGD23P6GB4BJBB3ZM5CPTN6EPV2FUWXKC72SMOITNWPCGLMLLSDLYT)

---

## âš« Level 6 Black Belt â€” Production Upgrades

TrustChain has been upgraded to **Level 6 Black Belt** with production-grade features including gasless transactions, real-time analytics, on-chain credential exploration, comprehensive security hardening, and production monitoring.

### âš¡ Advanced Smart Contracts
- **Credential Contract:** Added expiry functionality, verification tiers (Bronze to Platinum), batch operations, and dispute resolution logic. Protected by 14 comprehensive unit tests.
- **Reputation Contract:** Rewritten with robust duplicate endorsement prevention, time-decay weighted scores (newer reviews weigh more), and total trust tiers. Protected by 13 comprehensive unit tests.

### ðŸ”„ Production CI/CD Pipeline
- **Automated Workflow (`.github/workflows/ci.yml`)**: 8-stage professional pipeline triggering on push to main.
- **Stages**: Frontend linting, Frontend unit/integration testing, Frontend bundling, `cargo clippy` linting, `cargo test` for smart contracts, WASM artifact builds, NPM security auditing, and automated Vercel preview/production deployments.

### âš¡ Gasless Transactions & Automated Onboarding
- **Shared Logic:** `src/utils/feeBump.js` â€” `buildFeeBumpTransaction(innerTxXDR, sponsorKeypair, networkPassphrase)`
- **Server-Side API:** `api/fee-bump.js` & `api/build-mint.js` â€” Vercel serverless functions
- **Why:** Informal economy workers should never need to buy XLM to receive credentials
- **How it works (2-Step Magic):** 
  1. **New Users (0 XLM):** When a new worker registers, our server automatically creates their Stellar account and funds it with **2 XLM** (enough to cover the base reserve and future fees).
  2. **Existing Users:** For everyday transactions (minting, endorsing, voting), our server wraps the transaction in a `FeeBumpTransaction` so the sponsor wallet pays the network fee (0.00001 XLM).
- **Security:** `SPONSOR_SECRET` is stored securely in Vercel env vars and never exposed to the frontend.

### ðŸ“Š Analytics Dashboard
- **Live at:** [trust-chain-mocha.vercel.app/analytics](https://trust-chain-mocha.vercel.app/analytics)
- Tracks: Total Interactions (45+), Active Wallets (18+), Transactions Today, 7-day trend
- Live Activity Feed showing real-time contract events
- Auto-refreshes every 30 seconds via Horizon API
- Built with Recharts

### ðŸ” Credential Explorer
- **Live at:** [trust-chain-mocha.vercel.app/explorer](https://trust-chain-mocha.vercel.app/explorer)
- Search any Stellar wallet address to see all on-chain credentials
- Results: Credential Type, Issued On, TX Hash (linked to Stellar Expert), Ledger number
- Powered by cursor-paginated Horizon API indexer with 60s cache

### ðŸ—‚ï¸ Data Indexing
- **Approach:** Stellar Horizon API cursor-based pagination indexes ALL TrustChain contract events
- **File:** `src/services/indexer.js`
- **Cache:** 60-second sessionStorage TTL to prevent rate limiting
- **Explorer endpoint:** [trust-chain-mocha.vercel.app/explorer](https://trust-chain-mocha.vercel.app/explorer)

### ðŸ” Security Checklist

| Check | Status |
|-------|--------|
| Input validation on all user inputs | âœ… |
| XSS protection via `sanitizeString()` | âœ… |
| Vercel security headers (CSP, X-Frame-Options, X-Content-Type-Options) | âœ… |
| Stellar wallet address strkey validation | âœ… |
| Error boundaries on all async Horizon/Soroban calls | âœ… |
| No secret keys exposed in frontend bundle | âœ… |
| Sponsor secret stored in Vercel environment variables only | âœ… |
| SPA rewrite rules prevent 404 on hard refresh | âœ… |

> Full detailed checklist: [SECURITY.md](./SECURITY.md)

### ðŸ”­ Production Monitoring
- **Live at:** [trust-chain-mocha.vercel.app/admin/logs](https://trust-chain-mocha.vercel.app/admin/logs)
- Transaction log + Exception log stored in localStorage
- Auto-refreshes every 5 seconds
- All Horizon and Soroban errors captured with full context

### ðŸŒ Community Contribution

> ðŸ“¢ **Twitter/X Post:** [View on X/Twitter](https://x.com/i/status/2042962447297057275)
>
> Posted about TrustChain's mission with screenshots of Analytics dashboard + homepage to empower 2B+ informal economy workers with decentralized, verifiable credentials on Stellar.

### ðŸ“‹ Level 6 New Files Added

| File | Purpose |
|------|--------|
| `api/fee-bump.js` | Server-side fee bump signing (Vercel serverless function) |
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
| `.github/workflows/ci.yml` | Production 8-job CI/CD Pipeline |
| `contracts/credential/src/lib.rs` | Upgraded to Level 6 Advanced (14 tests) |
| `contracts/reputation/src/lib.rs` | Upgraded to Level 6 Advanced (13 tests) |

### ðŸ§ª Code Quality & Production Readiness

TrustChain's codebase has been hardened to **production-grade** standards through four key improvements:

#### Component Decomposition
All monolithic page components (400+ LOC) have been decomposed into focused, reusable sub-components:

| Page | Before | After | Extracted Components |
|------|--------|-------|---------------------|
| `Landing.jsx` | 756 LOC | ~130 LOC | `HeroSection`, `StatsBar`, `HowItWorks`, `TechStack` |
| `Dashboard.jsx` | 423 LOC | ~170 LOC | `ConnectPrompt`, `DashboardSidebar`, `DashboardActivityFeed` |
| `DiscoverWorkers.jsx` | 563 LOC | ~200 LOC | `WorkerCard`, `FilterBar` |

#### Runtime PropTypes Validation
All 13 reusable components now have mandatory `PropTypes` declarations ensuring runtime type safety:
- Core: `MetricCard`, `ErrorBoundary`, `TrustChainLogo`
- Landing: `HeroSection`, `StatsBar`, `HowItWorks`, `TechStack`
- Dashboard: `ConnectPrompt`, `DashboardSidebar`, `DashboardActivityFeed`
- Discover: `WorkerCard`, `FilterBar`

#### JSDoc Type Annotations
Professional-grade `@typedef`, `@param`, and `@returns` annotations added to all utility and library modules:
- `utils/monitor.js` â€” `ErrorLogEntry`, `TransactionLogEntry`
- `utils/feeBump.js` â€” Full parameter/return type docs
- `utils/validation.js` â€” `ValidationResult` typedef
- `lib/reputation.js` â€” `Endorsement`, `ReputationScore` typedefs

#### Test Coverage (93 Tests, 11 Suites)

| Suite | Tests | Coverage Area |
|-------|-------|--------------|
| `validation.test.js` | 16 | Input sanitization, XSS, wallet address |
| `shared-components.test.jsx` | 14 | StatsBar, HowItWorks, MetricCard, Footer |
| `integration.test.jsx` | 10 | Multi-step user flows (search, endorse, verify) |
| `accessibility.test.jsx` | 9 | ARIA, keyboard nav, screen reader, color contrast |
| `pages.test.jsx` | 9 | Page smoke tests (all 7 routes render) |
| `reputation.test.js` | 7 | Score calculation, edge cases, breakdown |
| `hooks.test.jsx` | 7 | Custom hook isolation tests |
| `monitor.test.js` | 5 | Error/TX logging, log capping |
| `components.test.jsx` | 4 | ErrorBoundary, TrustChainLogo smoke tests |
| `feeBump.test.js` | 3 | Fee bump transaction building |
| `subcomponents.test.jsx` | 9 | Sub-component rendering, props, interactions |

```bash
# Run all tests
npx vitest run
# âœ… 93/93 passing â€” 0 failures
```

### ðŸ—ºï¸ Improvement Roadmap â€” Based on Level 6 User Feedback

| Feedback Theme | Planned Improvement | Status |
|----------------|-------------------|--------|
| Sarthak Kharat: "Add analytics" | Built /analytics dashboard with 7-day trend | âœ… [View](https://github.com/OmcarSN/TrustChain/commit/2d98a4b) |
| Thanchan Bhumij: "UI can be improved" | Premium glassmorphism redesign completed | âœ… [View](https://github.com/OmcarSN/TrustChain/commit/a6b09ce) |
| Priyanka, Stallon, Sudam: "Add languages" | Multi-language support (Hindi completed) | âœ… [View](https://github.com/OmcarSN/TrustChain/commit/446c024) |
| Manisha, Gauri: "Add QR code" | QR code profile sharing | ðŸ”œ [View](https://github.com/OmcarSN/TrustChain/commit/446c024) |
| Mobile users need better access | Mobile-first redesign planned for next phase | ðŸ”œ [View](https://github.com/OmcarSN/TrustChain/commit/446c024) |

---

## âš¡ Advanced Feature: Gasless Onboarding & Fee Sponsorship

TrustChain completely eliminates the biggest barrier to Web3 adoption: **Gas Fees**. 

Blue-collar workers (painters, plumbers, drivers) shouldn't need to visit a crypto exchange just to create a professional profile. TrustChain solves this using a **Sponsor Wallet Architecture**.

### The Automated Onboarding Flow

1. **The 2 XLM Airdrop:** When a brand new worker connects an empty wallet (0 XLM balance), they normally wouldn't even exist on the Stellar ledger. Our backend detects this and automatically prepends a `CreateAccount` operation, funding the worker with **2 XLM** from our Sponsor Wallet. This covers Stellar's minimum reserve requirement and gives them a working wallet for life.
2. **Fee Bump Transactions:** For all other operations (minting credentials, submitting endorsements, voting in DAO), the worker simply signs the transaction. Our `/api/fee-bump` serverless function wraps it and pays the 0.00001 XLM network fee.
3. **The Result:** The user experiences a seamless Web2-like flow while interacting directly with a decentralized Web3 blockchain.

### Security Measures

- Sponsor secret key stored **server-side only** in Vercel env vars (`SPONSOR_SECRET` â€” no `VITE_` prefix)
- Fee bump signing performed via Vercel serverless functions (`/api/fee-bump` and `/api/build-mint`)
- Client never has access to the sponsor secret â€” only sends signed XDR to API
- Error messages sanitized with regex: `/S[A-Z0-9]{55}/g â†’ [REDACTED]`

### Files Involved
| File | Purpose |
|------|---------|
| [`api/fee-bump.js`](./api/fee-bump.js) | Server-side fee bump signing (Vercel serverless function) |
| [`src/utils/feeBump.js`](./src/utils/feeBump.js) | Fee bump transaction builder (used by API) |
| [`src/lib/stellar.js`](./src/lib/stellar.js) | Client calls `/api/fee-bump` for sponsorship |
| Vercel Dashboard | `SPONSOR_SECRET` env var (server-side only) |

---

## ðŸ“¡ Data Indexing

TrustChain implements a **custom Horizon-based indexer** that queries the Stellar ledger for on-chain credential events, eliminating the need for a centralized database.

### Approach

Instead of maintaining a backend database, TrustChain queries the **Stellar Horizon API** directly to retrieve transaction history and parse ManageData operations. This provides:

- **Decentralized data retrieval** â€” no single point of failure
- **Real-time on-chain data** â€” always reflects the latest ledger state
- **Hybrid storage** â€” critical data on-chain, UI metadata cached in localStorage

### Architecture

```
User Request â†’ indexer.js â†’ Horizon API (horizon.stellar.org)
                   â”‚
                   â”œâ”€â”€ Parse ManageData operations
                   â”œâ”€â”€ Extract credential type, timestamp, tx hash
                   â”œâ”€â”€ Fallback to localStorage if Horizon unavailable
                   â”‚
                   â””â”€â”€ Return structured credential/endorsement data
```

### Key Functions

| Function | File | Description |
|----------|------|-------------|
| `fetchCredentialsByWallet(address)` | `src/services/indexer.js` | Fetches all credential events for a wallet from Horizon |
| `fetchAllCredentialEvents()` | `src/services/indexer.js` | Aggregates credentials across all registered wallets |
| `fetchLatestLedger()` | `src/services/indexer.js` | Retrieves the latest ledger sequence and close time |

### Endpoints & Dashboards

| Resource | Link |
|----------|------|
| **Credential Explorer UI** | [trust-chain-mocha.vercel.app/explorer](https://trust-chain-mocha.vercel.app/explorer) |
| **Horizon API (Mainnet)** | [horizon.stellar.org](https://horizon.stellar.org) |
| **Analytics Dashboard** | [trust-chain-mocha.vercel.app/analytics](https://trust-chain-mocha.vercel.app/analytics) |

### Resilience Strategy

1. **Primary**: Query Horizon API for on-chain ManageData operations
2. **Secondary**: Fall back to localStorage transaction logs
3. **Tertiary**: Display cached data from previous successful queries

---

## ðŸ“Š Metrics Dashboard

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
- **Hook**: `src/hooks/useHorizonMetrics.js` â€” polls Horizon every 30 seconds
- **Charts**: Recharts library for interaction trend visualization
- **Components**: `src/components/MetricCard.jsx` â€” animated metric cards with sparklines

### User Metrics Tracking
| Metric | How Tracked |
|--------|------------|
| **DAU (Daily Active Users)** | Today's unique transaction sources from Horizon |
| **Total Transactions** | Historical transaction count from contract account |
| **Retention** | Repeat wallet addresses across multiple transactions |
| **New Registrations** | Workers added to `trustchain_worker_registry` in localStorage |

### Screenshots

<img width="960" height="540" alt="Screenshot 2026-07-16 123610" src="https://github.com/user-attachments/assets/83196e57-3c28-45ac-b88e-50feb5c076bc" />


<img width="960" height="540" alt="Screenshot 2026-07-16 130425" src="https://github.com/user-attachments/assets/8bbc118c-680a-4ebc-8cb8-00dee5b81f78" />


<img width="960" height="540" alt="Screenshot 2026-07-16 130459" src="https://github.com/user-attachments/assets/cd7f5ad0-d187-44e5-ba4a-70ad65253f6f" />


<img width="960" height="540" alt="Screenshot 2026-07-16 130532" src="https://github.com/user-attachments/assets/a3bd582b-ad39-43a8-98d5-c5d429dd2034" />


<img width="960" height="540" alt="Screenshot 2026-07-16 130547" src="https://github.com/user-attachments/assets/68984662-7450-41fd-91fa-4fde96753a2c" />


<img width="960" height="540" alt="Screenshot 2026-07-16 130613" src="https://github.com/user-attachments/assets/9c44c346-88ef-43c9-9749-265bbadc6d7a" />


---

## ðŸ” Monitoring Dashboard

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
- **Logger**: `src/utils/monitor.js` â€” `logTransaction()`, `logError()`, `getErrorLog()`, `getTxLog()`
- **Dashboard**: `src/pages/AdminLogs.jsx` â€” split-panel transaction and error viewer
- **Storage**: localStorage keys `trustchain_txlog` and `trustchain_errors`
- **Access**: Hidden admin route at `/admin/logs`

---

## ðŸ”’ Security Checklist

âœ… **Full security checklist completed** â€” see [SECURITY.md](./SECURITY.md)

### Summary

| Category | Checks | Status |
|----------|--------|--------|
| Input Validation & Sanitization | 7 checks | âœ… All Pass |
| Authentication & Wallet Security | 5 checks | âœ… All Pass |
| Smart Contract Security | 5 checks | âœ… All Pass |
| Fee Sponsorship Security | 7 checks | âœ… All Pass |
| Network & Transport Security | 7 checks | âœ… All Pass |
| Error Handling & Monitoring | 6 checks | âœ… All Pass |
| Data Privacy | 4 checks | âœ… All Pass |
| **Total** | **41 checks** | **âœ… All Pass** |

---

## ðŸ“– User Guide

### For Workers â€” Mint Your Credential

1. **Install Freighter** â€” Download the [Freighter wallet](https://www.freighter.app/) browser extension
2. **Switch to Mainnet** â€” Open Freighter settings â†’ Network â†’ Select "Mainnet (Pubnet)"
3. **Visit TrustChain** â€” Go to [trust-chain-mocha.vercel.app](https://trust-chain-mocha.vercel.app/)
4. **Connect Wallet** â€” Click "Connect Freighter" in the navbar
5. **Register** â€” Click "I'm a Worker" â†’ Fill your name, skill, experience, city, and bio
6. **Mint** â€” Click "Mint My Credential" â†’ Approve the transaction in Freighter
7. **Done!** â€” Your credential is now permanently sealed on the Stellar blockchain

### For Employers â€” Endorse a Worker

1. **Connect Wallet** â€” Same Freighter setup as above
2. **Navigate to Endorse** â€” Click "Endorse" in the navbar
3. **Search Worker** â€” Enter the worker's Stellar wallet address (starts with G...)
4. **Write Endorsement** â€” Select star rating, job type, and write detailed feedback
5. **Submit** â€” Click "Seal Endorsement" â†’ Approve in Freighter
6. **Verified** â€” The endorsement is now on-chain and visible in the worker's profile

### For Anyone â€” Verify a Worker

1. **No wallet needed** â€” Verification is read-only
2. **Navigate to Verify** â€” Click "Verify" in the navbar
3. **Enter Address** â€” Paste the worker's Stellar wallet address
4. **View Results** â€” See their reputation score, star breakdown, endorsement history, and all credentials
5. **Share** â€” Copy the unique profile link to share with others

### For Admins â€” Monitor the System

1. **Navigate to `/admin/logs`** â€” Hidden admin route
2. **Transaction Log** â€” View all recorded on-chain transactions
3. **Exception Log** â€” Monitor any errors or failures
4. **Refresh** â€” Click "Refresh" for latest data or wait for auto-refresh (5s)
5. **Clear** â€” Click "Clear Logs" to reset monitoring data

---

## ðŸ”§ Technical Documentation

### Project Structure

```
trustchain/
â”œâ”€â”€ api/                    # Vercel serverless functions (server-side)
â”‚   â””â”€â”€ fee-bump.js         # Fee bump signing â€” SPONSOR_SECRET stays here
â”œâ”€â”€ contracts/              # Soroban smart contracts (Rust)
â”‚   â”œâ”€â”€ credential/
â”‚   â”‚   â””â”€â”€ src/
â”‚   â”‚       â””â”€â”€ lib.rs      # Credential issuance & retrieval logic
â”‚   â”œâ”€â”€ reputation/
â”‚   â”‚   â””â”€â”€ src/
â”‚   â”‚       â””â”€â”€ lib.rs      # Reputation scoring & endorsement logic
â”‚   â””â”€â”€ governance/
â”‚       â””â”€â”€ src/
â”‚           â””â”€â”€ lib.rs      # Governance & admin transfer logic
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ components/         # Reusable UI components (all have PropTypes)
â”‚   â”‚   â”œâ”€â”€ Navbar.jsx      # Navigation with wallet state
â”‚   â”‚   â”œâ”€â”€ Footer.jsx      # Footer with external links
â”‚   â”‚   â”œâ”€â”€ MetricCard.jsx  # Animated metric display
â”‚   â”‚   â”œâ”€â”€ ActivityFeed.jsx # Real-time event feed
â”‚   â”‚   â”œâ”€â”€ ErrorBoundary.jsx # Global React error handler
â”‚   â”‚   â”œâ”€â”€ TrustChainLogo.jsx # Brand logo component
â”‚   â”‚   â”œâ”€â”€ landing/        # Landing page sub-components
â”‚   â”‚   â”‚   â”œâ”€â”€ HeroSection.jsx   # Hero with animated headlines + CTAs
â”‚   â”‚   â”‚   â”œâ”€â”€ StatsBar.jsx      # Animated platform metrics bar
â”‚   â”‚   â”‚   â”œâ”€â”€ HowItWorks.jsx    # 3-step feature cards
â”‚   â”‚   â”‚   â””â”€â”€ TechStack.jsx     # Technology showcase section
â”‚   â”‚   â”œâ”€â”€ dashboard/      # Dashboard sub-components
â”‚   â”‚   â”‚   â”œâ”€â”€ ConnectPrompt.jsx  # Wallet connection CTA
â”‚   â”‚   â”‚   â”œâ”€â”€ DashboardSidebar.jsx # Credential + quick actions
â”‚   â”‚   â”‚   â””â”€â”€ DashboardActivityFeed.jsx # Endorsement timeline
â”‚   â”‚   â””â”€â”€ discover/       # Discover Workers sub-components
â”‚   â”‚       â”œâ”€â”€ WorkerCard.jsx    # Individual worker row card
â”‚   â”‚       â””â”€â”€ FilterBar.jsx     # Skill/city/rating filters
â”‚   â”œâ”€â”€ context/            # React Context providers
â”‚   â”‚   â”œâ”€â”€ WalletContext.jsx # Wallet state management
â”‚   â”‚   â””â”€â”€ ToastContext.jsx  # Toast notification system
â”‚   â”œâ”€â”€ hooks/              # Custom React hooks
â”‚   â”‚   â”œâ”€â”€ useHorizonMetrics.js # Horizon API polling hook
â”‚   â”‚   â””â”€â”€ usePlatformStats.js  # Real-time platform stats
â”‚   â”œâ”€â”€ lib/                # Core business logic (JSDoc annotated)
â”‚   â”‚   â”œâ”€â”€ stellar.js      # Stellar SDK interactions + /api/fee-bump client
â”‚   â”‚   â”œâ”€â”€ stellar-config.js # Centralized network configuration
â”‚   â”‚   â”œâ”€â”€ freighter.js    # Freighter wallet integration
â”‚   â”‚   â”œâ”€â”€ reputation.js   # Reputation score calculation (JSDoc typed)
â”‚   â”‚   â””â”€â”€ toast.js        # Toast bridge for non-React code
â”‚   â”œâ”€â”€ pages/              # Route-level page components
â”‚   â”‚   â”œâ”€â”€ Landing.jsx     # Composed from landing/ sub-components
â”‚   â”‚   â”œâ”€â”€ WorkerRegistration.jsx # 3-step credential minting
â”‚   â”‚   â”œâ”€â”€ Endorse.jsx     # Endorsement submission
â”‚   â”‚   â”œâ”€â”€ Verify.jsx      # Credential verification
â”‚   â”‚   â”œâ”€â”€ Dashboard.jsx   # Composed from dashboard/ sub-components
â”‚   â”‚   â”œâ”€â”€ DiscoverWorkers.jsx # Composed from discover/ sub-components
â”‚   â”‚   â”œâ”€â”€ WorkerProfile.jsx # Individual worker profile
â”‚   â”‚   â”œâ”€â”€ Analytics.jsx   # Network metrics dashboard
â”‚   â”‚   â”œâ”€â”€ Explorer.jsx    # On-chain credential explorer
â”‚   â”‚   â”œâ”€â”€ HowItWorks.jsx  # Detailed feature walkthrough
â”‚   â”‚   â”œâ”€â”€ About.jsx       # About the platform
â”‚   â”‚   â”œâ”€â”€ Contact.jsx     # Contact information
â”‚   â”‚   â”œâ”€â”€ Mission.jsx     # Mission statement
â”‚   â”‚   â”œâ”€â”€ AdminLogs.jsx   # System monitoring dashboard
â”‚   â”‚   â””â”€â”€ NotFound.jsx    # 404 page
â”‚   â”œâ”€â”€ services/           # External service integrations
â”‚   â”‚   â”œâ”€â”€ indexer.js      # Horizon-based data indexer
â”‚   â”‚   â””â”€â”€ eventParser.js  # Transaction parsing & filtering
â”‚   â”œâ”€â”€ utils/              # Utility functions (JSDoc annotated)
â”‚   â”‚   â”œâ”€â”€ validation.js   # Input validation & sanitization
â”‚   â”‚   â”œâ”€â”€ feeBump.js      # Fee bump transaction builder
â”‚   â”‚   â”œâ”€â”€ monitor.js      # Error & transaction logging
â”‚   â”‚   â””â”€â”€ stellar-errors.js # Horizon error code decoder
â”‚   â”œâ”€â”€ test/               # Vitest test suites (93 tests)
â”‚   â”‚   â”œâ”€â”€ components.test.jsx  # Component smoke tests
â”‚   â”‚   â”œâ”€â”€ reputation.test.js   # Reputation scoring tests
â”‚   â”‚   â”œâ”€â”€ validation.test.js   # Input validation tests
â”‚   â”‚   â”œâ”€â”€ monitor.test.js      # Logging utility tests
â”‚   â”‚   â””â”€â”€ feeBump.test.js      # Fee bump transaction tests
â”‚   â”œâ”€â”€ App.jsx             # Route definitions
â”‚   â”œâ”€â”€ main.jsx            # Entry point with providers
â”‚   â””â”€â”€ index.css           # Global styles & Tailwind config
â”œâ”€â”€ public/                 # Static assets
â”œâ”€â”€ SECURITY.md             # Security checklist (41 checks)
â”œâ”€â”€ vercel.json             # Deployment config with security headers
â”œâ”€â”€ .env                    # Client env vars only (no secrets)
â””â”€â”€ package.json            # Dependencies
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
| `fetchLatestLedger()` | None | `{ sequence, closedAt }` | Latest ledger sequence and close time |

#### Reputation Engine (`src/lib/reputation.js`)

| Function | Parameters | Returns | Description |
|----------|-----------|---------|-------------|
| `calculateScore(endorsements)` | Endorsement[] | `{ average, total, breakdown }` | Weighted reputation score with star distribution |

### Environment Variables

| Variable | Location | Description | Required |
|----------|----------|-------------|----------|
| `VITE_CREDENTIAL_CONTRACT_ID` | `.env` (client) | Soroban credential contract address | Yes |
| `VITE_REPUTATION_CONTRACT_ID` | `.env` (client) | Soroban reputation contract address | Yes |
| `VITE_SPONSOR_PUBLIC_KEY` | `.env` (client) | Sponsor public key for indexer queries | Yes |
| `SPONSOR_SECRET` | Vercel Dashboard (server-side only) | Stellar secret key for fee sponsorship | Yes |

> âš ï¸ **Security:** `SPONSOR_SECRET` must **never** be prefixed with `VITE_`. Any `VITE_`-prefixed variable is embedded in the client-side JavaScript bundle and visible to anyone.

---

## ðŸš€ Getting Started

### Prerequisites
- Node.js >= 18.x
- [Freighter Wallet](https://www.freighter.app/) set to **Mainnet (Pubnet)**

### Installation
```bash
git clone https://github.com/OmcarSN/TrustChain.git
cd TrustChain
npm install
npm run dev
```

App runs at `http://localhost:5173`

### Run Tests
```bash
npx vitest run
# âœ… 93 tests across 11 suites
```

### Environment Setup
```bash
cp .env.example .env
# Edit .env with your contract IDs and sponsor public key
# Set SPONSOR_SECRET in Vercel Dashboard â†’ Settings â†’ Environment Variables
```

### Build for Production
```bash
npm run build
```

---

## ðŸ“Š User Feedback & Validation

### Feedback Collection

- **Google Form:** [TrustChain Feedback Form](https://docs.google.com/forms/d/e/1FAIpQLSc9x0prppbJZpEPGv_HJmZESKKAikCJ5IH1SUXl5aX20ekWLQ/viewform?usp=publish-editor)
- **Exported Data:** [user-feedback.xlsx](./user-feedback.xlsx)
- **Total Responses:** 30 verified users âœ…

### Feedback Summary (30 Responses)

#### Overall Rating Distribution
| Rating | Count | Percentage |
|--------|-------|------------|
| â­â­â­â­â­ (5/5) | 27 | 90% |
| â­â­â­â­ (4/5) | 2 | 6.7% |
| â­â­â­ (3/5) | 1 | 3.3% |
| **Average** | **4.87 / 5** | â€” |

#### All User Responses

| # | User | Rating | What They Liked | Improvement Suggestion |
|---|------|--------|----------------|----------------------|
| 1 | Devyani Sanjay Gofan | â­â­â­â­â­ | The overall experience is excellent and reliable | No improvements needed, everything is working great |
| 2 | Yash Annadate | â­â­â­â­â­ | Helpful application, can find trustworthy workers | Work on more concise UI, easy to understand for new users |
| 3 | Sanjivani Gofan | â­â­â­â­â­ | Easy to use interface, system is well organised | Platform is already very efficient and well designed |
| 4 | Aditya Sanjay Gofan | â­â­â­â­â­ | Features are easy to understand, everything works smoothly | Everything looks good and works perfectly |
| 5 | Shubham Golekar | â­â­â­â­â­ | UI is very good | â€” |
| 6 | Lilavati Gofan | â­â­â­â­â­ | Easy to understand, helps complete tasks quickly | Satisfied with features and performance |
| 7 | Prerana Ravindra More | â­â­â­â­â­ | Clean design and easy navigation | Everything is working perfectly |
| 8 | Priyanka Nanavare | â­â­â­â­â­ | Its UI | Add multiple languages |
| 9 | Anuj Patil | â­â­â­â­â­ | Everything is amazing | Good |
| 10 | Meghiya Tulse | â­â­â­â­â­ | â€” | â€” |
| 11 | Kartik Botre | â­â­â­â­â­ | Flow | Nothing right now |
| 12 | Stallon Joseph | â­â­â­â­â­ | I like the UI | Add multiple language options |
| 13 | Sanjay Gofan | â­â­â­â­â­ | Well designed platform, easy to understand for new users | Everything is good, no additional improvements required |
| 14 | Kajal Mahajan | â­â­â­â­â­ | Very simple to use, saves a lot of time | System is already efficient and user-friendly |
| 15 | Manisha Khatpe | â­â­â­â­ | I like the idea most | Add QR code option for employees |
| 16 | Piyush Bawalekar | â­â­â­â­â­ | I like the UI and idea | Work on adding more options |
| 17 | Ayush Gaikwad | â­â­â­â­â­ | Unique application | Everything is great |
| 18 | Govind Mote | â­â­â­â­â­ | App UI/UX design is very nice | â€” |
| 19 | Khushi Nagare | â­â­â­â­â­ | Everything is nice and working properly | UI should be better but overall everything is good |
| 20 | Thanchan Bhumij | â­â­â­â­â­ | Transparency | Add some attractive things in the homepage |
| 21 | Sudam Nanavare | â­â­â­ | Simplicity | Add multiple language support and contact details of worker |
| 22 | Pooja Nanavare | â­â­â­â­â­ | Idea of TrustChain and the logic behind it | No improvement needed, everything works perfectly |
| 23 | Pranali Ganesh Taware | â­â­â­â­â­ | Everything | Nothing |
| 24 | Pallavi Patil | â­â­â­â­â­ | User-friendly, fast-loading, and mobile-responsive | Nothing for now |
| 25 | Mayuresh Taware | â­â­â­â­â­ | â€” | â€” |
| 26 | Sakshi Dhanna | â­â­â­â­â­ | User friendly | High speed performance |
| 27 | Sagar Khilare | â­â­â­â­â­ | The certificate is trusted, enabling a secure connection | Nothing |
| 28 | Narayan Mote | â­â­â­â­â­ | Easy to use navigation | You should update UI |
| 29 | Raghav Shastri | â­â­â­ | Good idea | You should more work on logic |
| 30 | Gauri Shinde | â­â­â­â­ | Simplicity | Multiple things like QR code, languages, contact numbers |

### Key Feedback Themes

| Theme | Frequency | Action Taken |
|-------|-----------|-------------|
| ðŸŽ¨ **UI/UX praised** | 15+ users | âœ… Continued premium design |
| ðŸŒ **Multi-language support** | 4 users | âœ… Hindi added |
| ðŸ“± **QR code sharing** | 2 users | ðŸ”œ Planned for next iteration |
| ðŸ“ž **Contact details** | 2 users | ðŸ”œ Under consideration |
| âš¡ **Easy to use** | 10+ users | âœ… Maintained simplicity |

---

## ðŸ‘› User Wallet Addresses (Bootcamp Phase)

> âœ… **30 verified users onboarded with active Stellar wallets during the RiseIn Bootcamp phase (initially on Testnet, now migrated to Mainnet)**

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

> âœ… **30 responses collected and exported to user-feedback.xlsx**
>
> ðŸ“Š [Download user-feedback.xlsx](./user-feedback.xlsx)

---

## ðŸ¦ Community Contribution

> ðŸ“¢ **Twitter/X Post:** [View on X/Twitter](https://x.com/i/status/2042962447297057275)
>
> Posted about TrustChain's mission with screenshots of Analytics dashboard + homepage to empower 2B+ informal economy workers with decentralized, verifiable credentials on Stellar.

---

## ðŸ”„ Startup Roadmap & Milestones

### âœ… Completed Milestones

| Milestone | Description | Evidence |
|-----------|-------------|----------|
| MVP Development | Full-featured credential + endorsement platform | [Live Demo](https://trust-chain-mocha.vercel.app/) |
| Soroban Smart Contracts | Credential & Reputation contracts in Rust | [View on Stellar Expert](https://stellar.expert/explorer/public/contract/CCBIIOQMO4BOHZ7RTL7FQDQJCLNRUR7JMNWHDBO4L6QMISLB3UZHDTU4) |
| Mainnet Deployment | Both contracts deployed on Stellar Mainnet | Contract IDs in README |
| Gasless Onboarding | Sponsor wallet funds new accounts + pays all fees | `/api/build-mint.js` + `/api/fee-bump.js` |
| Phone Verification | Twilio OTP-based Sybil resistance | `/api/send-otp.js` + `/api/verify-otp.js` |
| User Validation | 30 real users tested, 4.8/5 avg rating | [user-feedback.xlsx](./user-feedback.xlsx) |
| Security Hardening | Rate limiting, CORS, input sanitization, 93 automated tests | [SECURITY.md](./SECURITY.md) |
| CI/CD Pipeline | 8-stage automated GitHub Actions workflow | [ci.yml](./.github/workflows/ci.yml) |
| Multi-Language Support | English + Hindi localization | `src/locales/` |
| DAO Governance UI | Full governance dashboard (frontend built) | `src/pages/Governance.jsx` |
| Community Contribution | Twitter post about TrustChain's mission | [View Post](https://x.com/i/status/2042962447297057275) |

### ðŸ”œ Next Milestones (Level 7 â€” Startup Track)

| Milestone | Target | Timeline |
|-----------|--------|----------|
| **User Growth: 500 Workers** | Direct field onboarding in Pune & Mumbai | Month 1-3 |
| **Governance Contract Deployment** | Deploy DAO governance contract on Mainnet | Month 1 |
| **QR Code Profile Sharing** | Offline-first sharing for workers without internet | Month 2 |
| **Verification API (B2B)** | REST API for employers to verify credentials programmatically | Month 3 |
| **Marathi Language Support** | Expand accessibility for Maharashtra's 80M+ Marathi speakers | Month 2 |
| **Microfinance Partnership (Pilot)** | Partner with 1 NBFC to use reputation scores as credit signals | Month 4-6 |
| **Mobile-First Redesign** | PWA optimized for low-end Android devices on 3G/4G | Month 3-4 |
| **Photo Evidence System** | Workers attach work photos to endorsements for richer profiles | Month 4 |
| **Employer Dashboard** | Dedicated interface for businesses to manage verifications | Month 5 |
| **Revenue: First Paying Customer** | Staffing agency or employer account subscription | Month 6 |
| **AI Worker Matching** | Smart recommendations matching worker skills to job requirements | Month 6-8 |
| **Multi-City Expansion** | Launch in Delhi, Bangalore, Hyderabad | Month 6-9 |
| **SCF Grant Application** | Apply to Stellar Community Fund with demonstrated traction | Month 6 |

### ðŸ“ˆ Past Iteration â€” Based on User Feedback (30 Responses)

| Improvement | Feedback Source | Status |
|------------|----------------|--------|
| Analytics Dashboard | Sarthak Kharat: "Add analytics" | âœ… Shipped |
| Toast Notifications | Sarthak Kharat: "Add notifications" | âœ… Shipped |
| UI Polish | Thanchan, Khushi, Narayan: "Improve UI" | âœ… Shipped |
| Multi-Language | Priyanka, Stallon, Sudam, Gauri: "Add languages" | âœ… Hindi shipped |
| QR Code Sharing | Manisha, Gauri: "Add QR code" | ðŸ”œ Planned |
| Worker Contact Details | Sudam, Gauri: "Add contact numbers" | ðŸ”œ Planned |

---

## ðŸ“„ License

MIT License â€” see [LICENSE](./LICENSE) for details.

---

### Built with â¤ï¸ on Stellar

**TrustChain** â€” Empowering the informal economy with decentralized trust.

[![Stellar](https://img.shields.io/badge/Powered_by-Stellar-7c3aed?style=flat-square&logo=stellar)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Smart_Contracts-Soroban-orange?style=flat-square)](https://soroban.stellar.org)
[![Freighter](https://img.shields.io/badge/Wallet-Freighter-blue?style=flat-square)](https://freighter.app)
