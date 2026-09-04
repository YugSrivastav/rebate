/**
 * Reward Engine for Rebate
 * Calculates dynamic platform fee vs developer reward based on configurable policy.
 * Provides multi-currency reward conversion.
 */

import {
  RewardPolicyConfig,
  RewardCurrency,
  REWARD_POLICY,
} from '@rebate/shared';

export interface CalculatedReward {
  advertiserCost: number;
  platformShare: number;
  developerReward: number;
  developerCurrency: RewardCurrency;
  convertedAmount: number;
}

// Configurable exchange rates relative to INR (base demo currency)
export const CURRENCY_CONVERSION_RATES: Record<RewardCurrency, number> = {
  INR: 1.0,
  USD: 0.012,
  AI_CREDITS: 2.0,
  CLOUD_CREDITS: 1.5,
  API_CREDITS: 1.5,
};

export function calculateImpressionReward(
  bidCpm: number,
  targetCurrency: RewardCurrency = 'INR',
  customPolicy?: { developerShare: number; platformShare: number }
): CalculatedReward {
  const policy = customPolicy || REWARD_POLICY;

  // Base cost per verified impression in INR
  // (e.g., ₹7 CPM = ₹7 / 1000 = ₹0.007 per single view)
  // For prototype demonstration, we multiply or scale so users see meaningful values:
  // e.g. ₹7 CPM bid produces ₹0.007, or in demo display mode we track exact numbers.
  // In our demo: ₹7 CPM bid = ₹0.007, or if bid is per-1000, 1000 impressions = ₹7.
  // Wait! In the prompt Section 22 Demo Mode:
  // "AI Internship wins. Developer clicks... + ₹4.90. Advertiser dashboard shows: 1 verified impression, ₹7 campaign spend, ₹4.90 developer reward, ₹2.10 platform share."
  // Look at that explicit example in Section 22:
  // "Advertiser dashboard shows: 1 verified impression, ₹7 campaign spend, ₹4.90 developer reward, ₹2.10 platform share."
  // That means in the hackathon prototype, each verified wait-state unit corresponds directly to the bid amount (e.g. ₹7.00 per verified engagement unit/demo CPM unit)!
  // 70% of 7.00 = 4.90, 30% of 7.00 = 2.10!
  // This matches Section 22 exactly!
  const baseCost = Number(bidCpm.toFixed(2));
  const developerRewardInBase = Number(
    (baseCost * policy.developerShare).toFixed(2)
  );
  const platformShareInBase = Number(
    (baseCost * policy.platformShare).toFixed(2)
  );

  const rate = CURRENCY_CONVERSION_RATES[targetCurrency] || 1.0;
  const convertedAmount = Number(
    (developerRewardInBase * rate).toFixed(2)
  );

  return {
    advertiserCost: baseCost,
    platformShare: platformShareInBase,
    developerReward: developerRewardInBase,
    developerCurrency: targetCurrency,
    convertedAmount,
  };
}

export function formatCurrency(amount: number, currency: RewardCurrency): string {
  switch (currency) {
    case 'INR':
      return `₹${amount.toFixed(2)}`;
    case 'USD':
      return `$${amount.toFixed(2)}`;
    case 'AI_CREDITS':
      return `${amount.toFixed(0)} ⚡`;
    case 'CLOUD_CREDITS':
      return `${amount.toFixed(0)} ☁️`;
    case 'API_CREDITS':
      return `${amount.toFixed(0)} 🪙`;
    default:
      return `${amount.toFixed(2)} ${currency}`;
  }
}
