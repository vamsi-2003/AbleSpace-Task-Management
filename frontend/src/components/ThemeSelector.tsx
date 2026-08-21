'use client';

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Palette } from 'lucide-react';

export const ThemeSelector: React.FC = () => {
  const { mode, accent, toggleMode, setAccent } = useTheme();

  const swatches: Array<{ id: 'blue' | 'emerald' | 'indigo' | 'rose'; name: string; bgClass: string }> = [
    { id: 'blue', name: 'Royal Blue', bgClass: 'bg-blue-500' },
    { id: 'emerald', name: 'Emerald', bgClass: 'bg-emerald-500' },
    { id: 'indigo', name: 'Indigo', bgClass: 'bg-indigo-500' },
    { id: 'rose', name: 'Rose', bgClass: 'bg-rose-500' },
  ];

  return (
    <div className="flex items-center gap-4">
      {/* Accent Color Swatches */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/50">
        <Palette className="w-3.5 h-3.5 ml-1.5 text-slate-400" />
        {swatches.map((s) => (
          <button
            key={s.id}
            onClick={() => setAccent(s.id)}
            title={s.name}
            className={`w-4 h-4 rounded-full ${s.bgClass} transition-transform cursor-pointer ${
              accent === s.id ? 'ring-2 ring-slate-900 dark:ring-white scale-125' : 'opacity-70 hover:opacity-100'
            }`}
          />
        ))}
      </div>

      {/* Light / Dark Mode Toggle */}
      <button
        onClick={toggleMode}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
      >
        {mode === 'dark' ? (
          <>
            <Sun className="w-3.5 h-3.5 text-blue-400" />
            <span>Light Mode</span>
          </>
        ) : (
          <>
            <Moon className="w-3.5 h-3.5 text-slate-600" />
            <span>Dark Mode</span>
          </>
        )}
      </button>
    </div>
  );
};
