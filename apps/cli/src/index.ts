#!/usr/bin/env node

/**
 * Rebate Local Agent / CLI
 * Converts AI waiting states into native developer opportunities and rewards.
 */

import readline from 'readline';
import { SessionManager } from './session/session';
import { RebateApiClient } from './client/api';
import { TerminalDisplay } from './display/terminal';
import { DemoAdapter } from './adapters/demo';
import { AntigravityAdapter } from './adapters/antigravity';
import { ClaudeAdapter } from './adapters/claude';
import { CodexAdapter } from './adapters/codex';
import { OpenCodeAdapter } from './adapters/opencode';
import { AgentAdapter, AgentEvent } from './adapters/adapter';
import { AgentType } from '@rebate/shared';

const sessionManager = new SessionManager();
const config = sessionManager.getConfig();
const apiClient = new RebateApiClient(config.apiUrl);
const display = new TerminalDisplay();

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0] || 'demo';

async function main() {
  switch (command) {
    case 'demo':
      await runInteractiveDemo();
      break;

    case 'run':
      const targetAgent = (args[1] || 'antigravity') as AgentType;
      const taskPrompt = args.slice(2).join(' ') || 'Refactor authentication module and add unit tests';
      await runAgentTask(targetAgent, taskPrompt);
      break;

    case 'start':
      const agentType = (args[1] || config.preferredAgent || 'demo') as AgentType;
      await runAgentDaemon(agentType);
      break;

    case 'status':
      await printStatus();
      break;

    case 'config':
      handleConfig(args.slice(1));
      break;

    case 'help':
    case '--help':
    case '-h':
    default:
      printHelp();
      break;
  }
}

async function runInteractiveDemo() {
  console.log('\n\x1b[1m\x1b[36m◆ REBATE — Local Agent Demo Engine\x1b[0m');
  console.log('\x1b[2mTurning AI wait states into developer economic value\x1b[0m\n');

  console.log(`\x1b[2mDeveloper Profile:\x1b[0m \x1b[1m${config.developerId}\x1b[0m (Priya Sharma • Student • AI/ML • India)`);
  console.log(`\x1b[2mBackend API:\x1b[0m      \x1b[1m${config.apiUrl}\x1b[0m`);
  console.log(`\x1b[2mRule:\x1b[0m             Zero code/prompt reading • 100% profile-matched\n`);

  console.log('\x1b[33m[1/4] Simulating AI coding agent launching...\x1b[0m');
  await sleep(1000);

  const demoAdapter = new DemoAdapter();
  const sessionId = sessionManager.getSessionId();

  let activeImpressionId: string | undefined;
  let waitStartTime = 0;

  // Enable raw keyboard mode to catch 'o' key press to open opportunity
  setupKeypressListener(demoAdapter);

  demoAdapter.start(async (event: AgentEvent) => {
    if (event.type === 'agent_waiting') {
      waitStartTime = Date.now();
      display.startThinking();

      // Request auction winner from backend
      const result = await apiClient.fetchOpportunity(
        config.developerId,
        sessionId,
        'demo'
      );

      if (result.opportunity) {
        activeImpressionId = result.impressionId;
        display.updateOpportunity(result.opportunity);
      }
    } else if (event.type === 'agent_finished') {
      const durationSeconds = Math.max(1, Math.round((Date.now() - waitStartTime) / 1000));
      display.stopThinking();

      console.log('\n\x1b[32m✔ AI finished reasoning. Opportunity cleanly reverted.\x1b[0m');

      if (activeImpressionId) {
        console.log(`\x1b[2mSettling impression (${durationSeconds}s visible duration)...\x1b[0m`);
        const verifyRes = await apiClient.reportImpression({
          impressionId: activeImpressionId,
          developerId: config.developerId,
          sessionId,
          agentType: 'demo',
          startedAt: new Date(waitStartTime).toISOString(),
          endedAt: new Date().toISOString(),
          durationSeconds,
          customMinViewSeconds: 2, // Allow quick settlement in demo mode
        });

        if (verifyRes.verified) {
          const rewardAmount = (verifyRes as any).reward?.amount ?? verifyRes.developerReward ?? 4.90;
          const rewardCurrency = (verifyRes as any).reward?.currency ?? verifyRes.currency ?? 'INR';
          console.log(
            `\x1b[32m✔ Verified impression settled!\x1b[0m Developer reward: \x1b[1m+${rewardCurrency === 'INR' ? '₹' : ''}${rewardAmount.toFixed(2)} ${rewardCurrency}\x1b[0m credited to wallet.`
          );
          console.log('\x1b[2m(Note: Earnings are never displayed in the AI status line, only in the wallet)\x1b[0m\n');
        } else {
          console.log(`\x1b[33mℹ Impression recorded (status: ${verifyRes.reason || 'unverified'})\x1b[0m\n`);
        }
      }

      console.log('To view updated wallet and opportunities, visit:');
      console.log(`\x1b[36m${config.apiUrl}/developer\x1b[0m\n`);

      demoAdapter.stop();
      if (process.stdin.isTTY) {
        try {
          process.stdin.removeAllListeners('keypress');
          process.stdin.setRawMode(false);
          process.stdin.pause();
        } catch {}
      }
      return;
    }
  });

  console.log('\x1b[33m[2/4] Agent entering waiting state for 10 seconds...\x1b[0m');
  console.log('\x1b[2m(Watch the status line below change dynamically. Press \x1b[1m"o"\x1b[0m\x1b[2m at any time to open opportunity in browser)\x1b[0m\n');

  demoAdapter.simulateWait(10);
}

