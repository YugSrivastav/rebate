# REBATE — Project Architecture & Developer Handoff

> **"While your AI works, Rebate works for you."**  
> Rebate is the reward layer that converts AI agent wait states into developer economic value.

---

## 1. Executive Summary

Developers spend hours waiting on AI agents (generating tokens, planning, running tests, or executing tools). Rebate turns this idle attention window into a sponsored developer opportunity channel (tools, cloud credits, jobs, hackathons) and shares the advertiser revenue directly with the developer.

### Core Guarantees:
1. **Zero Code / Prompt Inspection**: Rebate never reads developer source code, terminal history, or prompts. Matching is 100% profile-driven.
2. **Non-Intrusive Terminal Display**: Uses the AI agent's existing status line (e.g. `⠋ Generating... • Sponsored: ... [press o to view]`). Never pushes text or corrupts the TUI.
3. **Clean Revert**: As soon as the agent finishes reasoning or outputs tokens, the opportunity is immediately cleared.
4. **Failure Isolation**: If the Rebate backend is unreachable or slow, the agent process runs 100% normally without delay or error.

---

## 2. Monorepo Structure

```text
Rebate/
├── apps/
│   ├── web/                      # Next.js 14 Web Application & Backend API
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── page.tsx               # Public Marketing & Landing Page
│   │   │   │   ├── onboarding/            # 4-Question Developer Onboarding Wizard
│   │   │   │   ├── developer/             # Developer Dashboard & Multi-currency Wallet
│   │   │   │   ├── advertiser/            # Advertiser Campaign Builder & Budget Manager
│   │   │   │   ├── download/              # Download Center (CLI, MCP, SDK, Extensions)
│   │   │   │   ├── opportunity/[id]/      # Transparent Opportunity Details Page
│   │   │   │   └── api/                   # Core Backend Endpoints:
│   │   │   │       ├── auction/           # Real-time Matching & Auction Engine (POST)
│   │   │   │       ├── ledger/impression/ # Anti-Fraud Verification & Wallet Settlement (POST)
│   │   │   │       ├── ledger/click/      # CPC Click Tracking (POST)
│   │   │   │       ├── developer/wallet/  # Live Wallet Balance & Redemption (GET/POST)
│   │   │   │       ├── developer/profile/ # Profile CRUD & Settings (GET/POST)
│   │   │   │       └── advertiser/budget/ # Budget Top-Up & Analytics (GET/POST)
│   │   │   └── lib/                       # Database Helpers & Core Logic
│   │   └── package.json
│   │
│   └── cli/                      # Local CLI Daemon & Terminal Integrations
│       ├── src/
│       │   ├── index.ts                   # CLI Entrypoint (demo, run, start, status, config)
│       │   ├── adapters/                  # Agent Lifecycle Adapters
│       │   │   ├── antigravity.ts         # Google Antigravity Adapter
│       │   │   ├── claude.ts              # Claude Code Adapter
│       │   │   ├── codex.ts               # Codex Adapter
│       │   │   ├── opencode.ts            # OpenCode Adapter
│       │   │   └── demo.ts                # 10-second Deterministic Simulator
│       │   ├── proxy/
│       │   │   └── agy_proxy.py           # Native Antigravity PTY Interceptor (WinPTY)
│       │   ├── display/terminal.ts        # 1-Line Status Spinner & Hotkey Listener
│       │   └── client/api.ts              # Resilient HTTP Client with Failover
│       └── package.json
│
├── packages/
│   └── shared/                   # Shared TypeScript Types, Rules & Formulas
│       ├── src/
│       │   ├── types.ts                   # Developer, Campaign, Opportunity, Wallet Types
│       │   ├── auction.ts                 # Rank = Bid * Relevance * Quality Score
│       │   ├── fraud.ts                   # 7-Layer Fraud Prevention Rules
│       │   └── index.ts
│       └── package.json
│
├── data/
│   └── rebate.db.json            # Local JSON Database (Seeded with Alex/Priya & Campaigns)
│
├── package.json                  # Root Monorepo Scripts
└── HANDOFF.md                    # This Document
```

---

## 3. Quickstart: How to Run the Project

### Prerequisites:
- **Node.js**: `v20+` or `v24+`
- **npm**: `v9+` or `v10+`
- **Python**: `3.10+` or `3.11+` with `winpty` (`pip install pywinpty`)
- **Google Antigravity CLI (`agy`)**: Located at `C:\Users\yugsr\AppData\Local\agy\bin\agy.exe`

### Step 1: Start the Web App & Backend API
In your primary terminal:
```powershell
npm run dev:web
```
- Web App UI: **`http://localhost:3000`**
- Developer Portal: **`http://localhost:3000/developer`**
- Advertiser Portal: **`http://localhost:3000/advertiser`**
- Onboarding Flow: **`http://localhost:3000/onboarding`**

---

### Step 2: Try the Interactive CLI Simulation
To demonstrate wait-state detection and wallet settlement in 10 seconds:
```powershell
npm run cli demo
```
- Displays live status spinner: `⠋ AI is thinking... • Sponsored: ... [press o to view]`
- Press **`o`** to open the opportunity card in your browser.
- Automatically settles verified duration and credits the developer wallet.

