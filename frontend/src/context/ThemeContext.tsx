'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Mode = 'light' | 'dark';
type Accent = 'blue' | 'emerald' | 'indigo' | 'rose';

interface ThemeContextType {
  mode: Mode;
  accent: Accent;
  toggleMode: () => void;
  setAccent: (accent: Accent) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<Mode>('dark');
  const [accent, setAccentState] = useState<Accent>('blue');

  useEffect(() => {
    const savedMode = localStorage.getItem('theme_mode') as Mode;
    const savedAccent = localStorage.getItem('theme_accent') as Accent;

    if (savedMode) {
      setMode(savedMode);
    } else {
      setMode('dark');
    }

    if (savedAccent && savedAccent !== ('amber' as any)) {
      setAccentState(savedAccent);
    } else {
      setAccentState('blue');
      localStorage.setItem('theme_accent', 'blue');
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme_mode', mode);
  }, [mode]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-accent', accent);
    localStorage.setItem('theme_accent', accent);
  }, [accent]);

  const toggleMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setAccent = (newAccent: Accent) => {
    setAccentState(newAccent);
  };

  return (
    <ThemeContext.Provider value={{ mode, accent, toggleMode, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
