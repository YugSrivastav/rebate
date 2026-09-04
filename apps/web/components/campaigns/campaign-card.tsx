'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Pause, ArrowUpRight, CheckCircle2, Eye, MousePointerClick, ShieldCheck } from 'lucide-react';
import { Campaign } from '@rebate/shared';

interface CampaignCardProps {
  campaign: Campaign;
  onToggleStatus: (campaign: Campaign) => void;
  isToggling?: boolean;
}

export function CampaignCard({ campaign, onToggleStatus, isToggling }: CampaignCardProps) {
  const ctr = campaign.impressionsCount > 0
    ? ((campaign.clicksCount / campaign.impressionsCount) * 100).toFixed(1)
    : '0.0';

  const isActive = campaign.status === 'active';

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 transition hover:border-zinc-700/80">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-medium border ${
                isActive
                  ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
              }`}
            >
              {campaign.status.toUpperCase()}
            </span>
            <span className="text-xs font-mono text-zinc-500 uppercase">
              {campaign.opportunityType.replace('_', ' ')}
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs text-zinc-400">{campaign.companyName}</span>
          </div>
          <h3 className="text-base font-bold text-white tracking-tight">{campaign.title}</h3>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/opportunity/opp_${campaign.id}`}
            className="inline-flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-300 hover:text-white transition"
          >
            <span>Preview</span>
            <ArrowUpRight className="h-3 w-3" />
          </Link>

          <button
            onClick={() => onToggleStatus(campaign)}
            disabled={isToggling}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
              isActive
                ? 'border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                : 'border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20'
            }`}
          >
            {isActive ? (
              <>
                <Pause className="h-3.5 w-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" />
                <span>Activate</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
        <div className="rounded-lg bg-zinc-950/40 p-2.5 border border-zinc-800/40">
          <div className="text-[11px] text-zinc-500">Bid (CPM)</div>
          <div className="mt-1 font-bold text-white">₹{campaign.bidCpm.toFixed(2)}</div>
        </div>

        <div className="rounded-lg bg-zinc-950/40 p-2.5 border border-zinc-800/40">
          <div className="text-[11px] text-zinc-500">Budget Remaining</div>
          <div className="mt-1 font-bold text-white">
            ₹{campaign.remainingBudget.toFixed(2)} <span className="text-zinc-600">/ ₹{campaign.budget}</span>
          </div>
        </div>

        <div className="rounded-lg bg-zinc-950/40 p-2.5 border border-zinc-800/40">
          <div className="text-[11px] text-zinc-500">Verified Impressions</div>
          <div className="mt-1 font-bold text-indigo-400">
            {campaign.verifiedImpressionsCount} <span className="text-zinc-600">({campaign.impressionsCount} reqs)</span>
          </div>
        </div>

        <div className="rounded-lg bg-zinc-950/40 p-2.5 border border-zinc-800/40">
          <div className="text-[11px] text-zinc-500">Clicks / CTR</div>
          <div className="mt-1 font-bold text-white">
            {campaign.clicksCount} <span className="text-indigo-400 text-[10px]">({ctr}%)</span>
          </div>
        </div>
      </div>

      {/* Targeting Summary Tags */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5 text-[11px]">
        <span className="text-zinc-500 font-mono">Targeting:</span>
        {(campaign.target.roles || []).map((r) => (
          <span key={r} className="rounded bg-zinc-800/60 px-2 py-0.5 text-zinc-300 font-mono">
            {r}
          </span>
        ))}
        {(campaign.target.fields || []).map((f) => (
          <span key={f} className="rounded bg-zinc-800/60 px-2 py-0.5 text-zinc-300 font-mono">
            {f}
          </span>
        ))}
        {(campaign.target.countries && campaign.target.countries.length > 0) ? (
          campaign.target.countries.map((c) => (
            <span key={c} className="rounded bg-indigo-950/30 border border-indigo-500/20 px-2 py-0.5 text-indigo-400 font-mono">
              📍 {c}
            </span>
          ))
        ) : (
          <span className="rounded bg-zinc-800/40 px-2 py-0.5 text-zinc-400 font-mono">
            🌐 Global / Remote
          </span>
        )}
        {(campaign.skills || []).slice(0, 3).map((s) => (
          <span key={s} className="rounded bg-zinc-800/40 px-2 py-0.5 text-zinc-400 font-mono">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
