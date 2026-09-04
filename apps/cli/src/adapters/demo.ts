/**
 * Demo Adapter for Rebate
 * Deterministic hackathon simulator that drives wait states reliably.
 */

import { AgentAdapter, AgentEvent } from './adapter';

export class DemoAdapter implements AgentAdapter {
  readonly name = 'Demo Simulation Adapter';
  readonly agentType = 'demo';
  private callback?: (event: AgentEvent) => void;
  private running = false;
  private sessionId = `sess_demo_${Date.now()}`;
  private timer?: NodeJS.Timeout;

  start(onEvent: (event: AgentEvent) => void): void {
    this.callback = onEvent;
    this.running = true;
    this.emit('agent_started');
  }

  stop(): void {
    if (this.timer) clearTimeout(this.timer);
    this.running = false;
  }

  public simulateWait(durationSeconds = 10, onDone?: () => void): void {
    if (!this.running) return;

    this.emit('agent_waiting');

    this.timer = setTimeout(() => {
      this.emit('agent_finished');
      if (onDone) onDone();
    }, durationSeconds * 1000);
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
