import { NextRequest, NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';
import { Click } from '@rebate/shared';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { impressionId, campaignId, developerId, destinationUrl } = body;

    const click: Click = {
      clickId: `clk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      impressionId: impressionId || 'direct',
      campaignId,
      developerId: developerId || 'dev_alex_india',
      destinationUrl,
      timestamp: new Date().toISOString(),
    };
    dbStore.recordClick(click);

    if (campaignId) {
      const campaign = dbStore.getCampaignById(campaignId);
      if (campaign) {
        campaign.clicksCount += 1;
        dbStore.saveCampaign(campaign);
      }
    }

    return NextResponse.json({ success: true, clickId: click.clickId });
  } catch (error) {
    console.error('[API /ledger/click error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record click' },
      { status: 500 }
    );
  }
}
