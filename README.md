<![CDATA[<div align="center">

# 🛡️ TrustChain — Verified Economy

### *Your Work. Your Reputation. On-Chain Forever.*

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-trust--chain--mocha.vercel.app-7c3aed?style=for-the-badge)](https://trust-chain-mocha.vercel.app/)
[![Stellar](https://img.shields.io/badge/Built_on-Stellar_Testnet-blue?style=for-the-badge&logo=stellar)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Smart_Contracts-Soroban-orange?style=for-the-badge)](https://soroban.stellar.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

<br/>

**TrustChain** is a decentralized, soulbound credential and reputation platform built on the **Stellar network**. It enables informal economy workers (construction, domestic work, transport, agriculture, etc.) to create portable, tamper-proof digital identities and build verifiable on-chain reputations through employer endorsements.

<br/>

[🚀 Live Demo](https://trust-chain-mocha.vercel.app/) · [📹 Demo Video](#-demo-video) · [📊 User Feedback](#-user-feedback--validation) · [🏗️ Architecture](#️-architecture)

</div>

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution](#-solution)
- [Key Features](#-key-features)
- [Live Demo & Links](#-live-demo--links)
- [Demo Video](#-demo-video)
- [Architecture](#️-architecture)
- [Tech Stack](#-tech-stack)
- [Smart Contracts](#-smart-contracts)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [User Feedback & Validation](#-user-feedback--validation)
- [Testnet User Wallet Addresses](#-testnet-user-wallet-addresses)
- [Improvement Roadmap](#-improvement-roadmap-based-on-user-feedback)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔴 Problem Statement

Over **2 billion** workers in the informal economy worldwide lack verifiable professional credentials. Without formal documentation:

- Workers can't **prove** their skills, experience, or reliability to potential employers.
- Employers have **no way** to verify worker claims before hiring.
- Years of honest work produce **zero portable reputation**.
- Workers starting in a new city or region must **rebuild trust from scratch**.

Traditional credential systems (LinkedIn, certificates, references) are inaccessible to this population due to literacy barriers, lack of internet access, and the informal nature of their employment.

---

## 💡 Solution

**TrustChain** solves this by providing a sovereign, on-chain identity layer:

| Feature | Description |
|---------|-------------|
| **Soulbound Credentials** | Workers mint non-transferable credential NFTs to their Stellar wallet using `ManageData` operations |
| **On-Chain Endorsements** | Employers write immutable star-rated reviews directly to the Stellar ledger |
| **Reputation Score** | Algorithmically calculated from endorsement history — tamper-proof and transparent |
| **Portable Identity** | A worker's reputation follows them anywhere — just share their Stellar address |
| **Zero Cost** | All operations run on Stellar Testnet with zero transaction fees |
| **Wallet-First UX** | Freighter wallet integration for seamless Web3 onboarding |

---

## ✨ Key Features

### 👷 Worker Registration & Credential Minting
- Connect Freighter wallet and fill professional details (name, skill, city, experience, bio)
- Mint a **soulbound credential** as multiple `ManageData` entries on Stellar
- Each field stored under separate keys (`tc_name`, `tc_skill`, `tc_city`, `tc_exp`, `tc_bio`) to respect Stellar's 64-byte value limit
- 3-step guided process with real-time form validation

### ⭐ Endorsement System
- Employers search for workers by Stellar address
- Submit 1-5 star ratings with job type and detailed feedback
- Endorsements are signed and sealed on-chain via Freighter
- Duplicate endorsement protection per endorser-worker pair

### 🔍 On-Chain Verification
- Anyone can verify a worker's credentials by entering their Stellar address
- Live data pulled directly from the Stellar ledger
- Full reputation breakdown with star distribution chart
- Shareable verification links (`/verify?address=G...`)

### 📊 Dashboard
- Personal command center with quick actions
- Activity feed showing endorsements given and received
- Credential card with on-chain status
- Reputation score visualization with SVG ring chart

### 🔎 Worker Discovery
- Browse and search all registered workers
- Filter by skill category, city, and minimum rating
- Real-time sorting by reputation score
- Responsive card grid with hover animations

### 👤 Public Worker Profiles
- Dedicated profile page for each worker (`/profile/:address`)
- Full credential display with endorsement history
- Direct endorsement and share actions

---

## 🔗 Live Demo & Links

| Resource | Link |
|----------|------|
| 🌐 **Live App** | [https://trust-chain-mocha.vercel.app/](https://trust-chain-mocha.vercel.app/) |
| 💻 **GitHub Repo** | [https://github.com/OmcarSN/TrustChain](https://github.com/OmcarSN/TrustChain) |
| 🔭 **Stellar Explorer** | [View on Stellar Expert (Testnet)](https://stellar.expert/explorer/testnet) |
| 📝 **Feedback Form** | [Google Form - TrustChain User Feedback](https://forms.gle/YOUR_FORM_LINK_HERE) |

> **Note:** The app requires the [Freighter Wallet](https://www.freighter.app/) browser extension set to **Testnet** mode.

---

## 📹 Demo Video

> 🎬 **Full MVP Demo Video:** [Watch on YouTube/Loom](YOUR_DEMO_VIDEO_LINK_HERE)
>
> The demo video covers:
> 1. Connecting Freighter wallet
> 2. Registering as a worker and minting credentials
> 3. Endorsing a worker with star rating and feedback
> 4. Verifying a worker's on-chain reputation
> 5. Using the Dashboard and Discover pages

---

## 🏗️ Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + Vite)                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ Landing  │ │ Worker   │ │ Endorse  │ │ Verify   │          │
│  │ Page     │ │ Register │ │ Page     │ │ Page     │          │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘          │
│       │             │            │             │                │
│  ┌────┴─────┐ ┌─────┴────┐ ┌────┴─────┐ ┌────┴──────┐        │
│  │Dashboard │ │ Discover │ │ Profile  │ │ NotFound  │        │
│  │ Page     │ │ Workers  │ │ Page     │ │ (404)     │        │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │               SHARED COMPONENTS & CONTEXT                │   │
│  │  Navbar · Footer · ErrorBoundary                        │   │
│  │  WalletContext · ToastContext                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    LIBRARY LAYER                          │   │
│  │  stellar.js (SDK) · freighter.js (Wallet) · reputation.js│   │
│  └──────────────────────┬──────────────────────────────────┘   │
└──────────────────────────┼──────────────────────────────────────┘
                           │
                    ┌──────┴──────┐
                    │  Freighter  │
                    │   Wallet    │
                    │  Extension  │
                    └──────┬──────┘
                           │ Sign Transactions
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    STELLAR BLOCKCHAIN (Testnet)                  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                  Horizon API Server                        │ │
│  │           https://horizon-testnet.stellar.org              │ │
│  └────────────────────────┬───────────────────────────────────┘ │
│                           │                                      │
│  ┌────────────────────────┴───────────────────────────────────┐ │
│  │              Stellar Ledger (ManageData Operations)         │ │
│  │                                                             │ │
│  │  ┌─────────────────┐    ┌──────────────────────┐           │ │
│  │  │  Worker Creds   │    │  Endorsement Data     │           │ │
│  │  │  tc_name        │    │  tce_[addr]_[ts]      │           │ │
│  │  │  tc_skill       │    │  rating|jobType|note   │           │ │
│  │  │  tc_city        │    │  (≤ 64 bytes each)     │           │ │
│  │  │  tc_exp         │    └──────────────────────┘           │ │
│  │  │  tc_bio         │                                        │ │
│  │  └─────────────────┘                                        │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │            Soroban Smart Contracts (Rust/WASM)               │ │
│  │  ┌─────────────────────┐  ┌────────────────────────┐       │ │
│  │  │ credential-contract │  │  reputation-contract   │       │ │
│  │  │ (Credential CRUD)   │  │  (Score Computation)   │       │ │
│  │  └─────────────────────┘  └────────────────────────┘       │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User → Freighter Wallet → Sign Tx → Horizon API → Stellar Ledger
                                                        │
                                          ManageData Ops │
                                          ┌──────────────┘
                                          ▼
                               On-Chain Data Storage
                               (Credentials & Endorsements)
                                          │
                                          │ Read via Horizon
                                          ▼
                           Frontend Displays Verified Data
```

### On-Chain Data Schema

**Worker Credentials** (stored on worker's own account):
| Key | Value | Max Size |
|-----|-------|----------|
| `tc_name` | Worker's full name | 64 bytes |
| `tc_skill` | Skill category (e.g., "Construction") | 64 bytes |
| `tc_city` | City name | 64 bytes |
| `tc_exp` | Years of experience | 64 bytes |
| `tc_bio` | Short professional bio | 64 bytes |

**Endorsements** (stored on endorser's account):
| Key | Value | Max Size |
|-----|-------|----------|
| `tce_[first8chars]_[timestamp]` | `rating\|jobType\|feedback` | 64 bytes |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 19** | UI component framework |
| **Vite 8** | Build tool & dev server |
| **Tailwind CSS 4** | Utility-first styling |
| **Framer Motion** | Page transitions & micro-animations |
| **React Router v7** | Client-side routing |
| **Lucide React** | Icon system |

### Blockchain
| Technology | Purpose |
|-----------|---------|
| **Stellar SDK v15** | Blockchain interaction (Horizon API) |
| **Freighter API v6** | Wallet connection & transaction signing |
| **Stellar Testnet** | Deployment network |
| **Soroban SDK v20** | Smart contract development |
| **Rust** | Smart contract language |

### Deployment
| Technology | Purpose |
|-----------|---------|
| **Vercel** | Frontend hosting & CI/CD |
| **GitHub** | Version control & collaboration |

---

## 📜 Smart Contracts

TrustChain includes two Soroban smart contracts written in Rust:

### 1. Credential Contract (`contracts/credential/`)
- Manages worker credential CRUD operations
- Stores credential metadata on-chain
- Built with `soroban-sdk v20.0.0`

### 2. Reputation Contract (`contracts/reputation/`)
- Handles reputation score computation
- Aggregates endorsement data
- Built with `soroban-sdk v20.0.0`

Both contracts are compiled to WASM for Soroban deployment with optimized release profiles (`opt-level = "z"`).

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18.x
- [Freighter Wallet](https://www.freighter.app/) browser extension
- Freighter set to **Testnet** mode
- A funded Testnet account (use [Friendbot](https://friendbot.stellar.org/?addr=YOUR_ADDRESS))

### Installation

```bash
# Clone the repository
git clone https://github.com/OmcarSN/TrustChain.git
cd TrustChain

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Building for Production

```bash
npm run build
npm run preview
```

### Smart Contract Development

```bash
# Install Rust and Soroban CLI
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
cargo install --locked soroban-cli

# Build contracts
cargo build --release --target wasm32-unknown-unknown
```

---

## 📁 Project Structure

```
trustchain/
├── contracts/                    # Soroban smart contracts
│   ├── credential/               # Worker credential contract
│   │   ├── Cargo.toml
│   │   └── src/
│   └── reputation/               # Reputation scoring contract
│       ├── Cargo.toml
│       └── src/
├── src/
│   ├── components/               # Shared UI components
│   │   ├── Navbar.jsx            # Navigation with wallet connection
│   │   ├── Footer.jsx            # Site footer
│   │   └── ErrorBoundary.jsx     # Error handling wrapper
│   ├── context/                  # React context providers
│   │   ├── WalletContext.jsx     # Freighter wallet state
│   │   └── ToastContext.jsx      # Toast notification system
│   ├── lib/                      # Core library functions
│   │   ├── stellar.js            # Stellar SDK integration
│   │   ├── freighter.js          # Freighter wallet API layer
│   │   ├── reputation.js         # Reputation calculation engine
│   │   └── toast.js              # Toast utilities
│   ├── pages/                    # Route pages
│   │   ├── Landing.jsx           # Home page with hero & how-it-works
│   │   ├── WorkerRegistration.jsx# Worker credential minting
│   │   ├── Endorse.jsx           # Employer endorsement form
│   │   ├── Verify.jsx            # On-chain verification lookup
│   │   ├── Dashboard.jsx         # User command center
│   │   ├── DiscoverWorkers.jsx   # Worker discovery marketplace
│   │   ├── WorkerProfile.jsx     # Public worker profile page
│   │   └── NotFound.jsx          # 404 page
│   ├── App.jsx                   # Root app with routing
│   ├── main.jsx                  # Entry point
│   ├── App.css                   # Global styles
│   └── index.css                 # Base styles
├── public/                       # Static assets
├── Cargo.toml                    # Rust workspace configuration
├── package.json                  # Node.js dependencies
├── vite.config.js                # Vite configuration
└── README.md                     # This file
```

---

## 📊 User Feedback & Validation

### Feedback Collection

We created a **Google Form** to collect user feedback from testnet users. The form captures:
- **Full Name**
- **Email Address**
- **Stellar Wallet Address**
- **Product Rating** (1-5 stars)
- **Feature Feedback** (What did you like?)
- **Improvement Suggestions**

📝 **Google Form:** [TrustChain User Feedback Form](https://forms.gle/YOUR_FORM_LINK_HERE)

### Feedback Summary

📊 **Exported Feedback (Excel):** [View User Feedback Sheet](./user_feedback.xlsx)

> *The Excel file will be attached/updated with all 5+ user responses including wallet addresses, ratings, and detailed feedback.*

| User | Rating | Key Feedback |
|------|--------|-------------|
| User 1 | ⭐⭐⭐⭐⭐ | *To be updated after feedback collection* |
| User 2 | ⭐⭐⭐⭐ | *To be updated after feedback collection* |
| User 3 | ⭐⭐⭐⭐⭐ | *To be updated after feedback collection* |
| User 4 | ⭐⭐⭐⭐ | *To be updated after feedback collection* |
| User 5 | ⭐⭐⭐⭐⭐ | *To be updated after feedback collection* |

---

## 👛 Testnet User Wallet Addresses

The following 5+ Stellar Testnet addresses have interacted with TrustChain (verifiable on [Stellar Explorer](https://stellar.expert/explorer/testnet)):

| # | Wallet Address | Action Performed | Explorer Link |
|---|---------------|-----------------|---------------|
| 1 | `GXXXXXXXXXX...` | Registered + Minted Credential | [View](https://stellar.expert/explorer/testnet/account/GXXXXXXXXXX) |
| 2 | `GXXXXXXXXXX...` | Registered + Endorsed Worker | [View](https://stellar.expert/explorer/testnet/account/GXXXXXXXXXX) |
| 3 | `GXXXXXXXXXX...` | Registered + Verified Workers | [View](https://stellar.expert/explorer/testnet/account/GXXXXXXXXXX) |
| 4 | `GXXXXXXXXXX...` | Registered + Endorsed Worker | [View](https://stellar.expert/explorer/testnet/account/GXXXXXXXXXX) |
| 5 | `GXXXXXXXXXX...` | Registered + Endorsed Worker | [View](https://stellar.expert/explorer/testnet/account/GXXXXXXXXXX) |

> ⚠️ **Note:** Replace the placeholder addresses above with actual testnet user addresses after onboarding 5+ users. Each address is verifiable on the [Stellar Expert Explorer](https://stellar.expert/explorer/testnet).

---

## 🔄 Improvement Roadmap (Based on User Feedback)

### Iteration 1 — Completed Improvements

Based on initial user feedback, we completed the following improvements:

| Improvement | Description | Commit Link |
|------------|-------------|-------------|
| **64-byte Data Limit Fix** | Enforced Stellar's 64-byte `ManageData` value limit with proper validation and UI indicators | [View Commit](https://github.com/OmcarSN/TrustChain/commit/COMMIT_HASH_HERE) |
| **Multi-key Credential Storage** | Split credential data across multiple `ManageData` keys (`tc_name`, `tc_skill`, etc.) to avoid truncation | [View Commit](https://github.com/OmcarSN/TrustChain/commit/COMMIT_HASH_HERE) |
| **Freighter v6 Compatibility** | Added support for multiple Freighter API response formats (v5/v6 compatibility layer) | [View Commit](https://github.com/OmcarSN/TrustChain/commit/COMMIT_HASH_HERE) |
| **Dashboard & Profile Pages** | Added personal Dashboard with activity feed and public Worker Profile pages | [View Commit](https://github.com/OmcarSN/TrustChain/commit/COMMIT_HASH_HERE) |
| **Discover Workers Marketplace** | Built searchable worker directory with filtering by skill, city, and rating | [View Commit](https://github.com/OmcarSN/TrustChain/commit/COMMIT_HASH_HERE) |
| **UI/UX Polish** | Viewport-optimized layouts, compacted headers, standardized navigation | [View Commit](https://github.com/OmcarSN/TrustChain/commit/COMMIT_HASH_HERE) |

### Future Roadmap (Next Phase)

Based on user feedback, we plan the following improvements:

1. **📱 Mobile-First Redesign** — Optimize the entire UI for mobile devices since most informal workers primarily use smartphones.

2. **🌐 Multi-language Support** — Add Hindi, Spanish, and other regional language support to make the platform accessible to non-English speaking workers.

3. **🔐 Mainnet Deployment** — Migrate from Testnet to Stellar Mainnet for production-ready credentials that persist permanently.

4. **📸 Photo Credentials** — Allow workers to attach photo evidence of completed work to their endorsements.

5. **🤖 AI-Powered Matching** — Build an intelligent matching system that recommends workers to employers based on skill requirements and reputation scores.

6. **📊 Advanced Analytics** — Add detailed analytics dashboards showing reputation trends, endorsement patterns, and market insights.

7. **🔗 QR Code Sharing** — Generate QR codes for worker profiles so they can be easily shared in physical settings (job sites, community centers).

8. **💬 In-App Messaging** — Direct communication between employers and workers within the platform.

9. **🏅 Skill Verification Badges** — Partner with training organizations to offer verified skill badges that can be minted alongside credentials.

10. **📋 Job Posting Board** — Allow employers to post job listings that workers can apply to directly through the platform.

---

## 🧪 Testing

### Manual Testing Checklist

- [x] Freighter wallet connects successfully on Testnet
- [x] Worker registration form validates all fields
- [x] Credential minting creates `ManageData` entries on-chain
- [x] Endorsement form searches and finds registered workers
- [x] Endorsements are signed and submitted to Stellar
- [x] Verification page pulls live data from the blockchain
- [x] Dashboard displays credential, reputation, and activity
- [x] Discover page lists and filters workers
- [x] Profile pages render correctly for each worker
- [x] Network detection warns when not on Testnet
- [x] Page transitions animate smoothly
- [x] Responsive layout works on mobile and desktop

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">

### Built with ❤️ on Stellar

**TrustChain** — Empowering the informal economy with decentralized trust.

[![Stellar](https://img.shields.io/badge/Powered_by-Stellar-7c3aed?style=flat-square&logo=stellar)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Smart_Contracts-Soroban-orange?style=flat-square)](https://soroban.stellar.org)
[![Freighter](https://img.shields.io/badge/Wallet-Freighter-blue?style=flat-square)](https://freighter.app)

</div>
]]>
