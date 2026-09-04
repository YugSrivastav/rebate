# 🚀 Rebate — 60-Second Hackathon Demo Guide

> **"While your AI works, Rebate works for you."**

This guide provides the exact sequence to demonstrate the entire Rebate economic loop to judges and users in under 60 seconds.

---

## 🎯 The 60-Second Pitch (For Judges)

1. **The Problem**: Developers spend minutes every day waiting for AI agents to reason, plan, execute tools, and run test suites.
2. **The Rebate Solution**: Rebate turns that dead wait state into a curated, non-intrusive developer opportunity layer (Jobs, Internships, Hackathons, Dev Tools, Cloud/API Credits).
3. **The Privacy Guarantee**: Rebate **NEVER** reads source code, prompts, or terminal logs. Matching is 100% voluntary profile-driven.
4. **The Economic Value**: Advertisers pay for verified impressions. Developers receive **70%** directly into their wallet.

---

## 🛠 Prerequisites & Quick Start

Ensure the platform is running:

```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Seed database with 10 developers, 15 campaigns, 20 opportunities
npm run seed

# 3. Start Web Application & API (Terminal 1)
npm run dev
# Running at http://localhost:3000
```

---

## 🎬 Method A: Web-Based Live Demo Simulator (Visual Walkthrough)

Navigate in your browser to:
👉 **[http://localhost:3000/demo](http://localhost:3000/demo)**

### Step-by-Step Flow:

1. **Inspect Developer Profile**:
   - See the active developer identity: `Priya Sharma` (`dev_alex_india`)
   - Attributes: *Student • AI/ML • Skills: Python, FastAPI, PyTorch • India • INR (Cash)*

2. **Click `Run 60s Demo`**:
   - **Step 1**: Agent launches (`antigravity build-agent-pipeline --eval`).
   - **Step 2**: Agent enters wait state (`AI is thinking...`).
   - **Step 3 (Auction Engine)**: Watch the live auction table rank bids in real time:
     - *AWS Credits*: Bid ₹5.00 CPM × Relevance 0.72 × Quality 1.0 = **Score 3.60**
     - *CodeBuild Hackathon*: Bid ₹6.00 CPM × Relevance 0.80 × Quality 1.0 = **Score 4.80**
     - *AI Internship (Example AI)*: Bid ₹7.00 CPM × Relevance 0.95 × Quality 1.0 = **Score 6.65 (WINNER)**
     *(Notice: A highly relevant moderate bidder beats irrelevant high bidders).*
   - **Step 4 (Native 1-Line Status)**:
     - Terminal line dynamically transforms into:
       ```text
       ⠋ AI is thinking... • Sponsored: AI Engineering Internship — Apply
       ```
     - *Never shows `+₹2.37` in the CLI — earnings are kept clean in the wallet.*
   - **Step 5 (Click Experience)**:
     - Click **`Apply`** to open the full Opportunity Details page.
     - Inspect the transparent **"Why you're seeing this"** section explaining exact skill/geography alignment.
   - **Step 6 (Verification & Economic Settlement)**:
     - After 8 seconds of verified duration (or click `Instant Settle`):
     - **Advertiser Spend**: ₹7.00 (1 verified impression)
     - **Developer Reward (70%)**: **+₹4.90** credited directly to wallet
     - **Platform Share (30%)**: **₹2.10** marketplace revenue
     - **AI Finishes**: Status line cleanly reverts to prompt.

3. **Check Developer Wallet**:
   - Click **`Go to Developer Wallet`** (or `/developer`).
   - Confirm Priya's balance has increased by **+₹4.90** and the transaction appears in the live earnings ledger.

4. **Check Advertiser Dashboard**:
   - Visit **[http://localhost:3000/advertiser](http://localhost:3000/advertiser)**.
   - Confirm campaign spend and verified impressions incremented.

---

## 💻 Method B: Terminal CLI Interactive Demo

Open a new terminal window and run:

```bash
# Terminal 2
npm run cli demo
```

### What You Will See in the Terminal:

```text
◆ REBATE — Local Agent Demo Engine
Turning AI wait states into developer economic value

Developer Profile: dev_alex_india (Priya Sharma • Student • AI/ML • India)
Backend API:      http://localhost:3000
Rule:             Zero code/prompt reading • 100% profile-matched

[1/4] Simulating AI coding agent launching...
[2/4] Agent entering waiting state for 10 seconds...

⠋ AI is thinking... • Sponsored: AI Engineering Internship — Apply [press o to view]
```

- **Interactive Hotkey**: Press **`o`** on your keyboard:
  - Rebate opens the opportunity page in your default web browser.
- When the 10 seconds complete:
  ```text
  ✔ AI finished reasoning. Opportunity cleanly reverted.
  Settling impression (10s visible duration)...
  ✔ Verified impression settled! Developer reward: +₹4.90 INR credited to wallet.
  (Note: Earnings are never displayed in the AI status line, only in the wallet)
  ```

---

## 🔍 Key Questions Judges Might Ask

| Question | Answer |
| :--- | :--- |
| **Does Rebate read my code?** | **NEVER.** Zero source code, zero prompts, zero terminal history. 100% profile and targeting driven. |
| **Does it break my terminal?** | No popups, no banners, no audio. It occupies only the existing status line and vanishes immediately when the agent finishes. |
| **What if the backend is down?** | Rebate is best-effort and non-blocking. If the API fails, the AI coding workflow continues with normal thinking status. |
| **How does auction ranking work?** | $\text{Rank} = \text{Bid} \times \text{Relevance} \times \text{Quality}$. Irrelevant high bidders lose to relevant moderate bidders. |
| **Can I choose other currencies?** | Yes! Supports Cash (INR/USD), AI compute credits, and cloud infrastructure credits. |
