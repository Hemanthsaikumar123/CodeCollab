import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first, then system preference
    const saved = localStorage.getItem('cc_theme');
    if (saved) {
      return saved === 'dark';
    }
    // Default to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Save to localStorage whenever theme changes
    localStorage.setItem('cc_theme', isDarkMode ? 'dark' : 'light');
    
    // Apply theme to document root
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // Only auto-switch if user hasn't manually set a preference
      const saved = localStorage.getItem('cc_theme');
      if (!saved) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
      // Background colors
      bg: {
        primary: isDarkMode ? 'bg-gray-900' : 'bg-gray-100',
        secondary: isDarkMode ? 'bg-gray-800' : 'bg-white',
        tertiary: isDarkMode ? 'bg-gray-700' : 'bg-gray-50',
        accent: isDarkMode ? 'bg-gray-600' : 'bg-gray-200',
      },
      // Text colors
      text: {
        primary: isDarkMode ? 'text-gray-100' : 'text-gray-900',
        secondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
        tertiary: isDarkMode ? 'text-gray-400' : 'text-gray-500',
        accent: isDarkMode ? 'text-blue-400' : 'text-blue-600',
      },
      // Border colors
      border: {
        primary: isDarkMode ? 'border-gray-700' : 'border-gray-200',
        secondary: isDarkMode ? 'border-gray-600' : 'border-gray-300',
        accent: isDarkMode ? 'border-blue-600' : 'border-blue-500',
      },
      // Button colors
      button: {
        primary: isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700',
        secondary: isDarkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-600 hover:bg-gray-700',
        danger: isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-600 hover:bg-red-700',
        ghost: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
      },
      // Input colors
      input: {
        bg: isDarkMode ? 'bg-gray-700' : 'bg-white',
        border: isDarkMode ? 'border-gray-600' : 'border-gray-300',
        focus: isDarkMode ? 'focus:border-blue-500 focus:ring-blue-500' : 'focus:border-blue-500 focus:ring-blue-500',
        text: isDarkMode ? 'text-gray-100' : 'text-gray-900',
        placeholder: isDarkMode ? 'placeholder-gray-400' : 'placeholder-gray-500',
      },
      // Chat specific colors
      chat: {
        ownMessage: isDarkMode ? 'bg-blue-600' : 'bg-blue-500',
        otherMessage: isDarkMode ? 'bg-gray-700' : 'bg-gray-100',
        ownText: 'text-white',
        otherText: isDarkMode ? 'text-gray-100' : 'text-gray-800',
        username: isDarkMode ? 'text-blue-200' : 'text-blue-100',
        otherUsername: isDarkMode ? 'text-gray-400' : 'text-gray-600',
        timestamp: isDarkMode ? 'text-blue-200' : 'text-blue-100',
        otherTimestamp: isDarkMode ? 'text-gray-500' : 'text-gray-500',
      }
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;