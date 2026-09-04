'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Wallet as WalletIcon,
  Coins,
  TrendingUp,
  Cpu,
  ArrowUpRight,
  ShieldCheck,
  Check,
  X,
  ArrowRight,
  CreditCard,
  Sparkles,
  Copy,
  Zap,
} from 'lucide-react';
import { RewardCurrency, REWARD_CURRENCIES, DeveloperProfile } from '@rebate/shared';
import { formatCurrency } from '@/lib/rewards/reward';

interface WalletCardProps {
  profile: DeveloperProfile | null;
  balances: Record<RewardCurrency, number>;
  totalEarned: Record<RewardCurrency, number>;
  selectedCurrency: RewardCurrency;
  onCurrencyChange: (currency: RewardCurrency) => void;
  impressionsCount: number;
  onRefresh?: () => void;
}

export function WalletCard({
  profile,
  balances,
  totalEarned,
  selectedCurrency,
  onCurrencyChange,
  impressionsCount,
  onRefresh,
}: WalletCardProps) {
  const currentBalance = balances[selectedCurrency] || 0;
  const totalEarnedAmount = totalEarned[selectedCurrency] || 0;

  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [redemptionType, setRedemptionType] = useState<'upi_transfer' | 'api_credit' | 'cloud_credit'>('upi_transfer');
  const [redeemAmount, setRedeemAmount] = useState<number>(Math.min(currentBalance, 25) || 5);
  const [destinationInput, setDestinationInput] = useState('priya.sharma@okhdfcbank');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redemptionResult, setRedemptionResult] = useState<any>(null);
  const [redeemError, setRedeemError] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  const handleRedeemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (redeemAmount <= 0) {
      setRedeemError('Please enter a valid amount');
      return;
    }
    if (redeemAmount > currentBalance) {
      setRedeemError(`Amount exceeds available balance (${currentBalance.toFixed(2)})`);
      return;
    }

    setIsRedeeming(true);
    setRedeemError('');

    try {
      const res = await fetch('/api/developer/wallet/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          developerId: profile?.id || 'dev_alex_india',
          amount: Number(redeemAmount),
          currency: selectedCurrency,
          redemptionType,
          destination: destinationInput,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setRedemptionResult(data);
        if (onRefresh) onRefresh();
      } else {
        setRedeemError(data.error || 'Failed to complete redemption');
      }
    } catch {
      setRedeemError('Network error during payout request');
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Primary Balance Hero Card */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2">
              <Coins className="h-4 w-4" />
              <span>REBATE DEVELOPER WALLET</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">70% Value Share Policy</span>
            </div>

            <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-mono">
              {formatCurrency(currentBalance, selectedCurrency)}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
              <span className="flex items-center gap-1 text-emerald-400/90 font-medium">
                <TrendingUp className="h-3.5 w-3.5" />
                Total Lifetime: {formatCurrency(totalEarnedAmount, selectedCurrency)}
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">
                {impressionsCount} verified wait-state impressions
              </span>
            </div>
          </div>

          {/* Currency Switcher */}
          <div className="flex flex-col sm:items-end gap-2">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              Display Currency
            </span>
            <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-950/80 p-1">
              {REWARD_CURRENCIES.map((curr) => (
                <button
                  key={curr.id}
                  onClick={() => onCurrencyChange(curr.id)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                    selectedCurrency === curr.id
                      ? 'bg-emerald-500 text-black font-semibold shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title={curr.label}
                >
                  {curr.symbol} {curr.id}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setRedemptionResult(null);
                setRedeemError('');
                setRedeemAmount(Math.min(currentBalance, 25) || 5);
                setShowRedeemModal(true);
              }}
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-black hover:bg-emerald-400 transition font-mono shadow-sm"
            >
              <CreditCard className="h-3.5 w-3.5" />
              <span>Withdraw / Redeem</span>
            </button>
          </div>
        </div>

        {/* Currency Breakdown Bar */}
        <div className="mt-8 pt-6 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {REWARD_CURRENCIES.map((curr) => {
            const bal = balances[curr.id] || 0;
            const isSelected = selectedCurrency === curr.id;
            return (
              <div
                key={curr.id}
                onClick={() => onCurrencyChange(curr.id)}
                className={`cursor-pointer rounded-xl border p-3 transition ${
                  isSelected
                    ? 'border-emerald-500/40 bg-emerald-500/5'
                    : 'border-zinc-800/60 bg-zinc-900/30 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                  <span>{curr.id}</span>
                  <span>{curr.symbol}</span>
                </div>
                <div className="text-sm sm:text-base font-bold text-white font-mono">
                  {formatCurrency(bal, curr.id)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Connected AI Agents & Profile Attributes Badge Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Connected Agents Card */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Cpu className="h-4 w-4 text-emerald-400" />
              <span>Connected AI Agents</span>
            </div>
            <Link
              href="/developer/agents"
              className="text-[11px] text-emerald-400 hover:underline flex items-center gap-0.5"
            >
              Manage <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(profile?.connectedAgents || ['antigravity', 'claude_code', 'codex', 'opencode']).map((agent) => (
              <span
                key={agent}
                className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-mono text-emerald-300"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {agent}
              </span>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-zinc-500">
            Rebate listens to wait states via non-invasive adapters. Zero source code or prompt ingestion.
          </p>
        </div>

        {/* Voluntary Targeting Attributes */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Profile Targeting Attributes</span>
            </div>
            <Link
              href="/developer/onboarding"
              className="text-[11px] text-emerald-400 hover:underline flex items-center gap-0.5"
            >
              Edit <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded bg-zinc-800/80 px-2 py-0.5 text-xs text-zinc-300 font-mono">
              {profile?.role || 'Student'}
            </span>
            <span className="rounded bg-zinc-800/80 px-2 py-0.5 text-xs text-zinc-300 font-mono">
              {profile?.field || 'AI/ML'}
            </span>
            <span className="rounded bg-zinc-800/80 px-2 py-0.5 text-xs text-zinc-300 font-mono">
              {profile?.location?.country ? `${profile.location.country}` : 'Global / Remote'}
            </span>
            {(profile?.skills || ['Python', 'FastAPI', 'PyTorch']).slice(0, 3).map((s) => (
              <span key={s} className="rounded bg-zinc-800/50 px-2 py-0.5 text-xs text-zinc-400 font-mono">
                {s}
              </span>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-zinc-500">
            100% voluntary targeting. Location is optional. Only explicit profile criteria are shared with the auction.
          </p>
        </div>
      </div>

      {/* Interactive Redemption / Payout Modal */}
      {showRedeemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-emerald-400" />
                <h3 className="font-bold text-white text-sm font-mono">Withdraw & Redeem Payout</h3>
              </div>
              <button
                onClick={() => setShowRedeemModal(false)}
                className="rounded-md p-1 text-zinc-400 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {redemptionResult ? (
              <div className="space-y-4 py-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold">
                  <Check className="h-4 w-4" />
                  <span>PAYOUT SUCCESSFUL</span>
                </div>

                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs">
                  <p className="text-zinc-200 leading-relaxed font-sans">{redemptionResult.message}</p>
                  
                  {redemptionResult.voucherCode && (
                    <div className="mt-3 pt-3 border-t border-emerald-500/20">
                      <div className="text-[11px] text-zinc-400 font-mono mb-1">Your Voucher Code:</div>
                      <div className="flex items-center justify-between rounded bg-zinc-900 px-3 py-2 font-mono text-emerald-300 font-bold border border-zinc-800">
                        <span>{redemptionResult.voucherCode}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(redemptionResult.voucherCode);
                            setCopiedCode(true);
                            setTimeout(() => setCopiedCode(false), 2000);
                          }}
                          className="text-zinc-400 hover:text-white"
                        >
                          {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex justify-between text-[11px] font-mono text-zinc-400 pt-2 border-t border-zinc-800">
                    <span>Reference:</span>
                    <span className="text-zinc-200">{redemptionResult.transactionId}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowRedeemModal(false)}
                  className="w-full rounded-lg bg-zinc-800 py-2.5 text-xs font-semibold text-white hover:bg-zinc-700 transition font-mono"
                >
                  Done & Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleRedeemSubmit} className="space-y-4">
                <div className="flex justify-between items-center text-xs text-zinc-400 font-mono bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800">
                  <span>Available Balance:</span>
                  <span className="font-bold text-white">{formatCurrency(currentBalance, selectedCurrency)}</span>
                </div>

                {/* Redemption Method */}
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-2">Payout Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setRedemptionType('upi_transfer');
                        setDestinationInput('priya.sharma@okhdfcbank');
                      }}
                      className={`rounded-lg border p-2.5 text-left text-xs transition ${
                        redemptionType === 'upi_transfer'
                          ? 'border-emerald-500/50 bg-emerald-500/10 text-white'
                          : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="font-bold text-[11px]">Instant UPI</div>
                      <div className="text-[10px] text-zinc-500">Bank Transfer</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setRedemptionType('api_credit');
                        setDestinationInput('anthropic-api-account');
                      }}
                      className={`rounded-lg border p-2.5 text-left text-xs transition ${
                        redemptionType === 'api_credit'
                          ? 'border-emerald-500/50 bg-emerald-500/10 text-white'
                          : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="font-bold text-[11px]">API Tokens</div>
                      <div className="text-[10px] text-zinc-500">Claude / OpenAI</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setRedemptionType('cloud_credit');
                        setDestinationInput('cloudx-gpu-cluster');
                      }}
                      className={`rounded-lg border p-2.5 text-left text-xs transition ${
                        redemptionType === 'cloud_credit'
                          ? 'border-emerald-500/50 bg-emerald-500/10 text-white'
                          : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="font-bold text-[11px]">Cloud GPU</div>
                      <div className="text-[10px] text-zinc-500">Compute Credits</div>
                    </button>
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <div className="flex justify-between text-xs text-zinc-400 mb-1">
                    <label>Amount to Redeem ({selectedCurrency})</label>
                    <div className="flex gap-1.5 font-mono text-[10px]">
                      <button
                        type="button"
                        onClick={() => setRedeemAmount(Number((currentBalance * 0.5).toFixed(2)))}
                        className="text-zinc-500 hover:text-emerald-400"
                      >
                        50%
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => setRedeemAmount(Number(currentBalance.toFixed(2)))}
                        className="text-emerald-400 hover:underline"
                      >
                        Max
                      </button>
                    </div>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={currentBalance}
                    value={redeemAmount}
                    onChange={(e) => setRedeemAmount(Number(e.target.value))}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    {redemptionType === 'upi_transfer'
                      ? 'UPI ID / VPA'
                      : redemptionType === 'api_credit'
                      ? 'Target LLM Provider Key ID'
                      : 'Cloud Cluster Identifier'}
                  </label>
                  <input
                    type="text"
                    value={destinationInput}
                    onChange={(e) => setDestinationInput(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                {redeemError && (
                  <div className="text-xs text-red-400 font-mono">
                    {redeemError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isRedeeming || currentBalance <= 0}
                  className="w-full rounded-lg bg-emerald-500 py-2.5 text-xs font-semibold text-black hover:bg-emerald-400 transition font-mono shadow-sm disabled:opacity-50"
                >
                  {isRedeeming ? 'Processing Transfer...' : `Confirm Payout (${formatCurrency(redeemAmount, selectedCurrency)})`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
