import { View, StyleSheet } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import OnboardingLayout from '@/components/layout/OnboardingLayout';

const OnboardingScreenStep6 = () => {
  const router = useRouter();

  return (
    <OnboardingLayout
      backgroundColor="rgb(245, 235, 255)"
      progress="100%"
      title="EHR Access at your fingertips, anywhere."
      subtitle="Empower your health data anywhere."
      onNext={() => router.push('/(tabs)')}
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

export default OnboardingScreenStep6; 