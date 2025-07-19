import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

interface AccessibilityState {
  isLargeText: boolean;
  isHighContrast: boolean;
  isReducedMotion: boolean;
}

export const useAccessibility = () => {
  const [state, setState] = useState<AccessibilityState>({
    isLargeText: false,
    isHighContrast: false,
    isReducedMotion: false,
  });

  useEffect(() => {
    loadAccessibilityPreferences();
  }, []);

  const loadAccessibilityPreferences = async () => {
    try {
      const preferences = await AsyncStorage.getItem('accessibility_preferences');
      if (preferences) {
        setState(JSON.parse(preferences));
      }
    } catch (error) {
      console.error('Error loading accessibility preferences:', error);
    }
  };

  const setAccessibilityPreference = async (
    key: keyof AccessibilityState,
    value: boolean
  ) => {
    try {
      const newState = { ...state, [key]: value };
      setState(newState);
      await AsyncStorage.setItem(
        'accessibility_preferences',
        JSON.stringify(newState)
      );
    } catch (error) {
      console.error('Error saving accessibility preference:', error);
    }
  };

  return {
    ...state,
    setAccessibilityPreference,
  };
};

/**
 * Hook for accessible touch targets
 * Following JSON guideline: "large touch targets, color-blind friendly palettes"
 */
export const useAccessibleTouchTargets = () => {
  const { isScreenReaderEnabled, isLargeFontEnabled } = useAccessibility();

  // Minimum touch target following JSON: "48x48px for mobile usability"
  const minimumTouchTarget = 48;
  const recommendedTouchTarget = isScreenReaderEnabled || isLargeFontEnabled ? 56 : 48;

  return {
    minimum: minimumTouchTarget,
    recommended: recommendedTouchTarget,
    getButtonSize: (variant: 'small' | 'medium' | 'large' = 'medium') => {
      const baseSizes = { small: 36, medium: 48, large: 56 };
      const baseSize = baseSizes[variant];
      return Math.max(baseSize, recommendedTouchTarget);
    },
  };
};

/**
 * Hook for accessible text contrast
 * Ensures text meets WCAG AA standards (4.5:1 ratio)
 */
export const useAccessibleTextContrast = () => {
  const { getAccessibleColors } = useAccessibility();

  const getContrastRatio = (foreground: string, background: string): number => {
    // Simplified contrast calculation
    // In a real implementation, you'd use a proper color contrast library
    const getLuminance = (color: string) => {
      // This is a simplified luminance calculation
      const rgb = color.match(/\d+/g);
      if (!rgb) return 0;
      const [r, g, b] = rgb.map(Number);
      return 0.299 * r + 0.587 * g + 0.114 * b;
    };

    const fg = getLuminance(foreground);
    const bg = getLuminance(background);
    const ratio = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
    return ratio;
  };

  const ensureMinimumContrast = (
    textColor: string, 
    backgroundColor: string, 
    minimumRatio: number = 4.5
  ): string => {
    const ratio = getContrastRatio(textColor, backgroundColor);
    if (ratio >= minimumRatio) {
      return textColor;
    }

    // Return high contrast text color if ratio is insufficient
    const colors = getAccessibleColors();
    return colors.text;
  };

  return {
    getContrastRatio,
    ensureMinimumContrast,
    minimumRatio: 4.5, // WCAG AA standard
    enhancedRatio: 7.0, // WCAG AAA standard
  };
};

export default useAccessibility; 