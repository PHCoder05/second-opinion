import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Animated, { FadeIn } from 'react-native-reanimated';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Link, useRouter } from 'expo-router';
import { authService } from '../src/services/authService';

export default function SignUpScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const styles = createStyles(colorScheme);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    let error = '';
    if (!password) {
      error = 'Password is required.';
    } else if (password.length < 8) {
      error = 'Password must be at least 8 characters.';
    } else if (!/[A-Z]/.test(password)) {
      error = 'Password must contain at least one uppercase letter.';
    } else if (password !== confirmPassword) {
      error = "Passwords don't match";
    }
    setPasswordError(error);
    if (error) return;
    if (!email) {
      Alert.alert('Error', 'Email is required.');
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await authService.signUp(email, password);
      if (error) {
        Alert.alert('Error', error.message);
        return;
      }
      if (data?.user) {
        Alert.alert('Success', 'Account created! Please check your email to verify your account.');
        router.push('/signin');
      }
    } catch (e) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 40, paddingHorizontal: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          entering={FadeIn.duration(800).delay(200)}
          style={styles.content}>
          <View style={styles.header}>
            <Image
              source={require('@/assets/images/partial-react-logo.png')}
              style={styles.logo}
            />
          </View>

          <View style={styles.formContainer}>
            <View style={styles.titleContainer}>
              <ThemedText type="title" style={styles.title}>
                Sign Up For Free
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Sign up in minutes. Your account is safe.
              </ThemedText>
            </View>

            <View style={styles.inputsContainer}>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Email Address</ThemedText>
                <View style={styles.inputWrapper}>
                  <IconSymbol
                    name="email"
                    size={24}
                    color={Colors[colorScheme].text}
                  />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    style={[styles.input, { color: '#000' }]}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor={Colors[colorScheme].icon}
                    editable={!isLoading}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Password</ThemedText>
                <View style={[styles.inputWrapper, passwordError ? styles.inputWrapperError : null]}>
                  <IconSymbol
                    name="lock"
                    size={24}
                    color={Colors[colorScheme].text}
                  />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    style={[styles.input, { color: '#000' }]}
                    secureTextEntry={!passwordVisible}
                    placeholderTextColor={Colors[colorScheme].icon}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    onPress={() => setPasswordVisible(!passwordVisible)}
                    disabled={isLoading}
                  >
                    <IconSymbol
                      name={passwordVisible ? 'eye' : 'eye-off'}
                      size={24}
                      color={Colors[colorScheme].icon}
                    />
                  </TouchableOpacity>
                </View>
                {passwordError ? (
                  <View style={styles.warningContainer}>
                    <ThemedText style={styles.warningText}>{passwordError}</ThemedText>
                  </View>
                ) : null}
              </View>
              
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>
                  Confirm Password
                </ThemedText>
                <View style={styles.inputWrapper}>
                  <IconSymbol
                    name="lock"
                    size={24}
                    color={Colors[colorScheme].text}
                  />
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm your password"
                    style={[styles.input, { color: '#000' }]}
                    secureTextEntry={!confirmPasswordVisible}
                    placeholderTextColor={Colors[colorScheme].icon}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setConfirmPasswordVisible(!confirmPasswordVisible)
                    }
                    disabled={isLoading}
                  >
                    <IconSymbol
                      name={confirmPasswordVisible ? 'eye' : 'eye-off'}
                      size={24}
                      color={Colors[colorScheme].icon}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={[styles.button, isLoading && styles.buttonDisabled]} onPress={handleSignUp} disabled={isLoading}>
                <Text style={styles.buttonText}>{isLoading ? 'Signing Up...' : 'Sign Up'}</Text>
                {!isLoading && <IconSymbol name="arrow.right" size={24} color="#FFFFFF" />}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <ThemedText style={{ color: '#000' }}>Already have an account? </ThemedText>
            <Link href="/signin" disabled={isLoading}>
              <ThemedText style={[styles.link, { color: '#000' }]}>Sign In</ThemedText>
            </Link>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colorScheme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F5F5',
    },
    scrollContainer: {
      flex: 1,
    },
    scrollContentContainer: {
      paddingVertical: 40,
      paddingHorizontal: 16,
    },
    content: {
      alignItems: 'center',
      gap: 32,
    },
    header: {
      alignItems: 'center',
    },
    logo: {
      width: 56,
      height: 56,
    },
    formContainer: {
      width: '100%',
      gap: 32,
    },
    titleContainer: {
      gap: 8,
      alignItems: 'center',
    },
    title: {
      color: 'rgb(49, 58, 52)',
      textAlign: 'center',
    },
    subtitle: {
      color: 'rgb(100, 112, 103)',
      textAlign: 'center',
      fontSize: 16,
      lineHeight: 26,
    },
    inputsContainer: {
      gap: 24,
    },
    inputGroup: {
      gap: 8,
    },
    inputLabel: {
      color: 'rgb(49, 58, 52)',
      fontSize: 16,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 21,
      paddingHorizontal: 16,
      height: 56,
      shadowColor: 'rgb(47, 60, 51)',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.05,
      shadowRadius: 16,
      elevation: 1,
      gap: 8,
    },
    inputWrapperError: {
      borderColor: 'rgb(244, 63, 94)',
      borderWidth: 1,
      shadowColor: 'rgb(244, 63, 94)',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: Colors[colorScheme].text,
    },
    button: {
      height: 56,
      backgroundColor: 'rgb(132, 204, 22)',
      borderRadius: 21,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 12,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    link: {
      color: 'rgb(132, 204, 22)',
      fontWeight: 'bold',
    },
    warningContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgb(255, 238, 240)',
        borderColor: 'rgb(244, 63, 94)',
        borderWidth: 1,
        borderRadius: 17,
        paddingVertical: 12,
        paddingHorizontal: 12,
        marginTop: -16,
    },
    warningText: {
        color: 'rgb(49, 58, 52)',
    },
    centeredWrapper: {
      flex: 1,
      justifyContent: 'center',
    },
    buttonDisabled: {
      opacity: 0.7,
    },
  }); 