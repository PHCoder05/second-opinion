import { ThemedText } from '@/components/ThemedText';
import { Button, IconSymbol, Input } from '@/components/ui';
import { MedicalColors, MedicalGradients } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { authService } from '../src/services/authService';
import { profileService } from '../src/services/profileService';

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    return isValid;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { data, error } = await authService.signIn(email, password);
      
      if (error) {
        Alert.alert('Sign In Failed', error.message);
        return;
      }

      if (data?.user) {
        // Start a new session for tracking
        await profileService.startSession(data.user.id, 'Mobile App');
        
        // Log the login activity
        await profileService.logActivity(data.user.id, 'login', {
          login_method: 'email_password',
          device: Platform.OS
        });
        
        // Check if user has completed onboarding
        const { data: profile } = await profileService.getUserProfile(data.user.id);
        
        if (profile && profile.first_name) {
          // User has profile, go directly to main app
          router.replace('/(tabs)');
        } else {
          // New user or incomplete profile, go to onboarding
          router.replace('/onboarding');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[MedicalColors.primary[50], '#FFFFFF']}
        style={StyleSheet.absoluteFillObject}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeIn.duration(800).delay(200)} style={styles.content}>
            {/* Header */}
            <Animated.View style={styles.header} entering={FadeInDown.duration(600)}>
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={MedicalGradients?.primary || ['#007BFF', '#0056D3']}
                  style={styles.logoGradient}
                >
                  <IconSymbol name="stethoscope" size={28} color="#FFFFFF" />
                </LinearGradient>
              </View>
              <ThemedText type="title" style={styles.title}>Welcome Back</ThemedText>
              <ThemedText style={styles.subtitle}>Sign in to continue your healthcare journey</ThemedText>
            </Animated.View>

            {/* Form */}
            <Animated.View style={styles.formContainer} entering={FadeInDown.duration(600).delay(200)}>
              <View style={styles.inputsContainer}>
                <Input
                  label="Email Address"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  leftIcon="email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={emailError}
                  disabled={isLoading}
                  required
                />

                <Input
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  leftIcon="lock"
                  secureTextEntry={true}
                  error={passwordError}
                  disabled={isLoading}
                  required
                />

                <Button
                  title={isLoading ? 'Signing In...' : 'Sign In'}
                  onPress={handleSignIn}
                  variant="primary"
                  size="large"
                  icon={isLoading ? undefined : "arrow_forward"}
                  iconPosition="right"
                  loading={isLoading}
                  disabled={isLoading}
                  fullWidth
                  style={styles.signInButton}
                />
              </View>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <ThemedText style={styles.dividerText}>or continue with</ThemedText>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialContainer}>
                <Button
                  title="Google"
                  onPress={() => {/* TODO: Implement Google Sign-In */}}
                  variant="outline"
                  size="medium"
                  icon="language"
                  iconPosition="left"
                  disabled={isLoading}
                  style={styles.socialButton}
                />
                <Button
                  title="Apple"
                  onPress={() => {/* TODO: Implement Apple Sign-In */}}
                  variant="outline"
                  size="medium"
                  icon="apple"
                  iconPosition="left"
                  disabled={isLoading}
                  style={styles.socialButton}
                />
              </View>
            </Animated.View>

            {/* Footer */}
            <Animated.View style={styles.footer} entering={FadeInDown.duration(600).delay(400)}>
              <View style={styles.footerLinks}>
                <ThemedText style={styles.footerText}>
                  Don't have an account?{' '}
                  <Link href="/signup" disabled={isLoading}>
                    <ThemedText style={styles.link}>Sign Up</ThemedText>
                  </Link>
                </ThemedText>
              </View>
              
              <Button
                title="Forgot Password?"
                onPress={() => router.push('/forgot-password')}
                variant="ghost"
                size="small"
                disabled={isLoading}
                style={styles.forgotButton}
              />
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    gap: 40,
  },
  header: {
    alignItems: 'center',
    gap: 16,
  },
  logoContainer: {
    marginBottom: 8,
  },
  logoGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: MedicalColors.primary[500],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    color: MedicalColors.neutral[900],
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: MedicalColors.neutral[600],
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  formContainer: {
    width: '100%',
    gap: 24,
  },
  inputsContainer: {
    gap: 20,
  },
  signInButton: {
    marginTop: 8,
    shadowColor: MedicalColors.primary[500],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: MedicalColors.neutral[200],
  },
  dividerText: {
    color: MedicalColors.neutral[500],
    fontSize: 14,
    paddingHorizontal: 16,
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    gap: 16,
  },
  footerLinks: {
    alignItems: 'center',
  },
  footerText: {
    color: MedicalColors.neutral[600],
    fontSize: 16,
    textAlign: 'center',
  },
  link: {
    color: MedicalColors.primary[600],
    fontWeight: '600',
  },
  forgotButton: {
    marginTop: 8,
  },
}); 