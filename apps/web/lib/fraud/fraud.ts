/**
 * Fraud Prevention Layer for Rebate
 * Implements 7 lightweight anti-fraud checks for wait-state impressions.
 */

import {
  FRAUD_RULES,
  Impression,
  DeveloperProfile,
  AgentSession,
  FraudFlag,
} from '@rebate/shared';
import { dbStore } from '../db/store';

export interface FraudVerificationResult {
  valid: boolean;
  rejectionReason?: string;
  flag?: FraudFlag;
}

export function verifyImpressionEvent(params: {
  impression: Impression;
  profile: DeveloperProfile;
  session?: AgentSession;
  durationSeconds: number;
  customMinViewSeconds?: number;
}): FraudVerificationResult {
  const { impression, profile, session, durationSeconds, customMinViewSeconds } = params;
  const now = Date.now();
  const minSeconds = customMinViewSeconds ?? FRAUD_RULES.minimumViewSeconds;

  // Layer 7: Account Status Check
  if (profile.accountStatus === 'review_required' || profile.accountStatus === 'suspended') {
    return {
      valid: false,
      rejectionReason: `Account status is ${profile.accountStatus}. Manual review required.`,
    };
  }

  // Layer 3: Session ID Validation
  if (!session) {
    const flag: FraudFlag = {
      id: `flag_${now}`,
      developerId: profile.id,
      sessionId: impression.sessionId,
      flagType: 'invalid_session',
      severity: 'medium',
      details: `Impression submitted for non-existent session: ${impression.sessionId}`,
      timestamp: new Date().toISOString(),
    };
    dbStore.recordFraudFlag(flag);
    return {
      valid: false,
      rejectionReason: 'Invalid or unknown agent session identifier.',
      flag,
    };
  }

  // Layer 5: Duration & Activity Confidence Check
  if (durationSeconds < minSeconds) {
    return {
      valid: false,
      rejectionReason: `Wait-state duration (${durationSeconds}s) below minimum required (${minSeconds}s).`,
    };
  }
  if (durationSeconds > 7200) {
    const flag: FraudFlag = {
      id: `flag_${now}`,
      developerId: profile.id,
      sessionId: session.sessionId,
      flagType: 'suspicious_activity',
      severity: 'low',
      details: `Excessive impression duration detected: ${durationSeconds} seconds`,
      timestamp: new Date().toISOString(),
    };
    dbStore.recordFraudFlag(flag);
    return {
      valid: false,
      rejectionReason: 'Impression duration exceeds maximum plausible wait state threshold.',
      flag,
    };
  }

  // Layer 2: Impression Cooldown Check (15s minimum between settled impressions)
  const recentImpressions = dbStore.getRecentImpressionsByDeveloper(profile.id, 10);
  const lastVerified = recentImpressions.find(
    (i) => i.status === 'verified' && i.impressionId !== impression.impressionId
  );
  if (lastVerified && lastVerified.endedAt) {
    const lastEndedMs = new Date(lastVerified.endedAt).getTime();
    const currentStartMs = new Date(impression.startedAt).getTime();
    const intervalSeconds = (currentStartMs - lastEndedMs) / 1000;

    if (intervalSeconds >= 0 && intervalSeconds < FRAUD_RULES.minimumIntervalBetweenRewardedImpressions) {
      const flag: FraudFlag = {
        id: `flag_${now}`,
        developerId: profile.id,
        sessionId: session.sessionId,
        flagType: 'cooldown_violation',
        severity: 'medium',
        details: `Impression submitted within cooldown window (${intervalSeconds.toFixed(1)}s < ${FRAUD_RULES.minimumIntervalBetweenRewardedImpressions}s)`,
        timestamp: new Date().toISOString(),
      };
      dbStore.recordFraudFlag(flag);
      return {
        valid: false,
        rejectionReason: `Cooldown violation: rapid successive wait-state events.`,
        flag,
      };
    }
  }

  // Layer 1: Hourly Earning Cap Check
  const oneHourAgo = new Date(now - 60 * 60 * 1000).toISOString();
  const pastHourRewards = dbStore
    .getRewardsByDeveloper(profile.id)
    .filter((r) => r.timestamp >= oneHourAgo && r.status === 'settled');

  const hourlyTotal = pastHourRewards.reduce((sum, r) => sum + r.amount, 0);
  if (hourlyTotal >= FRAUD_RULES.maximumEarningPerHour) {
    const flag: FraudFlag = {
      id: `flag_${now}`,
      developerId: profile.id,
      sessionId: session.sessionId,
      flagType: 'hourly_cap_exceeded',
      severity: 'low',
      details: `Hourly earning limit of ${FRAUD_RULES.maximumEarningPerHour} reached (${hourlyTotal.toFixed(2)}).`,
      timestamp: new Date().toISOString(),
    };
    dbStore.recordFraudFlag(flag);
    return {
      valid: false,
      rejectionReason: 'Hourly reward cap reached. Impressions will not generate additional earnings this hour.',
      flag,
    };
  }

  // Layer 4: Replay Event Check
  if (impression.status === 'verified') {
    return {
      valid: false,
      rejectionReason: 'Replay detected: this impression has already been settled.',
    };
  }

  return {
    valid: true,
  };
}
