'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Mode = 'light' | 'dark';

interface ThemeContextType {
  mode: Mode;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<Mode>('dark');

  useEffect(() => {
    localStorage.removeItem('theme_accent');
    localStorage.removeItem('accent');
    localStorage.removeItem('accentColor');
    document.documentElement.removeAttribute('data-accent');

    const savedMode = localStorage.getItem('theme_mode') as Mode;
    if (savedMode) {
      setMode(savedMode);
    } else {
      setMode('dark');
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.removeAttribute('data-accent');
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme_mode', mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
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
