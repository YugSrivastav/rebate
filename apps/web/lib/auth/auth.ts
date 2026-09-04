/**
 * Authentication Utilities for Rebate
 * Supports demo profiles, persistent session storage, and role verification.
 */

import { UserRole } from '@rebate/shared';

export interface AuthSessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileId?: string;
  companyName?: string;
}

export const DEMO_DEVELOPER: AuthSessionUser = {
  id: 'usr_dev_2',
  name: 'Priya Sharma',
  email: 'priya.sharma@tech.in',
  role: 'developer',
  profileId: 'dev_alex_india',
};

export const DEMO_ADVERTISER: AuthSessionUser = {
  id: 'usr_adv_1',
  name: 'Elena Rostova',
  email: 'sponsor@example-ai.dev',
  role: 'advertiser',
  companyName: 'Example AI Research',
};

export const AUTH_STORAGE_KEY = 'rebate_auth_user';

export function getStoredUser(): AuthSessionUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthSessionUser | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch {}
}
