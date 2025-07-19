import OnboardingLayout from '@/components/layout/OnboardingLayout';
import { IconSymbol } from '@/components/ui';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
      <View style={styles.illustration}>
        <View style={styles.analysisContainer}>
          <View style={styles.analysisHeader}>
            <IconSymbol name="psychology" size={32} color="rgb(59, 130, 246)" />
            <Text style={styles.analysisTitle}>AI Symptom Analysis</Text>
          </View>
          <View style={styles.symptomCard}>
            <View style={styles.symptomIcon}>
              <IconSymbol name="favorite" size={24} color="rgb(239, 68, 68)" />
            </View>
            <View style={styles.symptomInfo}>
              <Text style={styles.symptomName}>Headache</Text>
              <Text style={styles.symptomSeverity}>Severity: Moderate</Text>
            </View>
          </View>
          <View style={styles.aiAnalysis}>
            <View style={styles.analysisBar}>
              <View style={[styles.analysisProgress, { width: '75%' }]} />
            </View>
            <Text style={styles.analysisText}>Analyzing symptoms...</Text>
          </View>
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Possible Causes:</Text>
            <View style={styles.resultItem}>
              <IconSymbol name="check_circle" size={16} color="rgb(34, 197, 94)" />
              <Text style={styles.resultText}>Tension headache (85%)</Text>
            </View>
            <View style={styles.resultItem}>
              <IconSymbol name="check_circle" size={16} color="rgb(34, 197, 94)" />
              <Text style={styles.resultText}>Dehydration (60%)</Text>
            </View>
          </View>
        </View>
      </View>
    </OnboardingLayout>
  );
};

const styles = StyleSheet.create({
  illustration: {
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analysisContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  analysisHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgb(59, 130, 246)',
    marginTop: 8,
  },
  symptomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  symptomIcon: {
    marginRight: 12,
  },
  symptomInfo: {
    flex: 1,
  },
  symptomName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgb(239, 68, 68)',
  },
  symptomSeverity: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
    marginTop: 2,
  },
  aiAnalysis: {
    marginBottom: 16,
  },
  analysisBar: {
    height: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 4,
    marginBottom: 8,
  },
  analysisProgress: {
    height: 8,
    backgroundColor: 'rgb(59, 130, 246)',
    borderRadius: 4,
  },
  analysisText: {
    fontSize: 14,
    color: 'rgb(59, 130, 246)',
    textAlign: 'center',
  },
  resultsContainer: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    padding: 16,
    borderRadius: 12,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgb(34, 197, 94)',
    marginBottom: 8,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  resultText: {
    fontSize: 14,
    color: 'rgb(34, 197, 94)',
    marginLeft: 8,
  },
});

export default OnboardingScreenStep3; 