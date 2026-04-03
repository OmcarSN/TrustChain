# 🛡️ TrustChain — Verified Economy
### *Your Work. Your Reputation. On-Chain Forever.*

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-trust--chain--mocha.vercel.app-7c3aed?style=for-the-badge)](https://trust-chain-mocha.vercel.app/)
[![Stellar](https://img.shields.io/badge/Built_on-Stellar_Testnet-blue?style=for-the-badge&logo=stellar)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Smart_Contracts-Soroban-orange?style=for-the-badge)](https://soroban.stellar.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

**TrustChain** is a decentralized, soulbound credential and reputation platform built on the **Stellar network**. It enables informal economy workers (construction, domestic work, transport, agriculture, etc.) to create portable, tamper-proof digital identities and build verifiable on-chain reputations through employer endorsements.

[🚀 Live Demo](https://trust-chain-mocha.vercel.app/) · [📹 Demo Video](#-demo-video) · [📊 User Feedback](#-user-feedback--validation) · [🏗️ Architecture](#️-architecture)

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
- [User Feedback & Validation](#-user-feedback--validation)
- [Testnet User Wallet Addresses](#-testnet-user-wallet-addresses)
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
| **Zero Cost** | All operations run on Stellar Testnet with near-zero transaction fees |
| **Wallet-First UX** | Freighter wallet integration for seamless Web3 onboarding |

---

## ✨ Key Features

### 👷 Worker Registration & Credential Minting
- Connect Freighter wallet and fill professional details
- Mint a soulbound credential as ManageData entries on Stellar
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
- Shareable verification links

### 📊 Dashboard
- Personal command center with quick actions
- Activity feed showing endorsements given and received
- Reputation score visualization

### 🔎 Worker Discovery
- Browse and search all registered workers
- Filter by skill category, city, and minimum rating
- Real-time sorting by reputation score

---

## 🔗 Live Demo & Links

| Resource | Link |
|----------|------|
| 🌐 **Live App** | [https://trust-chain-mocha.vercel.app/](https://trust-chain-mocha.vercel.app/) |
| 💻 **GitHub Repo** | [https://github.com/OmcarSN/TrustChain](https://github.com/OmcarSN/TrustChain) |
| 🔭 **Credential Contract** | [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CCQG7ZFOQX4H7OSUXDU2FE2J73XCUQLXP2FONFUMKXXDUP253J3JP6HZ) |
| 🔭 **Reputation Contract** | [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CAHH72L2C7XN32IKOIBLNODWQF4MLUJTJRZWFCU4JIUQEXLEEX3E52GI) |
| 📝 **Feedback Form** | [Google Form](https://docs.google.com/forms/d/e/1FAIpQLSdCP50NOzA3ppCr9hLYw_ZbJRXzGiJzKT7aPVDLxz365czW_Q/viewform?usp=publish-editor) |

> **Note:** The app requires the [Freighter Wallet](https://www.freighter.app/) browser extension set to **Testnet** mode.

---

## 📹 Demo Video

> 🎬 **Full MVP Demo Video:** [Watch Here](YOUR_DEMO_VIDEO_LINK_HERE)
>
> The demo covers:
> 1. Connecting Freighter wallet
> 2. Registering as a worker and minting credentials
> 3. Endorsing a worker with star rating and feedback
> 4. Verifying a worker's on-chain reputation
> 5. Using the Dashboard and Discover pages

---

## 🏗️ Architecture
┌─────────────────────────────────────────────────┐
│           FRONTEND (React + Vite)               │
│  Landing · Worker · Endorse · Verify            │
│  Dashboard · Discover · Profile · 404           │
│  WalletContext · ToastContext                   │
│  stellar.js · freighter.js · reputation.js      │
└──────────────────┬──────────────────────────────┘
│
┌────────┴────────┐
│ Freighter Wallet │
│   Extension      │
└────────┬────────┘
│ Sign Transactions
▼
┌─────────────────────────────────────────────────┐
│         STELLAR BLOCKCHAIN (Testnet)            │
│                                                 │
│  Horizon API: horizon-testnet.stellar.org       │
│                                                 │
│  ManageData Operations:                         │
│  tc_name · tc_skill · tc_city · tc_exp · tc_bio │
│  tce_[addr]_[timestamp] → rating|job|feedback   │
│                                                 │
│  Soroban Smart Contracts:                       │
│  credential-contract · reputation-contract      │
└─────────────────────────────────────────────────┘

### Smart Contract Addresses
| Contract | Address |
|----------|---------|
| Credential Contract | `CCQG7ZFOQX4H7OSUXDU2FE2J73XCUQLXP2FONFUMKXXDUP253J3JP6HZ` |
| Reputation Contract | `CAHH72L2C7XN32IKOIBLNODWQF4MLUJTJRZWFCU4JIUQEXLEEX3E52GI` |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite + Tailwind CSS |
| Animations | Framer Motion |
| Routing | React Router v7 |
| Blockchain | Stellar Testnet + Horizon API |
| Wallet | Freighter API v6 |
| Smart Contracts | Soroban SDK + Rust |
| Deployment | Vercel |

---

## 📜 Smart Contracts

### Credential Contract
- Manages worker credential operations
- Stores credential metadata on-chain
- Soulbound — non-transferable by design
- Address: `CCQG7ZFOQX4H7OSUXDU2FE2J73XCUQLXP2FONFUMKXXDUP253J3JP6HZ`

### Reputation Contract
- Handles reputation score computation
- Aggregates endorsement data
- Produces queryable scores
- Address: `CAHH72L2C7XN32IKOIBLNODWQF4MLUJTJRZWFCU4JIUQEXLEEX3E52GI`

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

### Build for Production
```bash
npm run build
```

---

## 📊 User Feedback & Validation

### Feedback Summary

| User | Rating | What They Liked | Improvement Suggestion |
|------|--------|----------------|----------------------|
| Yash Annadate | ⭐⭐⭐⭐⭐ | Overall best experience | Keep building and improving |
| Mrunal Ghorpade | ⭐⭐⭐⭐⭐ | Excellent UI | Nothing, everything is perfect |
| Thanchan Bhumij | ⭐⭐⭐⭐⭐ | Secure and transparent | UI can be improved |
| Priyanka Nanavare | ⭐⭐⭐⭐⭐ | Solves real world problems | Nothing |
| Anuj Patil | ⭐⭐⭐⭐⭐ | Everything is good | Some minor changes |
| Sarthak Kharat | ⭐⭐⭐⭐⭐ | Intuitive interface + robust verification | Add analytics and notifications |

📊 **Exported Feedback:** [user-feedback.xlsx](./user-feedback.xlsx)
📝 **Google Form:** [TrustChain Feedback Form](https://docs.google.com/forms/d/e/1FAIpQLSdCP50NOzA3ppCr9hLYw_ZbJRXzGiJzKT7aPVDLxz365czW_Q/viewform?usp=publish-editor)

---

## 👛 Testnet User Wallet Addresses

| # | Name | Wallet Address 
|---|------|---------------
| 1 | Yash Annadate | `GBWDGDXAN4AW22OBEQADIOSK2GE7EFNDLZDTBJV6AP33SEPTGNNGFDAE` | 
| 2 | Mrunal Ghorpade | `GAGKWDKAZYZ7GSK2K6YZGGEDEZXL2GEHDU2NMOAU4AVHSFAVZH336FFX` |  
| 3 | Thanchan Bhumij | `GDHPNSQINMCUNO6DOWO7HSAW5NTNO2MDY6LDHGKPJMGLUSUMLVWBJKJ6` |
| 4 | Priyanka Nanavare | `GCM5HJ6PGNITCR26FIWDQ62OQ4LTF7HDSMQTXH5GIVOFY7RKM5WR4PC6` |
| 5 | Anuj Patil | `GCFMMVOUOIAMWPOSA4354VADBAW3JFVMGOCJDZWSRDNVR5T6NXY3YAMN` | 
| 6 | Sarthak Kharat | `GBZVSOQ3M4VFC46JFB6I7IHSSU76MNUDLI62S7KWLTGFGPHHIEVBQEOU` | 

---

## 🔄 Improvement Roadmap (Based on User Feedback)

### Iteration 1 — Completed

| Improvement | Description | Commit |
|------------|-------------|--------|
| Multi-key Credential Storage | Split credential data across ManageData keys | [View](https://github.com/OmcarSN/TrustChain/commits/master) |
| Dashboard Page | Personal hub with activity feed | [View](https://github.com/OmcarSN/TrustChain/commits/master) |
| Worker Discovery | Searchable worker directory | [View](https://github.com/OmcarSN/TrustChain/commits/master) |
| UI/UX Polish | Viewport optimized layouts | [View](https://github.com/OmcarSN/TrustChain/commits/master) |

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
