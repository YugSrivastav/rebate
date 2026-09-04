import { NextRequest, NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';
import { verifyImpressionEvent } from '@/lib/fraud/fraud';
import { calculateImpressionReward } from '@/lib/rewards/reward';
import { Reward } from '@rebate/shared';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      impressionId,
      developerId,
      sessionId,
      agentType,
      startedAt,
      endedAt,
      durationSeconds = 0,
      customMinViewSeconds,
    } = body;

    if (!impressionId) {
      return NextResponse.json(
        { success: false, error: 'Missing impressionId' },
        { status: 400 }
      );
    }

    const impression = dbStore.getImpressionById(impressionId);
    if (!impression) {
      return NextResponse.json(
        { success: false, error: 'Impression record not found' },
        { status: 404 }
      );
    }

    const profile = dbStore.getProfileById(developerId || impression.developerId);
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Developer profile not found' },
        { status: 404 }
      );
    }

    const session = dbStore.getSessionById(sessionId || impression.sessionId);
    const campaign = dbStore.getCampaignById(impression.campaignId);
    if (!campaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // 7-Layer Fraud Verification
    const verification = verifyImpressionEvent({
      impression,
      profile,
      session,
      durationSeconds,
      customMinViewSeconds,
    });

    if (!verification.valid) {
      impression.status = 'rejected';
      impression.rejectionReason = verification.rejectionReason;
      impression.durationSeconds = durationSeconds;
      impression.endedAt = endedAt || new Date().toISOString();
      dbStore.saveImpression(impression);

      return NextResponse.json({
        success: false,
        verified: false,
        reason: verification.rejectionReason,
      });
    }

    // Calculate Reward Split
    const rewardCalculation = calculateImpressionReward(
      campaign.bidCpm,
      profile.rewardPreference || 'INR'
    );

    // Update Impression Record
    impression.status = 'verified';
    impression.durationSeconds = durationSeconds;
    impression.endedAt = endedAt || new Date().toISOString();
    impression.advertiserCost = rewardCalculation.advertiserCost;
    impression.platformShare = rewardCalculation.platformShare;
    impression.developerReward = rewardCalculation.convertedAmount;
    impression.currency = profile.rewardPreference || 'INR';
    dbStore.saveImpression(impression);

    // Deduct Campaign Budget & Increment Spend
    campaign.remainingBudget = Math.max(
      0,
      Number((campaign.remainingBudget - rewardCalculation.advertiserCost).toFixed(2))
    );
    campaign.totalSpend = Number(
      (campaign.totalSpend + rewardCalculation.advertiserCost).toFixed(2)
    );
    campaign.impressionsCount += 1;
    campaign.verifiedImpressionsCount += 1;
    dbStore.saveCampaign(campaign);

    // Record Reward Ledger Entry
    const rewardEntry: Reward = {
      id: `rew_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      developerId: profile.id,
      amount: rewardCalculation.convertedAmount,
      currency: profile.rewardPreference || 'INR',
      source: `${campaign.companyName} — ${campaign.title}`,
      campaignId: campaign.id,
      impressionId: impression.impressionId,
      status: 'settled',
      timestamp: new Date().toISOString(),
    };
    dbStore.recordReward(rewardEntry);

    // Credit Developer Wallet
    const updatedWallet = dbStore.creditWallet(
      profile.id,
      rewardCalculation.convertedAmount,
      profile.rewardPreference || 'INR'
    );

    return NextResponse.json({
      success: true,
      verified: true,
      reward: {
        amount: rewardCalculation.convertedAmount,
        currency: profile.rewardPreference || 'INR',
        advertiserCost: rewardCalculation.advertiserCost,
        platformShare: rewardCalculation.platformShare,
      },
      wallet: updatedWallet,
    });
  } catch (error) {
    console.error('[API /ledger/impression error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to settle impression' },
      { status: 500 }
    );
  }
}
