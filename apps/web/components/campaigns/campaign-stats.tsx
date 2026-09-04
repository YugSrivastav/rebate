'use client';

import React from 'react';
import { CheckCircle2, MousePointerClick, DollarSign, Megaphone, TrendingUp } from 'lucide-react';

interface CampaignStatsProps {
  totalImpressions: number;
  totalVerified: number;
  totalClicks: number;
  totalSpend: number;
  overallCtr: number;
  activeCount: number;
}

export function CampaignStats({
  totalImpressions,
  totalVerified,
  totalClicks,
  totalSpend,
  overallCtr,
  activeCount,
}: CampaignStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {/* Verified Impressions */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>Verified Impressions</span>
          <CheckCircle2 className="h-4 w-4 text-indigo-400" />
        </div>
        <div className="mt-3 text-2xl font-bold text-white font-mono">
          {totalVerified}
        </div>
        <div className="mt-2 text-[11px] text-zinc-500">
          From {totalImpressions} total auction requests
        </div>
      </div>

      {/* Clicks */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>Opportunity Clicks</span>
          <MousePointerClick className="h-4 w-4 text-zinc-400" />
        </div>
        <div className="mt-3 text-2xl font-bold text-white font-mono">
          {totalClicks}
        </div>
        <div className="mt-2 text-[11px] text-indigo-400 font-mono">
          {overallCtr}% average CTR
        </div>
      </div>

      {/* Campaign Spend */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>Total Campaign Spend</span>
          <DollarSign className="h-4 w-4 text-indigo-400" />
        </div>
        <div className="mt-3 text-2xl font-bold text-white font-mono">
          ₹{totalSpend.toFixed(2)}
        </div>
        <div className="mt-2 text-[11px] text-zinc-500">
          70% paid to developers, 30% platform
        </div>
      </div>

      {/* Active Campaigns */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>Active Campaigns</span>
          <Megaphone className="h-4 w-4 text-zinc-400" />
        </div>
        <div className="mt-3 text-2xl font-bold text-white font-mono">
          {activeCount}
        </div>
        <div className="mt-2 text-[11px] text-zinc-500 flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Auction matching online
        </div>
      </div>
    </div>
  );
}
