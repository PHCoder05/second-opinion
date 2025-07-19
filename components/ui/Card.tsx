import { BorderRadius, FunctionalColors, MedicalColors, MedicalGradients, Shadows, Spacing } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient' | 'health' | 'warning' | 'danger' | 'success' | 'info' | 'medical' | 'vitals';
  padding?: 'none' | 'small' | 'medium' | 'large' | 'xl';
  margin?: 'none' | 'small' | 'medium' | 'large';
  style?: ViewStyle;
  onPress?: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: 'button' | 'text' | 'none';
  testID?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  margin = 'none',
  style,
  onPress,
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
  testID,
}) => {
  const getCardStyle = (): ViewStyle[] => {
    const baseStyle = [
      styles.card,
      styles[`padding_${padding}`],
      styles[`margin_${margin}`],
      disabled && styles.disabled,
      style,
    ];

    switch (variant) {
      case 'elevated':
        return [...baseStyle, styles.elevated];
      case 'outlined':
        return [...baseStyle, styles.outlined];
      case 'health':
        return [...baseStyle, styles.health];
      case 'warning':
        return [...baseStyle, styles.warning];
      case 'danger':
        return [...baseStyle, styles.danger];
      case 'success':
        return [...baseStyle, styles.success];
      case 'info':
        return [...baseStyle, styles.info];
      case 'medical':
        return [...baseStyle, styles.medical];
      case 'vitals':
        return [...baseStyle, styles.vitals];
      default:
        return [...baseStyle, styles.default];
    }
  };

  const getGradientColors = (): string[] => {
    switch (variant) {
      case 'gradient':
        return MedicalGradients?.card || ['#FFFFFF', '#F8F9FA'];
      case 'health':
        return MedicalGradients?.health || ['#28A745', '#17A2B8'];
      case 'warning':
        return MedicalGradients?.warning || ['#FFC107', '#D97706'];
      case 'danger':
        return MedicalGradients?.error || ['#DC3545', '#DC2626'];
      case 'success':
        return MedicalGradients?.success || ['#28A745', '#16A34A'];
      case 'info':
        return MedicalGradients?.calm || ['#17A2B8', '#007BFF'];
      case 'medical':
        return MedicalGradients?.care || ['#28A745', '#17A2B8'];
      case 'vitals':
        return MedicalGradients?.vitals || ['#007BFF', '#17A2B8'];
      default:
        return MedicalGradients?.background || ['#F8F9FA', '#E9ECEF'];
    }
  };

  const needsGradient = (): boolean => {
    return ['gradient', 'health', 'warning', 'danger', 'success', 'info', 'medical', 'vitals'].includes(variant);
  };

  const getAccessibilityRole = () => {
    if (accessibilityRole) return accessibilityRole;
    if (onPress) return 'button';
    return 'text';
  };

  const getAccessibilityState = () => ({
    disabled: disabled,
  });

  const CardContent = () => (
    <>
      {needsGradient() && (
        <LinearGradient
          colors={getGradientColors()}
          style={[StyleSheet.absoluteFillObject, styles.gradient]}
        />
      )}
      {children}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity 
        onPress={onPress}
        disabled={disabled}
        style={StyleSheet.flatten(getCardStyle())}
        activeOpacity={0.8}
        accessibilityRole={getAccessibilityRole()}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={getAccessibilityState()}
        testID={testID}
      >
        <CardContent />
      </TouchableOpacity>
    );
  }

  return (
    <View 
      style={StyleSheet.flatten(getCardStyle())}
      accessibilityRole={getAccessibilityRole()}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      <CardContent />
    </View>
  );
};

const styles = StyleSheet.create({
  // Base card style - exact JSON specifications
  card: {
    backgroundColor: FunctionalColors.cardBackground,
    borderRadius: BorderRadius.md, // 8px border radius from JSON
    position: 'relative',
    overflow: 'hidden',
  },
  
  gradient: {
    borderRadius: BorderRadius.md, // 8px from JSON
  },
  
  disabled: {
    opacity: 0.6,
  },
  
  // Padding variants using 8px base unit system from JSON
  padding_none: {
    padding: 0,
  },
  
  padding_small: {
    padding: Spacing.sm, // 8px
  },
  
  padding_medium: {
    padding: Spacing.cardPadding, // 16px - exact card padding specification from JSON
  },
  
  padding_large: {
    padding: Spacing.lg, // 24px
  },
  
  padding_xl: {
    padding: Spacing.xl, // 32px
  },
  
  // Margin variants
  margin_none: {
    margin: 0,
  },
  
  margin_small: {
    margin: Spacing.sm, // 8px
  },
  
  margin_medium: {
    margin: Spacing.md, // 16px
  },
  
  margin_large: {
    margin: Spacing.lg, // 24px
  },
  
  // Card variants following exact design system
  default: {
    backgroundColor: FunctionalColors.cardBackground,
    // Shadow specification from JSON: "0 2px 4px rgba(0,0,0,0.1)"
    ...Shadows.card,
  },
  
  elevated: {
    backgroundColor: FunctionalColors.cardBackground,
    ...Shadows.elevated,
  },
  
  outlined: {
    backgroundColor: FunctionalColors.cardBackground,
    borderWidth: 1,
    borderColor: FunctionalColors.border,
    shadowOpacity: 0, // No shadow for outlined variant
    elevation: 0,
  },
  
  health: {
    backgroundColor: MedicalColors.success[50],
    borderWidth: 1,
    borderColor: MedicalColors.success[200],
    ...Shadows.card,
  },
  
  warning: {
    backgroundColor: MedicalColors.warning[50],
    borderWidth: 1,
    borderColor: MedicalColors.warning[200],
    ...Shadows.card,
  },
  
  danger: {
    backgroundColor: MedicalColors.error[50],
    borderWidth: 1,
    borderColor: MedicalColors.error[200],
    ...Shadows.card,
  },
  
  success: {
    backgroundColor: MedicalColors.success[50],
    borderWidth: 1,
    borderColor: MedicalColors.success[200],
    ...Shadows.card,
  },
  
  info: {
    backgroundColor: MedicalColors.info[50],
    borderWidth: 1,
    borderColor: MedicalColors.info[200],
    ...Shadows.card,
  },
  
  medical: {
    backgroundColor: MedicalColors.primary[50],
    borderWidth: 1,
    borderColor: MedicalColors.primary[200],
    ...Shadows.card,
  },
  
  vitals: {
    backgroundColor: MedicalColors.accent[50],
    borderWidth: 1,
    borderColor: MedicalColors.accent[200],
    ...Shadows.card,
  },
});

// Specialized card components for medical contexts
export const HealthCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card variant="health" {...props} />
);

export const WarningCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card variant="warning" {...props} />
);

export const DangerCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card variant="danger" {...props} />
);

export const SuccessCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card variant="success" {...props} />
);

export const InfoCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card variant="info" {...props} />
);

export const MedicalCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card variant="medical" {...props} />
);

export const VitalsCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card variant="vitals" {...props} />
);

export const ElevatedCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card variant="elevated" {...props} />
);

export const OutlinedCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card variant="outlined" {...props} />
);

export default Card; 