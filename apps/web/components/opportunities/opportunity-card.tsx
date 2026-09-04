'use client';

import React from 'react';
import Link from 'next/link';
import { Opportunity } from '@rebate/shared';
import { Sparkles, MapPin, Building, ArrowUpRight, Bookmark } from 'lucide-react';

interface OpportunityCardProps {
  opportunity: Opportunity;
  isSaved?: boolean;
  onToggleSave?: (oppId: string) => void;
  showSaveButton?: boolean;
}

export function OpportunityCard({
  opportunity,
  isSaved = false,
  onToggleSave,
  showSaveButton = true,
}: OpportunityCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 transition hover:border-zinc-700/80 hover:bg-zinc-900/60 shadow-lg">
      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Building className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">{opportunity.company}</div>
              <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                <MapPin className="h-3 w-3" />
                <span>{opportunity.location || 'Global / Remote'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-zinc-800/80 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-emerald-400 border border-zinc-700/50">
              {opportunity.opportunityType.replace('_', ' ')}
            </span>

            {showSaveButton && onToggleSave && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onToggleSave(opportunity.id);
                }}
                className={`rounded-md p-1.5 transition ${
                  isSaved
                    ? 'text-amber-400 bg-amber-400/10 border border-amber-400/30'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
                }`}
                title={isSaved ? 'Remove from saved' : 'Save opportunity'}
              >
                <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>
        </div>

        <h3 className="text-base font-bold text-white tracking-tight mb-2">
          {opportunity.title}
        </h3>

        <p className="text-xs text-zinc-400 line-clamp-3 mb-4 leading-relaxed">
          {opportunity.description}
        </p>

        {/* Skill tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(opportunity.skills || []).slice(0, 4).map((s) => (
            <span
              key={s}
              className="rounded bg-zinc-950/80 px-2 py-0.5 text-[11px] text-zinc-400 border border-zinc-800 font-mono"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Transparent Matching Rationale */}
        {opportunity.matchReason && (
          <div className="rounded-lg bg-emerald-950/20 border border-emerald-500/20 p-2.5 text-[11px] text-zinc-300 mb-4 flex items-start gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-emerald-400 font-semibold font-mono">Matched for you: </span>
              <span>
                {opportunity.matchReason.role || 'Developer'} • {opportunity.matchReason.field || 'Tech'} • {opportunity.matchReason.skills?.join(', ')}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
          {opportunity.sponsoredLabel || 'Sponsored Opportunity'}
        </span>

        <Link
          href={`/opportunity/${opportunity.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs font-semibold text-white transition"
        >
          <span>{opportunity.cta || 'View Details'}</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
