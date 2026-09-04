# 💎 Rebate — The AI Wait-State Developer Opportunity & Reward Layer

> **"While your AI works, Rebate works for you."**

---

## ⚡ What is Rebate?

Developers increasingly delegate complex coding tasks to AI agents (such as Antigravity, Claude Code, OpenAI Codex, and OpenCode). During those wait periods, developers spend seconds or minutes waiting while the agent reasons, explores codebases, writes solutions, executes tools, and runs tests.

**Rebate converts that otherwise-wasted attention window into a non-intrusive, native opportunity and economic reward layer.**

Instead of showing generic advertisements or noisy popups, Rebate matches developers with curated, high-value opportunities:
* **Jobs & Engineering Residencies**
* **AI & Systems Internships**
* **Hackathons & Bounties**
* **Developer Tools & Frameworks**
* **Cloud Infrastructure & GPU Credits**
* **API Token Grants**

### The Core Economic Loop:
1. Advertisers bid to reach relevant developers based on skills, roles, and geography.
2. Rebate runs an auction balancing bid, relevance, and advertiser quality:
   $$\text{Rank} = \text{Bid} \times \text{Relevance} \times \text{Quality}$$
3. Developers see a native, **1-line status line** directly in their AI workflow.
4. Developers receive **70% of the economic value** directly into their Rebate wallet.

---

## 🛡 Hard Privacy Guarantees

Rebate operates on a strict **Zero Code / Zero Prompt Ingestion** policy:
* ❌ **NEVER** reads source code
* ❌ **NEVER** uploads project files
* ❌ **NEVER** reads or logs AI prompts
* ❌ **NEVER** accesses terminal history or private repos
* ❌ **NEVER** uses webcams, screenshots, or keystroke monitors
* ✔ **100% Voluntary Targeting**: Matches are made exclusively between advertiser campaign specifications and developer-declared profile attributes (skills, role, field, and optional geography).

---

## 🖥 The Native 1-Line CLI Experience

Rebate **never** opens intrusive popups, banners, or terminal modals:

```text
⠋ AI is thinking...
```

temporarily becomes:

```text
⠋ AI is thinking... • Sponsored: AI Engineering Internship — Apply [press o to view]
```

and the instant the AI completes reasoning:

```text
✔ AI finished reasoning.
```

* **No Earnings in CLI**: We strictly never display `+₹2.37` in the AI status line. Earnings belong in the developer's wallet to keep the terminal pristine.
* **Silent Failover**: If the Rebate backend is unreachable or no campaigns match, the developer workflow continues without interruption.

---

## 📦 Monorepo Structure

```text
Rebate/
├── apps/
│   ├── web/                         # Next.js 14 Web Application & API
│   │   ├── app/
│   │   │   ├── page.tsx             # Landing Page & Live Preview
│   │   │   ├── developer/           # Developer Center, Wallet & Onboarding
│   │   │   ├── advertiser/          # Advertiser Portal & Campaign Builder
│   │   │   ├── opportunity/[id]/    # Opportunity Detail ("Why am I seeing this?")
│   │   │   ├── demo/                # Interactive 60-Second Economic Simulator
│   │   │   └── api/                 # Auction, Ledger, Fraud, Profile Endpoints
│   │   └── lib/                     # Auction, Matching, Rewards & Fraud Engines
│   └── cli/                         # Lightweight Local Rebate Agent / Daemon
│       └── src/
│           ├── adapters/            # Adapters for Antigravity, Claude Code, Codex, OpenCode
│           ├── display/             # Clean 1-line terminal status renderer
│           ├── client/              # Resilient, non-blocking HTTP API client
│           └── index.ts             # Rebate CLI entrypoint
├── packages/
│   └── shared/                      # Shared types, constants, and policies
├── README.md                        # Documentation & Quickstart
├── ARCHITECTURE.md                  # Deep technical design
└── DEMO.md                          # Hackathon 60-second judging guide
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js 18+ (tested on Node v24)
- npm / npx

### 2. Installation & Database Seeding
```bash
# Clone and install dependencies
npm install

# Seed the database with 10 developers, 15 campaigns, and 20 opportunities
npm run seed
```

### 3. Start the Web Platform
```bash
npm run dev:web
# Web application live at http://localhost:3000
```

### 4. Run the Rebate Local CLI Agent
```bash
# Run the interactive demo simulation
npm run cli demo

# Or start the local daemon for your preferred agent
npm run cli start antigravity
# or: npm run cli start claude_code
```

---

## 🧪 Running Automated Tests

Rebate includes unit and integration tests covering the matching engine, hard geographic isolation, auction ranking, configurable rewards, anti-fraud rules, and failure isolation:

```bash
npm test
```

---

## 🧭 Key Navigation URLs

| Destination | Path | Description |
| :--- | :--- | :--- |
| **Landing Page** | [`/`](http://localhost:3000) | Overview, live visual preview, ecosystem architecture |
| **60s Demo Simulator** | [`/demo`](http://localhost:3000/demo) | Full visual economic loop simulation for hackathon judges |
| **Developer Center** | [`/developer`](http://localhost:3000/developer) | Multi-currency wallet, transaction history, matched opportunities |
| **Developer Onboarding** | [`/developer/onboarding`](http://localhost:3000/developer/onboarding) | Role, field, skills, optional location, and reward preference setup |
| **Advertiser Portal** | [`/advertiser`](http://localhost:3000/advertiser) | Campaign management, real-time CTR, verified impressions, spend |
| **Campaign Builder** | [`/advertiser/campaigns/new`](http://localhost:3000/advertiser/campaigns/new) | Create opportunity, define targeting, bid CPM, and budget |
| **Privacy & Trust** | [`/privacy`](http://localhost:3000/privacy) | Comprehensive privacy boundaries and zero-code reading manifesto |

---

## 📄 License
MIT © 2026 Rebate Team.
