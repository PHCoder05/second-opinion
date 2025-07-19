import OnboardingLayout from '@/components/layout/OnboardingLayout';
import { IconSymbol } from '@/components/ui';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
      <View style={styles.illustration}>
        <View style={styles.medicationContainer}>
          <View style={styles.medicationHeader}>
            <IconSymbol name="medication" size={32} color="rgb(245, 158, 11)" />
            <Text style={styles.medicationTitle}>Smart Medication</Text>
          </View>
          <View style={styles.medicationSchedule}>
            <View style={styles.scheduleItem}>
              <View style={styles.timeSlot}>
                <IconSymbol name="schedule" size={16} color="rgb(245, 158, 11)" />
                <Text style={styles.timeText}>8:00 AM</Text>
              </View>
              <View style={styles.medicationPill}>
                <IconSymbol name="medication" size={20} color="white" />
              </View>
              <Text style={styles.medicationName}>Aspirin</Text>
            </View>
            <View style={styles.scheduleItem}>
              <View style={styles.timeSlot}>
                <IconSymbol name="schedule" size={16} color="rgb(245, 158, 11)" />
                <Text style={styles.timeText}>2:00 PM</Text>
              </View>
              <View style={styles.medicationPill}>
                <IconSymbol name="medication" size={20} color="white" />
              </View>
              <Text style={styles.medicationName}>Vitamin D</Text>
            </View>
            <View style={styles.scheduleItem}>
              <View style={styles.timeSlot}>
                <IconSymbol name="schedule" size={16} color="rgb(245, 158, 11)" />
                <Text style={styles.timeText}>8:00 PM</Text>
              </View>
              <View style={styles.medicationPill}>
                <IconSymbol name="medication" size={20} color="white" />
              </View>
              <Text style={styles.medicationName}>Omega-3</Text>
            </View>
          </View>
          <View style={styles.aiInsights}>
            <View style={styles.insightHeader}>
              <IconSymbol name="psychology" size={16} color="rgb(245, 158, 11)" />
              <Text style={styles.insightTitle}>AI Insights</Text>
            </View>
            <View style={styles.insightItem}>
              <IconSymbol name="trending_up" size={14} color="rgb(34, 197, 94)" />
              <Text style={styles.insightText}>Blood pressure improving</Text>
            </View>
            <View style={styles.insightItem}>
              <IconSymbol name="notifications" size={14} color="rgb(239, 68, 68)" />
              <Text style={styles.insightText}>Refill reminder in 3 days</Text>
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
  medicationContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  medicationHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  medicationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgb(245, 158, 11)',
    marginTop: 8,
  },
  medicationSchedule: {
    marginBottom: 20,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    minWidth: 80,
  },
  timeText: {
    fontSize: 14,
    color: 'rgb(245, 158, 11)',
    marginLeft: 4,
    fontWeight: '500',
  },
  medicationPill: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgb(245, 158, 11)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  medicationName: {
    fontSize: 14,
    color: 'rgb(49, 58, 52)',
    fontWeight: '500',
  },
  aiInsights: {
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
    padding: 16,
    borderRadius: 12,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgb(245, 158, 11)',
    marginLeft: 8,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 14,
    color: 'rgb(49, 58, 52)',
    marginLeft: 8,
  },
});

export default OnboardingScreenStep5; 