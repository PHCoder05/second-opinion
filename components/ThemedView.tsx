import { useThemeColors } from '@/hooks/useThemeContext';
import React from 'react';
import { View, ViewProps } from 'react-native';

interface ThemedViewProps extends ViewProps {
  lightColor?: string;
  darkColor?: string;
}

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const colors = useThemeColors();
  const backgroundColor = lightColor || colors.background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
