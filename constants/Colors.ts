/**
 * Medical App Design System - Colors & Themes
 * Based on JSON Design System Profile specifications  
 * Exact implementation of color palette with accessibility compliance
 */


// Exact JSON Specification Colors
export const MedicalColors = {
  // Primary Colors - Exact from JSON (#007BFF)
  primary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#007BFF', // Main primary color from JSON
    600: '#0056D3',
    700: '#0043AA',
    800: '#003281',
    900: '#002658',
  },
  
  // Secondary Colors - Exact from JSON (#6C757D)
  secondary: {
    50: '#F8F9FA', // Background from JSON
    100: '#E9ECEF',
    200: '#DEE2E6',
    300: '#CED4DA',
    400: '#ADB5BD',
    500: '#6C757D', // Main secondary color from JSON
    600: '#495057',
    700: '#343A40', // Neutral dark from JSON
    800: '#212529', // Main text color from JSON
    900: '#121212',
  },
  
  // Accent Colors - Exact from JSON (#17A2B8)
  accent: {
    50: '#E0F7FA',
    100: '#B2EBF2',
    200: '#80DEEA',
    300: '#4DD0E1',
    400: '#26C6DA',
    500: '#17A2B8', // Main accent color from JSON
    600: '#00ACC1',
    700: '#0097A7',
    800: '#00838F',
    900: '#006064',
  },
  
  // Success Colors - Exact from JSON (#28A745)
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#28A745', // Success color from JSON
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },
  
  // Warning Colors - Exact from JSON (#FFC107)
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#FFC107', // Warning color from JSON
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
  
  // Error Colors - Exact from JSON (#DC3545)
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#DC3545', // Error color from JSON
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },
  
  // Info Colors for medical context
  info: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9',
    600: '#0284C7',
    700: '#0369A1',
    800: '#075985',
    900: '#0C4A6E',
  },
  
  // Neutral Colors - Exact from JSON specifications
  neutral: {
    light: '#FFFFFF', // Exact from JSON
    dark: '#343A40',  // Exact from JSON
    50: '#F8F9FA',    // Background from JSON
    100: '#E9ECEF',
    200: '#DEE2E6',
    300: '#CED4DA',
    400: '#ADB5BD',
    500: '#6C757D',
    600: '#495057',
    700: '#343A40',
    800: '#212529',   // Text color from JSON
    900: '#121212',   // Dark background from JSON
  },
};

// Medical-specific color gradients for visual hierarchy
export const MedicalGradients = {
  primary: ['#007BFF', '#0056D3'],
  secondary: ['#6C757D', '#495057'],
  accent: ['#17A2B8', '#00ACC1'],
  success: ['#28A745', '#16A34A'],
  warning: ['#FFC107', '#D97706'],
  error: ['#DC3545', '#DC2626'],
  info: ['#0EA5E9', '#0284C7'],
  
  // Medical context specific gradients
  health: ['#28A745', '#17A2B8'],
  vitals: ['#007BFF', '#17A2B8'],
  emergency: ['#DC3545', '#B91C1C'],
  wellness: ['#28A745', '#4ADE80'],
  
  // Background gradients
  background: ['#F8F9FA', '#E9ECEF'],
  card: ['#FFFFFF', '#F8F9FA'],
  surface: ['#FFFFFF', '#F1F5F9'],
  
  // Calming medical gradients
  calm: ['#17A2B8', '#007BFF'],
  trust: ['#007BFF', '#0056D3'],
  care: ['#28A745', '#17A2B8'],
};

// Spacing system - 8px base unit as specified in JSON
export const Spacing = {
  xs: 4,
  sm: 8,   // Small margin from JSON
  md: 16,  // Medium margin & card padding from JSON  
  lg: 24,  // Large margin from JSON
  xl: 32,
  xxl: 48,
  xxxl: 64,
  
  // Component-specific spacing from JSON
  cardPadding: 16,           // Card padding specification
  buttonPaddingVertical: 12, // Button padding from JSON: "12px 24px"
  buttonPaddingHorizontal: 24,
  minimumTouchTarget: 48,    // Accessibility specification from JSON
};

// Typography system - exact from JSON specifications
export const Typography = {
  fonts: {
    primary: 'Roboto',     // Exact from JSON
    secondary: 'Helvetica', // Exact from JSON
    system: 'System',
  },
  sizes: {
    small: 12,      // Exact from JSON
    caption: 14,    // Exact from JSON
    body: 16,       // Exact from JSON
    subheading: 18, // Exact from JSON
    heading: 24,    // Exact from JSON
    title: 28,
    largeTitle: 32,
  },
  weights: {
    regular: '400',  // Exact from JSON
    medium: '500',
    semibold: '600',
    bold: '700',     // Exact from JSON
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,     // Exact from JSON specification
    loose: 1.8,
  },
};

