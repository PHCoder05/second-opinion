import { View, StyleSheet } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import OnboardingLayout from '@/components/layout/OnboardingLayout';

const OnboardingScreen = () => {
  const router = useRouter();

  return (
    <OnboardingLayout
      backgroundColor="rgb(236, 253, 229)"
      progress="17%"
      title="Smart Appointment Scheduling"
      subtitle="Experience the power of smart scheduling"
      onNext={() => router.push('/onboarding-step2')}
      onSkip={() => router.push('/(tabs)')}
    >
      <View style={styles.illustration} />
    </OnboardingLayout>
  );
};

const styles = StyleSheet.create({
  illustration: {
    width: 250,
    height: 250,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 20,
  },
});

export default OnboardingScreen; 