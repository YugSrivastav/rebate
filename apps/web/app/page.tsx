'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Terminal,
  ShieldCheck,
  Coins,
  ArrowRight,
  Sparkles,
  Zap,
  Play,
  CheckCircle2,
  ExternalLink,
  ArrowUpRight,
  Sliders,
  Wallet,
  Check,
  Keyboard,
  Clock,
  Layers,
  Code2,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';

const AGENTS = [
  {
    id: 'antigravity',
    name: 'Google Antigravity CLI',
    badge: 'Working Prototype ⭐',
    cmd: 'agy refactor auth_middleware.py --verify-tokens',
    status: 'Analyzing abstract syntax tree and evaluating candidate opportunities...',
    supported: true,
  },
  {
    id: 'claude_code',
    name: 'Claude Code',
    badge: 'Roadmap Preview',
    cmd: 'claude "implement distributed rate limiter"',
    status: 'Thinking through token bucket architecture...',
    supported: false,
  },
  {
    id: 'codex',
    name: 'Codex CLI',
    badge: 'Roadmap Preview',
    cmd: 'codex optimize database_indexes.sql',
    status: 'Analyzing execution plan and table locks...',
    supported: false,
  },
  {
    id: 'opencode',
    name: 'OpenCode',
    badge: 'Roadmap Preview',
    cmd: 'opencode run test-suite --e2e',
    status: 'Running 42 end-to-end integration tests...',
    supported: false,
  },
];

