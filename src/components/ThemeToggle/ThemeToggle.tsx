'use client';

import React, { useEffect, useState } from 'react';
import { useThemeToggleAnalytics } from '../../hooks/useAnalytics';
import './ThemeToggle.css';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { trackThemeToggle } = useThemeToggleAnalytics();

  useEffect(() => {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (newTheme: 'light' | 'dark') => {
    const root = document.documentElement;
    
    if (newTheme === 'dark') {
      root.classList.add('dark-theme');
    } else {
      root.classList.remove('dark-theme');
    }
    
    localStorage.setItem('theme', newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
    
    // Track the theme toggle
    trackThemeToggle(newTheme);
  };

  return (
    <button 
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      <span className="theme-toggle__icon">
        {theme === 'light' ? '🌙' : '☀️'}
      </span>
      <span className="theme-toggle__text">
        {theme === 'light' ? 'Dark' : 'Light'} Mode
      </span>
    </button>
  );
};

export default ThemeToggle;
