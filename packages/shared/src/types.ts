/**
 * Shared Type Definitions for Rebate
 * Unified contract across Web, CLI, Auction, Matching, and Reward Engines.
 */

export type RewardCurrency = 'INR' | 'USD' | 'AI_CREDITS' | 'CLOUD_CREDITS' | 'API_CREDITS';

export interface RewardPolicyConfig {
  developerShare: number;
  platformShare: number;
}

export type OpportunityCategory =
  | 'job'
  | 'internship'
  | 'hackathon'
  | 'dev_tool'
  | 'cloud_credits'
  | 'api_credits'
  | 'grant';

export type DeveloperRole =
  | 'Student'
  | 'Intern'
  | 'Developer'
  | 'Professional Engineer'
  | 'Freelancer'
  | 'Founder'
  | 'Researcher';

export type DeveloperField =
  | 'AI/ML'
  | 'Web Development'
  | 'Mobile Development'
  | 'Cybersecurity'
  | 'Data'
  | 'Cloud/DevOps'
  | 'Embedded/IoT'
  | 'Blockchain/Web3'
  | 'Game Development'
  | 'Hardware'
  | 'Other';

export type EducationStatus =
  | 'Student'
  | 'Graduate'
  | 'Working professional'
  | 'Self-employed'
  | 'Founder'
  | 'Researcher';

export type AgentType = 'claude_code' | 'codex' | 'opencode' | 'antigravity' | 'demo';

export type BillingModel = 'cpm_impression' | 'cpc_click';

export type CampaignStatus = 'active' | 'paused' | 'completed' | 'draft';

export interface DeveloperLocation {
  country?: string;
  state?: string;
  city?: string;
}

export type UserRole = 'developer' | 'advertiser' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface DeveloperProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: DeveloperRole;
  field: DeveloperField;
  skills: string[];
  education: EducationStatus;
  location?: DeveloperLocation;
  rewardPreference: RewardCurrency;
  preferredCategories: OpportunityCategory[];
  connectedAgents: AgentType[];
  accountStatus: 'active' | 'review_required' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface Advertiser {
  id: string;
  userId: string;
  companyName: string;
  website: string;
  logoUrl?: string;
  verified: boolean;
  demoBalance: number;
  totalSpent: number;
  createdAt: string;
}

export interface CampaignTarget {
  roles?: DeveloperRole[];
  fields?: DeveloperField[];
  skills?: string[];
  education?: EducationStatus[];
  countries?: string[];
  states?: string[];
  categories?: OpportunityCategory[];
  allowUnspecifiedLocation: boolean;
}

export interface Campaign {
  id: string;
  advertiserId: string;
  companyName: string;
  title: string;
  opportunityType: OpportunityCategory;
  description: string;
  requirements: string[];
  skills: string[];
  destinationUrl: string;
  cta: string;
  logoUrl?: string;
  target: CampaignTarget;
  budget: number;
  remainingBudget: number;
  bidCpm: number;
  campaignQuality: number;
  billingModel: BillingModel;
  status: CampaignStatus;
  impressionsCount: number;
  verifiedImpressionsCount: number;
  clicksCount: number;
  totalSpend: number;
  createdAt: string;
  updatedAt: string;
}

export interface OpportunityMatchReason {
  skills: string[];
  role?: string;
  field?: string;
  education?: string;
  location?: string;
}

export interface Opportunity {
  id: string;
  campaignId: string;
  title: string;
  company: string;
  opportunityType: OpportunityCategory;
  location: string;
  description: string;
  requirements: string[];
  skills: string[];
  destinationUrl: string;
  cta: string;
  logoUrl?: string;
  sponsoredLabel: string;
  matchReason?: OpportunityMatchReason;
}

export interface AgentSession {
  sessionId: string;
  developerId: string;
  agentType: AgentType;
  status: 'active' | 'waiting' | 'thinking' | 'idle' | 'closed';
  startedAt: string;
  lastHeartbeat: string;
  eventSequence: number;
}

export type ImpressionStatus = 'pending' | 'verified' | 'rejected';

export interface Impression {
  impressionId: string;
  campaignId: string;
  developerId: string;
  sessionId: string;
  agentType: AgentType;
  startedAt: string;
  endedAt?: string;
  durationSeconds: number;
  status: ImpressionStatus;
  rejectionReason?: string;
  advertiserCost: number;
  platformShare: number;
  developerReward: number;
  currency: RewardCurrency;
  createdAt: string;
}

export interface Click {
  clickId: string;
  impressionId: string;
  campaignId: string;
  developerId: string;
  destinationUrl: string;
  timestamp: string;
}

export interface Reward {
  id: string;
  developerId: string;
  amount: number;
  currency: RewardCurrency;
  source: string;
  campaignId: string;
  impressionId: string;
  status: 'settled' | 'pending' | 'cancelled';
  timestamp: string;
}

export interface Wallet {
  developerId: string;
  balances: Record<RewardCurrency, number>;
  totalEarned: Record<RewardCurrency, number>;
  updatedAt: string;
}

export interface FraudFlag {
  id: string;
  developerId?: string;
  sessionId?: string;
  flagType:
    | 'hourly_cap_exceeded'
    | 'cooldown_violation'
    | 'invalid_session'
    | 'replay_detected'
    | 'impossible_velocity'
    | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high';
  details: string;
  timestamp: string;
}

export interface AuctionCandidate {
  campaign: Campaign;
  relevanceScore: number;
  relevanceDetails: OpportunityMatchReason;
  effectiveBid: number;
  totalScore: number;
}

export interface AuctionResult {
  winner: AuctionCandidate | null;
  allScores: Array<{
    campaignId: string;
    title: string;
    bid: number;
    relevance: number;
    quality: number;
    totalScore: number;
  }>;
}

export interface OpportunityRequest {
  developerId: string;
  sessionId: string;
  agentType: AgentType;
  timestamp?: string;
}

export interface OpportunityResponse {
  success: boolean;
  opportunity: Opportunity | null;
  impressionId?: string;
  token?: string;
  reason?: string;
}

export interface ImpressionVerifyRequest {
  impressionId: string;
  developerId: string;
  sessionId: string;
  agentType: AgentType;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  token?: string;
}

export interface ImpressionVerifyResponse {
  success: boolean;
  verified: boolean;
  developerReward?: number;
  currency?: RewardCurrency;
  reason?: string;
}
