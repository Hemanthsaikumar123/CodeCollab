import React, { createContext, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Fixed dark theme
  const theme = {
    colors: {
      // Background colors
      bg: {
        primary: 'bg-gray-900',
        secondary: 'bg-gray-800',
        tertiary: 'bg-gray-700',
        accent: 'bg-gray-600',
      },
      // Text colors
      text: {
        primary: 'text-gray-100',
        secondary: 'text-gray-300',
        tertiary: 'text-gray-400',
        accent: 'text-blue-400',
      },
      // Border colors
      border: {
        primary: 'border-gray-700',
        secondary: 'border-gray-600',
        accent: 'border-blue-600',
      },
      // Button colors
      button: {
        primary: 'bg-blue-600 hover:bg-blue-700',
        secondary: 'bg-gray-600 hover:bg-gray-700',
        danger: 'bg-red-600 hover:bg-red-700',
        ghost: 'hover:bg-gray-700',
      },
      // Input colors
      input: {
        bg: 'bg-gray-700',
        border: 'border-gray-600',
        focus: 'focus:border-blue-500 focus:ring-blue-500',
        text: 'text-gray-100',
        placeholder: 'placeholder-gray-400',
      },
      // Chat specific colors
      chat: {
        ownMessage: 'bg-blue-600',
        otherMessage: 'bg-gray-700',
        ownText: 'text-white',
        otherText: 'text-gray-100',
        username: 'text-blue-200',
        otherUsername: 'text-gray-400',
        timestamp: 'text-blue-200',
        otherTimestamp: 'text-gray-500',
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