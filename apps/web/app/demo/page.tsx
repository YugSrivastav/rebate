'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Terminal,
  TrendingUp,
  Coins,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Opportunity } from '@rebate/shared';

export default function DemoSimulatorPage() {
  const [step, setStep] = useState<number>(0);
  const [simulating, setSimulating] = useState(false);
  const [developerId, setDeveloperId] = useState('dev_alex_india');

  // Auction State
  const [auctionScores, setAuctionScores] = useState<any[]>([]);
  const [winner, setWinner] = useState<Opportunity | null>(null);
  const [impressionId, setImpressionId] = useState<string | null>(null);

  // Settlement State
  const [timerSeconds, setTimerSeconds] = useState(8);
  const [settled, setSettled] = useState(false);
  const [settledReward, setSettledReward] = useState<any>(null);

  const resetDemo = async () => {
    setStep(0);
    setSimulating(false);
    setAuctionScores([]);
    setWinner(null);
    setImpressionId(null);
    setTimerSeconds(8);
    setSettled(false);
    setSettledReward(null);

    await fetch('/api/demo/reset', { method: 'POST' });
  };

  const startLoop = async () => {
    setSimulating(true);
    setStep(1); // AI Agent Launches

    // Step 2: Agent Enters Waiting State
    setTimeout(() => {
      setStep(2);
    }, 1200);

    // Step 3: Run Auction on Backend
    setTimeout(async () => {
      setStep(3);
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
          setAuctionScores(data.auction.allScores || []);
        }
      } catch (err) {
        console.error('Auction failed:', err);
      }
    }, 2400);

    // Step 4: Display 1-Line Native Sponsored Opportunity
    setTimeout(() => {
      setStep(4);
    }, 3800);
  };

  // Timer countdown for Step 4 -> 5
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
    if (!impressionId || settled) return;
    setStep(5); // Settling
    try {
      const res = await fetch('/api/ledger/impression', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          impressionId,
          developerId,
          sessionId: 'sess_demo_sim',
          agentType: 'antigravity',
          startedAt: new Date(Date.now() - 8000).toISOString(),
          endedAt: new Date().toISOString(),
          durationSeconds: 8,
          customMinViewSeconds: 2, // Allow immediate settlement in demo
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSettled(true);
        setSettledReward(data.reward);
        setStep(6); // Completed Loop
      }
    } catch (err) {
      console.error('Settlement error:', err);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-2xl font-bold text-white tracking-tight">
              60-Second Economic Loop Simulator
            </h1>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Demonstrates the complete end-to-end flow: Developer Profile → AI Wait State → Auction → Native Display → Settlement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetDemo}
            className="flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Demo State</span>
          </button>
          <button
            onClick={startLoop}
            disabled={simulating && step !== 0}
            className="flex items-center gap-1.5 rounded-md bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-black hover:bg-emerald-400 transition shadow-md shadow-emerald-500/20 disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5" />
            <span>Run 60s Demo</span>
          </button>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs font-mono mb-8">
        {[
          { label: '1. Launch Agent', active: step >= 1 },
          { label: '2. Wait State', active: step >= 2 },
          { label: '3. Auction Match', active: step >= 3 },
          { label: '4. Native Display', active: step >= 4 },
          { label: '5. Verification', active: step >= 5 },
          { label: '6. Settlement', active: step >= 6 },
        ].map((s, idx) => (
          <div
            key={idx}
            className={`rounded-lg p-2 border transition ${
              s.active
                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300 font-semibold'
                : 'border-zinc-800/80 bg-zinc-950/40 text-zinc-600'
            }`}
          >
            {s.label}
          </div>
        ))}
      </div>

      {/* Stage 1: Active Developer Profile Card */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 mb-6">
        <div className="flex items-center justify-between text-xs mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-zinc-500">DEVELOPER IDENTITY:</span>
            <span className="font-bold text-white">Priya Sharma</span>
            <span className="text-zinc-500 font-mono">(dev_alex_india)</span>
          </div>
          <span className="text-emerald-400 font-mono text-[11px]">Voluntary Profile Attributes</span>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-mono text-zinc-300">
          <span className="rounded bg-zinc-800 px-2 py-0.5 border border-zinc-700">Role: Student</span>
          <span className="rounded bg-zinc-800 px-2 py-0.5 border border-zinc-700">Field: AI/ML</span>
          <span className="rounded bg-zinc-800 px-2 py-0.5 border border-zinc-700">Location: India</span>
          <span className="rounded bg-zinc-800 px-2 py-0.5 border border-zinc-700">Skills: Python, FastAPI, PyTorch</span>
          <span className="rounded bg-emerald-500/15 text-emerald-300 px-2 py-0.5 border border-emerald-500/30">
            Reward: INR (Cash)
          </span>
        </div>
      </div>

      {/* Stage 2 & 4: Virtual Terminal Interface */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl mb-6 font-mono text-xs sm:text-sm">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
            <span className="ml-2 text-zinc-500 text-xs">developer terminal — antigravity agent</span>
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">
            {step >= 4 ? 'Status: Wait-State Opportunity Active' : step >= 2 ? 'Status: Agent Thinking' : 'Status: Ready'}
          </span>
        </div>

        <div className="space-y-2 text-zinc-300">
          <div className="text-zinc-500">$ antigravity build-agent-pipeline --eval</div>

          {step >= 1 && (
            <div className="text-zinc-400">
              Antigravity analyzing repository dependency graph... (3 tools pending)
            </div>
          )}

          {step >= 2 && step < 4 && (
            <div className="flex items-center gap-2 text-zinc-400 py-1">
              <span className="text-cyan-400 animate-spin">⠋</span>
              <span>AI is thinking...</span>
            </div>
          )}

          {/* Section 2 & 3: The Native 1-Line Opportunity Transformation */}
          {step >= 4 && (
            <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-950/20 text-zinc-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 truncate">
                <span className="text-cyan-400 animate-spin">⠋</span>
                <span className="text-zinc-400">AI is thinking...</span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400 text-xs">Sponsored:</span>
                <span className="font-bold text-white truncate">
                  {winner?.title || 'AI Engineering Internship'}
                </span>
                <span className="text-zinc-600">—</span>
                <Link
                  href={`/opportunity/${winner?.campaignId || 'camp_ai_internship'}`}
                  target="_blank"
                  className="text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>{winner?.cta || 'Apply'}</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-[11px] text-zinc-400">
                  {timerSeconds > 0 ? `Verifying: ${timerSeconds}s` : 'Verified!'}
                </span>
                {timerSeconds > 0 && (
                  <button
                    onClick={handleSettle}
                    className="rounded bg-emerald-500 px-2 py-1 text-[10px] font-bold text-black hover:bg-emerald-400 transition"
                  >
                    Instant Settle
                  </button>
                )}
              </div>
            </div>
          )}

          {step >= 6 && (
            <div className="pt-2 text-xs text-zinc-500">
              ✔ AI finished tool execution. Line cleanly reverted to prompt. (Earnings never displayed in CLI).
            </div>
          )}
        </div>
      </div>

      {/* Stage 3: Auction Engine Transparency Box */}
      {step >= 3 && auctionScores.length > 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Live Auction Engine Calculation: Rank = Bid × Relevance × Quality
            </h3>
            <span className="text-[11px] text-emerald-400 font-mono">Highest Rank Wins</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500">
                  <th className="pb-2">Campaign Title</th>
                  <th className="pb-2">Advertiser Bid</th>
                  <th className="pb-2">Profile Relevance</th>
                  <th className="pb-2">Quality</th>
                  <th className="pb-2 text-right">Auction Rank</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {auctionScores.map((score, i) => (
                  <tr
                    key={score.campaignId}
                    className={i === 0 ? 'text-emerald-300 font-bold bg-emerald-500/5' : 'text-zinc-400'}
                  >
                    <td className="py-2 flex items-center gap-2">
                      {i === 0 && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                      <span>{score.title}</span>
                    </td>
                    <td className="py-2">₹{score.bid.toFixed(2)} CPM</td>
                    <td className="py-2">{(score.relevance * 100).toFixed(0)}%</td>
                    <td className="py-2">{score.quality.toFixed(1)}x</td>
                    <td className="py-2 text-right text-emerald-400 font-mono">
                      {score.totalScore.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stage 6: Economic Settlement Proof (Section 22) */}
      {step >= 6 && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-6 shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold mb-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>ECONOMIC LOOP COMPLETED SUCCESSFULLY</span>
          </div>

          <h2 className="text-xl font-bold text-white mb-4">
            Economic Value Distribution (Section 22 Match)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
              <span className="text-zinc-500 block text-[10px]">ADVERTISER SPEND:</span>
              <span className="text-lg font-bold text-white">
                ₹{settledReward?.advertiserCost?.toFixed(2) || '7.00'}
              </span>
              <span className="text-[10px] text-zinc-400 block mt-1">1 Verified Impression</span>
            </div>

            <div className="rounded-lg border border-emerald-500/30 bg-emerald-900/20 p-4">
              <span className="text-emerald-400 block text-[10px]">DEVELOPER REWARD (70%):</span>
              <span className="text-lg font-bold text-emerald-400">
                +₹{settledReward?.amount?.toFixed(2) || '4.90'}
              </span>
              <span className="text-[10px] text-zinc-300 block mt-1">Credited to Wallet</span>
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
              <span className="text-zinc-500 block text-[10px]">PLATFORM SHARE (30%):</span>
              <span className="text-lg font-bold text-zinc-300">
                ₹{settledReward?.platformShare?.toFixed(2) || '2.10'}
              </span>
              <span className="text-[10px] text-zinc-500 block mt-1">Rebate Marketplace Fee</span>
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
              <span className="text-zinc-500 block text-[10px]">SECURITY AUDIT:</span>
              <span className="text-sm font-bold text-zinc-200 block">7-Layer Passed</span>
              <span className="text-[10px] text-emerald-400 block mt-1">0 Code/Prompt Read</span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-emerald-500/20 pt-4">
            <div className="text-xs text-zinc-300">
              View your updated balance and transaction history in the Rebate Developer Center.
            </div>
            <Link
              href="/developer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-black hover:bg-emerald-400 transition"
            >
              <span>Go to Developer Wallet</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
