import { NextRequest, NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';
import { DeveloperProfile } from '@rebate/shared';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id') || 'dev_alex_india';

  const profile = dbStore.getProfileById(id);
  if (!profile) {
    return NextResponse.json(
      { success: false, error: 'Profile not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, profile });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const existingId = body.id || 'dev_alex_india';
    const existing = dbStore.getProfileById(existingId);

    const updatedProfile: DeveloperProfile = {
      id: existingId,
      userId: existing?.userId || 'usr_dev_1',
      name: body.name || existing?.name || 'Developer',
      email: body.email || existing?.email || 'dev@example.com',
      role: body.role || existing?.role || 'Developer',
      field: body.field || existing?.field || 'AI/ML',
      skills: body.skills || existing?.skills || ['Python', 'TypeScript'],
      education: body.education || existing?.education || 'Student',
      location: body.location !== undefined ? body.location : existing?.location,
      rewardPreference: body.rewardPreference || existing?.rewardPreference || 'INR',
      preferredCategories: body.preferredCategories || existing?.preferredCategories || ['internship', 'cloud_credits'],
      connectedAgents: body.connectedAgents || existing?.connectedAgents || ['antigravity', 'demo'],
      accountStatus: existing?.accountStatus || 'active',
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dbStore.saveProfile(updatedProfile);
    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error('[API /developer/profile error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
