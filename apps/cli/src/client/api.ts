/**
 * Resilient Rebate API Client
 * Non-blocking, best-effort HTTP client with silent failover.
 * If backend fails or times out, the developer workflow continues uninterrupted.
 */

import { Opportunity, AgentType, ImpressionVerifyResponse } from '@rebate/shared';

export interface OpportunityFetchResult {
  opportunity: Opportunity | null;
  impressionId?: string;
  sessionId?: string;
}

export class RebateApiClient {
  private baseUrl: string;
  private timeoutMs: number;

  constructor(baseUrl = 'http://localhost:3000', timeoutMs = 2500) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.timeoutMs = timeoutMs;
  }

  public async fetchOpportunity(
    developerId: string,
    sessionId: string,
    agentType: AgentType
  ): Promise<OpportunityFetchResult> {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), this.timeoutMs);

      const res = await fetch(`${this.baseUrl}/api/auction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ developerId, sessionId, agentType }),
        signal: controller.signal,
      });

      clearTimeout(id);

      if (!res.ok) {
        return { opportunity: null };
      }

      const data = await res.json();
      return {
        opportunity: data.opportunity || null,
        impressionId: data.impressionId,
        sessionId: data.sessionId,
      };
    } catch {
      // Silent non-blocking fallback (Section 33 & 34)
      return { opportunity: null };
    }
  }

  public async reportImpression(params: {
    impressionId: string;
    developerId: string;
    sessionId: string;
    agentType: AgentType;
    startedAt: string;
    endedAt: string;
    durationSeconds: number;
    customMinViewSeconds?: number;
  }): Promise<ImpressionVerifyResponse> {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), this.timeoutMs);

      const res = await fetch(`${this.baseUrl}/api/ledger/impression`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
        signal: controller.signal,
      });

      clearTimeout(id);

      if (!res.ok) {
        return { success: false, verified: false };
      }

      return await res.json();
    } catch {
      return { success: false, verified: false };
    }
  }

  public async recordClick(params: {
    impressionId: string;
    campaignId: string;
    developerId: string;
    destinationUrl: string;
  }): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/api/ledger/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
    } catch {
      // Best-effort
    }
  }

  public async getWallet(developerId: string): Promise<any> {
    try {
      const res = await fetch(`${this.baseUrl}/api/developer/wallet?developerId=${developerId}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }
}
