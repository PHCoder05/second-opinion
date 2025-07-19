import { Platform } from 'react-native';

export const Fonts = {
  primary: Platform.select({
    ios: 'Roboto',
    android: 'Roboto',
    default: 'Roboto',
  }),
  secondary: Platform.select({
    ios: 'Helvetica',
    android: 'sans-serif',
    default: 'Helvetica',
  }),
};

export const FontSizes = {
  heading: 24,
  subheading: 18,
  body: 16,
  caption: 14,
  small: 12,
  
  // Additional sizes for hierarchy
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 18,
  h6: 16,
};

export const FontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const LineHeights = {
  tight: 1.2,    // For headings
  normal: 1.5,   // For body text (accessibility)
  relaxed: 1.75, // For easier reading
};

interface TextStyleBase {
  fontSize: number;
  fontFamily: string;
  fontWeight: keyof typeof FontWeights;
  lineHeight: number;
}

// Predefined text styles for consistency
export const TextStyles: Record<string, TextStyleBase> = {
  h1: {
    fontSize: FontSizes.h1,
    fontFamily: Fonts.primary,
    fontWeight: 'bold',
    lineHeight: FontSizes.h1 * LineHeights.tight,
  },
  h2: {
    fontSize: FontSizes.h2,
    fontFamily: Fonts.primary,
    fontWeight: 'bold',
    lineHeight: FontSizes.h2 * LineHeights.tight,
  },
  h3: {
    fontSize: FontSizes.h3,
    fontFamily: Fonts.primary,
    fontWeight: 'bold',
    lineHeight: FontSizes.h3 * LineHeights.tight,
  },
  h4: {
    fontSize: FontSizes.h4,
    fontFamily: Fonts.primary,
    fontWeight: 'semibold',
    lineHeight: FontSizes.h4 * LineHeights.tight,
  },
  h5: {
    fontSize: FontSizes.h5,
    fontFamily: Fonts.primary,
    fontWeight: 'semibold',
    lineHeight: FontSizes.h5 * LineHeights.tight,
  },
  h6: {
    fontSize: FontSizes.h6,
    fontFamily: Fonts.primary,
    fontWeight: 'semibold',
    lineHeight: FontSizes.h6 * LineHeights.tight,
  },
  body1: {
    fontSize: FontSizes.body,
    fontFamily: Fonts.primary,
    fontWeight: 'regular',
    lineHeight: FontSizes.body * LineHeights.normal,
  },
  body2: {
    fontSize: FontSizes.caption,
    fontFamily: Fonts.primary,
    fontWeight: 'regular',
    lineHeight: FontSizes.caption * LineHeights.normal,
  },
  caption: {
    fontSize: FontSizes.small,
    fontFamily: Fonts.secondary,
    fontWeight: 'regular',
    lineHeight: FontSizes.small * LineHeights.normal,
  },
  button: {
    fontSize: FontSizes.body,
    fontFamily: Fonts.primary,
    fontWeight: 'medium',
    lineHeight: FontSizes.body * LineHeights.tight,
  },
};

// Accessibility text styles with larger fonts
export const AccessibleTextStyles: Record<string, TextStyleBase> = {
  ...TextStyles,
  body1: {
    ...TextStyles.body1,
    fontSize: FontSizes.body + 2,
    lineHeight: (FontSizes.body + 2) * LineHeights.relaxed,
  },
  body2: {
    ...TextStyles.body2,
    fontSize: FontSizes.caption + 2,
    lineHeight: (FontSizes.caption + 2) * LineHeights.relaxed,
  },
  caption: {
    ...TextStyles.caption,
    fontSize: FontSizes.small + 2,
    lineHeight: (FontSizes.small + 2) * LineHeights.relaxed,
  },
}; 