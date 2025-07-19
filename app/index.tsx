import { IconSymbol } from '@/components/ui';
import { authService } from '@/src/services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export default function Index() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAppState();
  }, []);



  // Note: Removed router listener as it's not available in Expo Router
  // The app state will be checked on initial load and when navigating back to root

  const checkAppState = async () => {
    try {
      // Check authentication state
      const { isAuthenticated: authState } = await authService.initializeAuth();
      console.log('Auth state:', authState);
      setIsAuthenticated(authState);
      
      // Check if user has completed onboarding
      const onboardingCompleted = await AsyncStorage.getItem('onboarding_completed');
      console.log('Onboarding completed:', onboardingCompleted);
      setHasCompletedOnboarding(onboardingCompleted === 'true');
      
      // Small delay for smooth transition
      setTimeout(() => {
        setIsCheckingAuth(false);
      }, 1500);
      
    } catch (error) {
      console.error('App state check error:', error);
      setIsAuthenticated(false);
      setHasCompletedOnboarding(false);
      setIsCheckingAuth(false);
    }
  };

  // Always render the same component structure to avoid hooks error
  return (
    <View style={styles.container}>
      {isCheckingAuth ? (
        // Show loading screen while checking app state
        <Animated.View 
          entering={FadeIn.duration(500)} 
          exiting={FadeOut.duration(500)}
          style={styles.loadingContainer}
        >
          <Animated.View 
            entering={FadeIn.delay(300)}
            style={styles.logoContainer}
          >
            <IconSymbol name="stethoscope" size={64} color="rgb(132, 204, 22)" />
          </Animated.View>
          <Animated.View entering={FadeIn.delay(600)}>
            <Text style={styles.appName}>Second Opinion</Text>
            <Text style={styles.tagline}>Expert Medical Opinions</Text>
          </Animated.View>
          <Animated.View 
            entering={FadeIn.delay(900)}
            style={styles.loadingIndicator}
          >
            <Text style={styles.loadingText}>Preparing your experience...</Text>
          </Animated.View>
        </Animated.View>
      ) : (
        // Navigation logic based on app state
        <>
          {(() => {
            console.log('Navigation decision:', { isAuthenticated, hasCompletedOnboarding });
            if (isAuthenticated) {
              // User is authenticated
              if (hasCompletedOnboarding) {
                console.log('Redirecting to main app');
                return <Redirect href="/(tabs)" />;
              } else {
                console.log('Redirecting to onboarding');
                return <Redirect href="/onboarding" />;
              }
            } else {
              // User is not authenticated
              if (hasCompletedOnboarding) {
                console.log('Redirecting to signin');
                return <Redirect href="/signin" />;
              } else {
                console.log('Redirecting to welcome');
                return <Redirect href="/welcome" />;
              }
            }
          })()}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(245, 246, 245)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(132, 204, 22, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'rgb(49, 58, 52)',
    textAlign: 'center',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: 'rgb(100, 112, 103)',
    textAlign: 'center',
    marginBottom: 48,
  },
  loadingIndicator: {
    marginTop: 32,
  },
  loadingText: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
    textAlign: 'center',
  },
}); 