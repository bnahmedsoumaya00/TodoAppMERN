import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const themes = {
  dark: {
    name: 'dark',
    colors: {
      // Primary Color Palette
      shadowGrey: '#161925',
      twilightIndigo: '#23395b',
      richCerulean: '#406e8e',
      powderBlue: '#8ea8c3',
      frozenWater: '#cbf7ed',
      
      // Background Colors
      bgPrimary: '#161925',
      bgSecondary: '#23395b',
      bgTertiary: '#1e2738',
      
      // Text Colors
      textPrimary: '#ffffff',
      textSecondary: '#8ea8c3',
      textTertiary: '#cbf7ed',
      textMuted: '#6b7280',
      
      // Action Colors
      colorPrimary: '#406e8e',
      colorPrimaryHover: '#4d8ab8',
      colorAccent: '#cbf7ed',
      colorAccentHover: '#a7f4e3',
      
      // Status Colors
      colorSuccess: '#10b981',
      colorWarning: '#f59e0b',
      colorError: '#ef4444',
      
      // Borders
      borderPrimary: '#2d3748',
      borderSecondary: '#23395b',
      borderAccent: '#406e8e',
      
      // Shadows
      shadowSm: '0 1px 2px rgba(0, 0, 0, 0.3)',
      shadowMd: '0 4px 6px rgba(0, 0, 0, 0.3)',
      shadowLg: '0 10px 15px rgba(0, 0, 0, 0.4)',
      shadowGlow: '0 0 20px rgba(203, 247, 237, 0.3)',
    }
  },
  light:  {
    name: 'light',
    colors: {
      // Primary Color Palette (adjusted for light mode)
      shadowGrey: '#f8fafc',
      twilightIndigo: '#e0e7ff',
      richCerulean: '#3b82f6',
      powderBlue: '#64748b',
      frozenWater: '#0ea5e9',
      
      // Background Colors
      bgPrimary: '#ffffff',
      bgSecondary:  '#f1f5f9',
      bgTertiary: '#e2e8f0',
      
      // Text Colors
      textPrimary: '#0f172a',
      textSecondary: '#475569',
      textTertiary: '#0ea5e9',
      textMuted: '#94a3b8',
      
      // Action Colors
      colorPrimary: '#3b82f6',
      colorPrimaryHover: '#2563eb',
      colorAccent: '#0ea5e9',
      colorAccentHover: '#0284c7',
      
      // Status Colors
      colorSuccess: '#10b981',
      colorWarning: '#f59e0b',
      colorError: '#ef4444',
      
      // Borders
      borderPrimary:  '#e2e8f0',
      borderSecondary: '#cbd5e1',
      borderAccent: '#3b82f6',
      
      // Shadows
      shadowSm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      shadowMd: '0 4px 6px rgba(0, 0, 0, 0.07)',
      shadowLg: '0 10px 15px rgba(0, 0, 0, 0.1)',
      shadowGlow: '0 0 20px rgba(14, 165, 233, 0.3)',
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to dark
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'dark';
  });

  useEffect(() => {
    // Apply theme to document
    document. documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Apply CSS variables
    const themeColors = themes[theme]. colors;
    Object.keys(themeColors).forEach((key) => {
      const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      document.documentElement.style.setProperty(cssVarName, themeColors[key]);
    });
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    colors: themes[theme].colors
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};