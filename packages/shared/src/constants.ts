/**
 * Shared Constants for Rebate
 */

import {
  DeveloperRole,
  DeveloperField,
  EducationStatus,
  OpportunityCategory,
  RewardCurrency,
  AgentType,
} from './types';

export const DEVELOPER_ROLES: DeveloperRole[] = [
  'Student',
  'Intern',
  'Developer',
  'Professional Engineer',
  'Freelancer',
  'Founder',
  'Researcher',
];

export const DEVELOPER_FIELDS: DeveloperField[] = [
  'AI/ML',
  'Web Development',
  'Mobile Development',
  'Cybersecurity',
  'Data',
  'Cloud/DevOps',
  'Embedded/IoT',
  'Blockchain/Web3',
  'Game Development',
  'Hardware',
  'Other',
];

export const COMMON_SKILLS: string[] = [
  'Python',
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'C',
  'C++',
  'Java',
  'Rust',
  'Go',
  'FastAPI',
  'Django',
  'PyTorch',
  'TensorFlow',
  'AWS',
  'Azure',
  'GCP',
  'Docker',
  'Kubernetes',
  'PostgreSQL',
  'MongoDB',
  'Redis',
  'GraphQL',
  'Solidity',
  'Swift',
  'Flutter',
];

export const EDUCATION_STATUSES: EducationStatus[] = [
  'Student',
  'Graduate',
  'Working professional',
  'Self-employed',
  'Founder',
  'Researcher',
];

export const OPPORTUNITY_CATEGORIES: { id: OpportunityCategory; label: string }[] = [
  { id: 'job', label: 'Jobs' },
  { id: 'internship', label: 'Internships' },
  { id: 'hackathon', label: 'Hackathons' },
  { id: 'dev_tool', label: 'Developer Tools' },
  { id: 'cloud_credits', label: 'Cloud Credits' },
  { id: 'api_credits', label: 'API Credits' },
  { id: 'grant', label: 'Builder Grants' },
];

export const REWARD_CURRENCIES: { id: RewardCurrency; label: string; symbol: string }[] = [
  { id: 'INR', label: 'Indian Rupee (Cash)', symbol: '₹' },
  { id: 'USD', label: 'US Dollar (Cash)', symbol: '$' },
  { id: 'AI_CREDITS', label: 'AI Compute Credits', symbol: '⚡' },
  { id: 'CLOUD_CREDITS', label: 'Cloud Infrastructure Credits', symbol: '☁️' },
  { id: 'API_CREDITS', label: 'API Token Credits', symbol: '🪙' },
];

export const REWARD_POLICY = {
  developerShare: 0.70,
  platformShare: 0.30,
};

export const FRAUD_RULES = {
  minimumViewSeconds: 8,
  maximumEarningPerHour: 150, // INR equivalent
  minimumIntervalBetweenRewardedImpressions: 15, // seconds cooldown
  maxSessionDailyHours: 18,
};

export const AGENT_REGISTRY: Record<AgentType, { name: string; description: string; status: 'active' | 'beta' | 'connected' }> = {
  claude_code: {
    name: 'Claude Code',
    description: 'Anthropic official agentic coding terminal',
    status: 'connected',
  },
  codex: {
    name: 'Codex CLI',
    description: 'OpenAI agentic assistant interface',
    status: 'connected',
  },
  opencode: {
    name: 'OpenCode',
    description: 'Open source agent framework for terminal coding',
    status: 'connected',
  },
  antigravity: {
    name: 'Antigravity',
    description: 'Google Advanced Agentic Coding environment',
    status: 'connected',
  },
  demo: {
    name: 'Rebate Demo Engine',
    description: 'Deterministic hackathon wait-state simulator',
    status: 'connected',
  },
};
