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
  Platform
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Animated, { FadeIn } from 'react-native-reanimated';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Link, useRouter } from 'expo-router';
import { authService } from '../src/services/authService';
import { profileService } from '../src/services/profileService';

export default function SignInScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const styles = createStyles(colorScheme);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await authService.signIn(email, password);
      
      if (error) {
        Alert.alert('Error', error.message);
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
          Alert.alert('Welcome Back!', 'You have been signed in successfully. Your session will remain active until you manually log out.');
        } else {
          // New user or incomplete profile, go to onboarding
          router.push('/onboarding');
        }
      }
    } catch (error) {
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
        <Animated.View entering={FadeIn.duration(800).delay(200)} style={styles.content}>
          <View style={styles.header}>
            <Image
              source={require('@/assets/images/partial-react-logo.png')}
              style={styles.logo}
            />
          </View>

          <View style={styles.formContainer}>
            <View style={styles.titleContainer}>
              <ThemedText type="title" style={styles.title}>Sign In</ThemedText>
              <ThemedText style={styles.subtitle}>Let's experience the joy of telehealth AI</ThemedText>
            </View>

            <View style={styles.inputsContainer}>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Email Address</ThemedText>
                <View style={[styles.inputWrapper, styles.inputWrapperFocused]}>
                  <IconSymbol name="email" size={24} color={Colors[colorScheme].text} />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    style={[styles.input, { color: '#000' }]}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor={Colors[colorScheme].gray}
                    editable={!isLoading}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Password</ThemedText>
                <View style={styles.inputWrapper}>
                  <IconSymbol name="lock" size={24} color={Colors[colorScheme].text} />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    style={[styles.input, { color: '#000' }]}
                    secureTextEntry={!passwordVisible}
                    placeholderTextColor={Colors[colorScheme].gray}
                    editable={!isLoading}
                  />
                  <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} disabled={isLoading}>
                    <IconSymbol name={passwordVisible ? "eye" : "eye-off"} size={24} color={Colors[colorScheme].gray} />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.button, isLoading && styles.buttonDisabled]} 
                onPress={handleSignIn}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>{isLoading ? 'Signing In...' : 'Sign In'}</Text>
                {!isLoading && <IconSymbol name="arrow.right" size={24} color="#FFFFFF" />}
              </TouchableOpacity>
            </View>
            
            <View style={styles.socialContainer}>
                <View style={styles.socialButtons}>
                    <TouchableOpacity style={styles.socialButton} disabled={isLoading}>
                        <IconSymbol name="facebook" size={24} color={Colors.light.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton} disabled={isLoading}>
                        <IconSymbol name="google" size={24} color={Colors.light.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton} disabled={isLoading}>
                        <IconSymbol name="apple" size={24} color={Colors.light.text} />
                    </TouchableOpacity>
                </View>
            </View>
          </View>

          <View style={styles.footer}>
            <ThemedText style={{ color: '#000' }}>Don't have an account? </ThemedText>
            <Link href="/signup" disabled={isLoading}>
              <ThemedText style={[styles.link, { color: '#000' }]}>Sign Up</ThemedText>
            </Link>
          </View>
          <TouchableOpacity 
            onPress={() => router.push('/forgot-password')} 
            style={{ marginTop: 16, alignSelf: 'center' }}
            disabled={isLoading}
          >
            <Text style={{ color: '#000', textAlign: 'center', fontSize: 16, textDecorationLine: 'underline' }}>
              Forgot your password?
            </Text>
          </TouchableOpacity>
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
      shadowColor: "rgb(47, 60, 51)",
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.05,
      shadowRadius: 16,
      elevation: 1,
      gap: 8,
    },
    inputWrapperFocused: {
        borderColor: 'rgb(132, 204, 22)',
        borderWidth: 1,
        shadowColor: "rgb(132, 204, 22)",
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
      shadowColor: "rgb(132, 204, 22)",
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    socialContainer: {
        alignItems: 'center',
        gap: 40,
    },
    socialButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    socialButton: {
        width: 56,
        height: 56,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgb(162, 169, 164)',
        justifyContent: 'center',
        alignItems: 'center',
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
    centeredWrapper: {
      flex: 1,
      justifyContent: 'center',
    },
    buttonDisabled: {
      opacity: 0.7,
    },
  }); 