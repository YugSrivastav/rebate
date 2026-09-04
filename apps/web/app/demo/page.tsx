'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Terminal,
  TrendingUp,
  Coins,
  ShieldCheck,
  Zap,
  MousePointer,
  Keyboard,
  Info,
} from 'lucide-react';
import { Opportunity } from '@rebate/shared';

interface CandidateEval {
  campaignId: string;
  companyName: string;
  title: string;
  bid: number;
  qualified: boolean;
  relevance: number;
  quality: number;
  totalScore: number;
  rejectionReason?: string;
}

export default function DemoSimulatorPage() {
  const [step, setStep] = useState<number>(1);
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [simulating, setSimulating] = useState(false);
  const [developerId, setDeveloperId] = useState('dev_alex_india');

  // Auction State
  const [auctionScores, setAuctionScores] = useState<any[]>([]);
  const [candidateEvaluations, setCandidateEvaluations] = useState<CandidateEval[]>([]);
  const [winner, setWinner] = useState<Opportunity | null>(null);
  const [impressionId, setImpressionId] = useState<string | null>(null);

  // Settlement & Interaction State
  const [timerSeconds, setTimerSeconds] = useState(8);
  const [settled, setSettled] = useState(false);
  const [settledReward, setSettledReward] = useState<any>(null);
  const [hotkeyTriggered, setHotkeyTriggered] = useState(false);

  // Load initial auction data on mount
  const fetchAuctionData = useCallback(async () => {
    try {
      const res = await fetch('/api/auction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          developerId,
          sessionId: `sess_demo_${Date.now()}`,
          agentType: 'antigravity',
        }),
      });
      const data = await res.json();
      if (data.success && data.opportunity) {
        setWinner(data.opportunity);
        setImpressionId(data.impressionId);
        setAuctionScores(data.auction?.allScores || []);
        setCandidateEvaluations(data.auction?.evaluations || data.evaluations || []);
      }
    } catch (err) {
      console.error('Initial auction load failed:', err);
    }
  }, [developerId]);

  useEffect(() => {
    fetchAuctionData();
  }, [fetchAuctionData]);

  const resetDemo = async () => {
    setStep(1);
    setSimulating(false);
    setTimerSeconds(8);
    setSettled(false);
    setSettledReward(null);
    setHotkeyTriggered(false);
    await fetch('/api/demo/reset', { method: 'POST' });
    fetchAuctionData();
  };

  const startAutoPlay = () => {
    resetDemo();
    setSimulating(true);
    setMode('auto');
    setStep(1);

    // Step 2: Agent Enters Waiting State (after 1.8s)
    setTimeout(() => {
      setStep(2);
    }, 1800);

    // Step 3: Run Auction (after 3.6s)
    setTimeout(() => {
      setStep(3);
    }, 3600);

    // Step 4: Display 1-Line Opportunity (after 5.4s)
    setTimeout(() => {
      setStep(4);
    }, 5400);
  };

  // Manual Step Controls
  const nextStep = () => {
    setMode('manual');
    setSimulating(false);
    if (step < 6) {
      const next = step + 1;
      setStep(next);
      if (next === 5 && !settled) {
        handleSettle();
      }
    }
  };

  const prevStep = () => {
    setMode('manual');
    setSimulating(false);
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Keyboard Hotkey 'o' listener in Step 4
  const triggerHotkeyO = useCallback(() => {
    setHotkeyTriggered(true);
    const dest = winner?.destinationUrl || 'https://example-ai.dev/careers/internship-2026';
    window.open(dest, '_blank');
    if (!settled) {
      setTimeout(() => {
        handleSettle();
      }, 600);
    }
  }, [winner, settled]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'o' || e.key === 'O') && step === 4) {
        e.preventDefault();
        triggerHotkeyO();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, triggerHotkeyO]);

  // Timer countdown for Step 4 -> 5 in auto mode
  useEffect(() => {
    let interval: any;
    if (step === 4 && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (step === 4 && timerSeconds === 0 && !settled) {
      handleSettle();
    }
    return () => clearInterval(interval);
  }, [step, timerSeconds, settled]);

  const handleSettle = async () => {
    if (settled) return;
    setStep(5);
    try {
      const res = await fetch('/api/ledger/impression', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          impressionId: impressionId || `imp_demo_${Date.now()}`,
          developerId,
          sessionId: 'sess_demo_sim',
          agentType: 'antigravity',
          startedAt: new Date(Date.now() - 8000).toISOString(),
          endedAt: new Date().toISOString(),
          durationSeconds: 8,
          customMinViewSeconds: 2,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSettled(true);
        setSettledReward(data.reward);
        setStep(6);
        setSimulating(false);
      }
    } catch (err) {
      console.error('Settlement error:', err);
    }
  };

  const stepsMeta = [
    { num: 1, title: 'Developer Context', desc: 'Voluntary profile tags & candidate targeting filter' },
    { num: 2, title: 'Wait State Detection', desc: 'Google Antigravity CLI status line interception' },
    { num: 3, title: '2nd-Price Auction', desc: 'Real-time score: Bid × Relevance × Quality' },
    { num: 4, title: 'Terminal Display', desc: '1-line native transient banner with OSC 8 & "o" hotkey' },
    { num: 5, title: '7-Layer Verification', desc: 'Zero code inspection & cryptographic dwell attestation' },
    { num: 6, title: '70/30 Settlement', desc: 'Immediate INR/USD ledger credit to developer wallet' },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Top Banner: Evaluator Guide Alert */}
      <div className="mb-8 rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                Hackathon Judge Evaluator Mode
              </span>
              <span className="rounded-full bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-300">
                Self-Serve
              </span>
            </div>
            <p className="mt-0.5 text-xs text-zinc-400">
              Test the entire Rebate value engine right in your browser. Toggle between <strong>Auto-Play</strong> or <strong>Step-by-Step</strong> to inspect auction math, terminal mechanics, and wallet settlement.
            </p>
            <div className="mt-2 inline-flex items-center gap-2 rounded-md bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-[10px] font-mono text-indigo-300">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              <span>Hackathon Prototype Note: End-to-end working implementation is built specifically for Google Antigravity CLI (`agy`).</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={resetDemo}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-mono text-zinc-400 hover:text-white transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={startAutoPlay}
            disabled={simulating}
            className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition shadow-[0_0_15px_rgba(255,255,255,0.1)] disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Auto-Play Loop (60s)</span>
          </button>
        </div>
      </div>

      {/* Interactive Step Navigator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-mono text-zinc-400">
            CURRENT STAGE: <strong className="text-white">Step {step} of 6 — {stepsMeta[step - 1].title}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-300 hover:border-zinc-700 disabled:opacity-30 transition"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Prev</span>
            </button>
            <button
              onClick={nextStep}
              disabled={step === 6}
              className="flex items-center gap-1 rounded-md bg-zinc-800 px-2.5 py-1 text-xs font-medium text-white hover:bg-zinc-700 disabled:opacity-30 transition"
            >
              <span>Next</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {stepsMeta.map((s) => {
            const isCurrent = step === s.num;
            const isCompleted = step > s.num;
            return (
              <button
                key={s.num}
                onClick={() => {
                  setStep(s.num);
                  setMode('manual');
                  setSimulating(false);
                }}
                className={`text-left rounded-lg p-2.5 border transition font-mono ${
                  isCurrent
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-200 ring-1 ring-indigo-500/40 shadow-sm'
                    : isCompleted
                    ? 'border-zinc-700/80 bg-zinc-900/60 text-zinc-300'
                    : 'border-zinc-800/80 bg-zinc-950/40 text-zinc-600 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-bold">Step {s.num}</span>
                  {isCompleted && <CheckCircle2 className="h-3 w-3 text-indigo-400" />}
                </div>
                <div className="text-[10px] truncate leading-tight">{s.title}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left 2 Cols: Interactive Terminal & Live Visualizer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Terminal Window */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl font-mono text-xs sm:text-sm">
            {/* Window Header */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs text-zinc-400 font-semibold">
                  Google Antigravity CLI (`agy`) — Native Session
                </span>
              </div>
              <span className="text-[11px] font-mono text-indigo-400">
                {step >= 4 && step < 6
                  ? '● Opportunity Active'
                  : step === 2 || step === 3
                  ? '⠋ Thinking'
                  : step === 6
                  ? '✔ Reverted to Prompt'
                  : 'Idle'}
              </span>
            </div>

            {/* Terminal Body */}
            <div className="space-y-2.5 min-h-[220px]">
              <div className="text-zinc-500">
                <span className="text-indigo-400">priya@dev-box</span>:<span className="text-cyan-400">~/ml-pipeline</span>$ agy refactor auth_middleware.py --verify-tokens
              </div>

              {step >= 1 && (
                <div className="text-zinc-400">
                  Antigravity agent started. Analyzing abstract syntax tree and project imports...
                </div>
              )}

              {step === 2 && (
                <div className="flex items-center gap-2 text-zinc-300 py-1">
                  <span className="text-cyan-400 animate-spin">⠋</span>
                  <span>Generating refactored AST nodes... (wait state detected: 2.1s)</span>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-1 py-1">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <span className="text-cyan-400 animate-spin">⠋</span>
                    <span>Running decentralized opportunity auction...</span>
                  </div>
                  <div className="text-[11px] text-zinc-500 pl-5">
                    → Matched campaign with highest total rank: <strong className="text-white">{winner?.title || 'AI Engineering Internship'}</strong>
                  </div>
                </div>
              )}

              {/* STEP 4: Live 1-Line Opportunity Banner */}
              {step >= 4 && step < 6 && (
                <div className="my-2 rounded-lg border border-indigo-500/40 bg-indigo-950/20 p-3 text-zinc-100 transition shadow-lg shadow-indigo-950/30">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-cyan-400 animate-spin">⠋</span>
                      <span className="text-zinc-400">Working...</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-zinc-400 text-xs font-semibold">Sponsored:</span>
                      <span className="font-bold text-white truncate">
                        {winner?.title || 'AI Engineering Internship'}
                      </span>
                      <span className="text-zinc-600">—</span>
                      <a
                        href={winner?.destinationUrl || 'https://example-ai.dev/careers/internship-2026'}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 underline font-semibold flex items-center gap-1"
                        onClick={() => setHotkeyTriggered(true)}
                      >
                        <span>{winner?.cta || 'Apply'} ↗</span>
                      </a>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-zinc-400 font-mono">
                        Dwell: <strong className="text-white">{timerSeconds}s</strong> / 5s min
                      </span>
                      <button
                        onClick={handleSettle}
                        className="rounded bg-white px-2.5 py-1 text-[11px] font-bold text-zinc-950 hover:bg-zinc-200 transition shadow-sm"
                      >
                        Instant Settle
                      </button>
                    </div>
                  </div>

                  {/* Terminal Interaction Hint */}
                  <div className="mt-2.5 pt-2 border-t border-indigo-500/20 flex flex-wrap items-center justify-between text-[11px] text-zinc-400">
                    <div className="flex items-center gap-2">
                      <Keyboard className="h-3.5 w-3.5 text-indigo-400" />
                      <span>
                        Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-white font-bold">o</kbd> on your keyboard or click below to simulate hotkey:
                      </span>
                    </div>
                    <button
                      onClick={triggerHotkeyO}
                      className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                      <span>Simulate 'o' Press</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}

              {hotkeyTriggered && (
                <div className="text-[11px] text-indigo-300 bg-indigo-950/40 border border-indigo-500/30 p-2 rounded">
                  ✔ Hotkey 'o' / Click registered. Opened sponsored destination in browser. Dwell integrity recorded.
                </div>
              )}

              {step === 6 && (
                <div className="space-y-2 pt-2 text-xs">
                  <div className="text-indigo-400 font-semibold">
                    ✔ Agent completed refactor in 8.4s. Cleanly reverted line to prompt.
                  </div>
                  <div className="text-zinc-500">
                    Terminal buffer is 100% pristine. No lingering ads or earnings logs printed in developer CLI.
                  </div>
                  <div className="text-zinc-400">
                    priya@dev-box:~/ml-pipeline$ <span className="animate-pulse">▌</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Context Explanation Card for Current Step */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Info className="h-4 w-4 text-indigo-400" />
                <span>Architecture Breakdown: Step {step} — {stepsMeta[step - 1].title}</span>
              </h3>
              <span className="text-[11px] font-mono text-zinc-500">Section 22 Verification</span>
            </div>

            {step === 1 && (
              <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
                <p>
                  Rebate matches opportunities using <strong>only voluntary profile attributes</strong> explicitly declared by the developer in <code className="text-indigo-300 bg-zinc-950 px-1 py-0.5 rounded">~/.rebate/config.json</code> or the Developer Center.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
                    <span className="text-[10px] font-mono text-zinc-500 block mb-1">ZERO CODE INSPECTION</span>
                    Rebate never reads code files, abstract syntax trees, git history, or environment secrets.
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
                    <span className="text-[10px] font-mono text-zinc-500 block mb-1">ZERO PROMPT LOGGING</span>
                    Prompts and model reasoning never pass through Rebate servers. Only process lifecycle state is observed.
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
                <p>
                  In the terminal, Rebate wraps the process via transparent PTY wrapper (<code className="text-indigo-300 bg-zinc-950 px-1 py-0.5 rounded">apps/cli/src/proxy/agy_proxy.py</code>). It listens for transient status phrases:
                </p>
                <div className="flex flex-wrap gap-2 font-mono text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">Working...</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">Generating...</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">Thinking...</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">Planning...</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">Executing...</span>
                </div>
                <p className="text-zinc-400">
                  Wait-State Threshold: Only activates when the AI agent stays in a waiting state for &gt; 2 seconds. Sub-second tool calls are ignored to avoid flicker.
                </p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
                <p>
                  When a wait state is detected, the proxy requests a candidate from the local/edge auction engine. The auction ranks campaigns by:
                </p>
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-indigo-300 text-center">
                  Auction Rank = Advertiser Bid (CPM) × Relevance Score (0.0–1.0) × Quality Score (0.5–2.0)
                </div>
                <p className="text-zinc-400">
                  The highest rank wins. Pricing follows second-price clearing: the winner pays only what was needed to beat the second-highest bidder.
                </p>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
                <p>
                  The opportunity is injected as a <strong>1-line transient replacement</strong> of the spinner line. Two interaction modes are supported:
                </p>
                <ul className="list-disc list-inside space-y-1 text-zinc-400">
                  <li>
                    <strong className="text-white">Mouse Click (OSC 8 Hyperlinks):</strong> Modern terminals (Windows Terminal, VS Code, iTerm) support ANSI OSC 8 links (<code className="text-indigo-300 bg-zinc-950 px-1 py-0.5 rounded">\x1b]8;;url\x1b\</code>). Click directly on the title or CTA.
                  </li>
                  <li>
                    <strong className="text-white">Keyboard Hotkey ('o'):</strong> Press <kbd className="px-1 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-white font-bold">o</kbd> while the opportunity is visible to launch the link in your default browser.
                  </li>
                </ul>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
                <p>
                  Before crediting any balance, Rebate runs a <strong>7-Layer Anti-Fraud & Privacy Verification Gate</strong>:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="flex items-center gap-1.5 text-indigo-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Zero Code/Prompt Ingestion</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-indigo-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Dwell Time Verification (≥ 5s)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-indigo-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Genuine Agent Process Signature</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-indigo-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Rate Limiter (1 opp / 180s)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-indigo-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Window Focus Attestation</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-indigo-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Anti-Sybil Replay Nonce</span>
                  </div>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
                <p>
                  Settlement occurs instantly on verification. Value is distributed according to the <strong>70/30 Rebate Value Split</strong>:
                </p>
                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-950">
                    <div className="text-[10px] text-zinc-500">ADVERTISER SPEND</div>
                    <div className="text-sm font-bold text-white mt-1">₹7.00</div>
                  </div>
                  <div className="p-2.5 rounded-lg border border-indigo-500/40 bg-indigo-950/20">
                    <div className="text-[10px] text-indigo-400 font-bold">DEVELOPER (70%)</div>
                    <div className="text-sm font-bold text-indigo-300 mt-1">+₹4.90</div>
                  </div>
                  <div className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-950">
                    <div className="text-[10px] text-zinc-500">PLATFORM (30%)</div>
                    <div className="text-sm font-bold text-zinc-400 mt-1">₹2.10</div>
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <Link
                    href="/developer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition shadow-sm"
                  >
                    <span>View Priya's Updated Wallet</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Evaluator Inspection Tabs */}
        <div className="space-y-6">
          {/* Active Developer Profile Summary */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Active Developer Context
              </span>
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                Priya Sharma
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-500">Role:</span>
                <span className="text-zinc-200">Student (AI/ML)</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-500">Location:</span>
                <span className="text-zinc-200">Bengaluru, India</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-500">Skills:</span>
                <span className="text-zinc-200">Python, FastAPI, PyTorch</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-500">Reward Mode:</span>
                <span className="text-indigo-400 font-bold">INR Cash (UPI)</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-zinc-500">Native CLI:</span>
                <span className="text-cyan-400">Google Antigravity (`agy`)</span>
              </div>
            </div>
          </div>

          {/* Candidate Targeting Filter Matrix */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Targeting Filter Engine
              </span>
              <span className="text-[10px] font-mono text-zinc-500">Why Matched</span>
            </div>

            <div className="space-y-3">
              {candidateEvaluations.length > 0 ? (
                candidateEvaluations.slice(0, 4).map((cand) => (
                  <div
                    key={cand.campaignId}
                    className={`p-3 rounded-lg border text-xs font-mono ${
                      cand.qualified
                        ? 'border-indigo-500/30 bg-indigo-950/20'
                        : 'border-zinc-800 bg-zinc-950/60 text-zinc-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-semibold ${cand.qualified ? 'text-white' : 'text-zinc-400'}`}>
                        {cand.title}
                      </span>
                      {cand.qualified ? (
                        <span className="text-[10px] font-bold text-indigo-400 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>QUALIFIED</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-red-400 flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          <span>REJECTED</span>
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      {cand.qualified ? (
                        <span>Matched: Student role, AI/ML field, India location, Python/PyTorch skills.</span>
                      ) : (
                        <span className="text-zinc-500">
                          {cand.rejectionReason || 'Targeting criteria mismatch (Geographic/Skill constraint)'}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-zinc-500 font-mono">
                  Loading candidate evaluations...
                </div>
              )}
            </div>
          </div>

          {/* Live Auction Math Table */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Live Auction Score Matrix
              </span>
              <span className="text-[10px] font-mono text-indigo-400">Rank = Bid × Rel × Qual</span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {auctionScores.length > 0 ? (
                auctionScores.slice(0, 3).map((score, i) => (
                  <div
                    key={score.campaignId}
                    className={`p-2.5 rounded-lg border flex items-center justify-between ${
                      i === 0
                        ? 'border-indigo-500/40 bg-indigo-950/30 text-indigo-200 font-bold'
                        : 'border-zinc-800 bg-zinc-950/40 text-zinc-400'
                    }`}
                  >
                    <div>
                      <div className="text-white text-xs">{score.title}</div>
                      <div className="text-[10px] text-zinc-500 font-normal">
                        ₹{score.bid.toFixed(2)} CPM × {(score.relevance * 100).toFixed(0)}% × {score.quality}x
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-indigo-400 text-sm">{score.totalScore.toFixed(2)}</div>
                      <div className="text-[10px] text-zinc-500">{i === 0 ? '🏆 WINNER' : 'RUNNER-UP'}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-zinc-500">No active scores</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Evaluator Next Steps & Navigation Links */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
        <h3 className="text-sm font-mono font-bold text-white mb-3">
          NEXT EVALUATOR STEPS (SELF-SERVE)
        </h3>
        <p className="text-xs text-zinc-400 mb-4 max-w-2xl">
          Everything on Rebate is interconnected. After testing the simulator above, explore the live portals:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/developer"
            className="group rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 hover:border-zinc-700 hover:bg-zinc-900/80 transition"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-white group-hover:text-indigo-400 transition">
                1. Developer Wallet
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-zinc-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition" />
            </div>
            <p className="text-[11px] text-zinc-400">
              Inspect Priya's live ledger balance, voluntary profile tags, and multi-currency payout options (INR / USD / GPU).
            </p>
          </Link>

          <Link
            href="/advertiser"
            className="group rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 hover:border-zinc-700 hover:bg-zinc-900/80 transition"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-white group-hover:text-indigo-400 transition">
                2. Advertiser Portal
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-zinc-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition" />
            </div>
            <p className="text-[11px] text-zinc-400">
              Create developer campaigns, set targeting filters (roles/countries/skills), top up demo budget, and inspect CTR telemetry.
            </p>
          </Link>

          <Link
            href="/download"
            className="group rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 hover:border-zinc-700 hover:bg-zinc-900/80 transition"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-white group-hover:text-indigo-400 transition">
                3. CLI / SDK Specs
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-zinc-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition" />
            </div>
            <p className="text-[11px] text-zinc-400">
              Review Google Antigravity CLI native integration details, proxy architecture, MCP integration, and installation commands.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
