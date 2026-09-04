import { NextRequest, NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';
import { User, DeveloperProfile, Advertiser, Wallet } from '@rebate/shared';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, name, role, developerProfile, advertiserProfile } = body;

    if (action === 'login' || action === 'demo_login') {
      const users = dbStore.getUsers();
      const user = users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());

      if (user) {
        let profileId: string | undefined;
        let companyName: string | undefined;

        if (user.role === 'developer') {
          const prof = dbStore.getProfiles().find((p) => p.userId === user.id || p.id === user.id);
          profileId = prof?.id || 'dev_alex_india';
        } else {
          const adv = dbStore.getAdvertisers().find((a) => a.userId === user.id || a.id === user.id);
          companyName = adv?.companyName || 'Example AI Research';
        }

        return NextResponse.json({
          success: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileId,
            companyName,
          },
        });
      }

      // If email doesn't match exact seeded record, return a clean demo response
      const fallbackRole = role || 'developer';
      return NextResponse.json({
        success: true,
        user: {
          id: `usr_${Date.now()}`,
          name: name || (fallbackRole === 'advertiser' ? 'Elena Rostova' : 'Priya Sharma'),
          email: email || (fallbackRole === 'advertiser' ? 'sponsor@example-ai.dev' : 'priya.sharma@tech.in'),
          role: fallbackRole,
          profileId: fallbackRole === 'developer' ? 'dev_alex_india' : undefined,
          companyName: fallbackRole === 'advertiser' ? 'Example AI Research' : undefined,
        },
      });
    }

    if (action === 'signup') {
      const userId = `usr_${Date.now()}`;
      const userRole = role || 'developer';

      const newUser: User = {
        id: userId,
        email: email || `${userId}@rebate.dev`,
        name: name || 'Developer',
        role: userRole,
        createdAt: new Date().toISOString(),
      };

      dbStore.saveUser(newUser);

      if (userRole === 'developer') {
        const profileId = `dev_${Date.now()}`;
        const newProfile: DeveloperProfile = {
          id: profileId,
          userId,
          name: newUser.name,
          email: newUser.email,
          role: developerProfile?.role || 'Developer',
          field: developerProfile?.field || 'AI/ML',
          skills: developerProfile?.skills || ['Python', 'TypeScript'],
          education: developerProfile?.education || 'Student',
          location: developerProfile?.location,
          rewardPreference: developerProfile?.rewardPreference || 'INR',
          preferredCategories: ['internship', 'job', 'cloud_credits'],
          connectedAgents: ['antigravity', 'claude_code'],
          accountStatus: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        dbStore.saveProfile(newProfile);

        // Initialize empty multi-currency wallet
        const newWallet: Wallet = {
          developerId: profileId,
          balances: {
            INR: 0,
            USD: 0,
            AI_CREDITS: 0,
            CLOUD_CREDITS: 0,
            API_CREDITS: 0,
          },
          totalEarned: {
            INR: 0,
            USD: 0,
            AI_CREDITS: 0,
            CLOUD_CREDITS: 0,
            API_CREDITS: 0,
          },
          updatedAt: new Date().toISOString(),
        };
        dbStore.saveWallet(newWallet);

        return NextResponse.json({
          success: true,
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            profileId,
          },
        });
      } else {
        // Advertiser
        const advId = `adv_${Date.now()}`;
        const newAdv: Advertiser = {
          id: advId,
          userId,
          companyName: advertiserProfile?.companyName || 'Sponsor Tech',
          website: advertiserProfile?.website || 'https://example.com',
          verified: true,
          demoBalance: Number(advertiserProfile?.budget || 10000),
          totalSpent: 0,
          createdAt: new Date().toISOString(),
        };
        dbStore.saveAdvertiser(newAdv);

        return NextResponse.json({
          success: true,
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            companyName: newAdv.companyName,
          },
        });
      }
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    console.error('[API /api/auth POST error]:', err);
    return NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 500 });
  }
}