---

### Step 3: Run the Real Antigravity (`agy`) Integration
We have built a transparent terminal hook that intercepts Antigravity CLI's native `⠋ Generating...` line:
```powershell
npm run agy
```
*(Or simply type `agy` in any new PowerShell terminal — the function is bound in PowerShell `$PROFILE`)*

#### What Happens Live:
1. When you prompt `agy` (e.g. `> explain debounce in javascript`):
2. While the model reasons and generates, the line:
   ```text
   ⠋ Generating...
   ```
   dynamically transforms into:
   ```text
   ⠋ Generating... • Sponsored: JetBrains IDEs — 50% Off [press o to view]
   ```
3. Press **`o`** while it is generating to open the opportunity in your default browser.
4. When generation completes, the line cleanly reverts, duration is verified, and reward is settled into your wallet.

---

### Step 4: Inspect Wallet & Ledger in Terminal
```powershell
npm run cli -- status
```
Outputs developer ID, API connection status, and balances across INR, USD, AI Credits, and Cloud Credits.

---

### Step 5: Run Unit & Integration Tests
```powershell
npm run test
```
Runs the test suite in `apps/cli/src` (16 passing tests covering Matching, Auction, Reward Split, Anti-Fraud, and Failure Isolation).

---

## 4. Key Architectural Components

### A. The Auction & Matching Engine (`packages/shared/src/auction.ts`)
- Evaluates candidate campaigns for an incoming developer profile.
- Hard isolation: strictly rejects campaigns where developer country/language does not match targeting criteria.
- Dynamic scoring formula:
  $$\text{Score} = \text{Bid} \times \text{Relevance Score} \times \text{Quality Score}$$
- Revenue Split: 70% to Developer, 30% to Platform (dynamically configurable without code changes).

### B. Anti-Fraud & Verification Layer (`packages/shared/src/fraud.ts`)
Implements 7 defense layers:
1. **Hourly Earning Cap**: Caps developer rewards per hour to prevent runaway bots.
2. **Cooldown Windows**: Rejects rapid-fire impressions submitted faster than natural agent turns.
3. **Session Binding**: Every impression requires an active, verified agent session.
4. **Replay Protection**: Cryptographic nonce/UUID check prevents re-settling duplicate impressions.
5. **Minimum View Threshold**: Rejects impressions visible for less than the required minimum seconds.
6. **Interaction Quality Check**: Distinguishes between automated pings and real human dwell time.
7. **Account Health State**: Automatically flags or suspends accounts with anomalous activity.

### C. Native Antigravity PTY Hook (`apps/cli/src/proxy/agy_proxy.py`)
- Built with `winpty` to interface directly with Windows ConPTY (Pseudo Console).
- Spawns the authentic `agy-original.exe` inside a virtual terminal.
- Captures all raw ANSI stream chunks in real-time.
- Augments `Generating...` with the matched opportunity without breaking line wrapping or TUI layout.
- Non-blocking asynchronous HTTP reporting ensures zero lag for the developer.

---

## 5. Seed Data & Test Accounts

The local database is saved in `data/rebate.db.json`.

### Default Developer:
- **ID**: `dev_alex_india`
- **Name**: Priya Sharma
- **Role**: Computer Science Student / AI Engineer
- **Location**: India (`IN`)
- **Interests**: `AI/ML`, `Python`, `TypeScript`, `Next.js`

### Default Active Campaigns:
1. **JetBrains**: 50% Student & Pro Discount on IDEs (Target: Students & Developers worldwide)
2. **Vercel**: $200 Edge AI Compute Credits (Target: Next.js & Frontend engineers)
3. **Supabase**: Free Postgres & Vector Database Tier (Target: Full-stack developers)
4. **AI Engineering Internship**: Summer 2026 Remote Internship (Target: Students in India & APAC)

---

## 6. Recommended Next Steps for the Incoming Developer

1. **Database Migration**:
   - Currently uses flat-file JSON persistence in `data/rebate.db.json` with mutex-locking.
   - Recommended: Migrate to PostgreSQL using Prisma or Supabase client for scalable multi-user concurrency.

2. **Real Payout Gateways**:
   - The developer wallet currently simulates instant payouts (Bank Transfer, UPI, Stripe, AI Credits conversion).
   - Recommended: Connect Stripe Connect Express or Razorpay X Payouts API for real financial disbursement.

3. **VS Code & JetBrains Status Bar Plugins**:
   - Expand beyond CLI: Create a VS Code extension that renders the subtle opportunity in the bottom status bar next to Copilot / Gemini Code Assist while the agent is running.

4. **Claude Code / OpenCode Hooking**:
   - The adapters for `claude_code`, `codex`, and `opencode` are implemented in `apps/cli/src/adapters/`.
   - Implement the corresponding PTY wrappers or IPC listeners similar to `agy_proxy.py`.

5. **Cloud Deployment**:
   - Deploy `apps/web` to Vercel.
   - Publish `@rebate/cli` to npm so developers can install via `npm install -g rebate`.
