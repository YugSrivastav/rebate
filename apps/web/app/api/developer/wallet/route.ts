import { NextRequest, NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const developerId = searchParams.get('developerId') || 'dev_alex_india';

  const wallet = dbStore.getWallet(developerId);
  const rewards = dbStore.getRewardsByDeveloper(developerId);
  const impressions = dbStore.getRecentImpressionsByDeveloper(developerId, 15);

  return NextResponse.json({
    success: true,
    wallet,
    rewards,
    impressions,
  });
}
