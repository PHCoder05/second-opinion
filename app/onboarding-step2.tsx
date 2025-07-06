import { View, StyleSheet } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import OnboardingLayout from '@/components/layout/OnboardingLayout';

const OnboardingScreenStep2 = () => {
  const router = useRouter();

  return (
    <OnboardingLayout
      backgroundColor="rgb(255, 235, 235)"
      progress="33%"
      title="Emphatic Wellness AI Chatbot for All"
      subtitle="Wellness AI Chatbot at your fingertips."
      onNext={() => router.push('/onboarding-step3')}
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

export default OnboardingScreenStep2; 