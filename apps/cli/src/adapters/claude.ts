/**
 * Claude Code Adapter for Rebate
 * Hooks Claude Code wait-states via IPC/state listener.
 * Non-destructive and completely reversible.
 */

import { AgentAdapter, AgentEvent } from './adapter';

export class ClaudeAdapter implements AgentAdapter {
  readonly name = 'Claude Code Adapter';
  readonly agentType = 'claude_code';
  private callback?: (event: AgentEvent) => void;
  private running = false;
  private sessionId = `sess_claude_${Date.now()}`;

  start(onEvent: (event: AgentEvent) => void): void {
    this.callback = onEvent;
    this.running = true;

    this.emit('agent_started');
  }

  stop(): void {
    if (this.running) {
      this.emit('agent_finished');
      this.running = false;
    }
  }

  // Triggered when Claude Code enters thinking/tool-execution wait-state
  public triggerWait(): void {
    if (this.running) {
      this.emit('agent_waiting');
    }
  }

  // Triggered when Claude Code finishes reasoning and outputs response
  public triggerFinish(): void {
    if (this.running) {
      this.emit('agent_finished');
    }
  }

  private emit(type: AgentEvent['type']): void {
    if (this.callback) {
      this.callback({
        type,
        agentType: this.agentType,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
      });
    }
  }
}
