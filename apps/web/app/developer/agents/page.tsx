'use client';

import Link from 'next/link';
import { AGENT_REGISTRY, AgentType } from '@rebate/shared';
import { Terminal, ArrowLeft, CheckCircle2, ShieldCheck, Cpu, Lock, ArrowRight, User } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';

export default function AgentsPage() {
  const { isAuthenticated, isLoading, demoLogin } = useAuth();
  const agents = Object.entries(AGENT_REGISTRY) as [AgentType, { name: string; description: string; status: string }][];

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center font-mono text-xs text-zinc-500">
        <span className="animate-spin text-emerald-400 mr-2">⠋</span> Loading Connected Agents...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 mb-4">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">Developer Login Required</h2>
          <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
            Please sign in to inspect connected AI coding agents and local wait-state adapters.
          </p>

          <div className="mt-6 space-y-2.5">
            <Link
              href="/login?redirect=/developer/agents"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 py-2.5 text-xs font-semibold text-black hover:bg-emerald-400 transition"
            >
              <span>Sign In to Your Account</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => demoLogin('developer')}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 py-2.5 text-xs font-medium text-zinc-300 hover:text-white hover:border-zinc-700 transition font-mono"
            >
              <User className="h-3.5 w-3.5 text-emerald-400" />
              <span>1-Click Demo Login (Priya Sharma)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Connected AI Agents</h1>
          <p className="mt-1 text-xs text-zinc-400">
            Rebate integrates into the local wait state of your preferred coding agents via non-invasive adapters.
          </p>
        </div>
        <Link
          href="/developer"
          className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 transition"
        >
          ← Back to Wallet
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {agents.map(([type, info]) => (
          <div
            key={type}
            className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400">
                    <Cpu className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{info.name}</h3>
                    <span className="font-mono text-[10px] text-zinc-500">Adapter: {type}</span>
                  </div>
                </div>

                <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {info.status}
                </span>
              </div>

              <p className="text-xs text-zinc-400 mb-4">{info.description}</p>

              <div className="rounded bg-zinc-900 p-2.5 font-mono text-xs text-zinc-300 border border-zinc-800 select-all">
                npx rebate start {type}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-900 text-[11px] text-zinc-500 flex items-center justify-between">
              <span>Zero binary modification</span>
              <span className="text-emerald-400 font-mono">1-Line Hook Ready</span>
            </div>
          </div>
        ))}
      </div>

      {/* Safety & Non-Invasive Guarantee */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 flex items-start gap-4">
        <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-white text-sm">Adapter Safety & Reversibility Guarantee</h4>
          <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
            Rebate adapters listen to session lifecycle events without patching executable binaries, modifying installed packages, or intercepting terminal keystrokes. You can disable or uninstall Rebate at any time with zero trace.
          </p>
        </div>
      </div>
    </div>
  );
}
