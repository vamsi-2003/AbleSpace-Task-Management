'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme, ThemeMode, AccentColor } from '../context/ThemeContext';
import { Sun, Moon, Palette, Check } from 'lucide-react';

export function ThemeSelector() {
  const { mode, accent, setMode, setAccent } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const accents: { id: AccentColor; label: string; bg: string }[] = [
    { id: 'amber', label: 'Amber', bg: '#f59e0b' },
    { id: 'blue', label: 'Blue', bg: '#2563eb' },
    { id: 'pink', label: 'Pink', bg: '#ec4899' },
    { id: 'rose', label: 'Rose', bg: '#f43f5e' },
    { id: 'emerald', label: 'Emerald', bg: '#10b981' },
    { id: 'black', label: 'Black', bg: '#18181b' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-xs"
        title="Customize Theme & Accent Color"
      >
        <Palette className="w-3.5 h-3.5 accent-text-primary" />
        <span className="capitalize">{mode} Mode</span>
        <span
          className="w-2.5 h-2.5 rounded-full inline-block border border-white/20 shadow-xs"
          style={{ backgroundColor: accents.find((a) => a.id === accent)?.bg }}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
          {/* Theme Mode Section */}
          <div className="mb-3">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 block">
              Theme Mode
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-lg">
              <button
                onClick={() => setMode('light')}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  mode === 'light'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Sun className="w-3.5 h-3.5" /> Light
              </button>
              <button
                onClick={() => setMode('dark')}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  mode === 'dark'
                    ? 'bg-slate-700 text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Moon className="w-3.5 h-3.5" /> Dark
              </button>
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />

          {/* Accent Color Section */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 block">
              Accent Color
            </label>
            <div className="grid grid-cols-3 gap-2">
              {accents.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setAccent(item.id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-xs transition-all ${
                    accent === item.id
                      ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: item.bg }}
                  >
                    {accent === item.id && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-300">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
