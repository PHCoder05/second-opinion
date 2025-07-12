/**
 * Medical app color palette optimized for healthcare and wellness
 * Primary colors focus on trust, reliability, and health
 */

const tintColorLight = '#0B7285';
const tintColorDark = '#63E6BE';

export const Colors = {
  light: {
    text: '#1A1A1A',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#6B7280',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorLight,
    gray: '#6B7280',
    lightGray: '#F3F4F6',
    border: '#E5E7EB',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  dark: {
    text: '#F9FAFB',
    background: '#111827',
    tint: tintColorDark,
    icon: '#9CA3AF',
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorDark,
    gray: '#6B7280',
    lightGray: '#1F2937',
    border: '#374151',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#60A5FA',
  },
};

// Medical app specific colors
export const MedicalColors = {
  primary: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    500: '#0EA5E9',
    600: '#0284C7',
    700: '#0369A1',
    800: '#075985',
    900: '#0C4A6E',
  },
  secondary: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },
  accent: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    500: '#F97316',
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
  },
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

// Gradient combinations for medical app
export const MedicalGradients = {
  primary: ['#0EA5E9', '#0284C7'],
  secondary: ['#10B981', '#059669'],
  accent: ['#F97316', '#EA580C'],
  health: ['#10B981', '#0EA5E9'],
  warning: ['#F59E0B', '#F97316'],
  error: ['#EF4444', '#DC2626'],
  background: ['#F9FAFB', '#F3F4F6'],
  card: ['#FFFFFF', '#F9FAFB'],
};

// Functional colors for different states
export const FunctionalColors = {
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  cardBackground: '#FFFFFF',
  cardShadow: 'rgba(0, 0, 0, 0.1)',
  divider: '#E5E7EB',
  placeholder: '#9CA3AF',
  disabled: '#D1D5DB',
};
