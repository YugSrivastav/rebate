/**
 * Database Layer for Rebate
 * Typed, atomic file-backed relational data store.
 */

import fs from 'fs';
import path from 'path';
import {
  User,
  DeveloperProfile,
  Advertiser,
  Campaign,
  Opportunity,
  AgentSession,
  Impression,
  Click,
  Reward,
  Wallet,
  FraudFlag,
  RewardCurrency,
} from '@rebate/shared';

export interface DatabaseSchema {
  users: User[];
  developerProfiles: DeveloperProfile[];
  advertisers: Advertiser[];
  campaigns: Campaign[];
  opportunities: Opportunity[];
  agentSessions: AgentSession[];
  impressions: Impression[];
  clicks: Click[];
  rewards: Reward[];
  wallets: Record<string, Wallet>;
  fraudFlags: FraudFlag[];
}

function resolveDbPaths(): { dataDir: string; dbFile: string } {
  const candidates = [
    path.resolve(process.cwd(), 'data', 'rebate.db.json'),
    path.resolve(process.cwd(), '..', 'data', 'rebate.db.json'),
    path.resolve(process.cwd(), 'apps', 'web', 'data', 'rebate.db.json'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      return { dataDir: path.dirname(c), dbFile: c };
    }
  }
  return {
    dataDir: path.resolve(process.cwd(), 'data'),
    dbFile: path.resolve(process.cwd(), 'data', 'rebate.db.json'),
  };
}

const { dataDir: DATA_DIR, dbFile: DB_FILE } = resolveDbPaths();

class DataStore {
  private data: DatabaseSchema | null = null;
  private initialized = false;

  private getDefaultData(): DatabaseSchema {
    return {
      users: [],
      developerProfiles: [],
      advertisers: [],
      campaigns: [],
      opportunities: [],
      agentSessions: [],
      impressions: [],
      clicks: [],
      rewards: [],
      wallets: {},
      fraudFlags: [],
    };
  }

