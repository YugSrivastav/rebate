import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/db/seed';

export async function POST() {
  try {
    seedDatabase();
    return NextResponse.json({ success: true, message: 'Database reset to default seed state' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Reset failed' }, { status: 500 });
  }
}
