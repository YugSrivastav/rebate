'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AuthSessionUser,
  DEMO_DEVELOPER,
  DEMO_ADVERTISER,
  getStoredUser,
  setStoredUser,
} from './auth';
import { UserRole } from '@rebate/shared';

interface AuthContextType {
  user: AuthSessionUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  demoLogin: (role: UserRole) => void;
  signup: (newUser: AuthSessionUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthSessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const existing = getStoredUser();
    if (existing) {
      setUser(existing);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, requestedRole: UserRole = 'developer'): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, role: requestedRole }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setStoredUser(data.user);
        setIsLoading(false);
        return true;
      }
    } catch (err) {
      console.error('Login failed:', err);
    }

    // Fallback: match demo accounts
    if (email.toLowerCase().includes('elena') || requestedRole === 'advertiser') {
      setUser(DEMO_ADVERTISER);
      setStoredUser(DEMO_ADVERTISER);
    } else {
      setUser(DEMO_DEVELOPER);
      setStoredUser(DEMO_DEVELOPER);
    }
    setIsLoading(false);
    return true;
  };

  const demoLogin = (role: UserRole) => {
    const demoUser = role === 'advertiser' ? DEMO_ADVERTISER : DEMO_DEVELOPER;
    setUser(demoUser);
    setStoredUser(demoUser);
    if (role === 'advertiser') {
      router.push('/advertiser');
    } else {
      router.push('/developer');
    }
  };

  const signup = (newUser: AuthSessionUser) => {
    setUser(newUser);
    setStoredUser(newUser);
  };

  const logout = () => {
    setUser(null);
    setStoredUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        login,
        demoLogin,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
