import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ViewStyle, TextInputProps, TouchableOpacity } from 'react-native';
import { MedicalColors } from '@/constants/Colors';
import { IconSymbol } from './IconSymbol';

interface InputProps extends TextInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  secureTextEntry?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  error,
  disabled = false,
  required = false,
  variant = 'default',
  size = 'medium',
  style,
  secureTextEntry = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const getInputContainerStyle = () => {
    const baseStyle = [
      styles.inputContainer,
      styles[size],
      styles[variant],
      isFocused && styles.focused,
      error && styles.error,
      disabled && styles.disabled,
      style,
    ];
    return baseStyle;
  };

  const getInputStyle = () => {
    return [
      styles.input,
      styles[`${size}Text`],
      leftIcon && styles.inputWithLeftIcon,
      (rightIcon || secureTextEntry) && styles.inputWithRightIcon,
    ];
  };

  const handleRightIconPress = () => {
    if (secureTextEntry) {
      setIsSecure(!isSecure);
    } else if (onRightIconPress) {
      onRightIconPress();
    }
  };

  const getRightIconName = () => {
    if (secureTextEntry) {
      return isSecure ? 'eye.slash' : 'eye';
    }
    return rightIcon || '';
  };

  const getIconColor = () => {
    if (error) return MedicalColors.accent[500];
    if (isFocused) return MedicalColors.primary[500];
    return MedicalColors.neutral[400];
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, error && styles.labelError]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      
      <View style={getInputContainerStyle()}>
        {leftIcon && (
          <IconSymbol
            name={leftIcon}
            size={20}
            color={getIconColor()}
            style={styles.leftIcon}
          />
        )}
        
        <TextInput
          style={getInputStyle()}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isSecure}
          editable={!disabled}
          placeholderTextColor={MedicalColors.neutral[400]}
          {...props}
        />
        
        {(rightIcon || secureTextEntry) && (
          <TouchableOpacity
            onPress={handleRightIconPress}
            style={styles.rightIcon}
            disabled={disabled}
          >
            <IconSymbol
              name={getRightIconName()}
              size={20}
              color={getIconColor()}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.neutral[700],
    marginBottom: 8,
  },
  labelError: {
    color: MedicalColors.accent[500],
  },
  required: {
    color: MedicalColors.accent[500],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: MedicalColors.neutral[200],
    backgroundColor: '#FFFFFF',
  },
  // Variants
  default: {
    backgroundColor: '#FFFFFF',
  },
  filled: {
    backgroundColor: MedicalColors.neutral[50],
    borderColor: 'transparent',
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  // Sizes
  small: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
  },
  large: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 52,
  },
  // States
  focused: {
    borderColor: MedicalColors.primary[500],
    shadowColor: MedicalColors.primary[500],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  error: {
    borderColor: MedicalColors.accent[500],
  },
  disabled: {
    backgroundColor: MedicalColors.neutral[100],
    opacity: 0.6,
  },
  input: {
    flex: 1,
    color: MedicalColors.neutral[900],
    fontSize: 16,
  },
  inputWithLeftIcon: {
    marginLeft: 8,
  },
  inputWithRightIcon: {
    marginRight: 8,
  },
  // Text sizes
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  leftIcon: {
    marginRight: 4,
  },
  rightIcon: {
    marginLeft: 4,
    padding: 4,
  },
  errorText: {
    fontSize: 14,
    color: MedicalColors.accent[500],
    marginTop: 4,
  },
}); 