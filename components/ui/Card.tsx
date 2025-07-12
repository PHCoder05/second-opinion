import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MedicalColors, MedicalGradients } from '@/constants/Colors';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient' | 'health' | 'warning' | 'danger';
  padding?: 'none' | 'small' | 'medium' | 'large';
  style?: ViewStyle;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  style,
  onPress,
}) => {
  const getCardStyle = () => {
    const baseStyle = [
      styles.card,
      styles[padding],
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
      default:
        return [...baseStyle, styles.default];
    }
  };

  const getGradientColors = () => {
    switch (variant) {
      case 'gradient':
        return MedicalGradients.card;
      case 'health':
        return MedicalGradients.secondary;
      case 'warning':
        return MedicalGradients.warning;
      case 'danger':
        return MedicalGradients.error;
      default:
        return MedicalGradients.background;
    }
  };

  if (variant === 'gradient' || variant === 'health' || variant === 'warning' || variant === 'danger') {
    return (
      <View style={getCardStyle()}>
        <LinearGradient
          colors={getGradientColors()}
          style={[StyleSheet.absoluteFillObject, styles.gradient]}
        />
        {children}
      </View>
    );
  }

  return (
    <View style={getCardStyle()}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    position: 'relative',
  },
  gradient: {
    borderRadius: 16,
  },
  // Padding variants
  none: {
    padding: 0,
  },
  small: {
    padding: 12,
  },
  medium: {
    padding: 16,
  },
  large: {
    padding: 24,
  },
  // Card variants
  default: {
    backgroundColor: '#FFFFFF',
    shadowColor: MedicalColors.neutral[900],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  elevated: {
    backgroundColor: '#FFFFFF',
    shadowColor: MedicalColors.neutral[900],
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  outlined: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: MedicalColors.neutral[200],
  },
  health: {
    backgroundColor: MedicalColors.secondary[50],
    borderWidth: 1,
    borderColor: MedicalColors.secondary[200],
  },
  warning: {
    backgroundColor: MedicalColors.accent[50],
    borderWidth: 1,
    borderColor: MedicalColors.accent[200],
  },
  danger: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
}); 