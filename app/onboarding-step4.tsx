import OnboardingLayout from '@/components/layout/OnboardingLayout';
import { IconSymbol } from '@/components/ui';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
      <View style={styles.illustration}>
        <View style={styles.consultationContainer}>
          <View style={styles.consultationHeader}>
            <IconSymbol name="video_call" size={32} color="rgb(34, 197, 94)" />
            <Text style={styles.consultationTitle}>Virtual Consultation</Text>
          </View>
          <View style={styles.videoCall}>
            <View style={styles.doctorVideo}>
              <View style={styles.doctorAvatar}>
                <IconSymbol name="person" size={40} color="white" />
              </View>
              <Text style={styles.doctorName}>Dr. Johnson</Text>
              <Text style={styles.doctorSpecialty}>Cardiologist</Text>
            </View>
            <View style={styles.patientVideo}>
              <View style={styles.patientAvatar}>
                <IconSymbol name="person" size={24} color="white" />
              </View>
            </View>
          </View>
          <View style={styles.consultationFeatures}>
            <View style={styles.featureItem}>
              <IconSymbol name="record_voice_over" size={16} color="rgb(34, 197, 94)" />
              <Text style={styles.featureText}>Voice Analysis</Text>
            </View>
            <View style={styles.featureItem}>
              <IconSymbol name="face" size={16} color="rgb(34, 197, 94)" />
              <Text style={styles.featureText}>Facial Recognition</Text>
            </View>
            <View style={styles.featureItem}>
              <IconSymbol name="monitor_heart" size={16} color="rgb(34, 197, 94)" />
              <Text style={styles.featureText}>Vital Monitoring</Text>
            </View>
          </View>
          <View style={styles.aiIndicator}>
            <IconSymbol name="smart_toy" size={16} color="rgb(34, 197, 94)" />
            <Text style={styles.aiText}>AI-Powered Analysis Active</Text>
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
  consultationContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  consultationHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  consultationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgb(34, 197, 94)',
    marginTop: 8,
  },
  videoCall: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  doctorVideo: {
    alignItems: 'center',
    flex: 1,
  },
  doctorAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgb(34, 197, 94)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgb(34, 197, 94)',
  },
  doctorSpecialty: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
  },
  patientVideo: {
    alignItems: 'center',
    flex: 1,
  },
  patientAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(34, 197, 94, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  consultationFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureText: {
    fontSize: 12,
    color: 'rgb(34, 197, 94)',
    marginTop: 4,
    textAlign: 'center',
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    padding: 12,
    borderRadius: 12,
  },
  aiText: {
    fontSize: 14,
    color: 'rgb(34, 197, 94)',
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default OnboardingScreenStep4; 