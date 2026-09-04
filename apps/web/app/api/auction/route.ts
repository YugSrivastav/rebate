import { NextRequest, NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';
import { runAuction } from '@/lib/auction/auction';
import { AgentSession, Impression, Opportunity } from '@rebate/shared';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { developerId = 'dev_alex_india', sessionId, agentType = 'antigravity' } = body;

    const profile = dbStore.getProfileById(developerId);
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Developer profile not found' },
        { status: 404 }
      );
    }

    // Ensure session exists or create it
    const activeSessionId = sessionId || `sess_${agentType}_${Date.now()}`;
    let session = dbStore.getSessionById(activeSessionId);
    if (!session) {
      session = {
        sessionId: activeSessionId,
        developerId: profile.id,
        agentType,
        status: 'waiting',
        startedAt: new Date().toISOString(),
        lastHeartbeat: new Date().toISOString(),
        eventSequence: 1,
      };
      dbStore.saveSession(session);
    } else {
      session.status = 'waiting';
      session.lastHeartbeat = new Date().toISOString();
      session.eventSequence += 1;
      dbStore.saveSession(session);
    }

    const activeCampaigns = dbStore.getActiveCampaigns();
    const auctionResult = runAuction(profile, activeCampaigns);

    if (!auctionResult.winner) {
      return NextResponse.json({
        success: true,
        opportunity: null,
        message: 'No eligible campaigns matched this developer profile.',
        allScores: auctionResult.allScores,
      });
    }

    const winningCampaign = auctionResult.winner.campaign;
    const oppTemplate = dbStore.getOpportunityByCampaignId(winningCampaign.id);

    const impressionId = `imp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const opportunity: Opportunity = {
      id: oppTemplate?.id || `opp_${winningCampaign.id}`,
      campaignId: winningCampaign.id,
      title: winningCampaign.title,
      company: winningCampaign.companyName,
      opportunityType: winningCampaign.opportunityType,
      location: oppTemplate?.location || 'Remote / Global',
      description: winningCampaign.description,
      requirements: winningCampaign.requirements,
      skills: winningCampaign.skills,
      destinationUrl: winningCampaign.destinationUrl,
      cta: winningCampaign.cta,
      logoUrl: winningCampaign.logoUrl,
      sponsoredLabel: 'Sponsored Opportunity',
      matchReason: auctionResult.winner.relevanceDetails,
    };

    // Record pending impression
    const pendingImpression: Impression = {
      impressionId,
      campaignId: winningCampaign.id,
      developerId: profile.id,
      sessionId: activeSessionId,
      agentType,
      startedAt: new Date().toISOString(),
      durationSeconds: 0,
      status: 'pending',
      advertiserCost: 0,
      platformShare: 0,
      developerReward: 0,
      currency: profile.rewardPreference || 'INR',
      createdAt: new Date().toISOString(),
    };
    dbStore.saveImpression(pendingImpression);

    return NextResponse.json({
      success: true,
      opportunity,
      impressionId,
      sessionId: activeSessionId,
      auction: {
        winningBid: winningCampaign.bidCpm,
        relevanceScore: auctionResult.winner.relevanceScore,
        totalScore: auctionResult.winner.totalScore,
        allScores: auctionResult.allScores,
      },
    });
  } catch (error) {
    console.error('[API /auction error]:', error);
    return NextResponse.json(
      { success: false, error: 'Auction failed' },
      { status: 500 }
    );
  }
}
