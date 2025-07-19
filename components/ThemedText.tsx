import { useThemeColors } from '@/hooks/useThemeContext';
import React from 'react';
import { Text, TextProps } from 'react-native';

interface ThemedTextProps extends TextProps {
  lightColor?: string;
  darkColor?: string;
}

export function ThemedText({ style, lightColor, darkColor, ...otherProps }: ThemedTextProps) {
  const colors = useThemeColors();
  const color = lightColor || colors.text;

  return <Text style={[{ color }, style]} {...otherProps} />;
}
