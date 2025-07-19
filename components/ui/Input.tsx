import { BorderRadius, ComponentSizes, FunctionalColors, MedicalColors, Spacing, Typography } from '@/constants/Colors';
import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TextInput, TextInputProps, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { IconSymbol } from './IconSymbol';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  leftIcon?: string;
  rightIcon?: string;
  variant?: 'default' | 'medical' | 'search' | 'password';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  onRightIconPress?: () => void;
  onLeftIconPress?: () => void;
  testID?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  required = false,
  error,
  hint,
  leftIcon,
  rightIcon,
  variant = 'default',
  size = 'medium',
  disabled = false,
  loading = false,
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  onRightIconPress,
  onLeftIconPress,
  testID,
  value,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(props.secureTextEntry || false);
  const inputRef = useRef<TextInput>(null);
  const focusAnimation = useRef(new Animated.Value(0)).current;

  const handleFocus = (e: any) => {
    setIsFocused(true);
    Animated.timing(focusAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    Animated.timing(focusAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onBlur?.(e);
  };

  const getContainerStyle = (): ViewStyle[] => {
    const baseStyle = [
      styles.container,
      styles[size],
      style,
    ];

    if (variant === 'medical') {
      baseStyle.push(styles.medicalContainer);
    }

    if (variant === 'search') {
      baseStyle.push(styles.searchContainer);
    }

    return baseStyle;
  };

  const getInputContainerStyle = (): ViewStyle[] => {
    const baseStyle = [
      styles.inputContainer,
      styles[`${size}Container`],
    ];

    if (isFocused) {
      baseStyle.push(styles.focused);
    }

    if (error) {
      baseStyle.push(styles.error);
    }

    if (disabled) {
      baseStyle.push(styles.disabled);
    }

    switch (variant) {
      case 'medical':
        baseStyle.push(styles.medicalInput);
        break;
      case 'search':
        baseStyle.push(styles.searchInput);
        break;
      case 'password':
        baseStyle.push(styles.passwordInput);
        break;
    }

    return baseStyle;
  };

  const getInputStyle = (): TextStyle[] => {
    const baseStyle = [
      styles.input,
      styles[`${size}Text`],
      inputStyle,
    ];

    if (disabled) {
      baseStyle.push(styles.disabledText);
    }

    if (multiline) {
      baseStyle.push(styles.multilineInput);
    }

    return baseStyle;
  };

  const getIconColor = (): string => {
    if (disabled) return FunctionalColors.textDisabled;
    if (error) return MedicalColors.error[500];
    if (isFocused) return MedicalColors.primary[500];
    return FunctionalColors.textSecondary;
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

  const toggleSecureEntry = () => {
    setIsSecure(!isSecure);
  };

  const renderPasswordToggle = () => {
    if (variant !== 'password' && !props.secureTextEntry) return null;
    
    return (
      <TouchableOpacity
        onPress={toggleSecureEntry}
        style={styles.iconButton}
        accessibilityRole="button"
        accessibilityLabel={isSecure ? "Show password" : "Hide password"}
      >
        <IconSymbol
          name={isSecure ? "eye.slash.fill" : "eye.fill"}
          size={getIconSize()}
          color={getIconColor()}
        />
      </TouchableOpacity>
    );
  };

  const renderLabel = () => {
    if (!label) return null;

    const labelColor = error ? MedicalColors.error[500] : 
                     isFocused ? MedicalColors.primary[500] : 
                     FunctionalColors.textSecondary;

    return (
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { color: labelColor }]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      </View>
    );
  };

  const renderHint = () => {
    if (!hint && !error) return null;

    const text = error || hint;
    const textColor = error ? MedicalColors.error[500] : FunctionalColors.textSecondary;

    return (
      <Text 
        style={[styles.hint, { color: textColor }]}
        accessibilityRole="text"
        accessibilityLabel={error ? `Error: ${text}` : `Hint: ${text}`}
      >
        {text}
      </Text>
    );
  };

  return (
    <View style={StyleSheet.flatten(getContainerStyle())} testID={testID}>
      {renderLabel()}
      
      <Animated.View
        style={[
          StyleSheet.flatten(getInputContainerStyle()),
          {
            borderColor: focusAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [
                error ? MedicalColors.error[500] : FunctionalColors.border,
                error ? MedicalColors.error[500] : MedicalColors.primary[500]
              ],
            }),
          },
        ]}
      >
        {leftIcon && (
          <TouchableOpacity
            onPress={onLeftIconPress}
            style={styles.iconButton}
            disabled={!onLeftIconPress}
            accessibilityRole={onLeftIconPress ? "button" : undefined}
          >
            <IconSymbol
              name={leftIcon}
              size={getIconSize()}
              color={getIconColor()}
            />
          </TouchableOpacity>
        )}

        <TextInput
          ref={inputRef}
          style={StyleSheet.flatten(getInputStyle())}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled && !loading}
          placeholderTextColor={FunctionalColors.inputPlaceholder}
          selectionColor={MedicalColors.primary[500]}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          secureTextEntry={isSecure}
          accessibilityLabel={label}
          accessibilityHint={hint}
          accessibilityState={{
            disabled: disabled,
            busy: loading,
          }}
          {...props}
        />

        {loading && (
          <View style={styles.iconButton}>
            <IconSymbol
              name="circle.dashed"
              size={getIconSize()}
              color={getIconColor()}
            />
          </View>
        )}

        {(variant === 'password' || props.secureTextEntry) && renderPasswordToggle()}

        {rightIcon && !loading && !(variant === 'password' || props.secureTextEntry) && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.iconButton}
            disabled={!onRightIconPress}
            accessibilityRole={onRightIconPress ? "button" : undefined}
          >
            <IconSymbol
              name={rightIcon}
              size={getIconSize()}
              color={getIconColor()}
            />
          </TouchableOpacity>
        )}
      </Animated.View>

      {renderHint()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  
  small: {
    // Small container styles
  },
  
  medium: {
    // Medium container styles
  },
  
  large: {
    // Large container styles
  },
  
  medicalContainer: {
    marginBottom: Spacing.lg,
  },
  
  searchContainer: {
    marginBottom: Spacing.sm,
  },
  
  labelContainer: {
    marginBottom: Spacing.xs,
  },
  
  label: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.medium,
    fontFamily: Typography.fonts.primary,
    lineHeight: Typography.sizes.caption * Typography.lineHeights.normal,
  },
  
  required: {
    color: MedicalColors.error[500],
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: FunctionalColors.inputBackground,
    borderWidth: 1,
    borderColor: FunctionalColors.inputBorder,
    borderRadius: BorderRadius.sm, // 4px from design system
    paddingHorizontal: Spacing.md,
    minHeight: ComponentSizes.touchTargets.minimum, // 48px minimum from JSON
  },
  
  smallContainer: {
    minHeight: 40,
    paddingHorizontal: Spacing.sm,
  },
  
  mediumContainer: {
    minHeight: ComponentSizes.touchTargets.minimum, // 48px
    paddingHorizontal: Spacing.md,
  },
  
  largeContainer: {
    minHeight: ComponentSizes.touchTargets.recommended, // 56px
    paddingHorizontal: Spacing.lg,
  },
  
  focused: {
    borderColor: FunctionalColors.inputBorderFocus,
    shadowColor: MedicalColors.primary[500],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  
  error: {
    borderColor: FunctionalColors.inputBorderError,
    backgroundColor: MedicalColors.error[50],
  },
  
  disabled: {
    backgroundColor: FunctionalColors.disabled,
    borderColor: FunctionalColors.disabled,
  },
  
  medicalInput: {
    borderColor: MedicalColors.primary[200],
    backgroundColor: MedicalColors.primary[50],
  },
  
  searchInput: {
    borderRadius: BorderRadius.lg, // Rounded search input
    backgroundColor: MedicalColors.secondary[50],
  },
  
  passwordInput: {
    // Password-specific styles
  },
  
  input: {
    flex: 1,
    fontSize: Typography.sizes.body,
    fontFamily: Typography.fonts.primary,
    color: FunctionalColors.text,
    paddingVertical: Spacing.sm,
    includeFontPadding: false,
  },
  
  smallText: {
    fontSize: Typography.sizes.caption,
  },
  
  mediumText: {
    fontSize: Typography.sizes.body,
  },
  
  largeText: {
    fontSize: Typography.sizes.subheading,
  },
  
  multilineInput: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    textAlignVertical: 'top',
  },
  
  disabledText: {
    color: FunctionalColors.textDisabled,
  },
  
  iconButton: {
    padding: Spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  hint: {
    fontSize: Typography.sizes.small,
    fontFamily: Typography.fonts.primary,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
});

