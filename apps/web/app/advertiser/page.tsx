'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Megaphone,
  Plus,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { Campaign } from '@rebate/shared';
import { CampaignStats } from '@/components/campaigns/campaign-stats';
import { CampaignCard } from '@/components/campaigns/campaign-card';
import { useAuth } from '@/lib/auth/auth-context';

interface AnalyticsData {
  totalImpressions: number;
  totalVerified: number;
  totalClicks: number;
  totalSpend: number;
  overallCtr: number;
}

export default function AdvertiserDashboard() {
  const { user, isAuthenticated, isLoading: authLoading, demoLogin } = useAuth();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paused'>('all');
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoBalance, setDemoBalance] = useState(25000);
  const [isFunding, setIsFunding] = useState(false);

  const handleAddDemoFunds = async () => {
    setIsFunding(true);
    try {
      const res = await fetch('/api/advertiser/budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ advertiserId: 'adv_example_ai', amount: 10000 }),
      });
      const data = await res.json();
      if (data.success && data.advertiser) {
        setDemoBalance(data.advertiser.demoBalance);
      } else {
        setDemoBalance((prev) => prev + 10000);
      }
    } catch {
      setDemoBalance((prev) => prev + 10000);
    } finally {
      setIsFunding(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      setLoading(false);
      return;
    }

    async function loadCampaigns() {
      try {
        const res = await fetch('/api/advertiser/campaigns');
        const data = await res.json();
        if (data.campaigns) {
          setCampaigns(data.campaigns);
          setAnalytics(data.analytics);
        }
      } catch (err) {
        console.error('Failed to load campaigns:', err);
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      loadCampaigns();
    }
  }, [isAuthenticated, authLoading]);

  const toggleCampaignStatus = async (campaign: Campaign) => {
    const newStatus = campaign.status === 'active' ? 'paused' : 'active';
    setTogglingId(campaign.id);

    // Optimistic UI update
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaign.id ? { ...c, status: newStatus } : c))
    );

    try {
      const res = await fetch('/api/advertiser/campaigns', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: campaign.id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success && data.campaign) {
        setCampaigns((prev) =>
          prev.map((c) => (c.id === campaign.id ? data.campaign : c))
        );
      }
    } catch (err) {
      console.error('Failed to update campaign status:', err);
      setCampaigns((prev) =>
        prev.map((c) => (c.id === campaign.id ? campaign : c))
      );
    } finally {
      setTogglingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex h-96 items-center justify-center font-mono text-xs text-zinc-500">
        <span className="animate-spin text-indigo-400 mr-2">⠋</span> Loading Advertiser Portal...
      </div>
    );
  }

  // Auth Guard: Unauthenticated Access Screen
  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 mb-4">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">Advertiser Authentication Required</h2>
          <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
            Please sign in to manage opportunity campaigns, configure CPM bids, and view real-time wait-state impression analytics.
          </p>

          <div className="mt-6 space-y-2.5">
            <Link
              href="/login?redirect=/advertiser"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-white py-2.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition shadow-sm"
            >
              <span>Sign In to Advertiser Account</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => demoLogin('advertiser')}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 py-2.5 text-xs font-medium text-zinc-300 hover:text-white hover:border-zinc-700 transition font-mono"
            >
              <Megaphone className="h-3.5 w-3.5 text-cyan-400" />
              <span>1-Click Demo Login (Elena Rostova)</span>
            </button>
          </div>

          <div className="mt-6 text-xs text-zinc-500">
            Don't have an advertiser account?{' '}
            <Link href="/signup?role=advertiser" className="text-indigo-400 hover:underline">
              Register here →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const activeCount = campaigns.filter((c) => c.status === 'active').length;

  const filteredCampaigns = campaigns.filter((c) => {
    if (filterStatus === 'all') return true;
    return c.status === filterStatus;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Advertiser Portal</h1>
            <span className="rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-0.5 text-xs font-medium text-purple-400 font-mono">
              {user?.companyName || 'Example AI Research'} • Demo Balance: ₹{demoBalance.toLocaleString()}
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Reach active software engineers inside AI waiting windows with zero code reading.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleAddDemoFunds}
            disabled={isFunding}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:border-zinc-700 transition font-mono"
          >
            <Plus className="h-3.5 w-3.5 text-indigo-400" />
            <span>{isFunding ? 'Adding Funds...' : '+ ₹10,000 Demo Budget'}</span>
          </button>

          <Link
            href="/advertiser/campaigns/new"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition shadow-sm font-mono"
          >
            <Plus className="h-4 w-4" />
            <span>Create Campaign</span>
          </Link>
        </div>
      </div>

      {/* Analytics KPI Row Component */}
      <CampaignStats
        totalImpressions={analytics?.totalImpressions || 0}
        totalVerified={analytics?.totalVerified || 0}
        totalClicks={analytics?.totalClicks || 0}
        totalSpend={analytics?.totalSpend || 0}
        overallCtr={analytics?.overallCtr || 0}
        activeCount={activeCount}
      />

      {/* Campaign List Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Campaign Inventory</h2>
          <p className="mt-0.5 text-xs text-zinc-400">
            Live CPM bids, quality multipliers, and verified impression delivery.
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 p-1">
          <button
            onClick={() => setFilterStatus('all')}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              filterStatus === 'all'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            All ({campaigns.length})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              filterStatus === 'active'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setFilterStatus('paused')}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              filterStatus === 'paused'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Paused ({campaigns.length - activeCount})
          </button>
        </div>
      </div>

      {/* Campaign Cards List */}
      {filteredCampaigns.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-12 text-center">
          <p className="text-sm font-semibold text-zinc-300">No campaigns found</p>
          <p className="mt-1 text-xs text-zinc-500">
            Create your first campaign to start bidding in developer wait-state auctions.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCampaigns.map((camp) => (
            <CampaignCard
              key={camp.id}
              campaign={camp}
              onToggleStatus={toggleCampaignStatus}
              isToggling={togglingId === camp.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
