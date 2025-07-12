import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MedicalColors, MedicalGradients } from '@/constants/Colors';
import { IconSymbol } from './IconSymbol';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  icon?: string;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
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
  style,
  textStyle,
}) => {
  const getButtonStyle = () => {
    const baseStyle = [
      styles.button,
      styles[size],
      fullWidth && styles.fullWidth,
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
      default:
        return baseStyle;
    }
  };

  const getTextStyle = () => {
    const baseTextStyle = [
      styles.text,
      styles[`${size}Text`],
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
      default:
        return [...baseTextStyle, styles.primaryText];
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'secondary':
        return MedicalColors.primary[700];
      case 'outline':
        return MedicalColors.primary[600];
      case 'ghost':
        return MedicalColors.primary[600];
      case 'danger':
        return '#FFFFFF';
      default:
        return '#FFFFFF';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 24;
      default:
        return 20;
    }
  };

  const renderContent = () => (
    <>
      {icon && iconPosition === 'left' && !loading && (
        <IconSymbol name={icon} size={getIconSize()} color={getIconColor()} />
      )}
      {loading ? (
        <ActivityIndicator size="small" color={getIconColor()} />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
      {icon && iconPosition === 'right' && !loading && (
        <IconSymbol name={icon} size={getIconSize()} color={getIconColor()} />
      )}
    </>
  );

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={getButtonStyle()}
      >
        <LinearGradient
          colors={MedicalGradients.primary}
          style={[StyleSheet.absoluteFillObject, styles.gradient]}
        />
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={getButtonStyle()}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    gap: 8,
    position: 'relative',
  },
  gradient: {
    borderRadius: 12,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  // Sizes
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 44,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 52,
  },
  // Variants
  secondary: {
    backgroundColor: MedicalColors.secondary[50],
    borderWidth: 1,
    borderColor: MedicalColors.secondary[200],
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: MedicalColors.primary[300],
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: MedicalColors.accent[500],
  },
  // Text styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: MedicalColors.secondary[700],
  },
  outlineText: {
    color: MedicalColors.primary[600],
  },
  ghostText: {
    color: MedicalColors.primary[600],
  },
  dangerText: {
    color: '#FFFFFF',
  },
}); 