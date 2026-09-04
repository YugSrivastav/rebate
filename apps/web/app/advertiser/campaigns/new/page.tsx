'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  OPPORTUNITY_CATEGORIES,
  DEVELOPER_ROLES,
  DEVELOPER_FIELDS,
  COMMON_SKILLS,
  EDUCATION_STATUSES,
  OpportunityCategory,
  DeveloperRole,
  DeveloperField,
  EducationStatus,
  BillingModel,
} from '@rebate/shared';
import { Sparkles, ArrowLeft, Check, Plus, DollarSign, Image as ImageIcon, Lock, ArrowRight, Megaphone } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';

const LOGO_PRESETS = [
  { label: '⚡ Example AI', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=60' },
  { label: '☁️ CloudX', url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=128&auto=format&fit=crop&q=60' },
  { label: '🚀 CodeBuild', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=128&auto=format&fit=crop&q=60' },
  { label: '🛠 DevScale', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=128&auto=format&fit=crop&q=60' },
];

export default function NewCampaignPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, demoLogin } = useAuth();

  // Opportunity Details
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [opportunityType, setOpportunityType] = useState<OpportunityCategory>('internship');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [cta, setCta] = useState('Apply now');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState<string>('Proficiency in Python and distributed systems.');
  const [logoUrl, setLogoUrl] = useState(LOGO_PRESETS[0].url);
  const [customLogoUrl, setCustomLogoUrl] = useState('');

  // Targeting Criteria
  const [targetSkills, setTargetSkills] = useState<string[]>(['Python', 'FastAPI']);
  const [targetRole, setTargetRole] = useState<DeveloperRole>('Student');
  const [targetField, setTargetField] = useState<DeveloperField>('AI/ML');
  const [targetEducation, setTargetEducation] = useState<EducationStatus>('Student');
  const [targetCountry, setTargetCountry] = useState('India');
  const [targetState, setTargetState] = useState('');
  const [allowUnspecified, setAllowUnspecified] = useState(false);

  // Budget, Bidding & Billing Model
  const [bidCpm, setBidCpm] = useState(7.00);
  const [budget, setBudget] = useState(5000);
  const [billingModel, setBillingModel] = useState<BillingModel>('cpm_impression');
  const [submitting, setSubmitting] = useState(false);

  const toggleSkill = (s: string) => {
    if (targetSkills.includes(s)) {
      setTargetSkills(targetSkills.filter((item) => item !== s));
    } else {
      setTargetSkills([...targetSkills, s]);
    }
  };

  const handleApplyPreset = (type: string) => {
    if (type === 'ai_intern') {
      setTitle('AI Engineering Summer Internship 2026');
      setCompanyName('Example AI Research');
      setOpportunityType('internship');
      setDestinationUrl('https://example-ai.dev/careers/internships');
      setCta('Apply now');
      setDescription('Join our core foundation model research team. Work on agentic tool calling and sparse attention mechanisms.');
      setTargetSkills(['Python', 'FastAPI', 'PyTorch', 'Machine Learning']);
      setTargetRole('Student');
      setTargetField('AI/ML');
      setTargetEducation('Student');
      setTargetCountry('India');
      setBidCpm(8.00);
      setBudget(5000);
    } else if (type === 'cloud_credits') {
      setTitle('$500 GPU Cloud Credits for AI Builders');
      setCompanyName('CloudX Infrastructure');
      setOpportunityType('cloud_credits');
      setDestinationUrl('https://cloudx.io/credits/builders');
      setCta('Claim Credits');
      setDescription('Get instant H100 and A100 GPU compute credits to train and deploy your custom agents and models.');
      setTargetSkills(['Python', 'Docker', 'Kubernetes', 'PyTorch']);
      setTargetRole('Developer');
      setTargetField('Cloud/DevOps');
      setTargetCountry('');
      setAllowUnspecified(true);
      setBidCpm(6.50);
      setBudget(7500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !companyName || !destinationUrl) {
      alert('Please fill out all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const finalLogo = customLogoUrl.trim() ? customLogoUrl.trim() : logoUrl;
      const payload = {
        title,
        companyName,
        opportunityType,
        destinationUrl,
        cta,
        description,
        requirements: requirements.split('\n').filter(Boolean),
        skills: targetSkills,
        logoUrl: finalLogo,
        target: {
          roles: [targetRole],
          fields: [targetField],
          skills: targetSkills,
          education: [targetEducation],
          countries: targetCountry ? [targetCountry] : [],
          states: targetState ? [targetState] : [],
          allowUnspecifiedLocation: allowUnspecified,
        },
        bidCpm: Number(bidCpm),
        budget: Number(budget),
        billingModel,
      };

      const res = await fetch('/api/advertiser/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/advertiser');
      } else {
        alert('Failed to launch campaign');
      }
    } catch (err) {
      console.error('Error creating campaign:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center font-mono text-xs text-zinc-500">
        <span className="animate-spin text-emerald-400 mr-2">⠋</span> Checking advertiser credentials...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 mb-4">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">Advertiser Login Required</h2>
          <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
            Please sign in to your advertiser account to create and configure opportunity campaigns.
          </p>

          <div className="mt-6 space-y-2.5">
            <Link
              href="/login?redirect=/advertiser/campaigns/new"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 py-2.5 text-xs font-semibold text-black hover:bg-emerald-400 transition"
            >
              <span>Sign In to Advertiser Account</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => demoLogin('advertiser')}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 py-2.5 text-xs font-medium text-zinc-300 hover:text-white hover:border-zinc-700 transition font-mono"
            >
              <Megaphone className="h-3.5 w-3.5 text-cyan-400" />
              <span>1-Click Demo Login (Elena Rostova)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Link
          href="/advertiser"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Advertiser Portal
        </Link>
      </div>

      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create Opportunity Campaign</h1>
          <p className="mt-1 text-xs text-zinc-400">
            Define targeting parameters to match developers in AI waiting windows. Zero code reading.
          </p>
        </div>

        {/* Quick Demo Presets */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleApplyPreset('ai_intern')}
            className="rounded bg-zinc-800/80 px-2.5 py-1 text-xs font-mono text-emerald-400 hover:bg-zinc-800 transition"
          >
            + Preset: AI Intern
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('cloud_credits')}
            className="rounded bg-zinc-800/80 px-2.5 py-1 text-xs font-mono text-cyan-400 hover:bg-zinc-800 transition"
          >
            + Preset: Cloud
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Opportunity Details */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 shadow-xl">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span>1. Opportunity Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Company / Organization *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Example AI Labs"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Opportunity Type *</label>
              <select
                value={opportunityType}
                onChange={(e) => setOpportunityType(e.target.value as OpportunityCategory)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                {OPPORTUNITY_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-zinc-300 mb-1">Campaign Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AI Engineering Internship — Summer 2026"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Destination URL *</label>
              <input
                type="url"
                required
                value={destinationUrl}
                onChange={(e) => setDestinationUrl(e.target.value)}
                placeholder="https://company.com/apply"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Call To Action (CTA)</label>
              <input
                type="text"
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                placeholder="e.g. Apply now, Claim credits, Register"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-zinc-300 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the opportunity and what developers will work on..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-zinc-300 mb-1">Company Logo</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {LOGO_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setLogoUrl(preset.url);
                    setCustomLogoUrl('');
                  }}
                  className={`rounded-lg px-2.5 py-1 text-xs transition border ${
                    logoUrl === preset.url && !customLogoUrl
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={customLogoUrl}
              onChange={(e) => setCustomLogoUrl(e.target.value)}
              placeholder="Or enter custom logo image URL..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Section 2: Developer Audience Targeting */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 shadow-xl">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span>2. Developer Targeting Parameters</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Target Role</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value as DeveloperRole)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                {DEVELOPER_ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Target Field</label>
              <select
                value={targetField}
                onChange={(e) => setTargetField(e.target.value as DeveloperField)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                {DEVELOPER_FIELDS.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Target Education</label>
              <select
                value={targetEducation}
                onChange={(e) => setTargetEducation(e.target.value as EducationStatus)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                {EDUCATION_STATUSES.map((edu) => (
                  <option key={edu} value={edu}>{edu}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-zinc-300 mb-2">Target Skills</label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_SKILLS.map((skill) => {
                const active = targetSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`rounded px-2.5 py-1 text-xs font-mono transition border ${
                      active
                        ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 font-semibold'
                        : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Target Country</label>
              <input
                type="text"
                value={targetCountry}
                onChange={(e) => setTargetCountry(e.target.value)}
                placeholder="Leave blank for global"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Target State / Region</label>
              <input
                type="text"
                value={targetState}
                onChange={(e) => setTargetState(e.target.value)}
                placeholder="e.g. Karnataka, California"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs text-zinc-400 mt-2">
            <input
              type="checkbox"
              checked={allowUnspecified}
              onChange={(e) => setAllowUnspecified(e.target.checked)}
              className="rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500"
            />
            <span>Allow developers who choose not to share their geographic location</span>
          </label>
        </div>

        {/* Section 3: Bidding & Budget */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 shadow-xl">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-400" />
            <span>3. Budget, Bidding & Billing Model</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Bid (CPM in INR) *</label>
              <input
                type="number"
                step="0.5"
                min="1"
                required
                value={bidCpm}
                onChange={(e) => setBidCpm(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono font-bold"
              />
              <span className="text-[11px] text-zinc-500">Per 1,000 verified impressions</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Total Campaign Budget (INR) *</label>
              <input
                type="number"
                step="500"
                min="500"
                required
                value={budget}
                onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono font-bold"
              />
              <span className="text-[11px] text-zinc-500">Simulated balance deduction</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Billing Model</label>
              <select
                value={billingModel}
                onChange={(e) => setBillingModel(e.target.value as BillingModel)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="cpm_impression">Verified CPM (Default)</option>
                <option value="cpc_click">Cost Per Click (CPC)</option>
                <option value="cpa_conversion">Cost Per Action (CPA)</option>
              </select>
              <span className="text-[11px] text-zinc-500">Verified view duration</span>
            </div>
          </div>

          <div className="rounded-lg bg-zinc-950/60 p-4 border border-zinc-800 text-xs text-zinc-400">
            <div className="font-semibold text-white mb-1">Auction Formula: Rank = Bid × Relevance × Quality</div>
            <p className="text-[11px] leading-relaxed">
              Rebate does not merely pick the highest bidder. Even with a lower bid, higher skill alignment produces a superior auction score.
            </p>
          </div>
        </div>

        {/* Launch Button */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/advertiser"
            className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-emerald-500 px-6 py-2.5 text-xs font-semibold text-black hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20"
          >
            {submitting ? 'Launching Campaign...' : 'Launch Campaign in Auction'}
          </button>
        </div>
      </form>
    </div>
  );
}
