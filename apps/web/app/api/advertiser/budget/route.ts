import { NextRequest, NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { advertiserId, amount } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid top-up amount' }, { status: 400 });
    }

    const targetId = advertiserId || 'adv_example_ai';
    const updated = dbStore.topUpAdvertiserBalance(targetId, Number(amount));

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Advertiser not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully added ₹${Number(amount).toLocaleString()} to demo balance.`,
      advertiser: updated,
    });
  } catch (err) {
    console.error('[API /api/advertiser/budget error]:', err);
    return NextResponse.json({ success: false, error: 'Failed to update budget' }, { status: 500 });
  }
}
