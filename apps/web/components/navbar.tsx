'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Coins,
  Sparkles,
  ShieldCheck,
  Terminal,
  Megaphone,
  ArrowUpRight,
  Menu,
  X,
  User,
  LogOut,
  Briefcase,
  Cpu,
  Plus,
  Download,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, role, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 font-mono font-bold tracking-tight text-white transition hover:opacity-90"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 text-white">
              <Terminal className="h-4 w-4 text-indigo-400" />
            </div>
            <span className="text-base tracking-wider uppercase font-extrabold">Rebate</span>
          </Link>

          {/* Desktop Navigation Links based on Auth State */}
          <nav className="hidden md:flex items-center gap-1">
            {!isAuthenticated && (
              <>
                <Link
                  href="/#how-it-works"
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition"
                >
                  How It Works
                </Link>
                <Link
                  href="/#calculator"
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition"
                >
                  Calculator
                </Link>
                <Link
                  href="/privacy"
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    pathname === '/privacy' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Privacy
                </Link>
                <Link
                  href="/demo"
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    pathname === '/demo' ? 'bg-zinc-800 text-white' : 'text-indigo-400 hover:bg-indigo-500/10'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Demo Simulator</span>
                </Link>
                <Link
                  href="/download"
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    pathname === '/download' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Download className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Download</span>
                </Link>
              </>
            )}

            {isAuthenticated && role === 'developer' && (
              <>
                <Link
                  href="/developer"
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    pathname === '/developer' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Coins className="h-3.5 w-3.5" />
                  <span>Wallet & Overview</span>
                </Link>
                <Link
                  href="/developer/opportunities"
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    pathname.startsWith('/developer/opportunities') ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>Opportunities</span>
                </Link>
                <Link
                  href="/developer/agents"
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    pathname === '/developer/agents' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Cpu className="h-3.5 w-3.5" />
                  <span>Connected Agents</span>
                </Link>
                <Link
                  href="/demo"
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-indigo-400 hover:bg-indigo-500/10 transition`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>60s Simulator</span>
                </Link>
              </>
            )}

            {isAuthenticated && role === 'advertiser' && (
              <>
                <Link
                  href="/advertiser"
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    pathname === '/advertiser' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Megaphone className="h-3.5 w-3.5" />
                  <span>Campaigns & KPIs</span>
                </Link>
                <Link
                  href="/advertiser/campaigns/new"
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    pathname === '/advertiser/campaigns/new' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>New Campaign</span>
                </Link>
                <Link
                  href="/demo"
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-indigo-400 hover:bg-indigo-500/10 transition`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Auction Simulator</span>
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Right CTA / User Status */}
        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <>
              <Link
                href="/login"
                className="text-xs font-medium text-zinc-400 hover:text-zinc-200 px-3 py-1.5 rounded transition"
              >
                Sign In
              </Link>
              <Link
                href="/signup?role=developer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition shadow-sm"
              >
                <span>Get Started</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                <span className="font-medium text-zinc-300">
                  {user?.name || (role === 'advertiser' ? 'Advertiser' : 'Developer')}
                </span>
                {role === 'developer' ? (
                  <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-indigo-300">
                    70% Payout Active
                  </span>
                ) : (
                  <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">
                    ₹25k Demo Budget
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white px-2 py-1 rounded transition"
                title="Sign out"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden rounded-md p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950 px-4 pt-2 pb-4 space-y-2">
          {!isAuthenticated ? (
            <>
              <Link
                href="/#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-xs font-medium text-zinc-400 hover:bg-zinc-900"
              >
                How It Works
              </Link>
              <Link
                href="/#ecosystem"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-xs font-medium text-zinc-400 hover:bg-zinc-900"
              >
                Ecosystem
              </Link>
              <Link
                href="/privacy"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-xs font-medium text-zinc-400 hover:bg-zinc-900"
              >
                Privacy
              </Link>
              <Link
                href="/demo"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-xs font-medium text-indigo-400 hover:bg-zinc-900"
              >
                60s Demo Simulator
              </Link>
              <Link
                href="/download"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-900"
              >
                <Download className="h-3.5 w-3.5 text-indigo-400" />
                <span>Download CLI & SDK</span>
              </Link>
              <div className="pt-2 border-t border-zinc-800/80 flex gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center rounded-lg border border-zinc-800 py-2 text-xs text-zinc-300"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup?role=developer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center rounded-lg bg-white py-2 text-xs font-semibold text-zinc-950 hover:bg-zinc-200"
                >
                  Get Started
                </Link>
              </div>
            </>
          ) : (
            <>
              {role === 'developer' ? (
                <>
                  <Link
                    href="/developer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-md px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-900"
                  >
                    Wallet & Overview
                  </Link>
                  <Link
                    href="/developer/opportunities"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-md px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-900"
                  >
                    Opportunities Directory
                  </Link>
                  <Link
                    href="/developer/agents"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-md px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-900"
                  >
                    Connected AI Agents
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/advertiser"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-md px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-900"
                  >
                    Campaigns Dashboard
                  </Link>
                  <Link
                    href="/advertiser/campaigns/new"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-md px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-900"
                  >
                    Create New Campaign
                  </Link>
                </>
              )}
              <Link
                href="/demo"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-xs font-medium text-indigo-400 hover:bg-zinc-900"
              >
                Launch 60s Demo Simulator
              </Link>
              <div className="pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left rounded-md px-3 py-2 text-xs font-medium text-red-400 hover:bg-zinc-900"
                >
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}
