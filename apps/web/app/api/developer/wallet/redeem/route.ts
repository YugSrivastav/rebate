import { NextRequest, NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';
import { RewardCurrency } from '@rebate/shared';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { developerId, amount, currency, redemptionType, destination } = body;

    if (!developerId || !amount || amount <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid redemption parameters' }, { status: 400 });
    }

    const cur = (currency || 'INR') as RewardCurrency;
    const wallet = dbStore.getWallet(developerId);
    const balance = wallet.balances[cur] || 0;

    if (balance < amount) {
      return NextResponse.json(
        { success: false, error: `Insufficient balance. Available: ${balance.toFixed(2)} ${cur}` },
        { status: 400 }
      );
    }

    // Debit the wallet
    dbStore.debitWallet(developerId, amount, cur);

    // Generate simulated reference / voucher code
    const txnId = `TXN_${Date.now().toString().slice(-6)}`;
    let voucherCode: string | undefined;

    if (redemptionType === 'api_credit') {
      voucherCode = `REBATE-ANTHROPIC-${Math.floor(1000 + Math.random() * 9000)}-CREDIT`;
    } else if (redemptionType === 'cloud_credit') {
      voucherCode = `CLOUDX-H100-VOUCHER-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    return NextResponse.json({
      success: true,
      transactionId: txnId,
      redemptionType: redemptionType || 'upi_transfer',
      amountDebited: amount,
      currency: cur,
      destination: destination || 'Direct Transfer',
      voucherCode,
      message: voucherCode
        ? `Voucher code generated successfully! Redeemable instantly.`
        : `Payout of ${amount.toFixed(2)} ${cur} successfully initiated to ${destination || 'bank account'}.`,
      updatedWallet: dbStore.getWallet(developerId),
    });
  } catch (err) {
    console.error('[API /api/developer/wallet/redeem error]:', err);
    return NextResponse.json({ success: false, error: 'Redemption failed' }, { status: 500 });
  }
}
