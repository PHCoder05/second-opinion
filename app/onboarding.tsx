import OnboardingLayout from '@/components/layout/OnboardingLayout';
import { IconSymbol } from '@/components/ui';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
      <View style={styles.illustration}>
        <View style={styles.calendarContainer}>
          <View style={styles.calendarHeader}>
            <IconSymbol name="calendar" size={32} color="rgb(49, 58, 52)" />
            <Text style={styles.calendarTitle}>Smart Scheduling</Text>
          </View>
          <View style={styles.calendarGrid}>
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <View key={day} style={styles.calendarDay}>
                <Text style={styles.dayText}>{day}</Text>
                {day === 3 && <View style={styles.appointmentDot} />}
              </View>
            ))}
          </View>
          <View style={styles.appointmentCard}>
            <IconSymbol name="clock" size={16} color="rgb(49, 58, 52)" />
            <Text style={styles.appointmentText}>Dr. Smith - 2:30 PM</Text>
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
  calendarContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  calendarHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgb(49, 58, 52)',
    marginTop: 8,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  calendarDay: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
  },
  dayText: {
    fontSize: 14,
    color: 'rgb(49, 58, 52)',
  },
  appointmentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgb(132, 204, 22)',
    position: 'absolute',
    bottom: 2,
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(132, 204, 22, 0.1)',
    padding: 12,
    borderRadius: 12,
  },
  appointmentText: {
    fontSize: 14,
    color: 'rgb(49, 58, 52)',
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default OnboardingScreen; 