'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Briefcase,
  MapPin,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Building,
  Terminal,
} from 'lucide-react';
import { Opportunity, Campaign } from '@rebate/shared';
import { WhySeeingThis } from '@/components/opportunities/why-seeing-this';

export default function OpportunityDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [opp, setOpp] = useState<Opportunity | null>(null);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    async function loadOpportunity() {
      try {
        const res = await fetch(`/api/opportunities/${id}`);
        const data = await res.json();
        if (data.opportunity) {
          setOpp(data.opportunity);
          setCampaign(data.campaign);
        }
      } catch (err) {
        console.error('Failed to load opportunity:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOpportunity();
  }, [id]);

  const handleApplyClick = async () => {
    setClicked(true);
    try {
      await fetch('/api/ledger/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          impressionId: 'web_view',
          campaignId: opp?.campaignId,
          developerId: 'dev_alex_india',
          destinationUrl: opp?.destinationUrl,
        }),
      });
    } catch {
      // ignore
    }
    if (opp?.destinationUrl) {
      window.open(opp.destinationUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center font-mono text-xs text-zinc-500">
        <span className="animate-spin text-indigo-400 mr-2">⠋</span> Loading Opportunity Details...
      </div>
    );
  }

  if (!opp) {
    return (
      <div className="mx-auto max-w-xl py-24 text-center">
        <h1 className="text-xl font-bold text-white">Opportunity Not Found</h1>
        <p className="mt-2 text-xs text-zinc-400">The opportunity may have expired or is unavailable.</p>
        <Link href="/developer" className="mt-4 inline-block text-xs text-indigo-400 hover:underline">
          ← Return to Developer Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-6">
        <Link
          href="/developer"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
        </Link>
      </div>

      {/* Main Opportunity Card */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-zinc-800/80 pb-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 font-mono font-bold text-lg">
              {opp.company.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
                  {opp.sponsoredLabel}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-xs font-medium text-zinc-400 uppercase">{opp.opportunityType}</span>
              </div>
              <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {opp.title}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                <span className="flex items-center gap-1 font-medium text-zinc-200">
                  <Building className="h-3.5 w-3.5 text-zinc-500" /> {opp.company}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-zinc-500" /> {opp.location}
                </span>
              </div>
            </div>
          </div>

          <div className="sm:text-right shrink-0">
            <button
              onClick={handleApplyClick}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition shadow-md shadow-white/10"
            >
              <span>{opp.cta || 'Apply Now'}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
            <div className="mt-2 text-[11px] text-zinc-500 font-mono">
              Direct destination URL
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">Overview</h2>
          <p className="text-sm text-zinc-300 leading-relaxed">{opp.description}</p>
        </div>

        {/* Requirements */}
        {opp.requirements && opp.requirements.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">Requirements</h2>
            <ul className="space-y-2">
              {opp.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
                  <span className="text-indigo-400 font-bold shrink-0">✔</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills Tag Cloud */}
        {opp.skills && opp.skills.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">Target Skills</h2>
            <div className="flex flex-wrap gap-1.5">
              {opp.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded bg-zinc-800/80 px-2.5 py-1 font-mono text-xs text-zinc-300 border border-zinc-700/50"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 20: "Why am I seeing this?" Modular Component */}
        <div className="mt-8">
          <WhySeeingThis opportunity={opp} campaign={campaign} />
        </div>
      </div>
    </div>
  );
}
