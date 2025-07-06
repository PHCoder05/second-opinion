import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn } from 'react-native-reanimated';

const WelcomeScreen = () => {
  const router = useRouter();

  const handleGetStartedPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/onboarding');
  };

  return (
    <Animated.View style={styles.container} entering={FadeIn}>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              {/* Placeholder for Logo */}
            </View>
          </View>

          <Text style={styles.title}>
            Welcome to the osler AI Telehealth UI kit
          </Text>
          <Text style={styles.subtitle}>
            Your mindful mental health AI companion for everyone anywhere
          </Text>

          <View style={styles.illustrationContainer}>
            {/* Placeholder for Illustration */}
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleGetStartedPress}>
            <Text style={styles.primaryButtonText}>Get Started</Text>
            <IconSymbol name="chevron.right" color="white" size={24} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(tabs)')}>
            <Text style={styles.signInText}>Already have an account? <Text style={styles.signInLink}>Sign In</Text></Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(245, 245, 245)',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 24,
    backgroundColor: 'rgb(49, 58, 52)',
    // Add your logo component or image here
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'rgb(49, 58, 52)',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: 'rgb(100, 112, 103)',
    marginBottom: 48,
    paddingHorizontal: 20,
  },
  illustrationContainer: {
    width: 256,
    height: 256,
    borderRadius: 96,
    backgroundColor: 'white',
    marginBottom: 48,
    // Add your illustration component or image here
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(132, 204, 22)',
    borderRadius: 21,
    paddingVertical: 15,
    paddingHorizontal: 30,
    width: '80%',
    marginBottom: 24,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  signInText: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
  },
  signInLink: {
    fontWeight: 'bold',
    color: 'rgb(49, 58, 52)',
  },
}); 