async function runAgentTask(agentType: AgentType, prompt: string) {
  console.log('\n\x1b[1m\x1b[36m◆ REBATE — Agent Execution Wrapper\x1b[0m');
  console.log(`\x1b[2mAgent:\x1b[0m          \x1b[1m${agentType.toUpperCase()}\x1b[0m`);
  console.log(`\x1b[2mDeveloper ID:\x1b[0m   \x1b[1m${config.developerId}\x1b[0m (Priya Sharma • Student • India)`);
  console.log(`\x1b[2mTask Prompt:\x1b[0m    "${prompt}"`);
  console.log(`\x1b[2mPrivacy:\x1b[0m        Zero prompt/code inspection • Native status line hook • 100% profile-matched\n`);

  console.log(`\x1b[33m[1/3] Dispatching task to ${agentType} agent...\x1b[0m`);
  await sleep(800);

  let adapter: any;
  if (agentType === 'antigravity') {
    adapter = new AntigravityAdapter();
  } else if (agentType === 'claude_code') {
    adapter = new ClaudeAdapter();
  } else if (agentType === 'codex') {
    adapter = new CodexAdapter();
  } else if (agentType === 'opencode') {
    adapter = new OpenCodeAdapter();
  } else {
    adapter = new DemoAdapter();
  }

  const sessionId = `sess_${agentType}_${Date.now()}`;
  let activeImpressionId: string | undefined;
  let waitStartTime = 0;

  setupKeypressListener(adapter);

  adapter.start(async (event: AgentEvent) => {
    if (event.type === 'agent_waiting') {
      waitStartTime = Date.now();
      display.startThinking();

      const result = await apiClient.fetchOpportunity(
        config.developerId,
        sessionId,
        agentType
      );

      if (result.opportunity) {
        activeImpressionId = result.impressionId;
        display.updateOpportunity(result.opportunity);
      }
    } else if (event.type === 'agent_finished') {
      const durationSeconds = Math.max(1, Math.round((Date.now() - waitStartTime) / 1000));
      display.stopThinking();

      console.log(`\n\x1b[32m✔ ${agentType} finished reasoning and executing tools. Opportunity dismissed cleanly.\x1b[0m`);

      if (activeImpressionId) {
        console.log(`\x1b[2mSettling wait-state impression (${durationSeconds}s visible duration)...\x1b[0m`);
        const verifyRes = await apiClient.reportImpression({
          impressionId: activeImpressionId,
          developerId: config.developerId,
          sessionId,
          agentType,
          startedAt: new Date(waitStartTime).toISOString(),
          endedAt: new Date().toISOString(),
          durationSeconds,
          customMinViewSeconds: 2,
        });

        if (verifyRes.verified) {
          const rewardAmount = (verifyRes as any).reward?.amount ?? verifyRes.developerReward ?? 4.90;
          const rewardCurrency = (verifyRes as any).reward?.currency ?? verifyRes.currency ?? 'INR';
          console.log(
            `\x1b[32m✔ Verified impression settled!\x1b[0m Developer reward: \x1b[1m+${rewardCurrency === 'INR' ? '₹' : ''}${rewardAmount.toFixed(2)} ${rewardCurrency}\x1b[0m credited to wallet.`
          );
        } else {
          console.log(`\x1b[33mℹ Impression recorded (status: ${verifyRes.reason || 'unverified'})\x1b[0m\n`);
        }
      }

      console.log('\nTo view updated wallet and earnings analytics:');
      console.log(`\x1b[36m${config.apiUrl}/developer\x1b[0m\n`);

      adapter.stop();
      if (process.stdin.isTTY) {
        try {
          process.stdin.removeAllListeners('keypress');
          process.stdin.setRawMode(false);
          process.stdin.pause();
        } catch {}
      }
      return;
    }
  });

  console.log(`\x1b[33m[2/3] Agent active in wait-state (reasoning / tool invocations)...\x1b[0m`);
  console.log(`\x1b[2m(Rebate status line is displayed below. Press \x1b[1m"o"\x1b[0m\x1b[2m to open opportunity in browser)\x1b[0m\n`);

  if (typeof adapter.simulateWait === 'function') {
    adapter.simulateWait(8);
  } else {
    adapter.triggerWait();
    setTimeout(() => adapter.triggerFinish(), 8000);
  }
}

