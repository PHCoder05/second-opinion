import { BorderRadius, ComponentSizes, FunctionalColors, MedicalColors, MedicalGradients, Spacing, Typography } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { IconSymbol } from './IconSymbol';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning' | 'medical' | 'emergency';
  size?: 'small' | 'medium' | 'large';
  icon?: string;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  elevated?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'right',
  loading = false,
  disabled = false,
  fullWidth = false,
  elevated = false,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const getButtonStyle = (): ViewStyle[] => {
    const baseStyle = [
      styles.button,
      styles[size],
      fullWidth && styles.fullWidth,
      elevated && styles.elevated,
      disabled && styles.disabled,
      style,
    ];

    switch (variant) {
      case 'secondary':
        return [...baseStyle, styles.secondary];
      case 'outline':
        return [...baseStyle, styles.outline];
      case 'ghost':
        return [...baseStyle, styles.ghost];
      case 'danger':
        return [...baseStyle, styles.danger];
      case 'success':
        return [...baseStyle, styles.success];
      case 'warning':
        return [...baseStyle, styles.warning];
      case 'medical':
        return [...baseStyle, styles.medical];
      case 'emergency':
        return [...baseStyle, styles.emergency];
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle[] => {
    const baseTextStyle = [
      styles.text,
      styles[`${size}Text`],
      textStyle,
    ];

    switch (variant) {
      case 'secondary':
        return [...baseTextStyle, styles.secondaryText];
      case 'outline':
        return [...baseTextStyle, styles.outlineText];
      case 'ghost':
        return [...baseTextStyle, styles.ghostText];
      case 'danger':
        return [...baseTextStyle, styles.dangerText];
      case 'success':
        return [...baseTextStyle, styles.successText];
      case 'warning':
        return [...baseTextStyle, styles.warningText];
      case 'medical':
        return [...baseTextStyle, styles.medicalText];
      case 'emergency':
        return [...baseTextStyle, styles.emergencyText];
      default:
        return [...baseTextStyle, styles.primaryText];
    }
  };

  const getIconColor = (): string => {
    if (disabled) return FunctionalColors.textDisabled;
    
    switch (variant) {
      case 'secondary':
        return MedicalColors.primary[600];
      case 'outline':
        return MedicalColors.primary[600];
      case 'ghost':
        return MedicalColors.primary[600];
      case 'danger':
        return MedicalColors.neutral.light;
      case 'success':
        return MedicalColors.neutral.light;
      case 'warning':
        return MedicalColors.neutral.light;
      case 'medical':
        return MedicalColors.neutral.light;
      case 'emergency':
        return MedicalColors.neutral.light;
      default:
        return MedicalColors.neutral.light;
    }
  };

  const getIconSize = (): number => {
    switch (size) {
      case 'small':
        return ComponentSizes.iconSizes.sm;
      case 'large':
        return ComponentSizes.iconSizes.md;
      default:
        return ComponentSizes.iconSizes.sm;
    }
  };

  const getGradientColors = (): string[] => {
    if (disabled) return [FunctionalColors.disabled, FunctionalColors.disabled];
    
    switch (variant) {
      case 'danger':
        return MedicalGradients?.error || ['#DC3545', '#DC2626'];
      case 'success':
        return MedicalGradients?.success || ['#28A745', '#16A34A'];
      case 'warning':
        return MedicalGradients?.warning || ['#FFC107', '#D97706'];
      case 'medical':
        return MedicalGradients?.health || ['#28A745', '#17A2B8'];
      case 'emergency':
        return MedicalGradients?.emergency || ['#DC3545', '#B91C1C'];
      default:
        return MedicalGradients?.primary || ['#007BFF', '#0056D3'];
    }
  };

  const needsGradient = (): boolean => {
    return ['primary', 'danger', 'success', 'warning', 'medical', 'emergency'].includes(variant);
  };

  const getAccessibilityState = () => ({
    disabled: disabled || loading,
    busy: loading,
  });

  const renderContent = () => (
    <>
      {icon && iconPosition === 'left' && !loading && (
        <IconSymbol name={icon} size={getIconSize()} color={getIconColor()} />
      )}
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={getIconColor()} 
          accessibilityLabel="Loading"
        />
      ) : (
        <Text style={StyleSheet.flatten(getTextStyle())}>{title}</Text>
      )}
      {icon && iconPosition === 'right' && !loading && (
        <IconSymbol name={icon} size={getIconSize()} color={getIconColor()} />
      )}
    </>
  );

  const ButtonContent = () => {
    if (needsGradient()) {
      return (
        <>
          <LinearGradient
            colors={getGradientColors()}
            style={[StyleSheet.absoluteFillObject, styles.gradient]}
          />
          {renderContent()}
        </>
      );
    }
    
    return renderContent();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={StyleSheet.flatten(getButtonStyle())}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={getAccessibilityState()}
      testID={testID}
    >
      <ButtonContent />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Base button style - exact JSON specifications
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.sm, // 4px border radius from JSON
    gap: Spacing.sm, // 8px gap
    position: 'relative',
    // Ensure minimum touch target of 48x48px for accessibility (JSON spec)
    minWidth: ComponentSizes.touchTargets.minimum,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  gradient: {
    borderRadius: BorderRadius.sm, // 4px from JSON
  },
  
  elevated: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  
  fullWidth: {
    width: '100%',
  },
  
  disabled: {
    opacity: 0.6,
  },
  
  // Sizes - following JSON design system with 48px height specification
  small: {
    paddingVertical: Spacing.sm, // 8px
    paddingHorizontal: Spacing.md, // 16px
    minHeight: ComponentSizes.buttons.small.height, // 36px
  },
  
  medium: {
    paddingVertical: Spacing.buttonPaddingVertical, // 12px from JSON
    paddingHorizontal: Spacing.buttonPaddingHorizontal, // 24px from JSON
    minHeight: ComponentSizes.buttons.medium.height, // 48px from JSON
  },
  
  large: {
    paddingVertical: Spacing.md, // 16px
    paddingHorizontal: Spacing.xl, // 32px
    minHeight: ComponentSizes.buttons.large.height, // 56px
  },
  
  // Variants using exact design system colors
  secondary: {
    backgroundColor: MedicalColors.secondary[100],
    borderWidth: 1,
    borderColor: MedicalColors.secondary[300],
  },
  
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: MedicalColors.primary[500],
  },
  
  ghost: {
    backgroundColor: 'transparent',
  },
  
  danger: {
    // Uses gradient, no background needed
  },
  
  success: {
    // Uses gradient, no background needed
  },
  
  warning: {
    // Uses gradient, no background needed
  },
  
  medical: {
    // Uses gradient, no background needed
  },
  
  emergency: {
    // Uses gradient, no background needed
  },
  
  // Text styles using exact design system typography
  text: {
    fontWeight: Typography.weights.semibold,
    textAlign: 'center',
    fontFamily: Typography.fonts.primary, // Roboto from JSON
    includeFontPadding: false,
  },
  
  smallText: {
    fontSize: Typography.sizes.caption, // 14px
    lineHeight: Typography.sizes.caption * 1.2,
  },
  
  mediumText: {
    fontSize: Typography.sizes.body, // 16px
    lineHeight: Typography.sizes.body * 1.2,
  },
  
  largeText: {
    fontSize: Typography.sizes.subheading, // 18px
    lineHeight: Typography.sizes.subheading * 1.2,
  },
  
  // Text colors for variants
  primaryText: {
    color: MedicalColors.neutral.light, // White text on primary
  },
  
  secondaryText: {
    color: MedicalColors.primary[600],
  },
  
  outlineText: {
    color: MedicalColors.primary[500],
  },
  
  ghostText: {
    color: MedicalColors.primary[500],
  },
  
  dangerText: {
    color: MedicalColors.neutral.light,
  },
  
  successText: {
    color: MedicalColors.neutral.light,
  },
  
  warningText: {
    color: MedicalColors.neutral.light,
  },
  
  medicalText: {
    color: MedicalColors.neutral.light,
  },
  
  emergencyText: {
    color: MedicalColors.neutral.light,
  },
});

// Specialized button components for medical contexts
export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="primary" {...props} />
);

export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="secondary" {...props} />
);

export const OutlineButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="outline" {...props} />
);

export const DangerButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="danger" {...props} />
);

export const SuccessButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="success" {...props} />
);

export const WarningButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="warning" {...props} />
);

export const MedicalButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="medical" icon="heart.fill" {...props} />
);

export const EmergencyButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="emergency" icon="exclamationmark.triangle.fill" {...props} />
);

export default Button; 