/**
 * Codex CLI Adapter for Rebate
 * Translates Codex workflow status into Rebate wait-state events.
 */

import { AgentAdapter, AgentEvent } from './adapter';

export class CodexAdapter implements AgentAdapter {
  readonly name = 'Codex CLI Adapter';
  readonly agentType = 'codex';
  private callback?: (event: AgentEvent) => void;
  private running = false;
  private sessionId = `sess_codex_${Date.now()}`;

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

  public triggerWait(): void {
    if (this.running) {
      this.emit('agent_waiting');
    }
  }

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
