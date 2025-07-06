import { View, StyleSheet } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import OnboardingLayout from '@/components/layout/OnboardingLayout';

const OnboardingScreenStep5 = () => {
  const router = useRouter();

  return (
    <OnboardingLayout
      backgroundColor="rgb(255, 253, 239)"
      progress="83%"
      title="Intuitive Medication Management"
      subtitle="Data Driven Med Management with AI"
      onNext={() => router.push('/onboarding-step6')}
      onBack={() => router.back()}
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

export default OnboardingScreenStep5; 