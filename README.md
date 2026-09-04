# 💎 Rebate — The AI Wait-State Developer Opportunity & Reward Layer

> **"While your AI works, Rebate works for you."**

---

## ⚡ What is Rebate?

Modern developers delegate complex coding, debugging, refactoring, and test execution to AI agents (such as Google Antigravity, Claude Code, OpenAI Codex, and OpenCode). During these reasoning and tool execution cycles, developers spend valuable time waiting.

**Rebate converts that idle wait state into a native, high-value opportunity and economic reward layer.**

Instead of intrusive ads, popups, or banner noise, Rebate matches developers with curated, relevant engineering opportunities:
* 💼 **Jobs & Engineering Residencies**
* 🎓 **AI & Systems Internships**
* 🏆 **Hackathons & Bounties**
* 🛠 **Developer Tools & Frameworks**
* ⚡ **Cloud Infrastructure & GPU Credits**
* 🔑 **API Token Grants**

### The Economic Flywheel
1. **Advertisers Bid**: Tech companies, startups, and open-source foundations bid to reach relevant developers based on skills, roles, and geography.
2. **Dynamic Auction**: Rebate executes an auction balancing bid amount, skill relevance, and advertiser quality:
   $$\text{Rank} = \text{Bid CPM} \times \text{Relevance Score} \times \text{Quality Multiplier}$$
3. **Native 1-Line Status**: Developers receive a 1-line native status line directly in their AI terminal/agent workflow.
4. **Direct Economic Reward**: **70% of the economic value** is credited directly into the developer's Rebate wallet.

---

## 🛡 Zero-Knowledge Privacy Architecture

Rebate enforces a strict **Zero Code / Zero Prompt Ingestion** policy:

```
┌─────────────────────────────────────────────────────────────┐
│                      DEVELOPER WORKSPACE                    │
│                                                             │
│   ❌ Source Code           ❌ Git Repositories              │
│   ❌ AI Prompts            ❌ Terminal Commands             │
│   ❌ File Contents         ❌ Keylogs / Screen / Camera     │
│                                                             │
│       ────────────────── HARD WALL ──────────────────       │
│                                                             │
│   ✔ Voluntary Profile Metadata Only                         │
│     (Declared Role, Tech Stack, Voluntary Region)           │
└──────────────────────────────┬──────────────────────────────┘
                               │ Profile Match
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     REBATE AUCTION ENGINE                   │
│   - Ranked Matching by Skills & Stated Interests            │
│   - Hard Geographic Isolation Rules                         │
│   - 7-Layer Fraud & Rate Verification                       │
└─────────────────────────────────────────────────────────────┘
```

* ❌ **NEVER** reads source code or project files
* ❌ **NEVER** logs or intercepts AI prompts or model responses
* ❌ **NEVER** inspects terminal command history
* ✔ **100% Voluntary Profile Matching**: Matches are made exclusively using developer-declared profile attributes (skills, roles, field, and optional geography).
* ✔ **Hard Geographic Isolation**: Location-targeted campaigns strictly exclude non-matching regions. Developers who decline location sharing only receive global/unspecified campaigns.

---

## 🖥 The Native 1-Line CLI Experience

Rebate **never** breaks terminal focus or opens modal popups:

```text
⠋ AI is thinking...
```

dynamically transforms during wait states into:

```text
⠋ AI is thinking... • Sponsored: AI Systems Residency — Apply [press o to view]
```

and cleanly reverts the millisecond reasoning completes:

```text
✔ AI finished reasoning.
```

* **No Earnings Noise in Terminal**: Earnings (`+₹4.90`) are never displayed in the terminal thinking line to prevent clutter. Earning telemetry is kept in the web wallet.
* **Silent Non-Blocking Failover**: If the Rebate network is unreachable or no campaigns match, the agent runs normally without interruption.

---

## 🏛 System Architecture & Data Flow

```text
┌────────────────┐
│  AI Agent      │ (Antigravity, Claude Code, Codex, OpenCode)
└───────┬────────┘
        │ wait-state trigger (agent_waiting)
        ▼
┌────────────────┐
│ AgentAdapter   │ Translates agent lifecycle into standard events
└───────┬────────┘
        │ non-blocking event
        ▼
┌────────────────┐
│ Rebate CLI /   │ Requests eligible opportunity
│ Local Daemon   │
└───────┬────────┘
        │ POST /api/auction (developerId, sessionId)
        ▼
┌────────────────┐
│ Matching Engine│ Filters by Hard Geography, Skills, Roles, Education
└───────┬────────┘ (100% voluntary profile attributes; ZERO code reading)
        │ eligible candidates
        ▼
┌────────────────┐
│ Auction Engine │ Evaluates: Rank = Bid × Relevance × Quality
└───────┬────────┘ (Highest score wins; budget verified)
        │ winning opportunity + pending impression token
        ▼
┌────────────────┐
│ Local Display  │ Replaces "AI is thinking..." with 1-line sponsored status
└───────┬────────┘
        │ visible duration verified (min 8s) & agent finishes
        ▼
┌────────────────┐
│ Impression &   │ 7-Layer Fraud Checks (Cooldown, Hourly Cap, Anti-Replay)
│ Fraud Engine   │
└───────┬────────┘
        │ verified impression
        ▼
┌────────────────┐
│ Reward Engine  │ Configurable policy split (70% Developer / 30% Platform)
└───────┬────────┘ Multi-currency conversion (INR, USD, AI_CREDITS, etc.)
        │ credit transaction
        ▼
┌────────────────┐
│ Developer      │ Available balance increases;
│ Web Wallet     │ Recorded in earnings ledger
└────────────────┘
```

