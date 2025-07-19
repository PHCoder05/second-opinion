import OnboardingLayout from '@/components/layout/OnboardingLayout';
import { IconSymbol } from '@/components/ui';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const OnboardingScreenStep6 = () => {
  const router = useRouter();

  const handleComplete = async () => {
    try {
      // Mark onboarding as completed
      await AsyncStorage.setItem('onboarding_completed', 'true');
      // Navigate to health assessment
      router.push('/comprehensive-health-assessment');
    } catch (error) {
      console.error('Error saving onboarding completion:', error);
      router.push('/comprehensive-health-assessment');
    }
  };

  const handleSkip = async () => {
    try {
      // Mark onboarding as completed even when skipped
      await AsyncStorage.setItem('onboarding_completed', 'true');
      router.push('/(tabs)');
    } catch (error) {
      console.error('Error saving onboarding completion:', error);
      router.push('/(tabs)');
    }
  };

  return (
    <OnboardingLayout
      backgroundColor="rgb(245, 235, 255)"
      progress="100%"
      title="EHR Access at your fingertips, anywhere."
      subtitle="Empower your health data anywhere."
      onNext={handleComplete}
      onBack={() => router.back()}
      onSkip={handleSkip}
    >
      <View style={styles.illustration}>
        <View style={styles.ehrContainer}>
          <View style={styles.ehrHeader}>
            <IconSymbol name="folder_shared" size={32} color="rgb(147, 51, 234)" />
            <Text style={styles.ehrTitle}>Electronic Health Records</Text>
          </View>
          <View style={styles.recordCards}>
            <View style={styles.recordCard}>
              <View style={styles.recordIcon}>
                <IconSymbol name="monitor_heart" size={20} color="white" />
              </View>
              <View style={styles.recordInfo}>
                <Text style={styles.recordTitle}>Vital Signs</Text>
                <Text style={styles.recordDate}>Updated 2 hours ago</Text>
              </View>
              <IconSymbol name="chevron_right" size={16} color="rgb(147, 51, 234)" />
            </View>
            <View style={styles.recordCard}>
              <View style={styles.recordIcon}>
                <IconSymbol name="medication" size={20} color="white" />
              </View>
              <View style={styles.recordInfo}>
                <Text style={styles.recordTitle}>Medications</Text>
                <Text style={styles.recordDate}>3 active prescriptions</Text>
              </View>
              <IconSymbol name="chevron_right" size={16} color="rgb(147, 51, 234)" />
            </View>
            <View style={styles.recordCard}>
              <View style={styles.recordIcon}>
                <IconSymbol name="event_note" size={20} color="white" />
              </View>
              <View style={styles.recordInfo}>
                <Text style={styles.recordTitle}>Lab Results</Text>
                <Text style={styles.recordDate}>Last test: 1 week ago</Text>
              </View>
              <IconSymbol name="chevron_right" size={16} color="rgb(147, 51, 234)" />
            </View>
          </View>
          <View style={styles.securityBadge}>
            <IconSymbol name="security" size={16} color="rgb(147, 51, 234)" />
            <Text style={styles.securityText}>HIPAA Compliant & Secure</Text>
          </View>
          <View style={styles.syncStatus}>
            <IconSymbol name="sync" size={16} color="rgb(34, 197, 94)" />
            <Text style={styles.syncText}>All records synced</Text>
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
  ehrContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  ehrHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  ehrTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgb(147, 51, 234)',
    marginTop: 8,
  },
  recordCards: {
    marginBottom: 20,
  },
  recordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  recordIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgb(147, 51, 234)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recordInfo: {
    flex: 1,
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgb(147, 51, 234)',
  },
  recordDate: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
    marginTop: 2,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  securityText: {
    fontSize: 14,
    color: 'rgb(147, 51, 234)',
    marginLeft: 8,
    fontWeight: '500',
  },
  syncStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    padding: 12,
    borderRadius: 12,
  },
  syncText: {
    fontSize: 14,
    color: 'rgb(34, 197, 94)',
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default OnboardingScreenStep6; 