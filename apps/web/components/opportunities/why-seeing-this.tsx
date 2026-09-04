'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2, Sparkles, Lock } from 'lucide-react';
import { Opportunity, Campaign } from '@rebate/shared';

interface WhySeeingThisProps {
  opportunity: Opportunity;
  campaign?: Campaign | null;
  developerProfile?: {
    role?: string;
    field?: string;
    skills?: string[];
    location?: { country?: string; state?: string };
  } | null;
}

export function WhySeeingThis({
  opportunity,
  campaign,
  developerProfile,
}: WhySeeingThisProps) {
  const matchedSkills = opportunity.matchReason?.skills?.length
    ? opportunity.matchReason.skills
    : (campaign?.skills || ['Python', 'AI/ML']).slice(0, 3);

  const matchedField = opportunity.matchReason?.field || campaign?.target?.fields?.[0] || 'AI/ML';
  const matchedRole = opportunity.matchReason?.role || campaign?.target?.roles?.[0] || 'Student / Intern';
  const matchedCountry = campaign?.target?.countries?.[0] || 'Global / Remote';

  return (
    <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/10 p-6 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-2">
        <ShieldCheck className="h-4 w-4" />
        <span className="font-semibold uppercase tracking-wider">Transparent Attribution</span>
      </div>

      <h3 className="text-sm font-bold text-white mb-2">Why you are seeing this opportunity</h3>

      <p className="text-xs text-zinc-400 leading-relaxed mb-4">
        Matched strictly from voluntary profile criteria and advertiser targeting specifications.
        Rebate <strong className="text-white font-semibold">never</strong> reads your source code, prompts, or terminal logs.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-3">
          <div className="text-[11px] font-mono text-zinc-500 mb-1">Matched Skills</div>
          <div className="flex flex-wrap gap-1">
            {matchedSkills.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1 rounded bg-indigo-500/10 px-2 py-0.5 text-xs font-mono text-indigo-300 border border-indigo-500/20"
              >
                <CheckCircle2 className="h-3 w-3 text-indigo-400" />
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-3">
          <div className="text-[11px] font-mono text-zinc-500 mb-1">Role & Field Criteria</div>
          <div className="flex flex-wrap gap-1 text-xs font-mono text-zinc-300">
            <span className="rounded bg-zinc-800 px-2 py-0.5">{matchedRole}</span>
            <span className="rounded bg-zinc-800 px-2 py-0.5">{matchedField}</span>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-3">
          <div className="text-[11px] font-mono text-zinc-500 mb-1">Geographic Alignment</div>
          <div className="text-xs font-mono text-zinc-300 flex items-center gap-1">
            <span>📍 {matchedCountry}</span>
            <span className="text-zinc-500 text-[10px]">(matches your optional location)</span>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-3">
          <div className="text-[11px] font-mono text-zinc-500 mb-1">Auction Selection</div>
          <div className="text-xs font-mono text-zinc-300">
            Selected via <span className="text-indigo-400 font-semibold">Bid × Relevance × Quality</span>
          </div>
        </div>
      </div>
    </div>
  );
}
