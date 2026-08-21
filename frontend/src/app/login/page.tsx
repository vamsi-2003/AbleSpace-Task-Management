'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { ArrowRight, Lock, Mail, User, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'guest' | 'signin' | 'signup'>('guest');
  const [loading, setLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      const res = await api.guestLogin();
      localStorage.setItem('auth_token', res.token);
      localStorage.setItem('user_data', JSON.stringify(res.user));
      router.push('/tasks');
    } catch (err) {
      console.error('Guest login failed:', err);
      router.push('/tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const res = await api.googleLogin();
      localStorage.setItem('auth_token', res.token);
      localStorage.setItem('user_data', JSON.stringify(res.user));
      router.push('/tasks');
    } catch (err) {
      console.error('Google login failed:', err);
      router.push('/tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const nameFromEmail = email ? email.split('@')[0] : 'Member';
      const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
      
      const userObj = {
        id: `user-${Date.now()}`,
        fullName: fullName || formattedName,
        email: email || 'user@ablespace.io',
        title: 'Workspace Member',
        username: nameFromEmail.toLowerCase(),
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        isGuest: false,
      };

      localStorage.setItem('user_data', JSON.stringify(userObj));
      localStorage.setItem('auth_token', `session-token-${Date.now()}`);
      router.push('/tasks');
    } catch (err) {
      console.error('Auth submit error:', err);
      router.push('/tasks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Decorator */}
      <div className="absolute -top-40 -left-40 w-96 h-96 accent-bg-primary opacity-10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 accent-bg-primary opacity-10 rounded-full blur-3xl" />

      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 relative z-10">
        {/* Workspace Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl accent-bg-primary text-white font-extrabold text-2xl flex items-center justify-center mx-auto shadow-lg mb-3">
            P
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Pyramid Workspace
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            AbleSpace Task Management System — Sign In & Guest Portal
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl">
          <button
            onClick={() => setTab('guest')}
            className={`py-2 rounded-lg text-xs font-bold transition-all ${
              tab === 'guest'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Guest
          </button>
          <button
            onClick={() => setTab('signin')}
            className={`py-2 rounded-lg text-xs font-bold transition-all ${
              tab === 'signin'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`py-2 rounded-lg text-xs font-bold transition-all ${
              tab === 'signup'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Tab Content */}
        {tab === 'guest' ? (
          <div className="space-y-3 pt-2">
            <button
              onClick={handleGuestLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm hover:opacity-90 transition-opacity shadow-md cursor-pointer"
            >
              <span>Continue as Guest</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.27v3.15C3.25 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.27C.46 8.23 0 10.06 0 12s.46 3.77 1.27 5.39l4.01-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.61l4.01 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
                />
              </svg>
              <span>Login with Google</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleAuthSubmit} className="space-y-4 pt-2">
            {tab === 'signup' && (
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl accent-bg-primary text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-md cursor-pointer"
            >
              <span>{tab === 'signin' ? 'Sign In to Workspace' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Badges */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 accent-text-primary" />
            <span>Active Session Sync across Profile & Sidebar</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 accent-text-primary" />
            <span>Fully Editable Profile Fields & Local Storage Sync</span>
          </div>
        </div>
      </div>
    </div>
  );
}
