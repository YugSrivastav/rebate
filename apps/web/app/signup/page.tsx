'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Terminal, ShieldCheck, ArrowRight, ArrowLeft, Check, Sparkles, User, Megaphone, MapPin } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import {
  DEVELOPER_ROLES,
  DEVELOPER_FIELDS,
  COMMON_SKILLS,
  EDUCATION_STATUSES,
  REWARD_CURRENCIES,
  DeveloperRole,
  DeveloperField,
  EducationStatus,
  RewardCurrency,
  UserRole,
} from '@rebate/shared';

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get('role') as UserRole) || 'developer';

  const { signup } = useAuth();

  const [role, setRole] = useState<UserRole>(initialRole);
  const [step, setStep] = useState(1);

  // Common Account Details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Developer Profile Questions (1 to 4)
  const [devRole, setDevRole] = useState<DeveloperRole>('Student');
  const [devField, setDevField] = useState<DeveloperField>('AI/ML');
  const [devSkills, setDevSkills] = useState<string[]>(['Python', 'FastAPI', 'PyTorch']);
  const [devEducation, setDevEducation] = useState<EducationStatus>('Student');
  const [devCountry, setDevCountry] = useState('India');
  const [devState, setDevState] = useState('Karnataka');
  const [hasLocation, setHasLocation] = useState(true);
  const [devRewardPref, setDevRewardPref] = useState<RewardCurrency>('INR');

  // Advertiser Profile
  const [companyName, setCompanyName] = useState('');
  const [advertiserBudget, setAdvertiserBudget] = useState(25000);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const toggleSkill = (s: string) => {
    if (devSkills.includes(s)) {
      setDevSkills(devSkills.filter((item) => item !== s));
    } else {
      setDevSkills([...devSkills, s]);
    }
  };

  const handleDeveloperSubmit = async () => {
    if (!name || !email) {
      setErrorMsg('Please enter your name and email');
      setStep(1);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        action: 'signup',
        name,
        email,
        role: 'developer',
        developerProfile: {
          role: devRole,
          field: devField,
          skills: devSkills,
          education: devEducation,
          location: hasLocation ? { country: devCountry, state: devState } : undefined,
          rewardPreference: devRewardPref,
        },
      };

      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.user) {
        signup(data.user);
        router.push('/developer');
      } else {
        setErrorMsg('Failed to create developer account');
      }
    } catch {
      setErrorMsg('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdvertiserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !companyName) {
      setErrorMsg('Please complete all required fields');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        action: 'signup',
        name,
        email,
        role: 'advertiser',
        advertiserProfile: {
          companyName,
          budget: Number(advertiserBudget),
        },
      };

      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.user) {
        signup(data.user);
        router.push('/advertiser');
      } else {
        setErrorMsg('Failed to create advertiser account');
      }
    } catch {
      setErrorMsg('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalSteps = role === 'developer' ? 5 : 1;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-xl flex-col justify-center px-4 py-12 sm:px-6">
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/90 p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 font-mono font-bold text-white text-lg tracking-wider mb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <Terminal className="h-4 w-4" />
            </div>
            <span>REBATE</span>
          </Link>
          <h1 className="text-xl font-bold text-white tracking-tight">Create your account</h1>
          <p className="mt-1 text-xs text-zinc-400">
            {role === 'developer'
              ? 'Complete onboarding to start matching wait-state opportunities and earning rewards.'
              : 'Launch targeted opportunity campaigns to developers during AI wait states.'}
          </p>
        </div>

        {/* Role Switcher */}
        {step === 1 && (
          <div className="mb-6 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole('developer')}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-medium transition border ${
                role === 'developer'
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-semibold'
                  : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>Developer Account</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('advertiser')}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-medium transition border ${
                role === 'advertiser'
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-semibold'
                  : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Megaphone className="h-3.5 w-3.5" />
              <span>Advertiser Account</span>
            </button>
          </div>
        )}

        {/* Developer Stepper Indicator */}
        {role === 'developer' && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-1.5">
              <span>STEP {step} OF {totalSteps}</span>
              <span>{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 rounded-md border border-red-500/30 bg-red-950/20 p-2.5 text-xs text-red-400">
            {errorMsg}
          </div>
        )}

        {/* ================= DEVELOPER FLOW ================= */}
        {role === 'developer' && (
          <div>
            {/* Step 1: Account Credentials */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Email address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="priya.sharma@tech.in"
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Question 1 - Role & Primary Field */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">QUESTION 1 OF 4</span>
                  <h3 className="text-sm font-bold text-white mt-1">What is your professional role & primary field?</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Used exclusively to match you with appropriate job and grant tiers.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Role</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {DEVELOPER_ROLES.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setDevRole(r)}
                        className={`rounded-md p-2 text-xs text-left transition border ${
                          devRole === r
                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-semibold'
                            : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Primary Technical Field</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {DEVELOPER_FIELDS.map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setDevField(f)}
                        className={`rounded-md p-2 text-xs text-left transition border ${
                          devField === f
                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-semibold'
                            : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Question 2 - Core Skills */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">QUESTION 2 OF 4</span>
                  <h3 className="text-sm font-bold text-white mt-1">Select your primary technical skills</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Advertisers specify skill tags to reach developers with matching proficiencies.</p>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-64 overflow-y-auto pr-1">
                  {COMMON_SKILLS.map((skill) => {
                    const active = devSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-mono transition border ${
                          active
                            ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 font-semibold shadow-sm'
                            : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        {active && <Check className="h-3 w-3 text-emerald-400" />}
                        <span>{skill}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Question 3 - Education Status & Optional Geography */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">QUESTION 3 OF 4</span>
                  <h3 className="text-sm font-bold text-white mt-1">Education status & optional location</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Location is 100% voluntary. Leaving it blank limits opportunities to global/remote.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Education / Status</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {EDUCATION_STATUSES.map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setDevEducation(status)}
                        className={`rounded-md p-2 text-xs text-left transition border ${
                          devEducation === status
                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-semibold'
                            : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3.5 space-y-3">
                  <label className="flex items-center justify-between text-xs text-zinc-300 cursor-pointer">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={hasLocation}
                        onChange={(e) => setHasLocation(e.target.checked)}
                        className="rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500"
                      />
                      <span>Provide voluntary location</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">Unlocks local bounties</span>
                  </label>

                  {hasLocation && (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/60">
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-mono mb-1">Country</label>
                        <input
                          type="text"
                          value={devCountry}
                          onChange={(e) => setDevCountry(e.target.value)}
                          placeholder="e.g. India"
                          className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-mono mb-1">State / Province</label>
                        <input
                          type="text"
                          value={devState}
                          onChange={(e) => setDevState(e.target.value)}
                          placeholder="e.g. Karnataka"
                          className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Question 4 - Reward Preferences */}
            {step === 5 && (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">QUESTION 4 OF 4</span>
                  <h3 className="text-sm font-bold text-white mt-1">How would you like to receive your value share?</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Rebate provides 70% direct value share. You can change currencies anytime.</p>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {REWARD_CURRENCIES.map((curr) => {
                    const isSelected = devRewardPref === curr.id;
                    return (
                      <button
                        key={curr.id}
                        type="button"
                        onClick={() => setDevRewardPref(curr.id)}
                        className={`flex items-center justify-between p-3 rounded-lg border text-left transition ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-500/10 text-white shadow-sm'
                            : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-semibold text-white">{curr.label}</div>
                          <div className="text-[11px] text-zinc-500">
                            {curr.id === 'INR' && 'Cash equivalent deposited directly to Indian rupee balance.'}
                            {curr.id === 'USD' && 'Global dollar credit balance for international developers.'}
                            {curr.id === 'AI_CREDITS' && 'Model inference tokens (Claude, OpenAI, Antigravity).'}
                            {curr.id === 'CLOUD_CREDITS' && 'H100/A100 GPU compute and cloud infrastructure.'}
                            {curr.id === 'API_CREDITS' && 'Developer API token credits across partnered tools.'}
                          </div>
                        </div>
                        <span className="font-mono text-xs font-bold text-emerald-400 shrink-0 ml-3">
                          {curr.symbol} {curr.id}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/10 p-3 flex items-start gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-zinc-400">
                    <strong className="text-zinc-200">Zero Code Reading Guarantee: </strong>
                    Rebate strictly matches using your voluntary profile answers. We never inspect local files, terminal histories, or model prompts.
                  </p>
                </div>
              </div>
            )}

            {/* Stepper Buttons */}
            <div className="mt-8 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((prev) => prev - 1)}
                  className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 px-3 py-1.5 rounded"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </button>
              ) : (
                <div />
              )}

              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={() => {
                    if (step === 1 && (!name || !email)) {
                      setErrorMsg('Please enter your name and email');
                      return;
                    }
                    setErrorMsg('');
                    setStep((prev) => prev + 1);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-black hover:bg-emerald-400 transition"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleDeveloperSubmit}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-5 py-2 text-xs font-semibold text-black hover:bg-emerald-400 transition shadow-sm"
                >
                  <span>{isSubmitting ? 'Creating Profile...' : 'Complete & Open Wallet'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ================= ADVERTISER FLOW ================= */}
        {role === 'advertiser' && (
          <form onSubmit={handleAdvertiserSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Company / Organization Name *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Example AI Labs"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Representative Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Elena Rostova"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Work Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sponsor@example-ai.dev"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Initial Simulated Demo Budget (INR)</label>
              <input
                type="number"
                step="5000"
                min="5000"
                value={advertiserBudget}
                onChange={(e) => setAdvertiserBudget(Number(e.target.value))}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono"
              />
              <span className="text-[11px] text-zinc-500">Payments are simulated for hackathon evaluation.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 rounded-lg bg-emerald-500 py-2.5 text-xs font-semibold text-black hover:bg-emerald-400 transition shadow-sm"
            >
              {isSubmitting ? 'Creating Advertiser Account...' : 'Create Advertiser Account'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-xs text-zinc-400">
          Already have an account?{' '}
          <Link href="/login" className="text-emerald-400 hover:underline font-semibold">
            Sign in →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#09090b] flex items-center justify-center text-zinc-500 text-xs">Loading signup...</div>}>
      <SignUpContent />
    </Suspense>
  );
}