---

## 🔒 7-Layer Anti-Fraud Framework

| Layer | Guard | Mechanism |
| :---: | :--- | :--- |
| **1** | **Hourly Earning Cap** | Limits total rewards per rolling hour (`maximumEarningPerHour = ₹150`). |
| **2** | **Impression Cooldown** | Enforces 15-second minimum interval between rewarded impressions. |
| **3** | **Session Validation** | Requires unique, active session IDs issued by the agent adapter. |
| **4** | **Anti-Replay Guard** | Cryptographically rejects duplicate or previously settled impression tokens. |
| **5** | **Activity Confidence** | Rejects durations under minimum view threshold (8s) or over 2 hours. |
| **6** | **Velocity Anomaly** | Flags anomalous frequency or identical rapid sequential polling loops. |
| **7** | **Review Quarantine** | Flags suspicious accounts for administrative clearance before payout. |

---

## 📦 Monorepo Structure

```text
rebate/
├── apps/
│   ├── web/                         # Next.js 14 Web Application & Edge API
│   │   ├── app/
│   │   │   ├── page.tsx             # Product landing page & interactive preview
│   │   │   ├── developer/           # Developer dashboard, multi-currency wallet & ledger
│   │   │   ├── advertiser/          # Advertiser portal, campaign builder & analytics
│   │   │   ├── opportunity/[id]/    # Opportunity detail ("Why am I seeing this?")
│   │   │   ├── demo/                # Interactive 60-Second Economic Simulator
│   │   │   ├── download/            # CLI installation & agent setup instructions
│   │   │   └── api/                 # Auction, ledger, fraud, wallet, and auth endpoints
│   │   └── lib/                     # Core auction, matching, reward & fraud engines
│   └── cli/                         # Lightweight local Rebate agent & daemon
│       └── src/
│           ├── adapters/            # Adapters for Antigravity, Claude, Codex, OpenCode
│           ├── display/             # Clean 1-line terminal status renderer
│           ├── client/              # Resilient, non-blocking HTTP API client
│           └── index.ts             # Rebate CLI entrypoint
└── packages/
    └── shared/                      # Shared TypeScript types, constants, and schemas
```

---

## 🚀 Quick Start Guide (For Hackathon Judges & Developers)

### 1. Prerequisites
- **Node.js 18+**
- **npm**

### 2. Installation & Database Setup
```bash
# Clone the repository
git clone https://github.com/YugSrivastav/rebate.git
cd rebate

# Install monorepo dependencies
npm install

# Seed the database with developers, campaigns, and opportunities
npm run seed
```

### 3. Start the Web Platform
```bash
npm run dev:web
# Web application live at http://localhost:3000
```

### 4. Run the Rebate Interactive Demo
```bash
# Run the 60-second interactive CLI simulation
npm run cli demo

# Or start the local daemon for your preferred agent adapter
npm run cli start antigravity
# or: npm run cli start claude_code
```

---

## 🎬 60-Second Judge Walkthrough

### Web-Based Live Simulator:
1. Navigate to **[`/demo`](http://localhost:3000/demo)**.
2. Select developer profile (e.g. `Priya Sharma • Student • AI/ML • India`).
3. Click **`Run 60s Demo`**:
   - Watch the agent initiate a thinking cycle.
   - Observe the live auction engine rank bids by `Bid × Relevance × Quality`.
   - Experience the 1-line sponsored status display.
   - Click **`Apply`** to inspect the transparent **"Why you're seeing this"** breakdown.
   - Watch verified impression settlement credit **70% (+₹4.90)** directly to the developer wallet.
4. Visit **[`/developer`](http://localhost:3000/developer)** to inspect real-time wallet balances, multi-currency conversion, and the earnings ledger.
5. Visit **[`/advertiser`](http://localhost:3000/advertiser)** to inspect campaign impressions, CTR, and spend.

---

## 🧪 Automated Test Suite

Rebate includes comprehensive unit and integration tests covering the matching engine, geographic isolation, auction ranking, configurable reward splits, anti-fraud rules, and failure isolation:

```bash
npm test
```

```text
✔ 1. Matching Engine & Hard Geographic Isolation
✔ 2. Auction Engine (Rank = Bid × Relevance × Quality)
✔ 3. Reward Engine (Configurable Split & Multi-Currency)
✔ 4. Anti-Fraud Layer (7-Layer Verification)
✔ 5. Failure Isolation & Resilient CLI Client
```

---

## 🧭 Navigation Reference

| Destination | Route | Description |
| :--- | :--- | :--- |
| **Landing Page** | `/` | Product overview, value proposition, and interactive preview |
| **60s Simulator** | `/demo` | Complete end-to-end visual auction and payout simulator |
| **Developer Center** | `/developer` | Multi-currency wallet, payout redemption, and earnings ledger |
| **Developer Onboarding** | `/developer/onboarding` | Profile configuration (skills, role, optional geography) |
| **CLI Download** | `/download` | Setup guides for Antigravity, Claude Code, Codex, and OpenCode |
| **Advertiser Portal** | `/advertiser` | Campaign performance, impressions, CTR, and budget management |
| **Campaign Builder** | `/advertiser/campaigns/new` | Create targeted developer campaigns and set CPM bids |
| **Privacy & Security** | `/privacy` | Complete zero-code reading guarantee and privacy policies |

---

## 📄 License
MIT © 2026 Rebate Team.
