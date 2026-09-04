import { NextRequest, NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const opp = dbStore.getOpportunityById(id) || dbStore.getOpportunityByCampaignId(id);

  if (!opp) {
    return NextResponse.json(
      { success: false, error: 'Opportunity not found' },
      { status: 404 }
    );
  }

  const campaign = dbStore.getCampaignById(opp.campaignId);

  return NextResponse.json({
    success: true,
    opportunity: opp,
    campaign,
  });
}