async function runAgentDaemon(agentType: AgentType) {
  console.log(`\n\x1b[1m\x1b[36mRebate Agent Daemon active\x1b[0m (Adapter: ${agentType})`);
  console.log(`Session: ${sessionManager.getSessionId()}`);
  console.log('Listening for agent wait states... (Ctrl+C to exit)\n');

  let adapter: AgentAdapter;
  switch (agentType) {
    case 'claude_code':
      adapter = new ClaudeAdapter();
      break;
    case 'codex':
      adapter = new CodexAdapter();
      break;
    case 'opencode':
      adapter = new OpenCodeAdapter();
      break;
    case 'antigravity':
      adapter = new AntigravityAdapter();
      break;
    default:
      adapter = new DemoAdapter();
  }

  let activeImpressionId: string | undefined;
  let waitStartTime = 0;

  setupKeypressListener(adapter);

  adapter.start(async (event: AgentEvent) => {
    if (event.type === 'agent_waiting') {
      waitStartTime = Date.now();
      display.startThinking();

      const result = await apiClient.fetchOpportunity(
        config.developerId,
        event.sessionId,
        agentType
      );

      if (result.opportunity) {
        activeImpressionId = result.impressionId;
        display.updateOpportunity(result.opportunity);
      }
    } else if (event.type === 'agent_finished') {
      const durationSeconds = Math.max(1, Math.round((Date.now() - waitStartTime) / 1000));
      display.stopThinking();

      if (activeImpressionId) {
        await apiClient.reportImpression({
          impressionId: activeImpressionId,
          developerId: config.developerId,
          sessionId: event.sessionId,
          agentType,
          startedAt: new Date(waitStartTime).toISOString(),
          endedAt: new Date().toISOString(),
          durationSeconds,
        });
        activeImpressionId = undefined;
      }
    }
  });

  // Keep daemon process alive
  process.on('SIGINT', () => {
    display.stopThinking();
    adapter.stop();
    console.log('\n[Rebate] Daemon stopped.');
    process.exit(0);
  });
}

async function printStatus() {
  console.log('\n\x1b[1mRebate Local Agent Status\x1b[0m');
  console.log('-------------------------');
  console.log(`Developer ID:    ${config.developerId}`);
  console.log(`API URL:         ${config.apiUrl}`);
  console.log(`Preferred Agent: ${config.preferredAgent}`);

  const walletRes = await apiClient.getWallet(config.developerId);
  if (walletRes && walletRes.wallet) {
    const w = walletRes.wallet;
    console.log('\n\x1b[1mWallet Balances:\x1b[0m');
    console.log(`  INR:           ₹${w.balances.INR.toFixed(2)}`);
    console.log(`  USD:           $${w.balances.USD.toFixed(2)}`);
    console.log(`  AI Credits:    ${w.balances.AI_CREDITS} ⚡`);
    console.log(`  Cloud Credits: ${w.balances.CLOUD_CREDITS} ☁️`);
  } else {
    console.log('\n\x1b[33mUnable to connect to backend server at ' + config.apiUrl + '\x1b[0m');
  }
  console.log('');
}

function handleConfig(args: string[]) {
  if (args.length < 2) {
    console.log('Usage: rebate config <key> <value>');
    console.log('Keys: developerId, apiUrl, preferredAgent');
    return;
  }
  const [key, value] = args;
  sessionManager.saveConfig({ [key]: value });
  console.log(`Updated config ${key} = ${value}`);
}

function setupKeypressListener(adapter: AgentAdapter) {
  if (process.stdin.isTTY) {
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.resume();

    process.stdin.on('keypress', (str, key) => {
      if (key.ctrl && key.name === 'c') {
        display.stopThinking();
        adapter.stop();
        process.exit(0);
      }

      // 'o' opens active opportunity in browser
      if (key.name === 'o') {
        const opp = display.getActiveOpportunity();
        if (opp) {
          const url = `${config.apiUrl}/opportunity/${opp.id}`;
          console.log(`\n\x1b[36mOpening opportunity in browser: ${url}\x1b[0m`);
          display.openInBrowser(url);
          apiClient.recordClick({
            impressionId: 'cli_click',
            campaignId: opp.campaignId,
            developerId: config.developerId,
            destinationUrl: opp.destinationUrl,
          });
        }
      }
    });
  }
}

function printHelp() {
  console.log(`
\x1b[1mRebate CLI\x1b[0m — AI Wait-State Developer Opportunity & Reward Layer

\x1b[1mUsage:\x1b[0m
  rebate run [agent] [prompt]   Run agent task wrapped with Rebate wait-state detection
  rebate demo                   Run interactive wait-state simulation
  rebate start [agent]          Start Rebate background daemon (antigravity | claude_code | codex | opencode)
  rebate status                 Check connection and developer wallet balance
  rebate config                 Update developer ID or backend URL
`);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch(console.error);
