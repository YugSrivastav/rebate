'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Terminal, ShieldCheck, ArrowRight, User, Megaphone } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { UserRole } from '@rebate/shared';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect');

  const { login, demoLogin, isAuthenticated, role } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('developer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email address');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const ok = await login(email, selectedRole);
      if (ok) {
        if (redirectPath) {
          router.push(redirectPath);
        } else if (selectedRole === 'advertiser') {
          router.push('/advertiser');
        } else {
          router.push('/developer');
        }
      } else {
        setErrorMsg('Failed to sign in. Please try again.');
      }
    } catch {
      setErrorMsg('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-8 shadow-2xl backdrop-blur-sm">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-mono font-bold text-white text-lg tracking-wider mb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
              <Terminal className="h-4 w-4" />
            </div>
            <span>REBATE</span>
          </Link>
          <h1 className="text-xl font-bold text-white tracking-tight">Sign in to your account</h1>
          <p className="mt-1 text-xs text-zinc-400">
            Access your developer wallet or advertiser campaign manager.
          </p>
        </div>

        {/* 1-Click Demo Accounts for Judges & Fast Testing */}
        <div className="mb-6 rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-4">
          <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span>Instant Demo Login (Evaluator Mode)</span>
            <span className="text-[10px] text-indigo-400">1-Click</span>
          </div>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => demoLogin('developer')}
              className="w-full flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-left text-xs text-zinc-200 hover:border-indigo-500/40 hover:bg-zinc-900/80 transition"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-indigo-500/10 text-indigo-400">
                  <User className="h-3 w-3" />
                </div>
                <div>
                  <div className="font-semibold text-white">Priya Sharma (Developer)</div>
                  <div className="text-[10px] text-zinc-500 font-mono">Student • AI/ML • ₹28.00 Balance</div>
                </div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-zinc-500" />
            </button>

            <button
              type="button"
              onClick={() => demoLogin('advertiser')}
              className="w-full flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-left text-xs text-zinc-200 hover:border-indigo-500/40 hover:bg-zinc-900/80 transition"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-purple-500/10 text-purple-400">
                  <Megaphone className="h-3 w-3" />
                </div>
                <div>
                  <div className="font-semibold text-white">Elena Rostova (Advertiser)</div>
                  <div className="text-[10px] text-zinc-500 font-mono">Example AI Research • ₹25k Budget</div>
                </div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-zinc-500" />
            </button>
          </div>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-[11px] font-mono uppercase text-zinc-500">
            <span className="bg-zinc-950 px-2">Or continue with credentials</span>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-md border border-red-500/30 bg-red-950/20 p-2.5 text-xs text-red-400">
            {errorMsg}
          </div>
        )}

        {/* Role Selector */}
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Sign in as</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('developer')}
                className={`rounded-lg py-2 text-xs font-medium transition border ${
                  selectedRole === 'developer'
                    ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300 font-semibold'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Developer
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('advertiser')}
                className={`rounded-lg py-2 text-xs font-medium transition border ${
                  selectedRole === 'advertiser'
                    ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300 font-semibold'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Advertiser
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={selectedRole === 'developer' ? 'priya.sharma@tech.in' : 'sponsor@example-ai.dev'}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-indigo-500 focus:outline-none font-mono"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-zinc-400">Password</label>
              <span className="text-[11px] text-zinc-500">Demo (any password)</span>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-indigo-500 focus:outline-none font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-white py-2.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition shadow-sm"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-zinc-400">
          Don't have an account?{' '}
          <Link
            href={`/signup?role=${selectedRole}`}
            className="text-indigo-400 hover:underline font-semibold"
          >
            Create account →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#09090b] flex items-center justify-center text-zinc-500 text-xs">Loading login...</div>}>
      <LoginContent />
    </Suspense>
  );
}