  public init(initialData?: DatabaseSchema): void {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (initialData) {
      this.data = initialData;
      this.save();
      this.initialized = true;
      return;
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error('[DataStore] Failed to parse DB file, resetting default:', err);
        this.data = this.getDefaultData();
      }
    } else {
      this.data = this.getDefaultData();
    }
    this.initialized = true;
  }

  private ensureLoaded(): DatabaseSchema {
    if (!this.initialized || !this.data) {
      this.init();
    }
    return this.data!;
  }

  public save(): void {
    if (!this.data) return;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempFile, JSON.stringify(this.data, null, 2), 'utf-8');
      try {
        fs.renameSync(tempFile, DB_FILE);
      } catch {
        fs.copyFileSync(tempFile, DB_FILE);
        try { fs.unlinkSync(tempFile); } catch {}
      }
    } catch (err) {
      // In serverless environments (e.g. Vercel), file system may be read-only.
      // Data remains in-memory for the lifetime of the container instance.
      console.warn('[DataStore] Filesystem write bypassed in read-only environment:', err);
    }
  }

  public resetTo(data: DatabaseSchema): void {
    this.data = data;
    this.save();
  }

  // --- Users & Profiles ---
  public getUsers(): User[] {
    return this.ensureLoaded().users;
  }

  public saveUser(user: User): User {
    const db = this.ensureLoaded();
    const idx = db.users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      db.users[idx] = user;
    } else {
      db.users.push(user);
    }
    this.save();
    return user;
  }

  public getProfiles(): DeveloperProfile[] {
    return this.ensureLoaded().developerProfiles;
  }

  public getProfileById(id: string): DeveloperProfile | undefined {
    return this.getProfiles().find((p) => p.id === id || p.userId === id);
  }

  public saveProfile(profile: DeveloperProfile): DeveloperProfile {
    const db = this.ensureLoaded();
    const idx = db.developerProfiles.findIndex((p) => p.id === profile.id);
    if (idx >= 0) {
      db.developerProfiles[idx] = { ...profile, updatedAt: new Date().toISOString() };
    } else {
      db.developerProfiles.push(profile);
    }
    this.save();
    return profile;
  }

  // --- Advertisers ---
  public getAdvertisers(): Advertiser[] {
    return this.ensureLoaded().advertisers;
  }

  public getAdvertiserById(id: string): Advertiser | undefined {
    return this.getAdvertisers().find((a) => a.id === id || a.userId === id);
  }

  public saveAdvertiser(advertiser: Advertiser): Advertiser {
    const db = this.ensureLoaded();
    const idx = db.advertisers.findIndex((a) => a.id === advertiser.id);
    if (idx >= 0) {
      db.advertisers[idx] = advertiser;
    } else {
      db.advertisers.push(advertiser);
    }
    this.save();
    return advertiser;
  }

  public topUpAdvertiserBalance(advertiserId: string, amount: number): Advertiser | undefined {
    const adv = this.getAdvertiserById(advertiserId);
    if (!adv) return undefined;
    adv.demoBalance = (adv.demoBalance || 0) + amount;
    this.saveAdvertiser(adv);
    return adv;
  }

  // --- Campaigns ---
  public getCampaigns(): Campaign[] {
    return this.ensureLoaded().campaigns;
  }

  public getActiveCampaigns(): Campaign[] {
    return this.getCampaigns().filter(
      (c) => c.status === 'active' && c.remainingBudget > (c.bidCpm / 1000)
    );
  }

  public getCampaignById(id: string): Campaign | undefined {
    return this.getCampaigns().find((c) => c.id === id);
  }

  public saveCampaign(campaign: Campaign): Campaign {
    const db = this.ensureLoaded();
    const idx = db.campaigns.findIndex((c) => c.id === campaign.id);
    if (idx >= 0) {
      db.campaigns[idx] = { ...campaign, updatedAt: new Date().toISOString() };
    } else {
      db.campaigns.push(campaign);
    }
    this.save();
    return campaign;
  }

  // --- Opportunities ---
  public getOpportunities(): Opportunity[] {
    return this.ensureLoaded().opportunities;
  }

  public getOpportunityById(id: string): Opportunity | undefined {
    return this.getOpportunities().find((o) => o.id === id);
  }

  public getOpportunityByCampaignId(campaignId: string): Opportunity | undefined {
    return this.getOpportunities().find((o) => o.campaignId === campaignId);
  }

  public saveOpportunity(opp: Opportunity): Opportunity {
    const db = this.ensureLoaded();
    const idx = db.opportunities.findIndex((o) => o.id === opp.id);
    if (idx >= 0) {
      db.opportunities[idx] = opp;
    } else {
      db.opportunities.push(opp);
    }
    this.save();
    return opp;
  }

  // --- Sessions ---
  public getSessions(): AgentSession[] {
    return this.ensureLoaded().agentSessions;
  }

  public getSessionById(sessionId: string): AgentSession | undefined {
    return this.getSessions().find((s) => s.sessionId === sessionId);
  }

  public saveSession(session: AgentSession): AgentSession {
    const db = this.ensureLoaded();
    const idx = db.agentSessions.findIndex((s) => s.sessionId === session.sessionId);
    if (idx >= 0) {
      db.agentSessions[idx] = session;
    } else {
      db.agentSessions.push(session);
    }
    this.save();
    return session;
  }

  // --- Impressions ---
  public getImpressions(): Impression[] {
    return this.ensureLoaded().impressions;
  }

  public getImpressionById(impressionId: string): Impression | undefined {
    return this.getImpressions().find((i) => i.impressionId === impressionId);
  }

  public saveImpression(impression: Impression): Impression {
    const db = this.ensureLoaded();
    const idx = db.impressions.findIndex((i) => i.impressionId === impression.impressionId);
    if (idx >= 0) {
      db.impressions[idx] = impression;
    } else {
      db.impressions.push(impression);
    }
    this.save();
    return impression;
  }

  public getRecentImpressionsByDeveloper(developerId: string, limit = 20): Impression[] {
    return this.getImpressions()
      .filter((i) => i.developerId === developerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  // --- Clicks ---
  public getClicks(): Click[] {
    return this.ensureLoaded().clicks;
  }

  public recordClick(click: Click): Click {
    const db = this.ensureLoaded();
    db.clicks.push(click);
    this.save();
    return click;
  }

  // --- Rewards ---
  public getRewards(): Reward[] {
    return this.ensureLoaded().rewards;
  }

  public getRewardsByDeveloper(developerId: string): Reward[] {
    return this.getRewards()
      .filter((r) => r.developerId === developerId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public recordReward(reward: Reward): Reward {
    const db = this.ensureLoaded();
    db.rewards.push(reward);
    this.save();
    return reward;
  }

  // --- Wallets ---
  public getWallet(developerId: string): Wallet {
    const db = this.ensureLoaded();
    if (!db.wallets[developerId]) {
      db.wallets[developerId] = {
        developerId,
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
      this.save();
    }
    return db.wallets[developerId];
  }

  public creditWallet(developerId: string, amount: number, currency: RewardCurrency): Wallet {
    const wallet = this.getWallet(developerId);
    wallet.balances[currency] = (wallet.balances[currency] || 0) + amount;
    wallet.totalEarned[currency] = (wallet.totalEarned[currency] || 0) + amount;
    wallet.updatedAt = new Date().toISOString();
    this.ensureLoaded().wallets[developerId] = wallet;
    this.save();
    return wallet;
  }

  public saveWallet(wallet: Wallet): Wallet {
    const db = this.ensureLoaded();
    db.wallets[wallet.developerId] = wallet;
    this.save();
    return wallet;
  }

  public debitWallet(developerId: string, amount: number, currency: RewardCurrency): Wallet {
    const wallet = this.getWallet(developerId);
    wallet.balances[currency] = Math.max(0, (wallet.balances[currency] || 0) - amount);
    wallet.updatedAt = new Date().toISOString();
    this.ensureLoaded().wallets[developerId] = wallet;
    this.save();
    return wallet;
  }

  // --- Fraud Flags ---
  public getFraudFlags(): FraudFlag[] {
    return this.ensureLoaded().fraudFlags;
  }

  public recordFraudFlag(flag: FraudFlag): FraudFlag {
    const db = this.ensureLoaded();
    db.fraudFlags.push(flag);
    this.save();
    return flag;
  }
}

export const dbStore = new DataStore();
