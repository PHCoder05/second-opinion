import { AccessibilityColors, MedicalColors, Themes } from '@/constants/Colors';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'auto';
type AccessibilityMode = 'default' | 'highContrast' | 'lowVision';

interface ThemeContextType {
  // Theme state
  themeMode: ThemeMode;
  effectiveTheme: 'light' | 'dark';
  accessibilityMode: AccessibilityMode;
  
  // Theme actions
  setThemeMode: (mode: ThemeMode) => void;
  setAccessibilityMode: (mode: AccessibilityMode) => void;
  
  // Theme colors based on current mode
  colors: {
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    textDisabled: string;
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    border: string;
    divider: string;
    cardBackground: string;
    cardShadow: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const deviceColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('auto');
  const [accessibilityMode, setAccessibilityMode] = useState<AccessibilityMode>('default');

  // Determine effective theme based on mode and device settings
  const effectiveTheme: 'light' | 'dark' = 
    themeMode === 'auto' ? (deviceColorScheme || 'light') : themeMode;

  // Get colors based on current theme and accessibility mode
  const getColors = () => {
    // Start with base theme colors
    let baseColors = effectiveTheme === 'dark' ? Themes.dark : Themes.light;
    
    // Override with accessibility colors if needed
    if (accessibilityMode === 'highContrast') {
      return {
        background: AccessibilityColors.highContrast.background,
        surface: AccessibilityColors.highContrast.background,
        text: AccessibilityColors.highContrast.text,
        textSecondary: AccessibilityColors.highContrast.text,
        textDisabled: '#666666',
        primary: AccessibilityColors.highContrast.primary,
        secondary: MedicalColors.secondary[500],
        accent: MedicalColors.accent[500],
        success: AccessibilityColors.highContrast.success,
        warning: AccessibilityColors.highContrast.warning,
        error: AccessibilityColors.highContrast.error,
        info: MedicalColors.info[500],
        border: AccessibilityColors.highContrast.border,
        divider: AccessibilityColors.highContrast.border,
        cardBackground: AccessibilityColors.highContrast.background,
        cardShadow: 'rgba(0, 0, 0, 0.3)',
      };
    }
    
    if (accessibilityMode === 'lowVision') {
      return {
        background: AccessibilityColors.lowVision.background,
        surface: AccessibilityColors.lowVision.background,
        text: AccessibilityColors.lowVision.text,
        textSecondary: AccessibilityColors.lowVision.text,
        textDisabled: '#666666',
        primary: AccessibilityColors.lowVision.primary,
        secondary: MedicalColors.secondary[700],
        accent: MedicalColors.accent[600],
        success: MedicalColors.success[600],
        warning: MedicalColors.warning[600],
        error: MedicalColors.error[600],
        info: MedicalColors.info[600],
        border: AccessibilityColors.lowVision.border,
        divider: AccessibilityColors.lowVision.border,
        cardBackground: AccessibilityColors.lowVision.background,
        cardShadow: 'rgba(0, 0, 0, 0.2)',
      };
    }

    // Default theme colors
    if (effectiveTheme === 'dark') {
      return {
        background: baseColors.background,
        surface: baseColors.surface,
        text: '#FFFFFF',
        textSecondary: '#E5E7EB',
        textDisabled: '#9CA3AF',
        primary: baseColors.primary,
        secondary: baseColors.secondary,
        accent: baseColors.accent,
        success: MedicalColors.success[400],
        warning: MedicalColors.warning[400],
        error: MedicalColors.error[400],
        info: MedicalColors.info[400],
        border: MedicalColors.secondary[700],
        divider: MedicalColors.secondary[800],
        cardBackground: '#1F2937',
        cardShadow: 'rgba(0, 0, 0, 0.4)',
      };
    }

    // Light theme colors
    return {
      background: baseColors.background,
      surface: baseColors.surface,
      text: '#111827',
      textSecondary: '#4B5563',
      textDisabled: '#9CA3AF',
      primary: baseColors.primary,
      secondary: baseColors.secondary,
      accent: baseColors.accent,
      success: MedicalColors.success[500],
      warning: MedicalColors.warning[500],
      error: MedicalColors.error[500],
      info: MedicalColors.info[500],
      border: '#E5E7EB',
      divider: '#F3F4F6',
      cardBackground: '#FFFFFF',
      cardShadow: 'rgba(0, 0, 0, 0.1)',
    };
  };

  const value: ThemeContextType = {
    themeMode,
    effectiveTheme,
    accessibilityMode,
    setThemeMode,
    setAccessibilityMode,
    colors: getColors(),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeProvider };

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Return default values instead of throwing error
    console.warn('useTheme must be used within a ThemeProvider, returning default values');
    return {
      themeMode: 'auto',
      effectiveTheme: 'light',
      accessibilityMode: 'default',
      setThemeMode: () => {},
      setAccessibilityMode: () => {},
      colors: {
        background: '#FFFFFF',
        surface: '#FFFFFF',
        text: '#111827',
        textSecondary: '#4B5563',
        textDisabled: '#9CA3AF',
        primary: '#007BFF',
        secondary: '#6C757D',
        accent: '#17A2B8',
        success: '#28A745',
        warning: '#FFC107',
        error: '#DC3545',
        info: '#17A2B8',
        border: '#E5E7EB',
        divider: '#F3F4F6',
        cardBackground: '#FFFFFF',
        cardShadow: 'rgba(0, 0, 0, 0.1)',
      },
    };
  }
  return context;
};

// Convenience hooks for specific theme aspects
export const useThemeColors = () => {
  const { colors } = useTheme();
  return colors;
};

export const useEffectiveTheme = () => {
  const { effectiveTheme } = useTheme();
  return effectiveTheme;
};

export const useAccessibilityMode = () => {
  const { accessibilityMode, setAccessibilityMode } = useTheme();
  return { accessibilityMode, setAccessibilityMode };
};

// Helper function to create theme-aware styles
export const createThemedStyles = <T extends Record<string, any>>(
  styleCreator: (colors: ThemeContextType['colors'], theme: 'light' | 'dark') => T
) => {
  return () => {
    const { colors, effectiveTheme } = useTheme();
    return styleCreator(colors, effectiveTheme);
  };
}; 