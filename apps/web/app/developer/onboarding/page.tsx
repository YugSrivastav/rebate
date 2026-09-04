'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ProfileForm, ProfileFormData } from '@/components/onboarding/profile-form';
import { useAuth } from '@/lib/auth/auth-context';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/signup?role=developer');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleFinish = async (formData: ProfileFormData) => {
    setSaving(true);
    try {
      const payload = {
        id: user?.profileId || 'dev_alex_india',
        name: user?.name || 'Developer',
        ...formData,
      };

      await fetch('/api/developer/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      router.push('/developer');
    } catch (err) {
      console.error('Failed to save profile:', err);
      router.push('/developer');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-96 items-center justify-center font-mono text-xs text-zinc-500">
        <span className="animate-spin text-indigo-400 mr-2">⠋</span> Redirecting to developer signup...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/developer"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Wallet
        </Link>
        <span className="text-xs font-mono text-zinc-500">Update Profile Targeting Attributes</span>
      </div>

      <ProfileForm onFinish={handleFinish} isSaving={saving} />
    </div>
  );
}
