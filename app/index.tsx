import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { authService } from '@/src/services/authService';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export default function Index() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      // Initialize auth state and check if user should remain logged in
      const { isAuthenticated: authState } = await authService.initializeAuth();
      
      setIsAuthenticated(authState);
      
      // Small delay for smooth transition
      setTimeout(() => {
        setIsCheckingAuth(false);
      }, 1500);
      
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      setIsCheckingAuth(false);
    }
  };

  // Show loading screen while checking auth
  if (isCheckingAuth) {
    return (
      <View style={styles.container}>
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
            <Text style={styles.loadingText}>Checking your session...</Text>
          </Animated.View>
        </Animated.View>
      </View>
    );
  }

  // Redirect based on auth state
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/welcome" />;
  }
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