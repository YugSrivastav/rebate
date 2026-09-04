'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Opportunity, OpportunityCategory, OPPORTUNITY_CATEGORIES } from '@rebate/shared';
import { Sparkles, MapPin, Building, ArrowUpRight, Filter, Bookmark, Lock, ArrowRight, User } from 'lucide-react';
import { OpportunityCard } from '@/components/opportunities/opportunity-card';
import { useAuth } from '@/lib/auth/auth-context';

export default function OpportunitiesPage() {
  const { isAuthenticated, isLoading: authLoading, demoLogin } = useAuth();

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load saved opportunities from localStorage
    try {
      const stored = localStorage.getItem('rebate_saved_opps');
      if (stored) {
        setSavedIds(JSON.parse(stored));
      }
    } catch {}

    if (!isAuthenticated && !authLoading) {
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const res = await fetch('/api/advertiser/campaigns');
        const data = await res.json();
        // Extract opportunities from active campaigns
        const opps: Opportunity[] = (data.campaigns || []).map((c: any) => ({
          id: `opp_${c.id}`,
          campaignId: c.id,
          title: c.title,
          company: c.companyName,
          opportunityType: c.opportunityType,
          location: c.target.countries?.join(', ') || 'Global / Remote',
          description: c.description,
          requirements: c.requirements,
          skills: c.skills,
          destinationUrl: c.destinationUrl,
          cta: c.cta,
          sponsoredLabel: 'Sponsored Opportunity',
          matchReason: {
            skills: c.skills?.slice(0, 3) || [],
            field: c.target.fields?.[0],
            role: c.target.roles?.[0],
          },
        }));
        setOpportunities(opps);
      } catch (err) {
        console.error('Failed to load opportunities:', err);
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      load();
    }
  }, [isAuthenticated, authLoading]);

  const toggleSaveOpportunity = (oppId: string) => {
    setSavedIds((prev) => {
      const next = prev.includes(oppId) ? prev.filter((id) => id !== oppId) : [...prev, oppId];
      try {
        localStorage.setItem('rebate_saved_opps', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  if (authLoading || loading) {
    return (
      <div className="flex h-96 items-center justify-center font-mono text-xs text-zinc-500">
        <span className="animate-spin text-indigo-400 mr-2">⠋</span> Loading developer opportunities...
      </div>
    );
  }

  // Auth Guard
  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 mb-4">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">Developer Login Required</h2>
          <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
            Please sign in to browse and save developer opportunities matched to your skill profile.
          </p>

          <div className="mt-6 space-y-2.5">
            <Link
              href="/login?redirect=/developer/opportunities"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-white py-2.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition"
            >
              <span>Sign In to Your Account</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => demoLogin('developer')}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 py-2.5 text-xs font-medium text-zinc-300 hover:text-white hover:border-zinc-700 transition font-mono"
            >
              <User className="h-3.5 w-3.5 text-indigo-400" />
              <span>1-Click Demo Login (Priya Sharma)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filtered = opportunities.filter((o) => {
    if (showSavedOnly && !savedIds.includes(o.id)) {
      return false;
    }
    if (selectedCategory !== 'all' && o.opportunityType !== selectedCategory) {
      return false;
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Opportunities Directory</h1>
          <p className="mt-1 text-xs text-zinc-400">
            Curated jobs, internships, hackathons, and cloud credits matched to developer wait states.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/developer"
            className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 transition"
          >
            ← Back to Wallet
          </Link>
        </div>
      </div>

      {/* Filter Tabs Row */}
      <div className="flex flex-wrap items-center gap-2 pb-4 mb-6">
        <button
          onClick={() => {
            setShowSavedOnly(false);
            setSelectedCategory('all');
          }}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            !showSavedOnly && selectedCategory === 'all'
              ? 'bg-zinc-800 text-white font-semibold'
              : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          All Opportunities ({opportunities.length})
        </button>

        <button
          onClick={() => setShowSavedOnly((prev) => !prev)}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            showSavedOnly
              ? 'bg-zinc-800 text-white font-semibold'
              : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <Bookmark className={`h-3.5 w-3.5 ${showSavedOnly ? 'fill-current text-amber-400' : ''}`} />
          <span>Saved ({savedIds.length})</span>
        </button>

        <div className="h-4 w-px bg-zinc-800 mx-1 hidden sm:block" />

        {OPPORTUNITY_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setShowSavedOnly(false);
              setSelectedCategory(cat.id);
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition ${
              !showSavedOnly && selectedCategory === cat.id
                ? 'bg-zinc-800 text-white font-semibold'
                : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of Opportunities using OpportunityCard */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-12 text-center">
          <p className="text-sm font-semibold text-zinc-300">
            {showSavedOnly ? 'No saved opportunities found' : 'No opportunities in this category'}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {showSavedOnly
              ? 'Click the bookmark icon on any opportunity card to save it for later.'
              : 'Try selecting All Opportunities or updating your targeting profile.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              isSaved={savedIds.includes(opp.id)}
              onToggleSave={toggleSaveOpportunity}
            />
          ))}
        </div>
      )}
    </div>
  );
}
