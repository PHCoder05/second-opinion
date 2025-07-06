import { View, StyleSheet } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import OnboardingLayout from '@/components/layout/OnboardingLayout';

const OnboardingScreenStep3 = () => {
  const router = useRouter();

  return (
    <OnboardingLayout
      backgroundColor="rgb(235, 245, 255)"
      progress="50%"
      title="AI-Powered Symptom Analysis, Made Easy"
      subtitle="Analyze your symptom with AI"
      onNext={() => router.push('/onboarding-step4')}
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

export default OnboardingScreenStep3; 