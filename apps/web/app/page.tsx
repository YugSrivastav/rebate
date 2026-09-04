'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Terminal,
  ShieldCheck,
  Coins,
  ArrowRight,
  Cpu,
  CheckCircle2,
  XCircle,
  Sparkles,
  Zap,
  ArrowUpRight,
  Play,
  Building,
  MapPin,
  ExternalLink,
  Download,
} from 'lucide-react';
import { AgentType } from '@rebate/shared';

const AGENTS = [
  { id: 'antigravity', name: 'Antigravity', cmd: 'antigravity refactor auth.py --with-tests', status: 'Generating abstract syntax tree...' },
  { id: 'claude_code', name: 'Claude Code', cmd: 'claude "implement distributed rate limiter"', status: 'Thinking through token bucket architecture...' },
  { id: 'codex', name: 'Codex CLI', cmd: 'codex optimize database_indexes.sql', status: 'Analyzing execution plan and table locks...' },
  { id: 'opencode', name: 'OpenCode', cmd: 'opencode run test-suite --e2e', status: 'Running 42 end-to-end integration tests...' },
];

export default function MarketingPage() {
  const [activeAgent, setActiveAgent] = useState(AGENTS[0]);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Hero Section */}
      <section className="relative mx-auto max-w-6xl px-4 pt-16 pb-16 sm:px-6 sm:pt-24 sm:pb-20 border-b border-zinc-900">
        <div className="max-w-3xl">
          {/* Subtle Monospace Category Label */}
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="uppercase tracking-widest">Wait-State Economic Infrastructure</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            While your AI works, <br />
            <span className="text-zinc-400">Rebate works for you.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl">
            Developers delegate hours of coding to AI agents every week. During the seconds you wait for reasoning, searching, and tool execution, Rebate matches you with curated developer opportunities — paying you a <strong className="text-zinc-200">70% direct value share</strong>.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/signup?role=developer"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-xs font-semibold text-black hover:bg-emerald-400 transition shadow-sm"
            >
              <span>Start Earning as Developer</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/signup?role=advertiser"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-xs font-medium text-zinc-300 hover:border-zinc-700 hover:text-white transition"
            >
              <span>Advertise to Developers</span>
            </Link>

            <Link
              href="/download"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-xs font-medium text-zinc-300 hover:border-emerald-500/50 hover:text-white transition font-mono"
            >
              <Download className="h-3.5 w-3.5 text-emerald-400" />
              <span>Download CLI / SDK</span>
            </Link>

            <Link
              href="/demo"
              className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2.5 text-xs font-medium text-zinc-400 hover:text-emerald-400 transition"
            >
              <Play className="h-3 w-3 fill-current text-emerald-400" />
              <span>Interactive 60s Demo</span>
            </Link>
          </div>

          {/* Metric Bar */}
          <div className="mt-12 pt-8 border-t border-zinc-900 grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs font-mono">
            <div>
              <div className="text-zinc-500">Value Share</div>
              <div className="mt-1 text-base font-bold text-white font-mono">70% to Dev</div>
            </div>
            <div>
              <div className="text-zinc-500">Privacy Policy</div>
              <div className="mt-1 text-base font-bold text-white font-mono">Zero Code Ingestion</div>
            </div>
            <div>
              <div className="text-zinc-500">Terminal Format</div>
              <div className="mt-1 text-base font-bold text-white font-mono">1-Line Native</div>
            </div>
            <div>
              <div className="text-zinc-500">Settlement Payouts</div>
              <div className="mt-1 text-base font-bold text-white font-mono">INR • USD • Compute</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Terminal Demonstration Section */}
      <section className="py-16 sm:py-24 border-b border-zinc-900 bg-zinc-950/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-mono text-emerald-400 mb-1">TERMINAL NATIVE EXPERIENCE</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Never a popup. Never an interruption.
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-xl">
                Rebate temporarily occupies your existing status line during active wait states, and disappears the millisecond reasoning completes.
              </p>
            </div>

            {/* Agent Selector Tabs */}
            <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 p-1">
              {AGENTS.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => setActiveAgent(agent)}
                  className={`rounded-md px-2.5 py-1 text-xs font-mono transition ${
                    activeAgent.id === agent.id
                      ? 'bg-zinc-800 text-white font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {agent.name}
                </button>
              ))}
            </div>
          </div>

          {/* Realistic Terminal Chrome */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden font-mono text-xs">
            {/* Title Bar */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/60 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <span className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-zinc-400 text-[11px]">zsh — 80x24</span>
              </div>
              <span className="text-[11px] text-zinc-500">
                Adapter: {activeAgent.id} • Active Wait State
              </span>
            </div>

            {/* Terminal Body */}
            <div className="p-6 space-y-4">
              <div className="text-zinc-400">
                <span className="text-emerald-400">user@workstation</span>:<span className="text-cyan-400">~/project</span>$ {activeAgent.cmd}
              </div>

              <div className="text-zinc-500">
                [Agent] Inspecting local workspace dependencies...
                <br />
                [Agent] {activeAgent.status}
              </div>

              {/* Live Rebate 1-Line Status */}
              <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/50 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-zinc-200 truncate">
                  <span className="text-emerald-400 animate-spin">⠋</span>
                  <span className="text-zinc-400">AI is thinking...</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-500">Sponsored:</span>
                  <span className="font-semibold text-white truncate">AI Engineering Internship</span>
                  <span className="text-zinc-600">—</span>
                  <span className="text-emerald-400 font-semibold underline underline-offset-2">Apply</span>
                  <span className="text-zinc-600 text-[11px]">[press o to view]</span>
                </div>

                <div className="flex items-center gap-2 shrink-0 text-[10px] text-zinc-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>Verified Duration Tracking</span>
                </div>
              </div>

              <div className="text-zinc-500 text-[11px] pt-2 border-t border-zinc-900">
                Notice: Earnings are <strong className="text-zinc-400">never displayed</strong> in the CLI status line. Your terminal remains pristine. Rewards are credited directly to your Rebate wallet.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 4-Step Economic Engine */}
      <section id="how-it-works" className="py-16 sm:py-24 border-b border-zinc-900">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-xs font-mono text-emerald-400 mb-1">THE ECONOMIC FLYWHEEL</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How wait states become economic value
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-2xl">
            A transparent four-step cycle that connects high-intent developer attention with curated opportunities.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 flex flex-col justify-between">
              <div>
                <div className="font-mono text-xs text-zinc-500 mb-3">01 / ADVERTISER</div>
                <h3 className="text-base font-bold text-white mb-2">Campaign & Bid</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Companies create targeted campaigns (jobs, hackathons, GPU credits) specifying target skills, roles, and budget.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-zinc-900 text-[11px] font-mono text-zinc-500">
                CPM Bidding Engine
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 flex flex-col justify-between">
              <div>
                <div className="font-mono text-xs text-zinc-500 mb-3">02 / AUCTION</div>
                <h3 className="text-base font-bold text-white mb-2">Relevance Scoring</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  The auction evaluates <code className="text-emerald-400 text-[11px]">Rank = Bid × Relevance × Quality</code>. Irrelevant high bidders lose to relevant moderate bidders.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-zinc-900 text-[11px] font-mono text-zinc-500">
                100% Profile-Driven
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 flex flex-col justify-between">
              <div>
                <div className="font-mono text-xs text-zinc-500 mb-3">03 / CLI AGENT</div>
                <h3 className="text-base font-bold text-white mb-2">Wait-State Render</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Local Rebate daemon hooks into your AI agent's waiting lifecycle via non-invasive adapters, displaying a 1-line opportunity.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-zinc-900 text-[11px] font-mono text-zinc-500">
                Zero Popup Guarantee
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 flex flex-col justify-between">
              <div>
                <div className="font-mono text-xs text-zinc-500 mb-3">04 / VALUE SHARE</div>
                <h3 className="text-base font-bold text-white mb-2">Wallet Payout</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Upon verified 8-second view duration, <strong className="text-emerald-400">70% of the bid</strong> is credited directly to the developer's wallet.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-zinc-900 text-[11px] font-mono text-zinc-500">
                Configurable Share Policy
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strict Privacy Manifesto */}
      <section className="py-16 sm:py-24 border-b border-zinc-900 bg-zinc-950/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-xs font-mono text-emerald-400 mb-1">PRIVACY & TRUST ARCHITECTURE</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            The Zero-Code Ingestion Guarantee
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-xl">
            Rebate was designed for enterprise and open-source engineers who handle confidential IP.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Red Lines */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-red-400 mb-4 uppercase tracking-wider">
                <XCircle className="h-4 w-4" />
                <span>What Rebate NEVER Does</span>
              </div>
              <ul className="space-y-3 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Never reads or inspects local source code</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Never collects or logs AI prompts</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Never reads terminal histories or command outputs</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Never scans private Git repositories</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Never monitors keystrokes or captures screenshots</span>
                </li>
              </ul>
            </div>

            {/* What Rebate Uses */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-400 mb-4 uppercase tracking-wider">
                <CheckCircle2 className="h-4 w-4" />
                <span>What Rebate Uses (100% Voluntary)</span>
              </div>
              <ul className="space-y-3 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✔</span>
                  <span>Voluntarily declared technical skills (Python, Rust, etc.)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✔</span>
                  <span>Declared role and primary field (Student, Engineer, AI/ML)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✔</span>
                  <span>Optional geographic region (can be omitted completely)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✔</span>
                  <span>Coarse wait-state timestamps (duration verification only)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✔</span>
                  <span>Selected reward currency preference (INR, USD, Compute)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Ecosystem */}
      <section id="ecosystem" className="py-16 sm:py-24 border-b border-zinc-900">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-xs font-mono text-emerald-400 mb-1">SUPPORTED AGENT ECOSYSTEM</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Integrated with your favorite coding agents
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-xl">
            Reversible adapters listen to lifecycle events without modifying executable binaries.
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Antigravity', type: 'antigravity', desc: 'Google Advanced Agentic Coding environment.' },
              { name: 'Claude Code', type: 'claude_code', desc: 'Anthropic official terminal coding agent.' },
              { name: 'Codex CLI', type: 'codex', desc: 'OpenAI agentic assistant interface.' },
              { name: 'OpenCode', type: 'opencode', desc: 'Open source agent framework for terminal coding.' },
            ].map((agent) => (
              <div key={agent.type} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-white">{agent.name}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </div>
                <p className="text-[11px] text-zinc-400 mb-3 leading-relaxed">{agent.desc}</p>
                <div className="rounded bg-zinc-900 p-2 font-mono text-[10px] text-zinc-300 border border-zinc-800">
                  npx rebate start {agent.type}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Download / Installation Section */}
      <section className="py-16 sm:py-24 border-b border-zinc-900 bg-zinc-950/20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-mono text-emerald-400 mb-1">UNIVERSAL DISTRIBUTION</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Install in seconds. Zero configuration.
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-zinc-400">
                Choose the installation mode that matches your workflow.
              </p>
            </div>
            <Link
              href="/download"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-emerald-400 hover:border-emerald-500/50 transition font-mono"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Full Download Page & Checksums →</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. CLI Daemon */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-emerald-400 font-semibold">1. FOR DEVELOPERS</span>
                  <Terminal className="h-4 w-4 text-emerald-400" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">Rebate CLI Daemon</h3>
                <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                  Hooks terminal coding agents (Claude Code, Antigravity, Codex, OpenCode).
                </p>
                <div className="rounded bg-zinc-900 p-3 font-mono text-xs text-zinc-200 border border-zinc-800 space-y-1">
                  <div className="text-[10px] text-zinc-500"># macOS / Linux</div>
                  <div>curl -fsSL https://rebate.dev/install.sh | bash</div>
                  <div className="text-[10px] text-zinc-500 pt-1"># Windows PowerShell</div>
                  <div>irm https://rebate.dev/install.ps1 | iex</div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-900 flex justify-between items-center text-xs">
                <a href="/api/download/windows" download className="text-emerald-400 hover:underline font-mono">
                  Download .bat Installer
                </a>
                <span className="text-zinc-600 font-mono">v1.0.0</span>
              </div>
            </div>

            {/* 2. Agent SDK */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-purple-400 font-semibold">2. FOR AGENT BUILDERS</span>
                  <Cpu className="h-4 w-4 text-purple-400" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">Rebate Agent SDK</h3>
                <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                  Monetize autonomous agent thinking and tool execution in 2 lines of code.
                </p>
                <div className="rounded bg-zinc-900 p-3 font-mono text-xs text-zinc-200 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500"># npm / pnpm / yarn</div>
                  <div>npm install @rebate/sdk</div>
                  <div className="text-[10px] text-zinc-500 pt-2"># Python (Coming Soon)</div>
                  <div>pip install rebate</div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-900 flex justify-between items-center text-xs">
                <Link href="/download" className="text-purple-400 hover:underline font-mono">
                  View SDK API Docs
                </Link>
                <span className="text-zinc-600 font-mono">TypeScript</span>
              </div>
            </div>

            {/* 3. MCP Server */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-cyan-400 font-semibold">3. FOR IDES & CLAUDE</span>
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">Rebate MCP Server</h3>
                <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                  Connect to Claude Desktop, Cursor, or Antigravity to query balances & bounties.
                </p>
                <div className="rounded bg-zinc-900 p-3 font-mono text-xs text-zinc-200 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500"># Run MCP Server</div>
                  <div>npx -y @rebate/mcp</div>
                  <div className="text-[10px] text-zinc-500 pt-2"># Tools provided</div>
                  <div className="text-zinc-400 text-[11px]">get_wallet, list_bounties</div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-900 flex justify-between items-center text-xs">
                <Link href="/download" className="text-cyan-400 hover:underline font-mono">
                  View MCP Config
                </Link>
                <span className="text-zinc-600 font-mono">JSON-RPC</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Opportunities Sample */}
      <section className="py-16 sm:py-24 border-b border-zinc-900 bg-zinc-950/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-mono text-emerald-400 mb-1">OPPORTUNITY MARKETPLACE</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                High-value developer placements
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-zinc-400">
                Live opportunities currently matching developers in wait states.
              </p>
            </div>
            <Link
              href="/signup?role=developer"
              className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:underline font-semibold"
            >
              Sign up to view all opportunities →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                company: 'Example AI Research',
                title: 'AI Engineering Internship 2026',
                type: 'Internship',
                location: 'India / Remote',
                skills: ['Python', 'FastAPI', 'PyTorch'],
              },
              {
                company: 'CloudX Infrastructure',
                title: '$500 GPU Cloud Compute Credits',
                type: 'Cloud Credits',
                location: 'Global / Remote',
                skills: ['Python', 'Docker', 'Kubernetes'],
              },
              {
                company: 'CodeBuild Global',
                title: 'Agentic Hackathon — $50k Bounty Pool',
                type: 'Hackathon',
                location: 'Global / Online',
                skills: ['TypeScript', 'React', 'Next.js'],
              },
            ].map((item, idx) => (
              <div key={idx} className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
                    <span className="font-semibold text-white">{item.company}</span>
                    <span className="rounded bg-zinc-900 px-2 py-0.5 text-[10px] font-mono text-emerald-400 border border-zinc-800">
                      {item.type}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">{item.title}</h4>
                  <div className="text-[11px] text-zinc-400 mb-3 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {item.skills.map((s) => (
                      <span key={s} className="rounded bg-zinc-900 px-2 py-0.5 text-[10px] font-mono text-zinc-400 border border-zinc-800">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to monetize your AI wait time?
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
            Join developers earning cash, GPU compute, and API credits while their AI agents reason and code.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/signup?role=developer"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-2.5 text-xs font-semibold text-black hover:bg-emerald-400 transition shadow-sm"
            >
              <span>Get Started as Developer</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/signup?role=advertiser"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-5 py-2.5 text-xs font-medium text-zinc-300 hover:border-zinc-700 hover:text-white transition"
            >
              <span>Create Advertiser Account</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
