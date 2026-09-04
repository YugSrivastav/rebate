/**
 * Auction Engine for Rebate
 * Calculates: rank = bid * relevance * campaign_quality
 * Highest valid score wins.
 */

import {
  DeveloperProfile,
  Campaign,
  AuctionResult,
  AuctionCandidate,
} from '@rebate/shared';
import { evaluateCampaignMatch } from '../matching/matching';

export function runAuction(
  profile: DeveloperProfile,
  campaigns: Campaign[]
): AuctionResult {
  const eligibleCandidates: AuctionCandidate[] = [];
  const allScores: AuctionResult['allScores'] = [];
  const evaluations: NonNullable<AuctionResult['evaluations']> = [];

  for (const campaign of campaigns) {
    // 1. Status check
    if (campaign.status !== 'active') {
      evaluations.push({
        campaignId: campaign.id,
        companyName: campaign.companyName,
        title: campaign.title,
        bid: campaign.bidCpm,
        qualified: false,
        relevance: 0,
        quality: campaign.campaignQuality || 1.0,
        totalScore: 0,
        rejectionReason: 'Campaign is currently paused or inactive',
      });
      continue;
    }

    // 2. Budget check: campaign must have budget left for at least one CPM unit
    const costPerImpression = campaign.bidCpm / 1000;
    if (campaign.remainingBudget < costPerImpression) {
      evaluations.push({
        campaignId: campaign.id,
        companyName: campaign.companyName,
        title: campaign.title,
        bid: campaign.bidCpm,
        qualified: false,
        relevance: 0,
        quality: campaign.campaignQuality || 1.0,
        totalScore: 0,
        rejectionReason: 'Campaign budget depleted',
      });
      continue;
    }

    // 3. Matching & Relevance
    const match = evaluateCampaignMatch(profile, campaign);
    if (!match.isMatch) {
      evaluations.push({
        campaignId: campaign.id,
        companyName: campaign.companyName,
        title: campaign.title,
        bid: campaign.bidCpm,
        qualified: false,
        relevance: match.relevanceScore,
        quality: campaign.campaignQuality || 1.0,
        totalScore: 0,
        rejectionReason: match.rejectionReason || 'Targeting criteria mismatch',
      });
      continue;
    }

    // 4. Quality multiplier
    const quality = campaign.campaignQuality || 1.0;

    // 5. Total Rank: bid * relevance * quality
    const totalScore = Number(
      (campaign.bidCpm * match.relevanceScore * quality).toFixed(3)
    );

    allScores.push({
      campaignId: campaign.id,
      title: campaign.title,
      bid: campaign.bidCpm,
      relevance: match.relevanceScore,
      quality,
      totalScore,
    });

    evaluations.push({
      campaignId: campaign.id,
      companyName: campaign.companyName,
      title: campaign.title,
      bid: campaign.bidCpm,
      qualified: true,
      relevance: match.relevanceScore,
      quality,
      totalScore,
    });

    eligibleCandidates.push({
      campaign,
      relevanceScore: match.relevanceScore,
      relevanceDetails: match.reason,
      effectiveBid: campaign.bidCpm,
      totalScore,
    });
  }

  // Sort descending by totalScore (highest score wins)
  eligibleCandidates.sort((a, b) => b.totalScore - a.totalScore);
  allScores.sort((a, b) => b.totalScore - a.totalScore);
  evaluations.sort((a, b) => {
    if (a.qualified && !b.qualified) return -1;
    if (!a.qualified && b.qualified) return 1;
    return b.totalScore - a.totalScore;
  });

  return {
    winner: eligibleCandidates.length > 0 ? eligibleCandidates[0] : null,
    allScores,
    evaluations,
  };
}
