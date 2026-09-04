'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Wallet,
  Sparkles,
  ArrowUpRight,
  Bookmark,
  Briefcase,
  History,
  Lock,
  ArrowRight,
  User,
} from 'lucide-react';
import { DeveloperProfile, RewardCurrency } from '@rebate/shared';
import { WalletCard } from '@/components/wallet/wallet-card';
import { EarningsList, RewardItem, ImpressionItem } from '@/components/wallet/earnings-list';
import { useAuth } from '@/lib/auth/auth-context';

interface WalletApiResponse {
  wallet: {
    balances: Record<RewardCurrency, number>;
    totalEarned: Record<RewardCurrency, number>;
  };
  rewards: RewardItem[];
  impressions: ImpressionItem[];
}

export default function DeveloperDashboard() {
  const { user, isAuthenticated, isLoading: authLoading, demoLogin } = useAuth();

  const [profile, setProfile] = useState<DeveloperProfile | null>(null);
  const [walletData, setWalletData] = useState<WalletApiResponse | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<RewardCurrency>('INR');
  const [savedCount, setSavedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const profileId = user?.profileId || 'dev_alex_india';

  useEffect(() => {
    // Read saved count from localStorage
    try {
      const stored = localStorage.getItem('rebate_saved_opps');
      if (stored) {
        setSavedCount(JSON.parse(stored).length);
      }
    } catch {}

    if (!isAuthenticated && !authLoading) {
      setLoading(false);
      return;
    }

    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, authLoading, profileId]);

  const loadData = async () => {
    try {
      const profRes = await fetch(`/api/developer/profile?id=${profileId}`);
      const profJson = await profRes.json();
      if (profJson.profile) {
        setProfile(profJson.profile);
        setSelectedCurrency(profJson.profile.rewardPreference || 'INR');
      }

      const wallRes = await fetch(`/api/developer/wallet?developerId=${profileId}`);
      const wallJson = await wallRes.json();
      setWalletData(wallJson);
    } catch (err) {
      console.error('Failed to load developer dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCurrencyChange = async (currency: RewardCurrency) => {
    setSelectedCurrency(currency);
    if (profile) {
      try {
        await fetch('/api/developer/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...profile, rewardPreference: currency }),
        });
      } catch {}
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex h-96 items-center justify-center font-mono text-xs text-zinc-500">
        <span className="animate-spin text-indigo-400 mr-2">⠋</span> Loading Developer Wallet...
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
          <h2 className="text-lg font-bold text-white tracking-tight">Developer Authentication Required</h2>
          <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
            Please sign in to view your multi-currency developer wallet, reward ledger, and matched wait-state opportunities.
          </p>

          <div className="mt-6 space-y-2.5">
            <Link
              href="/login?redirect=/developer"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-white py-2.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition shadow-sm"
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

          <div className="mt-6 text-xs text-zinc-500">
            Don't have a developer profile yet?{' '}
            <Link href="/signup?role=developer" className="text-indigo-400 hover:underline">
              Create one here →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const defaultBalances: Record<RewardCurrency, number> = {
    INR: 0,
    USD: 0,
    AI_CREDITS: 0,
    CLOUD_CREDITS: 0,
    API_CREDITS: 0,
  };

  const balances = walletData?.wallet?.balances || defaultBalances;
  const totalEarned = walletData?.wallet?.totalEarned || defaultBalances;
  const rewards = walletData?.rewards || [];
  const impressions = walletData?.impressions || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Developer Center</h1>
            <span className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-xs font-medium text-indigo-400 font-mono">
              Active Wallet
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            {profile?.name || user?.name} • {profile?.role || 'Developer'} • {profile?.field || 'AI/ML'} • {profile?.location?.country || 'Global / Remote'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/developer/opportunities"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
          >
            <Briefcase className="h-3.5 w-3.5 text-indigo-400" />
            <span>Opportunities</span>
            {savedCount > 0 && (
              <span className="rounded bg-zinc-800 text-amber-300 px-1.5 py-0.2 text-[10px] font-mono">
                {savedCount} saved
              </span>
            )}
          </Link>

          <Link
            href="/demo"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Simulate Wait State</span>
          </Link>
        </div>
      </div>

      <div className="space-y-8">
        {/* Wallet Hero Card Component */}
        <WalletCard
          profile={profile}
          balances={balances}
          totalEarned={totalEarned}
          selectedCurrency={selectedCurrency}
          onCurrencyChange={handleCurrencyChange}
          impressionsCount={impressions.length}
          onRefresh={loadData}
        />

        {/* Verified Earnings Ledger Component */}
        <EarningsList
          rewards={rewards}
          impressions={impressions}
          selectedCurrency={selectedCurrency}
        />
      </div>
    </div>
  );
}
