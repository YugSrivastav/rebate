'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Terminal,
  Download,
  Copy,
  Check,
  Cpu,
  Boxes,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Laptop,
  Layers,
  Sparkles,
  ChevronRight,
  Code2,
  FileCode,
} from 'lucide-react';

type DistributionFormat = 'cli' | 'sdk' | 'mcp';
type Platform = 'windows' | 'macos-arm' | 'macos-intel' | 'linux';

export default function DownloadPage() {
  const [activeTab, setActiveTab] = useState<DistributionFormat>('cli');
  const [platform, setPlatform] = useState<Platform>('windows');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const getCliInstallCommand = () => {
    switch (platform) {
      case 'windows':
        return 'irm https://rebate.dev/install.ps1 | iex';
      case 'macos-arm':
      case 'macos-intel':
      case 'linux':
        return 'curl -fsSL https://rebate.dev/install.sh | bash';
      default:
        return 'npm install -g @rebate/cli';
    }
  };

  const getDirectDownloadUrl = () => {
    return `/api/download/${platform === 'windows' ? 'windows' : 'macos'}`;
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-200">
      {/* Hero Header */}
      <section className="border-b border-zinc-900 bg-zinc-950/60 pt-12 pb-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 font-mono mb-4">
            <Sparkles className="h-3 w-3" />
            <span>v1.0.0 RELEASE — UNIVERSAL DISTRIBUTION SUITE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-mono">
            Get Rebate
          </h1>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Turn your AI coding agent's waiting and reasoning time into economic value.
            Choose your installation method below based on your workflow.
          </p>

          {/* Architecture Selector Tabs */}
          <div className="mt-8 inline-flex p-1 rounded-xl border border-zinc-800 bg-zinc-900/90 shadow-lg">
            <button
              onClick={() => setActiveTab('cli')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold font-mono transition ${
                activeTab === 'cli'
                  ? 'bg-emerald-500 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>1. CLI Daemon (Developers)</span>
            </button>

            <button
              onClick={() => setActiveTab('sdk')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold font-mono transition ${
                activeTab === 'sdk'
                  ? 'bg-emerald-500 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>2. Agent SDK (Builders)</span>
            </button>

            <button
              onClick={() => setActiveTab('mcp')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold font-mono transition ${
                activeTab === 'mcp'
                  ? 'bg-emerald-500 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <Boxes className="h-3.5 w-3.5" />
              <span>3. MCP Server (IDEs & Claude)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
        {/* TAB 1: CLI DAEMON */}
        {activeTab === 'cli' && (
          <div className="space-y-10">
            {/* Explainer Box */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-6 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-emerald-400" />
                    <span>Rebate Local Daemon & Terminal Client</span>
                  </h2>
                  <p className="mt-1 text-xs text-zinc-400">
                    The standalone background daemon that automatically detects when terminal AI agents (Claude Code, Antigravity, Codex, OpenCode) enter wait states.
                  </p>
                </div>

                {/* OS Selector */}
                <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-1">
                  <button
                    onClick={() => setPlatform('windows')}
                    className={`rounded px-2.5 py-1 text-xs font-mono transition ${
                      platform === 'windows' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Windows
                  </button>
                  <button
                    onClick={() => setPlatform('macos-arm')}
                    className={`rounded px-2.5 py-1 text-xs font-mono transition ${
                      platform === 'macos-arm' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    macOS (M1/M2/M3)
                  </button>
                  <button
                    onClick={() => setPlatform('macos-intel')}
                    className={`rounded px-2.5 py-1 text-xs font-mono transition ${
                      platform === 'macos-intel' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    macOS (Intel)
                  </button>
                  <button
                    onClick={() => setPlatform('linux')}
                    className={`rounded px-2.5 py-1 text-xs font-mono transition ${
                      platform === 'linux' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Linux
                  </button>
                </div>
              </div>

              {/* Primary Download & Install Box */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Method A: One-line Terminal Installer */}
                <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/50 p-5 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-mono text-zinc-400 mb-2 flex items-center justify-between">
                      <span className="text-emerald-400 font-semibold">RECOMMENDED: 1-LINE INSTALL</span>
                      <span className="text-[11px] text-zinc-500">Auto-updates</span>
                    </div>
                    <p className="text-xs text-zinc-300 mb-4">
                      Runs the official installer script for {platform === 'windows' ? 'Windows' : 'macOS / Linux'}:
                    </p>

                    <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 font-mono text-xs text-zinc-200">
                      <span className="truncate mr-2">{getCliInstallCommand()}</span>
                      <button
                        onClick={() => copyToClipboard(getCliInstallCommand(), 'cmd_oneliner')}
                        className="text-zinc-400 hover:text-white transition flex-shrink-0"
                        title="Copy command"
                      >
                        {copiedCmd === 'cmd_oneliner' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400">
                    <span>or via npm: <code className="text-zinc-300">npm i -g @rebate/cli</code></span>
                    <button
                      onClick={() => copyToClipboard('npm install -g @rebate/cli', 'cmd_npm')}
                      className="text-zinc-500 hover:text-zinc-300"
                    >
                      {copiedCmd === 'cmd_npm' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Method B: Direct Binary / Script Package Download */}
                <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/50 p-5 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-mono text-zinc-400 mb-2 flex items-center justify-between">
                      <span className="text-white font-semibold">DIRECT DOWNLOAD INSTALLER</span>
                      <span className="text-[11px] text-zinc-500">v1.0.0</span>
                    </div>
                    <p className="text-xs text-zinc-300 mb-4">
                      Download the standalone installer bundle with pre-configured daemon scripts:
                    </p>

                    <a
                      href={getDirectDownloadUrl()}
                      download
                      className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 py-3 text-xs font-semibold text-black hover:bg-emerald-400 transition shadow-sm font-mono"
                    >
                      <Download className="h-4 w-4" />
                      <span>
                        Download Installer ({platform === 'windows' ? 'install-rebate.bat' : 'install-rebate.sh'})
                      </span>
                    </a>
                  </div>

                  <div className="mt-5 pt-4 border-t border-zinc-800/60 text-[11px] text-zinc-400 space-y-1">
                    <div className="flex justify-between">
                      <span>File format:</span>
                      <span className="font-mono text-zinc-300">{platform === 'windows' ? 'Batch / Executable' : 'Shell Script / Tarball'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SHA-256:</span>
                      <span className="font-mono text-zinc-500 text-[10px]">9f8a32...c74b1e</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 30-Second Quickstart Steps */}
              <div className="mt-8 pt-8 border-t border-zinc-900">
                <h3 className="text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider mb-4">
                  Quickstart in 3 steps
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/30 p-4">
                    <div className="text-xs font-mono text-emerald-400 mb-1">STEP 1</div>
                    <div className="text-xs font-semibold text-white mb-2">Link Your Developer ID</div>
                    <div className="rounded bg-zinc-950 px-2.5 py-1.5 font-mono text-[11px] text-zinc-400">
                      rebate login
                    </div>
                    <p className="mt-2 text-[11px] text-zinc-500">
                      Links the local client to your Rebate wallet so earnings credit directly to you.
                    </p>
                  </div>

                  <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/30 p-4">
                    <div className="text-xs font-mono text-emerald-400 mb-1">STEP 2</div>
                    <div className="text-xs font-semibold text-white mb-2">Launch with Your Agent</div>
                    <div className="rounded bg-zinc-950 px-2.5 py-1.5 font-mono text-[11px] text-zinc-400">
                      rebate run antigravity
                    </div>
                    <p className="mt-2 text-[11px] text-zinc-500">
                      Or wrap Claude Code, Codex, or OpenCode. The agent runs exactly as usual.
                    </p>
                  </div>

                  <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/30 p-4">
                    <div className="text-xs font-mono text-emerald-400 mb-1">STEP 3</div>
                    <div className="text-xs font-semibold text-white mb-2">Earn 70% Value Share</div>
                    <div className="rounded bg-zinc-950 px-2.5 py-1.5 font-mono text-[11px] text-zinc-400">
                      [press o to view]
                    </div>
                    <p className="mt-2 text-[11px] text-zinc-500">
                      Non-intrusive 1-line wait states. Press hotkey 'o' to inspect matched opportunities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AGENT SDK */}
        {activeTab === 'sdk' && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-md border border-purple-500/20 bg-purple-500/10 px-2.5 py-0.5 text-[11px] font-mono text-purple-400 mb-2">
                FOR AGENT CREATORS & FRAMEWORK AUTHORS
              </div>
              <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
                <Code2 className="h-5 w-5 text-emerald-400" />
                <span>Rebate Agent SDK (`@rebate/sdk`)</span>
              </h2>
              <p className="mt-1 text-xs text-zinc-400 max-w-2xl">
                Building an autonomous agent or coding assistant? Integrate the Rebate SDK to monetize your agent's thinking, search, and tool execution phases with 2 lines of code.
              </p>
            </div>

            {/* Install snippet */}
            <div>
              <div className="text-xs font-mono text-zinc-400 mb-2">Installation:</div>
              <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 font-mono text-xs text-zinc-200">
                <code>npm install @rebate/sdk</code>
                <button
                  onClick={() => copyToClipboard('npm install @rebate/sdk', 'sdk_npm')}
                  className="text-zinc-400 hover:text-white"
                >
                  {copiedCmd === 'sdk_npm' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Code example */}
            <div>
              <div className="text-xs font-mono text-zinc-400 mb-2">Usage in TypeScript / JavaScript:</div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-4 font-mono text-xs overflow-x-auto text-zinc-300">
                <pre>{`import { withRebate } from '@rebate/sdk';
import { MyAgent } from './agent';

// Wrap your existing agent with Rebate lifecycle hooks
const agent = withRebate(new MyAgent(), {
  developerId: process.env.REBATE_DEVELOPER_ID,
  rewardPreference: 'INR', // 'INR' | 'USD' | 'AI_CREDITS' | 'CLOUD_CREDITS'
  onOpportunityMatched: (opp) => {
    console.log(\`Matched wait-state bounty: \${opp.title}\`);
  },
});

// Run agent tasks as usual — wait-state tracking happens automatically
await agent.executeTask('Refactor auth service with unit tests');`}</pre>
              </div>
            </div>

            <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-4 text-xs text-zinc-400">
              <strong className="text-zinc-200">Supported Frameworks:</strong> LangChain, LlamaIndex, CrewAI, AutoGen, and raw OpenAI / Anthropic agent loops.
            </div>
          </div>
        )}

        {/* TAB 3: MCP SERVER */}
        {activeTab === 'mcp' && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-md border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-0.5 text-[11px] font-mono text-cyan-400 mb-2">
                MODEL CONTEXT PROTOCOL (MCP)
              </div>
              <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
                <Boxes className="h-5 w-5 text-emerald-400" />
                <span>Rebate MCP Server (`@rebate/mcp`)</span>
              </h2>
              <p className="mt-1 text-xs text-zinc-400 max-w-2xl">
                Add Rebate directly to Claude Desktop, Cursor, or Antigravity IDE so your AI assistant can query your wallet balance, fetch curated bounties, and redeem credits on demand.
              </p>
            </div>

            {/* MCP Config snippet */}
            <div>
              <div className="text-xs font-mono text-zinc-400 mb-2">Add to your MCP Configuration (`claude_desktop_config.json` or IDE config):</div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-4 font-mono text-xs overflow-x-auto text-zinc-300">
                <pre>{`{
  "mcpServers": {
    "rebate": {
      "command": "npx",
      "args": ["-y", "@rebate/mcp"],
      "env": {
        "REBATE_DEVELOPER_ID": "dev_alex_india"
      }
    }
  }
}`}</pre>
              </div>
            </div>

            {/* Exposed MCP Tools */}
            <div>
              <div className="text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider mb-3">
                Exposed MCP Tools:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 text-xs">
                  <code className="text-emerald-400 font-mono">get_rebate_wallet</code>
                  <p className="mt-1 text-[11px] text-zinc-400">
                    Returns current balances across INR, USD, AI tokens, and cloud credits.
                  </p>
                </div>

                <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 text-xs">
                  <code className="text-emerald-400 font-mono">list_opportunities</code>
                  <p className="mt-1 text-[11px] text-zinc-400">
                    Queries matched opportunities based on developer skills and target field.
                  </p>
                </div>

                <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 text-xs">
                  <code className="text-emerald-400 font-mono">redeem_credits</code>
                  <p className="mt-1 text-[11px] text-zinc-400">
                    Instantly redeems earned credits into API keys or cloud vouchers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Architectural Explainer & Comparison Table: What is Rebate? */}
        <section className="mt-12 rounded-xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white font-mono">
              Architecture Explained: Is Rebate a CLI, an SDK, or an MCP?
            </h3>
            <p className="mt-1 text-xs text-zinc-400 max-w-3xl">
              Rebate is architected as a <strong className="text-white">3-tier ecosystem</strong> so that every developer and agent framework can participate without friction:
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400">
                  <th className="pb-3 pr-4 font-semibold">Tier</th>
                  <th className="pb-3 pr-4 font-semibold">Primary Target</th>
                  <th className="pb-3 pr-4 font-semibold">Where It Runs</th>
                  <th className="pb-3 pr-4 font-semibold">How It Monetizes</th>
                  <th className="pb-3 font-semibold">Code Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-300">
                <tr>
                  <td className="py-3 pr-4 font-bold text-emerald-400">Rebate CLI Daemon</td>
                  <td className="py-3 pr-4">Terminal Developers</td>
                  <td className="py-3 pr-4">Local OS background process</td>
                  <td className="py-3 pr-4">Hooks process wait states; 1-line clean terminal status</td>
                  <td className="py-3 text-zinc-500">Zero (Black box)</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-bold text-purple-400">Rebate Agent SDK</td>
                  <td className="py-3 pr-4">Agent Framework Authors</td>
                  <td className="py-3 pr-4">Inside agent application code</td>
                  <td className="py-3 pr-4">Emits events during tool execution and model reasoning</td>
                  <td className="py-3 text-zinc-500">Lifecycle events only</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-bold text-cyan-400">Rebate MCP Server</td>
                  <td className="py-3 pr-4">Claude Desktop, Cursor, Antigravity</td>
                  <td className="py-3 pr-4">Standard MCP protocol host</td>
                  <td className="py-3 pr-4">Exposes wallet balance, bounty queries, credit redemption</td>
                  <td className="py-3 text-zinc-500">Tool calls only</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-start gap-3 text-xs text-zinc-300">
            <ShieldCheck className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">The Zero Code Reading Rule applies to all tiers:</strong> Rebate operates strictly on <strong className="text-white">lifecycle duration events</strong> and voluntary profile targeting criteria. Neither the CLI daemon, SDK, nor MCP server ever inspects your source code, repo files, or LLM prompts.
            </div>
          </div>
        </section>

        {/* CTA Footer */}
        <section className="mt-12 text-center rounded-xl border border-zinc-800 bg-zinc-900/30 p-8">
          <h3 className="text-lg font-bold text-white font-mono">
            Ready to start earning during wait states?
          </h3>
          <p className="mt-1 text-xs text-zinc-400">
            Create your developer profile in 60 seconds and link your Rebate wallet.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <Link
              href="/signup?role=developer"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-xs font-semibold text-black hover:bg-emerald-400 transition shadow-sm font-mono"
            >
              <span>Create Developer Profile</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs font-medium text-zinc-300 hover:text-white transition font-mono"
            >
              <Sparkles className="h-3 w-3 text-emerald-400" />
              <span>Try Wait-State Simulator</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
