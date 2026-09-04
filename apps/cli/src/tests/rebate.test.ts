/**
 * Rebate Test Suite
 * Tests Matching, Hard Geography Isolation, Auction Ranking, Rewards Calculation,
 * Impression Validation, Hourly Cap, and Failure Isolation.
 */

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateCampaignMatch } from '../../../web/lib/matching/matching';
import { runAuction } from '../../../web/lib/auction/auction';
import { calculateImpressionReward } from '../../../web/lib/rewards/reward';
import { verifyImpressionEvent } from '../../../web/lib/fraud/fraud';
import { RebateApiClient } from '../client/api';
import { dbStore } from '../../../web/lib/db/store';
import { SEED_DATA } from '../../../web/lib/db/seed';
import { DeveloperProfile, Campaign, Impression, AgentSession } from '@rebate/shared';

// Initialize store with seed data
dbStore.resetTo(SEED_DATA);

describe('Rebate Core Engines Test Suite', () => {

  describe('1. Matching Engine & Hard Geographic Isolation (Section 9)', () => {
    const studentIndiaProfile: DeveloperProfile = {
      id: 'dev_test_1',
      userId: 'usr_test_1',
      name: 'Priya Test',
      email: 'test@rebate.dev',
      role: 'Student',
      field: 'AI/ML',
      skills: ['Python', 'FastAPI', 'PyTorch'],
      education: 'Student',
      location: { country: 'India', state: 'Karnataka' },
      rewardPreference: 'INR',
      preferredCategories: ['internship'],
      connectedAgents: ['antigravity'],
      accountStatus: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const campaignIndiaOnly: Campaign = {
      id: 'camp_geo_india',
      advertiserId: 'adv_test',
      companyName: 'India AI Labs',
      title: 'AI Intern India',
      opportunityType: 'internship',
      description: 'Internship for Indian students',
      requirements: ['Python'],
      skills: ['Python'],
      destinationUrl: 'https://example.com',
      cta: 'Apply',
      target: {
        countries: ['India'],
        allowUnspecifiedLocation: false,
      },
      budget: 1000,
      remainingBudget: 1000,
      bidCpm: 7.00,
      campaignQuality: 1.0,
      billingModel: 'cpm_impression',
      status: 'active',
      impressionsCount: 0,
      verifiedImpressionsCount: 0,
      clicksCount: 0,
      totalSpend: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const campaignUsOnly: Campaign = {
      id: 'camp_geo_us',
      advertiserId: 'adv_test',
      companyName: 'Silicon Valley Labs',
      title: 'SF Residency',
      opportunityType: 'job',
      description: 'US based role',
      requirements: ['Python'],
      skills: ['Python'],
      destinationUrl: 'https://example.com',
      cta: 'Apply',
      target: {
        countries: ['United States'],
        allowUnspecifiedLocation: false,
      },
      budget: 1000,
      remainingBudget: 1000,
      bidCpm: 9.00,
      campaignQuality: 1.0,
      billingModel: 'cpm_impression',
      status: 'active',
      impressionsCount: 0,
      verifiedImpressionsCount: 0,
      clicksCount: 0,
      totalSpend: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    it('matches developer when geography criteria aligns', () => {
      const result = evaluateCampaignMatch(studentIndiaProfile, campaignIndiaOnly);
      assert.equal(result.isMatch, true);
      assert.ok(result.relevanceScore > 0.5);
    });

    it('strictly rejects campaign when developer location does not match country', () => {
      const result = evaluateCampaignMatch(studentIndiaProfile, campaignUsOnly);
      assert.equal(result.isMatch, false);
      assert.equal(result.relevanceScore, 0);
      assert.ok(result.rejectionReason?.includes('does not match campaign countries'));
    });

    it('HARD RULE: If location is not supplied, strictly rejects campaigns requiring location', () => {
      const anonProfile: DeveloperProfile = {
        ...studentIndiaProfile,
        id: 'dev_anon',
        location: undefined, // No location voluntarily provided
      };

      const result = evaluateCampaignMatch(anonProfile, campaignIndiaOnly);
      assert.equal(result.isMatch, false);
      assert.ok(result.rejectionReason?.includes('unspecified'));
    });

    it('HARD RULE: If location is not supplied, permits campaigns that allow unspecified location', () => {
      const anonProfile: DeveloperProfile = {
        ...studentIndiaProfile,
        id: 'dev_anon',
        location: undefined,
      };

      const globalCampaign: Campaign = {
        ...campaignIndiaOnly,
        id: 'camp_global',
        target: {
          countries: ['Global'],
          allowUnspecifiedLocation: true,
        },
      };

      const result = evaluateCampaignMatch(anonProfile, globalCampaign);
      assert.equal(result.isMatch, true);
      assert.ok(result.relevanceScore > 0);
    });
  });

  describe('2. Auction Engine (Section 8: bid × relevance × quality)', () => {
    const developer: DeveloperProfile = {
      id: 'dev_alex_india',
      userId: 'usr_dev_2',
      name: 'Priya Sharma',
      email: 'priya@example.com',
      role: 'Student',
      field: 'AI/ML',
      skills: ['Python', 'FastAPI', 'PyTorch'],
      education: 'Student',
      location: { country: 'India' },
      rewardPreference: 'INR',
      preferredCategories: ['internship'],
      connectedAgents: ['antigravity'],
      accountStatus: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    it('selects highest rank = bid * relevance * quality, not merely highest bidder', () => {
      // High bidder with low relevance
      const highBidderLowRel: Campaign = {
        id: 'camp_crypto_high_bid',
        advertiserId: 'adv_crypto',
        companyName: 'DeFi Corp',
        title: 'Solidity Core Dev',
        opportunityType: 'job',
        description: 'Web3 role',
        requirements: ['Solidity', 'Rust'],
        skills: ['Solidity', 'Rust'],
        destinationUrl: 'https://example.com',
        cta: 'Apply',
        target: {
          fields: ['Blockchain/Web3'],
          skills: ['Solidity', 'Rust'],
          allowUnspecifiedLocation: true,
        },
        budget: 5000,
        remainingBudget: 5000,
        bidCpm: 15.00, // Very high bid
        campaignQuality: 1.0,
        billingModel: 'cpm_impression',
        status: 'active',
        impressionsCount: 0,
        verifiedImpressionsCount: 0,
        clicksCount: 0,
        totalSpend: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Moderate bidder with extremely high relevance
      const modBidderHighRel: Campaign = {
        id: 'camp_ai_intern_high_rel',
        advertiserId: 'adv_ai',
        companyName: 'Example AI',
        title: 'AI Engineering Internship',
        opportunityType: 'internship',
        description: 'AI intern role',
        requirements: ['Python', 'FastAPI', 'PyTorch'],
        skills: ['Python', 'FastAPI', 'PyTorch'],
        destinationUrl: 'https://example.com',
        cta: 'Apply',
        target: {
          roles: ['Student'],
          fields: ['AI/ML'],
          skills: ['Python', 'FastAPI', 'PyTorch'],
          education: ['Student'],
          countries: ['India'],
          allowUnspecifiedLocation: false,
        },
        budget: 5000,
        remainingBudget: 5000,
        bidCpm: 7.00, // Moderate bid
        campaignQuality: 1.0,
        billingModel: 'cpm_impression',
        status: 'active',
        impressionsCount: 0,
        verifiedImpressionsCount: 0,
        clicksCount: 0,
        totalSpend: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = runAuction(developer, [highBidderLowRel, modBidderHighRel]);

      // Highly relevant moderate bidder wins!
      assert.ok(result.winner !== null);
      assert.equal(result.winner.campaign.id, 'camp_ai_intern_high_rel');
      assert.ok(result.winner.totalScore > 5.0);
    });

    it('skips campaigns with exhausted budgets', () => {
      const exhaustedCampaign: Campaign = {
        id: 'camp_exhausted',
        advertiserId: 'adv_test',
        companyName: 'Broke Tech',
        title: 'Empty Budget Role',
        opportunityType: 'job',
        description: 'Role',
        requirements: ['Python'],
        skills: ['Python'],
        destinationUrl: 'https://example.com',
        cta: 'Apply',
        target: { allowUnspecifiedLocation: true },
        budget: 100,
        remainingBudget: 0.001, // Exhausted
        bidCpm: 5.00,
        campaignQuality: 1.0,
        billingModel: 'cpm_impression',
        status: 'active',
        impressionsCount: 20,
        verifiedImpressionsCount: 20,
        clicksCount: 0,
        totalSpend: 100,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = runAuction(developer, [exhaustedCampaign]);
      assert.equal(result.winner, null);
    });
  });

  describe('3. Reward Engine (Section 6 & 10: Configurable Split & Currency Abstraction)', () => {
    it('computes 70% developer share and 30% platform share dynamically', () => {
      const reward = calculateImpressionReward(7.00, 'INR', { developerShare: 0.70, platformShare: 0.30 });
      assert.equal(reward.advertiserCost, 7.00);
      assert.equal(reward.developerReward, 4.90);
      assert.equal(reward.platformShare, 2.10);
      assert.equal(reward.convertedAmount, 4.90);
    });

    it('supports reconfigurable share policy without modifying code (e.g. 50/50)', () => {
      const reward50 = calculateImpressionReward(10.00, 'INR', { developerShare: 0.50, platformShare: 0.50 });
      assert.equal(reward50.developerReward, 5.00);
      assert.equal(reward50.platformShare, 5.00);
    });

    it('correctly converts rewards to alternative currencies (AI_CREDITS, USD)', () => {
      const rewardAiCredits = calculateImpressionReward(7.00, 'AI_CREDITS');
      // 4.90 INR * 2.0 rate = 9.80 credits
      assert.equal(rewardAiCredits.developerCurrency, 'AI_CREDITS');
      assert.equal(rewardAiCredits.convertedAmount, 9.80);
    });
  });

  describe('4. Anti-Fraud Layer (Section 13: 7 Layers)', () => {
    const profile = SEED_DATA.developerProfiles[0];
    const session: AgentSession = {
      sessionId: 'sess_test_fraud_01',
      developerId: profile.id,
      agentType: 'antigravity',
      status: 'waiting',
      startedAt: new Date().toISOString(),
      lastHeartbeat: new Date().toISOString(),
      eventSequence: 1,
    };
    dbStore.saveSession(session);

    it('Layer 5: Rejects impressions below minimum view threshold', () => {
      const impression: Impression = {
        impressionId: 'imp_fraud_too_short',
        campaignId: 'camp_ai_internship',
        developerId: profile.id,
        sessionId: session.sessionId,
        agentType: 'antigravity',
        startedAt: new Date(Date.now() - 3000).toISOString(),
        durationSeconds: 3,
        status: 'pending',
        advertiserCost: 0,
        platformShare: 0,
        developerReward: 0,
        currency: 'INR',
        createdAt: new Date().toISOString(),
      };

      const result = verifyImpressionEvent({
        impression,
        profile,
        session,
        durationSeconds: 3,
        customMinViewSeconds: 8,
      });

      assert.equal(result.valid, false);
      assert.ok(result.rejectionReason?.includes('below minimum required'));
    });

    it('Layer 3: Rejects impression when session identifier is non-existent', () => {
      const impression: Impression = {
        impressionId: 'imp_fake_session',
        campaignId: 'camp_ai_internship',
        developerId: profile.id,
        sessionId: 'sess_completely_fake',
        agentType: 'antigravity',
        startedAt: new Date(Date.now() - 10000).toISOString(),
        durationSeconds: 10,
        status: 'pending',
        advertiserCost: 0,
        platformShare: 0,
        developerReward: 0,
        currency: 'INR',
        createdAt: new Date().toISOString(),
      };

      const result = verifyImpressionEvent({
        impression,
        profile,
        session: undefined, // Unknown session
        durationSeconds: 10,
      });

      assert.equal(result.valid, false);
      assert.ok(result.rejectionReason?.includes('Invalid or unknown agent session'));
    });

    it('Layer 4: Rejects replay of already settled impressions', () => {
      const settledImpression: Impression = {
        impressionId: 'imp_already_settled',
        campaignId: 'camp_ai_internship',
        developerId: profile.id,
        sessionId: session.sessionId,
        agentType: 'antigravity',
        startedAt: new Date(Date.now() - 20000).toISOString(),
        durationSeconds: 12,
        status: 'verified', // already verified
        advertiserCost: 7,
        platformShare: 2.1,
        developerReward: 4.9,
        currency: 'INR',
        createdAt: new Date().toISOString(),
      };

      const result = verifyImpressionEvent({
        impression: settledImpression,
        profile,
        session,
        durationSeconds: 12,
      });

      assert.equal(result.valid, false);
      assert.ok(result.rejectionReason?.includes('Replay detected'));
    });

    it('Layer 1: Enforces hourly earning cap and rejects additional rewards', () => {
      // Simulate rewards that hit or exceed the hourly cap
      const cappedProfile: DeveloperProfile = {
        ...profile,
        id: 'dev_capped_user',
      };
      dbStore.saveProfile(cappedProfile);

      // Record 160 INR in rewards in the past 10 minutes (exceeds 150 cap)
      dbStore.recordReward({
        id: 'rew_cap_1',
        campaignId: 'camp_ai_internship',
        impressionId: 'imp_cap_1',
        developerId: cappedProfile.id,
        amount: 80,
        currency: 'INR',
        source: 'Impression verified: Test',
        status: 'settled',
        timestamp: new Date().toISOString(),
      });
      dbStore.recordReward({
        id: 'rew_cap_2',
        campaignId: 'camp_ai_internship',
        impressionId: 'imp_cap_2',
        developerId: cappedProfile.id,
        amount: 80,
        currency: 'INR',
        source: 'Impression verified: Test',
        status: 'settled',
        timestamp: new Date().toISOString(),
      });

      const impression: Impression = {
        impressionId: 'imp_over_cap',
        campaignId: 'camp_ai_internship',
        developerId: cappedProfile.id,
        sessionId: session.sessionId,
        agentType: 'antigravity',
        startedAt: new Date(Date.now() - 10000).toISOString(),
        durationSeconds: 10,
        status: 'pending',
        advertiserCost: 0,
        platformShare: 0,
        developerReward: 0,
        currency: 'INR',
        createdAt: new Date().toISOString(),
      };

      const result = verifyImpressionEvent({
        impression,
        profile: cappedProfile,
        session,
        durationSeconds: 10,
      });

      assert.equal(result.valid, false);
      assert.ok(result.rejectionReason?.includes('Hourly reward cap reached'));
    });

    it('Layer 2: Rejects rapid impressions submitted within the cooldown window', () => {
      const cooldownProfile: DeveloperProfile = {
        ...profile,
        id: 'dev_cooldown_user',
      };
      dbStore.saveProfile(cooldownProfile);

      // Record an impression that just ended 3 seconds ago
      const justEndedImpression: Impression = {
        impressionId: 'imp_just_ended',
        campaignId: 'camp_ai_internship',
        developerId: cooldownProfile.id,
        sessionId: session.sessionId,
        agentType: 'antigravity',
        startedAt: new Date(Date.now() - 15000).toISOString(),
        endedAt: new Date(Date.now() - 3000).toISOString(),
        durationSeconds: 12,
        status: 'verified',
        advertiserCost: 7,
        platformShare: 2.1,
        developerReward: 4.9,
        currency: 'INR',
        createdAt: new Date().toISOString(),
      };
      dbStore.saveImpression(justEndedImpression);

      const immediateNextImpression: Impression = {
        impressionId: 'imp_rapid_succession',
        campaignId: 'camp_ai_internship',
        developerId: cooldownProfile.id,
        sessionId: session.sessionId,
        agentType: 'antigravity',
        startedAt: new Date().toISOString(),
        durationSeconds: 10,
        status: 'pending',
        advertiserCost: 0,
        platformShare: 0,
        developerReward: 0,
        currency: 'INR',
        createdAt: new Date().toISOString(),
      };

      const result = verifyImpressionEvent({
        impression: immediateNextImpression,
        profile: cooldownProfile,
        session,
        durationSeconds: 10,
      });

      assert.equal(result.valid, false);
      assert.ok(result.rejectionReason?.includes('Cooldown violation'));
    });

    it('Layer 7: Rejects impressions for accounts flagged for review or suspended', () => {
      const suspendedProfile: DeveloperProfile = {
        ...profile,
        id: 'dev_suspended_user',
        accountStatus: 'review_required',
      };

      const impression: Impression = {
        impressionId: 'imp_suspended_test',
        campaignId: 'camp_ai_internship',
        developerId: suspendedProfile.id,
        sessionId: session.sessionId,
        agentType: 'antigravity',
        startedAt: new Date(Date.now() - 10000).toISOString(),
        durationSeconds: 10,
        status: 'pending',
        advertiserCost: 0,
        platformShare: 0,
        developerReward: 0,
        currency: 'INR',
        createdAt: new Date().toISOString(),
      };

      const result = verifyImpressionEvent({
        impression,
        profile: suspendedProfile,
        session,
        durationSeconds: 10,
      });

      assert.equal(result.valid, false);
      assert.ok(result.rejectionReason?.includes('Manual review required'));
    });
  });

  describe('5. Failure Isolation & Resilient CLI Client (Section 33 & 34)', () => {
    it('gracefully handles unreachable backend without throwing errors', async () => {
      // Point client to non-existent port
      const client = new RebateApiClient('http://localhost:59999', 500);

      const result = await client.fetchOpportunity('dev_alex_india', 'sess_test', 'antigravity');
      assert.equal(result.opportunity, null);

      const verifyResult = await client.reportImpression({
        impressionId: 'fake',
        developerId: 'fake',
        sessionId: 'fake',
        agentType: 'antigravity',
        startedAt: new Date().toISOString(),
        endedAt: new Date().toISOString(),
        durationSeconds: 10,
      });
      assert.equal(verifyResult.verified, false);
    });
  });
});