export default function MarketingPage() {
  const [activeAgent, setActiveAgent] = useState(AGENTS[0]);
  const [terminalState, setTerminalState] = useState<'waiting' | 'hotkey' | 'completed'>('waiting');
  const [dailyMinutes, setDailyMinutes] = useState<number>(20);
  const { demoLogin } = useAuth();

  // Calculator calculations
  const turnsPerDay = Math.round(dailyMinutes * 2.5); // ~2.5 wait states per minute of AI work
  const monthlyTurns = turnsPerDay * 25; // 25 working days
  const estimatedEarningsINR = Math.round(monthlyTurns * 4.9); // ₹4.90 per verified impression (70% share)
  const estimatedEarningsUSD = (estimatedEarningsINR / 83.5).toFixed(2);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-indigo-500/20 selection:text-indigo-300">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-6xl px-4 pt-16 pb-12 sm:px-6 sm:pt-24 sm:pb-16 border-b border-zinc-900">
        <div className="max-w-3xl">
          {/* Subtle Category Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-xs font-mono text-zinc-300 mb-6 backdrop-blur-sm shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="tracking-wide">AI Wait-State Economic Infrastructure</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            While your AI works, <br />
            <span className="text-zinc-400">Rebate works for you.</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl font-normal">
            Turn idle AI reasoning and tool-execution wait states into direct developer rewards.
            <strong className="text-white font-medium"> 70% direct value share</strong>, zero code reading, completely native to your terminal.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition shadow-[0_0_20px_rgba(255,255,255,0.15)]"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Interactive 60s Demo</span>
            </Link>

            <Link
              href="/signup?role=developer"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/80 px-4 py-2.5 text-xs font-medium text-zinc-300 hover:border-zinc-700 hover:text-white transition"
            >
              <span>Developer Signup</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/download"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-zinc-400 hover:text-white transition"
            >
              <span>CLI Setup (`agy`)</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Metric Bar */}
          <div className="mt-12 pt-8 border-t border-zinc-900 grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs font-mono">
            <div>
              <div className="text-zinc-500">Developer Share</div>
              <div className="mt-1 text-base font-bold text-white font-mono">70% Direct</div>
            </div>
            <div>
              <div className="text-zinc-500">Privacy Policy</div>
              <div className="mt-1 text-base font-bold text-white font-mono">0 Bytes Code Read</div>
            </div>
            <div>
              <div className="text-zinc-500">Terminal Experience</div>
              <div className="mt-1 text-base font-bold text-white font-mono">1-Line Native</div>
            </div>
            <div>
              <div className="text-zinc-500">Settlement Currency</div>
              <div className="mt-1 text-base font-bold text-white font-mono">INR • USD • Compute</div>
            </div>
          </div>
        </div>
      </section>

      {/* Hackathon Evaluator & Judge Command Deck */}
      <section className="border-b border-zinc-900 bg-zinc-950/60 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-6 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="flex h-2 w-2 rounded-full bg-indigo-400" />
                  <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                    Hackathon Evaluator & Judge Guide
                  </span>
                  <span className="rounded bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-400">
                    100% Self-Serve
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Evaluate everything in your browser
                </h2>
                <p className="mt-1 text-xs text-zinc-400 max-w-2xl">
                  No local CLI installation required. Test the complete matching, auction, and wallet payout flows in three 1-click paths:
                </p>
              </div>

              <Link
                href="/demo"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition shrink-0 shadow-sm"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Launch 60s Demo Simulator</span>
              </Link>
            </div>

            {/* 3 Step Evaluation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Path 1: Simulator */}
              <div className="group rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-5 hover:border-zinc-700 hover:bg-zinc-900/50 transition duration-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-2">
                    <span className="text-indigo-400 font-semibold">01 • SIMULATOR</span>
                    <span>60 Seconds</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">
                    Interactive 60s Loop
                  </h3>
                  <ul className="space-y-1.5 text-xs text-zinc-400">
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-indigo-400 shrink-0" />
                      <span>Live 2nd-price auction scoring</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-indigo-400 shrink-0" />
                      <span>Candidate targeting filter matrix</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-indigo-400 shrink-0" />
                      <span>Terminal OSC 8 link & 'o' hotkey</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-5 pt-3 border-t border-zinc-900">
                  <Link
                    href="/demo"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-white group-hover:text-indigo-400 transition"
                  >
                    <span>Open Simulator (/demo)</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* Path 2: Developer Dashboard */}
              <div className="group rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-5 hover:border-zinc-700 hover:bg-zinc-900/50 transition duration-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-2">
                    <span className="text-cyan-400 font-semibold">02 • DEVELOPER</span>
                    <span>1-Click Demo</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">
                    Priya Sharma's Wallet
                  </h3>
                  <ul className="space-y-1.5 text-xs text-zinc-400">
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-cyan-400 shrink-0" />
                      <span>Voluntary profile tags (AI/ML, India)</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-cyan-400 shrink-0" />
                      <span>Live ledger balance (₹28.00)</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-cyan-400 shrink-0" />
                      <span>Simulated UPI & token redemption</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-5 pt-3 border-t border-zinc-900 flex items-center justify-between">
                  <button
                    onClick={() => demoLogin('developer')}
                    className="inline-flex items-center gap-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs font-medium text-white transition"
                  >
                    <span>1-Click Dev Login</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                  <span className="text-[10px] font-mono text-zinc-500">Student Profile</span>
                </div>
              </div>

              {/* Path 3: Advertiser Portal */}
              <div className="group rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-5 hover:border-zinc-700 hover:bg-zinc-900/50 transition duration-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-2">
                    <span className="text-purple-400 font-semibold">03 • ADVERTISER</span>
                    <span>1-Click Demo</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">
                    Elena Rostova's Campaign Hub
                  </h3>
                  <ul className="space-y-1.5 text-xs text-zinc-400">
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-purple-400 shrink-0" />
                      <span>Targeting builder (roles, skills, geo)</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-purple-400 shrink-0" />
                      <span>+₹10,000 live demo budget top-up</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-purple-400 shrink-0" />
                      <span>Live CPM telemetry & CTR metrics</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-5 pt-3 border-t border-zinc-900 flex items-center justify-between">
                  <button
                    onClick={() => demoLogin('advertiser')}
                    className="inline-flex items-center gap-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs font-medium text-white transition"
                  >
                    <span>1-Click Adv Login</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                  <span className="text-[10px] font-mono text-zinc-500">Example AI</span>
                </div>
              </div>
            </div>

            {/* Prototype Scope Note */}
            <div className="mt-6 rounded-lg border border-zinc-800/80 bg-zinc-900/30 p-3.5 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-zinc-300">
                <span className="text-indigo-400 font-semibold">● Hackathon Scope:</span>
                <span>Fully working end-to-end version is built specifically for <strong>Google Antigravity CLI (`agy`)</strong>.</span>
              </div>
              <span className="text-[11px] text-zinc-500">Claude Code & Codex in roadmap preview</span>
            </div>
          </div>
        </div>
      </section>

      {/* Creative Interactive Feature: Live Terminal State Playground */}
      <section className="py-16 sm:py-20 border-b border-zinc-900 bg-zinc-950/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="text-xs font-mono text-indigo-400 mb-1">INTERACTIVE TERMINAL DEMO</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Never an interruption. Never an ad banner.
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-xl">
                Click below to simulate how Rebate temporarily occupies your status line during active wait states, and disappears the instant reasoning completes.
              </p>
            </div>

            {/* Interactive State Toggle Buttons */}
            <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 p-1">
              <button
                onClick={() => setTerminalState('waiting')}
                className={`rounded-md px-3 py-1 text-xs font-mono transition ${
                  terminalState === 'waiting'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                1. AI Thinking
              </button>
              <button
                onClick={() => setTerminalState('hotkey')}
                className={`rounded-md px-3 py-1 text-xs font-mono transition ${
                  terminalState === 'hotkey'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                2. Press 'o' Hotkey
              </button>
              <button
                onClick={() => setTerminalState('completed')}
                className={`rounded-md px-3 py-1 text-xs font-mono transition ${
                  terminalState === 'completed'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                3. Done & Revert
              </button>
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
                <span className="ml-2 text-zinc-400 text-[11px]">powershell — 80x24</span>
              </div>
              <span className="text-[11px] text-zinc-500">
                Session: Google Antigravity (`agy`) • Native Hook
              </span>
            </div>

            {/* Terminal Body */}
            <div className="p-6 space-y-3.5 min-h-[220px]">
              <div className="text-zinc-400">
                <span className="text-zinc-500">priya@dev-machine</span>:<span className="text-indigo-400">~/ml-project</span>$ agy refactor auth_middleware.py --verify-tokens
              </div>

              <div className="text-zinc-500">
                [Antigravity] Analyzing AST nodes and local module dependencies...
              </div>

              {/* State 1: Active 1-line transient wait state */}
              {terminalState === 'waiting' && (
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
                  <div className="flex items-center gap-2 text-zinc-200 truncate">
                    <span className="text-indigo-400 animate-spin">⠋</span>
                    <span className="text-zinc-400">Working...</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-400 text-xs">Sponsored:</span>
                    <span className="font-semibold text-white truncate">AI Engineering Internship</span>
                    <span className="text-zinc-600">—</span>
                    <span className="text-indigo-400 font-semibold underline underline-offset-2">Apply ↗</span>
                    <span className="text-zinc-500 text-[11px]">[press 'o' to open]</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-[10px] text-zinc-400 font-mono">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping" />
                    <span>Dwell Tracking: 4s / 5s min</span>
                  </div>
                </div>
              )}

              {/* State 2: User pressed hotkey 'o' */}
              {terminalState === 'hotkey' && (
                <div className="space-y-2 animate-fadeIn">
                  <div className="rounded-lg border border-indigo-500/30 bg-indigo-950/20 p-3 text-xs text-indigo-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Keyboard className="h-4 w-4 text-indigo-400" />
                      <span>Hotkey 'o' detected. Launched destination in browser. Dwell recorded.</span>
                    </div>
                    <span className="text-[10px] font-mono text-indigo-400">Impression Verified</span>
                  </div>
                  <div className="text-zinc-500 text-[11px] pl-2">
                    [Antigravity] Generator compiling refactored syntax tree...
                  </div>
                </div>
              )}

              {/* State 3: Clean line rollback */}
              {terminalState === 'completed' && (
                <div className="space-y-2 pt-1 animate-fadeIn">
                  <div className="text-white font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-indigo-400" />
                    <span>✔ Successfully refactored auth_middleware.py in 6.4s (3 tests passing).</span>
                  </div>
                  <div className="text-zinc-500 text-[11px]">
                    Status line cleanly reverted. Terminal buffer is 100% pristine. +₹4.90 credited silently to wallet.
                  </div>
                  <div className="text-zinc-400 pt-1">
                    priya@dev-machine:~/ml-project$ <span className="animate-pulse">▌</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Creative Interactive Feature: Live Wait-State Monetization Calculator */}
      <section id="calculator" className="py-16 sm:py-20 border-b border-zinc-900 bg-[#09090b]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="text-xs font-mono text-indigo-400 mb-1 uppercase tracking-wider">
              INTERACTIVE EARNINGS SIMULATOR
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Estimate your monthly wait-state earnings
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400">
              Drag the slider to match how many minutes per day you spend delegating tasks to AI agents.
            </p>
          </div>

          <div className="max-w-3xl mx-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-xl">
            {/* Slider Control */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400">Daily AI Reasoning & Tool Wait Time:</span>
                <span className="text-base font-bold text-white font-mono">{dailyMinutes} minutes / day</span>
              </div>

              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={dailyMinutes}
                onChange={(e) => setDailyMinutes(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-2 justify-end pt-1">
                {[
                  { label: 'Casual (10m)', val: 10 },
                  { label: 'Active Dev (20m)', val: 20 },
                  { label: 'Power Builder (40m)', val: 40 },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    onClick={() => setDailyMinutes(preset.val)}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-mono transition ${
                      dailyMinutes === preset.val
                        ? 'bg-zinc-800 text-white border border-zinc-700'
                        : 'bg-zinc-950 text-zinc-500 border border-zinc-900 hover:text-zinc-300'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Results Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4">
                <div className="text-[10px] text-zinc-500 uppercase">Est. Monthly INR</div>
                <div className="text-xl sm:text-2xl font-bold text-white mt-1">₹{estimatedEarningsINR.toLocaleString()}</div>
                <div className="text-[10px] text-zinc-500 mt-1">Direct UPI Cash</div>
              </div>

              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4">
                <div className="text-[10px] text-zinc-500 uppercase">Est. Monthly USD</div>
                <div className="text-xl sm:text-2xl font-bold text-white mt-1">${estimatedEarningsUSD}</div>
                <div className="text-[10px] text-zinc-500 mt-1">Stripe / PayPal</div>
              </div>

              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4">
                <div className="text-[10px] text-zinc-500 uppercase">Wait Turns Monetized</div>
                <div className="text-xl sm:text-2xl font-bold text-indigo-400 mt-1">{monthlyTurns}</div>
                <div className="text-[10px] text-zinc-500 mt-1">Per Month</div>
              </div>

              <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4">
                <div className="text-[10px] text-zinc-500 uppercase">Code Ingestion</div>
                <div className="text-xl sm:text-2xl font-bold text-white mt-1">0 Bytes</div>
                <div className="text-[10px] text-zinc-500 mt-1">100% Private</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 4-Step Economic Engine (Minimal Words) */}
      <section id="how-it-works" className="py-16 sm:py-20 border-b border-zinc-900">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-xs font-mono text-indigo-400 mb-1">THE ECONOMIC FLYWHEEL</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How wait states become economic value
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-2xl">
            A transparent four-step cycle that connects high-intent developer attention with curated opportunities.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950 p-5 flex flex-col justify-between">
              <div>
                <div className="font-mono text-xs text-zinc-500 mb-2">01 / ADVERTISER</div>
                <h3 className="text-sm font-bold text-white mb-1.5">Campaign & Bid</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Companies create targeted bounties (jobs, hackathons, GPU credits) specifying target skills, roles, and budget.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-900 text-[10px] font-mono text-zinc-500">
                CPM Bidding Engine
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950 p-5 flex flex-col justify-between">
              <div>
                <div className="font-mono text-xs text-zinc-500 mb-2">02 / AUCTION</div>
                <h3 className="text-sm font-bold text-white mb-1.5">2nd-Price Clearing</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  The auction calculates <code className="text-indigo-400 text-[11px]">Rank = Bid × Relevance × Quality</code>. Irrelevant high bidders lose to relevant candidates.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-900 text-[10px] font-mono text-zinc-500">
                100% Profile-Driven
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950 p-5 flex flex-col justify-between">
              <div>
                <div className="font-mono text-xs text-zinc-500 mb-2">03 / TERMINAL</div>
                <h3 className="text-sm font-bold text-white mb-1.5">Wait-State Render</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Rebate wraps the CLI process, temporarily replacing the spinner with a 1-line opportunity during active wait states.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-900 text-[10px] font-mono text-zinc-500">
                Zero Popup Guarantee
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950 p-5 flex flex-col justify-between">
              <div>
                <div className="font-mono text-xs text-zinc-500 mb-2">04 / REWARD</div>
                <h3 className="text-sm font-bold text-white mb-1.5">70% Value Share</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Upon verified 5-second view duration, <strong className="text-white">70% of the advertiser spend</strong> credits directly to your wallet.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-900 text-[10px] font-mono text-zinc-500">
                Direct Developer Payout
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Manifesto (Concise) */}
      <section className="py-16 sm:py-20 border-b border-zinc-900 bg-zinc-950/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-xs font-mono text-indigo-400 mb-1">PRIVACY & TRUST ARCHITECTURE</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            The Zero-Code Ingestion Guarantee
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-xl">
            Rebate is built for developers handling proprietary, sensitive codebases.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
              <div className="text-xs font-mono text-indigo-400 font-semibold mb-2">01 / LOCAL INTEGRITY</div>
              <h3 className="text-sm font-bold text-white mb-1.5">Zero Code Inspection</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Rebate never reads ASTs, source files, git commits, or environment secrets. Only process lifecycle state is observed.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
              <div className="text-xs font-mono text-indigo-400 font-semibold mb-2">02 / PROMPT ISOLATION</div>
              <h3 className="text-sm font-bold text-white mb-1.5">Zero Prompt Logging</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Prompts, completions, and model reasoning never pass through Rebate servers. They remain strictly on your local machine.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
              <div className="text-xs font-mono text-indigo-400 font-semibold mb-2">03 / TRANSPARENCY</div>
              <h3 className="text-sm font-bold text-white mb-1.5">Voluntary Profile Only</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Matching uses only self-declared tags (role, skills, optional country) configured in <code className="text-zinc-300">~/.rebate/config.json</code>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Ready to monetize your AI wait time?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            Install the CLI, connect your wallet, and continue coding as you always do.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition shadow-sm"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Launch 60s Demo</span>
            </Link>
            <Link
              href="/signup?role=developer"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-xs font-medium text-zinc-300 hover:border-zinc-700 hover:text-white transition"
            >
              <span>Get Started</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
