'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';
export type AccentColor = 'amber' | 'blue' | 'pink' | 'rose' | 'emerald' | 'black';

interface ThemeContextType {
  mode: ThemeMode;
  accent: AccentColor;
  setMode: (mode: ThemeMode) => void;
  setAccent: (accent: AccentColor) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [accent, setAccentState] = useState<AccentColor>('amber');

  useEffect(() => {
    // Initial loading from localStorage
    const savedMode = localStorage.getItem('theme_mode') as ThemeMode;
    const savedAccent = localStorage.getItem('theme_accent') as AccentColor;

    if (savedMode) {
      setModeState(savedMode);
      applyMode(savedMode);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialMode = prefersDark ? 'dark' : 'light';
      setModeState(initialMode);
      applyMode(initialMode);
    }

    if (savedAccent) {
      setAccentState(savedAccent);
      applyAccent(savedAccent);
    } else {
      applyAccent('amber');
    }

    // Try syncing from backend
    fetch(`${API_BASE_URL}/users/me/preferences`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.themeMode) {
          setModeState(data.themeMode);
          applyMode(data.themeMode);
        }
        if (data?.accentColor) {
          setAccentState(data.accentColor);
          applyAccent(data.accentColor);
        }
      })
      .catch(() => {
        // Fallback to local storage
      });
  }, []);

  const applyMode = (newMode: ThemeMode) => {
    const root = document.documentElement;
    if (newMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const applyAccent = (newAccent: AccentColor) => {
    const root = document.documentElement;
    root.setAttribute('data-accent', newAccent);
  };

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    applyMode(newMode);
    localStorage.setItem('theme_mode', newMode);
    syncPreferences(newMode, accent);
  };

  const setAccent = (newAccent: AccentColor) => {
    setAccentState(newAccent);
    applyAccent(newAccent);
    localStorage.setItem('theme_accent', newAccent);
    syncPreferences(mode, newAccent);
  };

  const toggleMode = () => {
    const nextMode = mode === 'light' ? 'dark' : 'light';
    setMode(nextMode);
  };

  const syncPreferences = (m: ThemeMode, a: AccentColor) => {
    fetch(`${API_BASE_URL}/users/me/preferences`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ themeMode: m, accentColor: a }),
    }).catch(() => {});
  };

  return (
    <ThemeContext.Provider value={{ mode, accent, setMode, setAccent, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
