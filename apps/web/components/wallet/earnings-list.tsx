'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, ArrowUpRight, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { RewardCurrency } from '@rebate/shared';
import { formatCurrency } from '@/lib/rewards/reward';

export interface RewardItem {
  id: string;
  amount: number;
  currency: RewardCurrency;
  source: string;
  status: string;
  timestamp: string;
}

export interface ImpressionItem {
  impressionId: string;
  agentType: string;
  durationSeconds: number;
  developerReward: number;
  currency: RewardCurrency;
  status: string;
  createdAt: string;
}

interface EarningsListProps {
  rewards: RewardItem[];
  impressions: ImpressionItem[];
  selectedCurrency: RewardCurrency;
}

export function EarningsList({ rewards, impressions, selectedCurrency }: EarningsListProps) {
  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Verified Earnings Ledger</span>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-mono font-medium text-emerald-400 border border-emerald-500/20">
              70% Payout Share
            </span>
          </h2>
          <p className="mt-1 text-xs text-zinc-400">
            Real-time verified rewards generated from AI wait states.
          </p>
        </div>

        <div className="text-xs font-mono text-zinc-500">
          Showing {rewards.length} settled rewards
        </div>
      </div>

      {rewards.length === 0 ? (
        <div className="py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800/50 text-zinc-500 mb-3">
            <Clock className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium text-zinc-300">No settled rewards yet</p>
          <p className="mt-1 text-xs text-zinc-500 max-w-sm mx-auto">
            Launch the Rebate CLI agent or run the demo simulator to generate your first verified opportunity reward.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link
              href="/demo"
              className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:underline"
            >
              <Sparkles className="h-3.5 w-3.5" /> Try 60s Demo Simulator
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {rewards.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between rounded-lg border border-zinc-800/60 bg-zinc-950/40 p-3.5 hover:border-zinc-700/80 transition"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    {r.source.replace('Impression verified: ', '')}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono mt-0.5">
                    <span>Verified wait state</span>
                    <span>•</span>
                    <span>{new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-bold font-mono text-emerald-400">
                  +{formatCurrency(r.amount, r.currency)}
                </div>
                <div className="text-[10px] font-mono text-zinc-500 uppercase">
                  {r.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Impression Activity Trace */}
      {impressions.length > 0 && (
        <div className="mt-8 pt-6 border-t border-zinc-800/80">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
            Recent Wait-State Impressions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500">
                  <th className="pb-2 font-medium">Session / ID</th>
                  <th className="pb-2 font-medium">Agent</th>
                  <th className="pb-2 font-medium">Duration</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium text-right">Developer Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-300">
                {impressions.slice(0, 5).map((imp) => (
                  <tr key={imp.impressionId} className="hover:bg-zinc-900/30">
                    <td className="py-2.5 text-zinc-400">{imp.impressionId.slice(0, 14)}...</td>
                    <td className="py-2.5 capitalize">{imp.agentType}</td>
                    <td className="py-2.5">{imp.durationSeconds}s</td>
                    <td className="py-2.5">
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400 border border-emerald-500/20">
                        {imp.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-bold text-emerald-400">
                      +{formatCurrency(imp.developerReward, imp.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
