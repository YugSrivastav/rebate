import { NextRequest, NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';
import { Campaign } from '@rebate/shared';

export async function GET() {
  const campaigns = dbStore.getCampaigns();
  const advertisers = dbStore.getAdvertisers();

  const totalImpressions = campaigns.reduce((acc, c) => acc + c.impressionsCount, 0);
  const totalVerified = campaigns.reduce((acc, c) => acc + c.verifiedImpressionsCount, 0);
  const totalClicks = campaigns.reduce((acc, c) => acc + c.clicksCount, 0);
  const totalSpend = campaigns.reduce((acc, c) => acc + c.totalSpend, 0);

  return NextResponse.json({
    success: true,
    campaigns,
    advertisers,
    analytics: {
      totalImpressions,
      totalVerified,
      totalClicks,
      totalSpend: Number(totalSpend.toFixed(2)),
      overallCtr: totalImpressions > 0 ? Number(((totalClicks / totalImpressions) * 100).toFixed(1)) : 0,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body.id || `camp_${Date.now()}`;

    const newCampaign: Campaign = {
      id,
      advertiserId: body.advertiserId || 'adv_example_ai',
      companyName: body.companyName || 'Sponsor Tech',
      title: body.title,
      opportunityType: body.opportunityType || 'job',
      description: body.description,
      requirements: body.requirements || [],
      skills: body.skills || [],
      destinationUrl: body.destinationUrl,
      cta: body.cta || 'Learn more',
      logoUrl: body.logoUrl || '/logos/default.svg',
      target: {
        roles: body.target?.roles,
        fields: body.target?.fields,
        skills: body.target?.skills,
        education: body.target?.education,
        countries: body.target?.countries,
        states: body.target?.states,
        categories: body.target?.categories,
        allowUnspecifiedLocation: body.target?.allowUnspecifiedLocation ?? true,
      },
      budget: Number(body.budget || 5000),
      remainingBudget: Number(body.budget || 5000),
      bidCpm: Number(body.bidCpm || 6.00),
      campaignQuality: Number(body.campaignQuality || 1.0),
      billingModel: body.billingModel || 'cpm_impression',
      status: body.status || 'active',
      impressionsCount: 0,
      verifiedImpressionsCount: 0,
      clicksCount: 0,
      totalSpend: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dbStore.saveCampaign(newCampaign);

    // Also auto-create a corresponding opportunity entry for the directory
    dbStore.saveOpportunity({
      id: `opp_${newCampaign.id}`,
      campaignId: newCampaign.id,
      title: newCampaign.title,
      company: newCampaign.companyName,
      opportunityType: newCampaign.opportunityType,
      location: newCampaign.target.countries?.join(', ') || 'Global / Remote',
      description: newCampaign.description,
      requirements: newCampaign.requirements,
      skills: newCampaign.skills,
      destinationUrl: newCampaign.destinationUrl,
      cta: newCampaign.cta,
      logoUrl: newCampaign.logoUrl,
      sponsoredLabel: 'Sponsored Opportunity',
    });

    return NextResponse.json({ success: true, campaign: newCampaign });
  } catch (error) {
    console.error('[API /advertiser/campaigns POST error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, budget, bidCpm } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    const campaign = dbStore.getCampaignById(id);
    if (!campaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      );
    }

    if (status) campaign.status = status;
    if (budget !== undefined) campaign.budget = Number(budget);
    if (bidCpm !== undefined) campaign.bidCpm = Number(bidCpm);
    campaign.updatedAt = new Date().toISOString();

    dbStore.saveCampaign(campaign);

    return NextResponse.json({ success: true, campaign });
  } catch (error) {
    console.error('[API /advertiser/campaigns PATCH error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update campaign' },
      { status: 500 }
    );
  }
}

