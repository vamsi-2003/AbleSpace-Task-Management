'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { ThemeSelector } from '../../components/ThemeSelector';
import { api, User } from '../../lib/api';
import { User as UserIcon, Edit2, ShieldAlert, LogOut, Check, Camera } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState<User | null>(null);
  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  ];

  useEffect(() => {
    api.getProfile().then((u) => {
      setProfile(u);
      setFullName(u.fullName || 'User');
      
      const userEmail = u.email || 'user@ablespace.io';
      const emailPrefix = userEmail.split('@')[0].toLowerCase();

      const derivedUsername =
        userEmail !== 'alex.morgan@ablespace.io' && (u.username === 'alexm' || !u.username)
          ? emailPrefix
          : u.username || emailPrefix;

      const derivedTitle =
        userEmail !== 'alex.morgan@ablespace.io' && (u.title === 'Lead Product Designer' || !u.title)
          ? 'Full Stack Developer'
          : u.title || 'Workspace Member';

      setUsername(derivedUsername);
      setTitle(derivedTitle);
      setEmail(userEmail);
      setAvatarUrl(u.avatarUrl || avatarPresets[0]);

      const updatedSession = { ...u, username: derivedUsername, title: derivedTitle };
      localStorage.setItem('user_data', JSON.stringify(updatedSession));
    }).catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await api.updateProfile({
        fullName,
        title,
        username,
        email,
        avatarUrl,
      });
      setProfile(updated);
      localStorage.setItem('user_data', JSON.stringify(updated));
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const handleLeaveWorkspace = async () => {
    if (confirm('Are you sure you want to LEAVE Pyramid Workspace? This action cannot be undone.')) {
      await api.leaveWorkspace();
      alert('You have left Pyramid Workspace.');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Sidebar user={profile} />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserIcon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            <h2 className="text-xl font-extrabold tracking-tight">Evaluator & User Profile</h2>
          </div>
          <ThemeSelector />
        </header>

        <div className="p-6 max-w-3xl space-y-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="relative group">
                <img
                  src={avatarUrl || avatarPresets[0]}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm"
                />
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{fullName || 'Evaluator User'}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{title || 'Full Stack Developer'}</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {profile?.isGuest ? 'Guest Session' : 'Workspace Member'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                Choose Avatar Preset
              </label>
              <div className="flex gap-3 overflow-x-auto py-1">
                {avatarPresets.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`Preset ${i}`}
                    onClick={() => setAvatarUrl(url)}
                    className={`w-10 h-10 rounded-full object-cover cursor-pointer border-2 transition-all ${
                      avatarUrl === url
                        ? 'border-slate-900 dark:border-white scale-110 shadow-sm'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    Job Title / Role
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      disabled={!isEditingEmail}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs p-3 pr-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:outline-hidden disabled:opacity-75"
                    />
                    <button
                      type="button"
                      onClick={() => setIsEditingEmail(!isEditingEmail)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                {savedMessage && (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Profile updated in live database!
                  </span>
                )}
                <button
                  type="submit"
                  className="ml-auto px-5 py-2.5 text-xs font-bold rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
                >
                  Save Profile Info
                </button>
              </div>
            </form>
          </div>

          <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-extrabold text-sm uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>Danger Zone</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Leaving the workspace will remove your access to Pyramid tasks, projects, and shared resources.
            </p>
            <button
              onClick={handleLeaveWorkspace}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-xs cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Leave Workspace</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
