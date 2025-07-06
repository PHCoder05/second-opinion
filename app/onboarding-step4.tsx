import { View, StyleSheet } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import OnboardingLayout from '@/components/layout/OnboardingLayout';

const OnboardingScreenStep4 = () => {
  const router = useRouter();

  return (
    <OnboardingLayout
      backgroundColor="rgb(236, 253, 229)"
      progress="67%"
      title="AI Driven Virtual Consultations"
      subtitle="Say goodbye to old digital consultations"
      onNext={() => router.push('/onboarding-step5')}
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

export default OnboardingScreenStep4; 