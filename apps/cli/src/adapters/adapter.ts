/**
 * Agent Adapter Interface for Rebate
 * Translates local agent lifecycle into standard wait-state events.
 */

import { AgentType } from '@rebate/shared';

export type AgentEventType = 'agent_started' | 'agent_waiting' | 'agent_finished';

export interface AgentEvent {
  type: AgentEventType;
  agentType: AgentType;
  sessionId: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface AgentAdapter {
  readonly name: string;
  readonly agentType: AgentType;
  start(onEvent: (event: AgentEvent) => void): void | Promise<void>;
  stop(): void | Promise<void>;
}
