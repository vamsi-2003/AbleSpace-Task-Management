'use client';

import React, { useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { useTheme } from '../../context/ThemeContext';
import { Settings, Sun, Moon, Bell, Shield, Sliders } from 'lucide-react';

export default function SettingsPage() {
  const { mode, toggleMode } = useTheme();

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [inAppNotifications, setInAppNotifications] = useState(true);
  const [defaultView, setDefaultView] = useState<'board' | 'list'>('board');
  const [twoFactor, setTwoFactor] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-slate-700 dark:text-slate-200" />
            <h2 className="text-xl font-extrabold tracking-tight">Workspace Settings</h2>
          </div>
          <button
            onClick={toggleMode}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {mode === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-slate-300" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-600" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </header>

        <form onSubmit={handleSaveSettings} className="p-6 max-w-3xl space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Sun className="w-4 h-4 text-slate-500" />
              <span>Appearance & Theme</span>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                Theme Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={toggleMode}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    mode === 'light'
                      ? 'border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <Sun className="w-4 h-4 text-slate-500" /> Light Mode
                </button>
                <button
                  type="button"
                  onClick={toggleMode}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    mode === 'dark'
                      ? 'border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <Moon className="w-4 h-4 text-slate-400" /> Dark Mode
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Bell className="w-4 h-4 text-slate-500" />
              <span>Notifications</span>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Email Notifications</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Receive updates on assigned tasks</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="w-4 h-4 rounded-md text-slate-900 focus:ring-slate-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">In-App Notifications</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Show popups when comments are added</p>
                </div>
                <input
                  type="checkbox"
                  checked={inAppNotifications}
                  onChange={(e) => setInAppNotifications(e.target.checked)}
                  className="w-4 h-4 rounded-md text-slate-900 focus:ring-slate-500"
                />
              </label>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-slate-500" />
              <span>Workspace Defaults</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                Default View Layout
              </label>
              <select
                value={defaultView}
                onChange={(e) => setDefaultView(e.target.value as any)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:outline-hidden"
              >
                <option value="board">Kanban Board View</option>
                <option value="list">Collapsible List View</option>
              </select>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Shield className="w-4 h-4 text-slate-500" />
              <span>Security</span>
            </div>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Two-Factor Authentication (2FA)</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Add an extra layer of security to your account</p>
              </div>
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={(e) => setTwoFactor(e.target.checked)}
                className="w-4 h-4 rounded-md text-slate-900 focus:ring-slate-500"
              />
            </label>
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedMessage && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                ✓ Workspace settings saved successfully!
              </span>
            )}
            <button
              type="submit"
              className="ml-auto px-5 py-2.5 text-xs font-bold rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 transition-opacity shadow-xs cursor-pointer"
            >
              Save Settings
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
