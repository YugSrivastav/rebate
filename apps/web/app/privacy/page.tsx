import { ShieldCheck, XCircle, CheckCircle2, Lock, EyeOff, ServerOff } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      {/* Header */}
      <div className="mb-12">
        <div className="text-xs font-mono text-emerald-400 mb-2">PRIVACY & TRUST MANIFESTO</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          What Rebate reads & what Rebate never touches
        </h1>
        <p className="mt-3 text-sm text-zinc-400 max-w-2xl leading-relaxed">
          Developer trust is the foundation of Rebate. We built our entire matching engine around strict isolation guarantees. We operate on a zero-code-ingestion model.
        </p>
      </div>

      {/* The Red Line: What Rebate NEVER Does */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 mb-10 shadow-lg">
        <div className="flex items-center gap-2.5 mb-2 text-red-400 font-mono text-xs font-semibold uppercase tracking-wider">
          <XCircle className="h-4 w-4" />
          <span>The Hard Red Lines: What Rebate Never Does</span>
        </div>

        <p className="text-xs text-zinc-400 mb-6">
          Rebate is strictly non-invasive. We enforce these boundaries at both the client adapter layer and the backend matching engine.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {[
            'NEVER reads your local source code',
            'NEVER uploads code or project files to any server',
            'NEVER reads, inspects, or logs your AI prompts',
            'NEVER intercepts or records terminal command histories',
            'NEVER scans or indexes private Git repositories',
            'NEVER monitors keystrokes or takes window screenshots',
            'NEVER accesses webcams, audio, or biometric telemetry',
            'NEVER implements code-context targeting',
          ].map((text, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
              <span className="text-red-400 font-bold shrink-0">✕</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* What Rebate Actually Uses */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 mb-10 shadow-lg">
        <div className="flex items-center gap-2.5 mb-2 text-emerald-400 font-mono text-xs font-semibold uppercase tracking-wider">
          <CheckCircle2 className="h-4 w-4" />
          <span>What Rebate Uses (100% Voluntary Profile Criteria)</span>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed mb-6">
          Instead of surveillance, Rebate operates like an ethical marketplace. All matching happens between explicit campaign targeting and voluntary profile attributes that you control:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: 'Voluntary Role & Skills',
              desc: 'You select which skills (e.g. Python, React, Rust) and role (e.g. Student, Engineer) you want opportunities for.',
            },
            {
              title: 'Optional Geography',
              desc: 'Location is completely optional. If left blank, you only see global and remote opportunities.',
            },
            {
              title: 'Reward Preference',
              desc: 'You select whether you want cash (INR/USD), AI compute credits, or cloud infrastructure credits.',
            },
            {
              title: 'Coarse Duration Timestamps',
              desc: 'Local adapters verify visible duration (e.g. 8s minimum) using only start and end timestamps, without reading content.',
            },
          ].map((item, idx) => (
            <div key={idx} className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-4">
              <h3 className="font-semibold text-xs text-white mb-1">{item.title}</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Non-Destructive Adapters */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
        <h3 className="text-sm font-bold text-white mb-1 font-mono">Reversible, Non-Destructive Agent Adapters</h3>
        <p className="text-xs text-zinc-400 leading-relaxed mb-4">
          Rebate installs cleanly without modifying system binaries, patching tool executables, or wrapping shell commands. If you uninstall Rebate, your AI agent status lines return to normal instantly.
        </p>
        <div className="flex items-center gap-4 text-xs font-mono">
          <Link href="/developer" className="text-emerald-400 hover:underline">
            Manage your Developer Profile →
          </Link>
          <Link href="/demo" className="text-zinc-400 hover:text-white">
            Inspect the live demo loop →
          </Link>
        </div>
      </div>
    </div>
  );
}
