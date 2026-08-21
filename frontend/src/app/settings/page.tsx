'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { useTheme } from '../../context/ThemeContext';
import { api, User } from '../../lib/api';
import {
  Settings as SettingsIcon,
  Palette,
  Bell,
  Sliders,
  Shield,
  Sun,
  Moon,
  Check,
  Lock,
  Key,
} from 'lucide-react';

export default function SettingsPage() {
  const { mode, accent, setMode, setAccent } = useTheme();
  const [profile, setProfile] = useState<User | null>(null);

  // Settings State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [desktopNotifications, setDesktopNotifications] = useState(true);
  const [defaultView, setDefaultView] = useState<'board' | 'list'>('board');
  const [autoArchive, setAutoArchive] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    api.getProfile().then(setProfile).catch(() => {});
  }, []);

  const accents = [
    { id: 'blue', label: 'Royal Blue', bg: '#3b82f6' },
    { id: 'blue', label: 'Blue', bg: '#2563eb' },
    { id: 'pink', label: 'Pink', bg: '#ec4899' },
    { id: 'rose', label: 'Rose', bg: '#f43f5e' },
    { id: 'emerald', label: 'Emerald', bg: '#10b981' },
    { id: 'black', label: 'Black', bg: '#18181b' },
  ];

  const handleSaveSettings = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Sidebar user={profile} />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-5 h-5 accent-text-primary" />
            <h2 className="text-xl font-extrabold tracking-tight">Application Settings</h2>
          </div>
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Check className="w-4 h-4" /> Preferences Saved!
            </span>
          )}
        </header>

        <div className="p-6 max-w-4xl space-y-6">
          {/* 1. Appearance & Theming Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Palette className="w-4 h-4 accent-text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Appearance & Dual-Axis Theming
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Theme Mode */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                  Theme Mode
                </label>
                <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/60 rounded-xl">
                  <button
                    onClick={() => setMode('light')}
                    className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                      mode === 'light'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    <Sun className="w-4 h-4 text-blue-400" /> Light Mode
                  </button>
                  <button
                    onClick={() => setMode('dark')}
                    className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                      mode === 'dark'
                        ? 'bg-slate-700 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    <Moon className="w-4 h-4 text-blue-400" /> Dark Mode
                  </button>
                </div>
              </div>

              {/* Accent Swatches */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                  Accent Swatch Color
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {accents.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setAccent(item.id as any)}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-semibold transition-all ${
                        accent === item.id
                          ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-white shrink-0"
                        style={{ backgroundColor: item.bg }}
                      >
                        {accent === item.id && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </span>
                      <span className="text-slate-700 dark:text-slate-200">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Notification Preferences */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Bell className="w-4 h-4 accent-text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Notification Preferences
              </h3>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Email Notifications</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Receive email alerts for task assignments and mentions</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="w-4 h-4 accent-bg-primary cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Desktop Browser Alerts</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Show push notifications on status changes</p>
                </div>
                <input
                  type="checkbox"
                  checked={desktopNotifications}
                  onChange={(e) => setDesktopNotifications(e.target.checked)}
                  className="w-4 h-4 accent-bg-primary cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* 3. Workspace Defaults */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Sliders className="w-4 h-4 accent-text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Workspace Defaults
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Default View Layout
                </label>
                <select
                  value={defaultView}
                  onChange={(e) => setDefaultView(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
                >
                  <option value="board">Kanban Board View</option>
                  <option value="list">Collapsible List View</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Auto-Archive Status
                </label>
                <select
                  value={autoArchive ? 'true' : 'false'}
                  onChange={(e) => setAutoArchive(e.target.value === 'true')}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
                >
                  <option value="false">Keep Completed Tasks Active</option>
                  <option value="true">Auto-Archive After 30 Days</option>
                </select>
              </div>
            </div>
          </div>

          {/* 4. Security & Authentication Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Shield className="w-4 h-4 accent-text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Security & Authentication
              </h3>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" /> Two-Factor Authentication (2FA)
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Add an extra layer of account protection</p>
              </div>
              <input
                type="checkbox"
                checked={twoFactorAuth}
                onChange={(e) => setTwoFactorAuth(e.target.checked)}
                className="w-4 h-4 accent-bg-primary cursor-pointer"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveSettings}
              className="px-6 py-2.5 text-xs font-bold rounded-xl accent-bg-primary text-white hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
            >
              Save All Settings
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
