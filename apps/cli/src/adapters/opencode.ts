/**
 * OpenCode Adapter for Rebate
 * Hooks OpenCode execution cycles cleanly and reversibly.
 */

import { AgentAdapter, AgentEvent } from './adapter';

export class OpenCodeAdapter implements AgentAdapter {
  readonly name = 'OpenCode Adapter';
  readonly agentType = 'opencode';
  private callback?: (event: AgentEvent) => void;
  private running = false;
  private sessionId = `sess_opencode_${Date.now()}`;

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
