# 🏛 Rebate Technical Architecture

Rebate is the economic reward and developer opportunity marketplace for AI coding agent wait states.

This document details the architectural boundaries, auction mechanics, fraud layers, and data flows.

---

## 1. High-Level Data Flow

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
│ Local Display  │ Replaces "AI is thinking..." with:
│                │ "AI is thinking... • Sponsored: [Title] — [CTA]"
└───────┬────────┘ (Never reveals reward amount in CLI)
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

## 2. Core Architectural Guarantees

### A. Zero Code / Zero Prompt Ingestion
Rebate enforces a hard separation between developer source code and opportunity matching.
- **No filesystem inspection**: The CLI daemon never reads project directories.
- **No prompt interception**: Prompts and AI generations are never inspected or uploaded.
- **Voluntary metadata only**: Matching operates strictly on the developer's voluntarily configured profile (role, field, skills, optional country/state).

### B. Non-Blocking & Silent Failover
The developer's coding flow is never compromised:
- If the Rebate backend is unreachable or times out, the local agent client silently falls back to standard AI thinking display.
- If no campaign matches, no broken ad or warning is printed; the thinking spinner continues normally.

### C. No Earning Telemetry in the CLI
Earnings telemetry (`+₹4.90`) is **strictly forbidden** in the terminal thinking line. Developers discover earnings through their web wallet and activity ledger.

---

## 3. The Auction Engine

Campaigns are ranked dynamically by the backend:

$$\text{Rank} = \text{Bid CPM} \times \text{Relevance Score} \times \text{Quality Multiplier}$$

Where:
1. **Bid CPM**: The advertiser's willingness to pay per verified engagement unit.
2. **Relevance Score** ($0.05 \text{ to } 1.0$):
   - **Skills Match** (40% weight): $\frac{|\text{Developer Skills} \cap \text{Target Skills}|}{|\text{Target Skills}|}$
   - **Field Match** (25% weight)
   - **Role Match** (20% weight)
   - **Education Match** (15% weight)
   - **Preferred Category Multiplier** ($+10\%$ boost)
3. **Quality Multiplier** ($1.0 \text{ to } 1.5$): Verified advertiser reputation.

> **Key Rule**: A high-bidding irrelevant campaign loses to a moderately bidding, highly relevant campaign.

---

## 4. Hard Geographic Isolation Rule

Location targeting adheres to two strict principles:
1. If a campaign targets specific countries/states, developers outside that region are **strictly excluded**.
2. If a developer voluntarily chooses **not** to provide location information, they will **only** receive campaigns that explicitly permit unspecified/global geography (`allowUnspecifiedLocation: true`).

---

## 5. Configurable Reward Policy

Economic splits are configuration-driven, never hardcoded:

```typescript
export const REWARD_POLICY = {
  developerShare: 0.70, // 70% to developer
  platformShare: 0.30,  // 30% to platform
};
```

### Multi-Currency Abstraction
Rewards are calculated in base units and converted to the developer's preference:
- **INR** (Cash)
- **USD** (Cash)
- **AI_CREDITS** (Compute tokens)
- **CLOUD_CREDITS** (Infrastructure credits)
- **API_CREDITS** (Model token credits)

---

## 6. 7-Layer Anti-Fraud Framework

| Layer | Name | Mechanism |
| :--- | :--- | :--- |
| **1** | Hourly Earning Cap | Limits total rewards per rolling hour (`maximumEarningPerHour = ₹150`). |
| **2** | Impression Cooldown | Enforces 15-second minimum interval between rewarded impressions. |
| **3** | Session Validation | Requires unique, active session IDs issued by the agent adapter. |
| **4** | Anti-Replay Guard | Rejects duplicate or previously settled impression tokens. |
| **5** | Activity Confidence | Rejects durations under minimum view threshold or over 2 hours. |
| **6** | Velocity Flags | Flags anomalous frequency or identical rapid sequential loops. |
| **7** | Manual Review State | Accounts flagged as `REVIEW_REQUIRED` require admin clearance. |

---

## 7. Universal Agent Adapter Interface

The adapter interface enables zero-dependency integration across agents:

```typescript
export interface AgentAdapter {
  readonly name: string;
  readonly agentType: AgentType;
  start(onEvent: (event: AgentEvent) => void): void | Promise<void>;
  stop(): void | Promise<void>;
}
```

Currently implemented:
- `AntigravityAdapter` (Google Antigravity environment)
- `ClaudeAdapter` (Anthropic Claude Code terminal)
- `CodexAdapter` (OpenAI Codex CLI)
- `OpenCodeAdapter` (Open-source agent frameworks)
- `DemoAdapter` (Deterministic hackathon simulator)