// Specialized input components for medical contexts
export const MedicalInput: React.FC<Omit<InputProps, 'variant'>> = (props) => (
  <Input variant="medical" {...props} />
);

export const SearchInput: React.FC<Omit<InputProps, 'variant'>> = (props) => (
  <Input variant="search" leftIcon="magnifyingglass" {...props} />
);

export const PasswordInput: React.FC<Omit<InputProps, 'variant'>> = (props) => (
  <Input variant="password" secureTextEntry {...props} />
);

// Medical data input components
export const VitalInput: React.FC<Omit<InputProps, 'variant' | 'keyboardType'>> = (props) => (
  <Input variant="medical" keyboardType="numeric" {...props} />
);

export const DateInput: React.FC<Omit<InputProps, 'variant'>> = (props) => (
  <Input variant="medical" rightIcon="calendar" {...props} />
);

export const PhoneInput: React.FC<Omit<InputProps, 'variant' | 'keyboardType'>> = (props) => (
  <Input variant="default" keyboardType="phone-pad" leftIcon="phone.fill" {...props} />
);

export const EmailInput: React.FC<Omit<InputProps, 'variant' | 'keyboardType'>> = (props) => (
  <Input variant="default" keyboardType="email-address" leftIcon="envelope.fill" {...props} />
);

export default Input; 