// Theme configurations - exact from JSON specifications
export const Themes = {
  light: {
    background: '#FFFFFF',    // Exact from JSON
    surface: '#F8F9FA',
    text: '#000000',          // Exact from JSON
    textSecondary: '#6C757D',
    textDisabled: '#ADB5BD',
    primary: '#007BFF',
    secondary: '#6C757D',
    accent: '#17A2B8',
    success: '#28A745',
    warning: '#FFC107',
    error: '#DC3545',
    info: '#0EA5E9',
    border: '#DEE2E6',
    divider: '#E9ECEF',
    cardBackground: '#FFFFFF',
    cardShadow: 'rgba(0, 0, 0, 0.1)', // Shadow spec from JSON
  },
  dark: {
    background: '#121212',    // Exact from JSON
    surface: '#343A40',
    text: '#FFFFFF',          // Exact from JSON
    textSecondary: '#ADB5BD',
    textDisabled: '#6C757D',
    primary: '#17A2B8',
    secondary: '#6C757D',
    accent: '#007BFF',
    success: '#28A745',
    warning: '#FFC107',
    error: '#DC3545',
    info: '#0EA5E9',
    border: '#495057',
    divider: '#343A40',
    cardBackground: '#343A40',
    cardShadow: 'rgba(0, 0, 0, 0.4)',
  },
};

// Functional color mappings for components
export const FunctionalColors = {
  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceSecondary: '#F8F9FA',
  
  // Text colors with high contrast ratios
  text: '#212529',
  textSecondary: '#6C757D',
  textDisabled: '#ADB5BD',
  textInverse: '#FFFFFF',
  
  // Interactive colors
  primary: '#007BFF',
  primaryHover: '#0056D3',
  primaryPressed: '#0043AA',
  primaryDisabled: '#ADB5BD',
  
  secondary: '#6C757D',
  secondaryHover: '#495057',
  secondaryPressed: '#343A40',
  
  // Border and divider colors
  border: '#DEE2E6',
  borderFocus: '#007BFF',
  borderError: '#DC3545',
  divider: '#E9ECEF',
  
  // Card and elevation
  cardBackground: '#FFFFFF',
  cardBorder: '#E9ECEF',
  cardShadow: 'rgba(0, 0, 0, 0.1)',
  
  // Overlay and backdrop
  overlay: 'rgba(0, 0, 0, 0.5)',
  backdrop: 'rgba(0, 0, 0, 0.3)',
  
  // Input and form colors
  inputBackground: '#FFFFFF',
  inputBorder: '#DEE2E6',
  inputBorderFocus: '#007BFF',
  inputBorderError: '#DC3545',
  inputPlaceholder: '#6C757D',
  
  // Status and notification colors
  disabled: '#ADB5BD',
  focus: '#007BFF',
  hover: '#F8F9FA',
  pressed: '#E9ECEF',
};

// Accessibility colors for high contrast and low vision modes
export const AccessibilityColors = {
  highContrast: {
    background: '#FFFFFF',
    text: '#000000',
    primary: '#0000FF',
    secondary: '#000000',
    success: '#008000',
    warning: '#FF8C00',
    error: '#FF0000',
    border: '#000000',
  },
  lowVision: {
    background: '#FFFFFF',
    text: '#000000',
    primary: '#0066CC',
    secondary: '#333333',
    success: '#006600',
    warning: '#CC6600',
    error: '#CC0000',
    border: '#333333',
  },
};

// Shadow specifications - exact from JSON
export const Shadows = {
  // Card shadow specification from JSON: "0 2px 4px rgba(0,0,0,0.1)"
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  elevated: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  deep: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
};

// Border radius specifications - exact from JSON
export const BorderRadius = {
  sm: 4,    // Button border radius from JSON
  md: 8,    // Card border radius from JSON
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

// Medical-specific icon sizes and touch targets
export const ComponentSizes = {
  iconSizes: {
    xs: 12,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  },
  touchTargets: {
    minimum: 48,      // Accessibility specification from JSON
    recommended: 56,
    large: 64,
  },
  buttons: {
    small: { height: 36, paddingHorizontal: 16 },
    medium: { height: 48, paddingHorizontal: 24 }, // JSON specification
    large: { height: 56, paddingHorizontal: 32 },
  },
};

// Colors object for useThemeColor hook compatibility
export const Colors = {
  light: {
    text: '#000000',
    background: '#FFFFFF',
    tint: '#007BFF',
    tabIconDefault: '#6C757D',
    tabIconSelected: '#007BFF',
    icon: '#6C757D',
    primary: '#007BFF',
    secondary: '#6C757D',
    accent: '#17A2B8',
    success: '#28A745',
    warning: '#FFC107',
    error: '#DC3545',
    border: '#DEE2E6',
    cardBackground: '#FFFFFF',
  },
  dark: {
    text: '#FFFFFF',
    background: '#121212',
    tint: '#17A2B8',
    tabIconDefault: '#ADB5BD',
    tabIconSelected: '#17A2B8',
    icon: '#ADB5BD',
    primary: '#17A2B8',
    secondary: '#6C757D',
    accent: '#007BFF',
    success: '#28A745',
    warning: '#FFC107',
    error: '#DC3545',
    border: '#495057',
    cardBackground: '#343A40',
  },
};

// Export default theme for backward compatibility
export default {
  colors: MedicalColors,
  gradients: MedicalGradients,
  spacing: Spacing,
  typography: Typography,
  themes: Themes,
  functional: FunctionalColors,
  accessibility: AccessibilityColors,
  shadows: Shadows,
  borderRadius: BorderRadius,
  componentSizes: ComponentSizes,
};
