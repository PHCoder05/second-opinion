import { AccessibleTextStyles, FontWeights, TextStyles } from '@/constants/Typography';
import { useAccessibility } from '@/hooks/useAccessibility';
import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

interface TypographyProps extends TextProps {
  variant?: keyof typeof TextStyles;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  children: React.ReactNode;
}

const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  style,
  color,
  align,
  children,
  ...props
}) => {
  const { isLargeText } = useAccessibility();
  const baseStyles = isLargeText ? AccessibleTextStyles[variant] : TextStyles[variant];

  // Convert string font weights to valid React Native values
  const fontWeightValue = (weight: string): '400' | '500' | '600' | '700' => {
    switch (weight) {
      case FontWeights.regular:
        return '400';
      case FontWeights.medium:
        return '500';
      case FontWeights.semibold:
        return '600';
      case FontWeights.bold:
        return '700';
      default:
        return '400';
    }
  };

  const processedStyles = {
    ...baseStyles,
    fontWeight: fontWeightValue(baseStyles.fontWeight),
  };

  return (
    <Text
      style={[
        processedStyles,
        color && { color },
        align && { textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

// Heading Components
export const H1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h1" {...props} />
);

export const H2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h2" {...props} />
);

export const H3: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h3" {...props} />
);

export const H4: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h4" {...props} />
);

export const H5: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h5" {...props} />
);

export const H6: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h6" {...props} />
);

// Body Components
export const Body: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="body1" {...props} />
);

export const Body1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="body1" {...props} />
);

export const Body2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="body2" {...props} />
);

// Other Components
export const Caption: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="caption" {...props} />
);

export const ButtonText: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="button" {...props} />
);

// Additional Components for compatibility
export const Heading: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h2" {...props} />
);

export const Label: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="body2" {...props} />
);

export const Subheading: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h3" {...props} />
);

export const Title: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h1" {...props} />
);

// Example usage of styles
const styles = StyleSheet.create({
  error: {
    color: 'red',
  },
  success: {
    color: 'green',
  },
  warning: {
    color: 'orange',
  },
  info: {
    color: 'blue',
  },
});

export default Typography; 