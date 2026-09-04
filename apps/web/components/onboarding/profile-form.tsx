'use client';

import React, { useState } from 'react';
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
} from '@rebate/shared';
import { Sparkles, Check, ArrowRight, ArrowLeft, ShieldCheck, MapPin } from 'lucide-react';

export interface ProfileFormData {
  role: DeveloperRole;
  field: DeveloperField;
  skills: string[];
  education: EducationStatus;
  location?: { country: string; state: string };
  rewardPreference: RewardCurrency;
}

interface ProfileFormProps {
  initialData?: Partial<ProfileFormData>;
  onFinish: (data: ProfileFormData) => Promise<void> | void;
  isSaving?: boolean;
}

export function ProfileForm({ initialData, onFinish, isSaving }: ProfileFormProps) {
  const [step, setStep] = useState(1);

  const [role, setRole] = useState<DeveloperRole>(initialData?.role || 'Student');
  const [field, setField] = useState<DeveloperField>(initialData?.field || 'AI/ML');
  const [skills, setSkills] = useState<string[]>(
    initialData?.skills || ['Python', 'FastAPI', 'PyTorch', 'React']
  );
  const [education, setEducation] = useState<EducationStatus>(initialData?.education || 'Student');
  const [country, setCountry] = useState(initialData?.location?.country || 'India');
  const [state, setState] = useState(initialData?.location?.state || 'Karnataka');
  const [hasLocation, setHasLocation] = useState(initialData?.location !== undefined);
  const [rewardPref, setRewardPref] = useState<RewardCurrency>(
    initialData?.rewardPreference || 'INR'
  );

  const toggleSkill = (s: string) => {
    if (skills.includes(s)) {
      setSkills(skills.filter((item) => item !== s));
    } else {
      setSkills([...skills, s]);
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep((prev) => prev + 1);
    } else {
      onFinish({
        role,
        field,
        skills,
        education,
        location: hasLocation ? { country, state } : undefined,
        rewardPreference: rewardPref,
      });
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-8 shadow-xl">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-zinc-500 font-mono mb-2">
          <span>STEP {step} OF 4</span>
          <span>{Math.round((step / 4) * 100)}% COMPLETE</span>
        </div>
        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-300 rounded-full"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Role & Field */}
      {step === 1 && (
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>DEVELOPER PROFILE</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-1">What is your primary role and field?</h2>
          <p className="text-xs text-zinc-400 mb-6">
            Used by the auction engine to find relevant jobs, internships, and hackathons.
          </p>

          <div className="mb-6">
            <label className="block text-xs font-medium text-zinc-300 mb-2">Your Role</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DEVELOPER_ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`rounded-lg p-2.5 text-xs text-left font-medium transition border ${
                    role === r
                      ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300 font-semibold'
                      : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-medium text-zinc-300 mb-2">Primary Field</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DEVELOPER_FIELDS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setField(f)}
                  className={`rounded-lg p-2.5 text-xs text-left font-medium transition border ${
                    field === f
                      ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300 font-semibold'
                      : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Skills */}
      {step === 2 && (
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>TECHNICAL EXPERTISE</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-1">Select your core skills</h2>
          <p className="text-xs text-zinc-400 mb-6">
            Advertisers target developers with specific technology stacks.
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {COMMON_SKILLS.map((skill) => {
              const selected = skills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono transition border ${
                    selected
                      ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300 font-semibold shadow-sm'
                      : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  {selected && <Check className="h-3.5 w-3.5 text-indigo-400" />}
                  <span>{skill}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 3: Education & Location */}
      {step === 3 && (
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono mb-2">
            <MapPin className="h-3.5 w-3.5" />
            <span>EDUCATION & GEOGRAPHY</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-1">Education status & optional location</h2>
          <p className="text-xs text-zinc-400 mb-6">
            Location is strictly optional. Providing it unlocks regional internships, hackathons, and jobs.
          </p>

          <div className="mb-6">
            <label className="block text-xs font-medium text-zinc-300 mb-2">Education / Status</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {EDUCATION_STATUSES.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setEducation(status)}
                  className={`rounded-lg p-2.5 text-xs text-left font-medium transition border ${
                    education === status
                      ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300 font-semibold'
                      : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6 rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-medium text-white flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={hasLocation}
                  onChange={(e) => setHasLocation(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900 text-indigo-500 focus:ring-indigo-500"
                />
                <span>Share geographic location (Optional)</span>
              </label>
              <span className="text-[10px] font-mono text-indigo-400">Recommended for regional events</span>
            </div>

            {hasLocation ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. India, United States, Germany"
                    className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">State / Province</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Karnataka, California, Berlin"
                    className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none font-mono"
                  />
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-zinc-500 mt-2">
                Without location, you will only receive global and remote opportunities.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Step 4: Reward Preference */}
      {step === 4 && (
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>REWARD PREFERENCES</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-1">How would you like to receive rewards?</h2>
          <p className="text-xs text-zinc-400 mb-6">
            Rebate supports multiple reward currencies. You can switch preferences anytime in your wallet.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {REWARD_CURRENCIES.map((curr) => {
              const isSelected = rewardPref === curr.id;
              return (
                <button
                  key={curr.id}
                  type="button"
                  onClick={() => setRewardPref(curr.id)}
                  className={`flex flex-col items-start p-4 rounded-xl border transition text-left ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/10 text-white'
                      : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-bold text-sm text-white">{curr.label}</span>
                    <span className="text-xs font-mono text-indigo-400 font-semibold">{curr.symbol} {curr.id}</span>
                  </div>
                  <span className="text-[11px] text-zinc-400">
                    {curr.id === 'INR' && 'Direct cash equivalent deposited to Indian developer wallet.'}
                    {curr.id === 'USD' && 'Global US dollar credit balance.'}
                    {curr.id === 'AI_CREDITS' && 'Redeemable for model inference & API keys.'}
                    {curr.id === 'CLOUD_CREDITS' && 'Cloud infrastructure, VPS, and GPU container compute.'}
                    {curr.id === 'API_CREDITS' && 'Universal API credits for LLM and dev platforms.'}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="rounded-lg border border-indigo-500/20 bg-indigo-950/10 p-4 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs text-zinc-300">
              <span className="font-semibold text-white">Privacy Guarantee: </span>
              Rebate operates solely on these voluntary profile selections. Your source code, prompts, and local environment remain 100% private.
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 pt-6 border-t border-zinc-800/80 flex items-center justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep((prev) => prev - 1)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>
        ) : (
          <div />
        )}

        <button
          type="button"
          onClick={handleNext}
          disabled={isSaving}
          className="inline-flex items-center gap-1.5 rounded-lg bg-white px-5 py-2 text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition shadow-md shadow-white/10"
        >
          <span>{step === 4 ? (isSaving ? 'Saving Profile...' : 'Complete Onboarding') : 'Continue'}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
