import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

interface HealthAction {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  backgroundColor: string;
  onPress: () => void;
}

export default function HealthScreen() {
  const router = useRouter();

  const healthActions: HealthAction[] = [
    {
      id: 'health-assessment',
      title: 'Health Assessment',
      subtitle: 'Complete health evaluation',
      icon: 'heart.text.square.fill',
      color: 'rgb(239, 68, 68)',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      onPress: () => router.push('/comprehensive-health-assessment'),
    },
    {
      id: 'symptoms',
      title: 'Symptom Checker',
      subtitle: 'AI-powered symptom analysis',
      icon: 'stethoscope',
      color: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      onPress: () => router.push('/symptom-checker'),
    },
    {
      id: 'vitals',
      title: 'Track Vitals',
      subtitle: 'Monitor your health metrics',
      icon: 'waveform.path.ecg',
      color: 'rgb(16, 185, 129)',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      onPress: () => {/* Coming soon */},
    },
    {
      id: 'medications',
      title: 'Medications',
      subtitle: 'Manage prescriptions & reminders',
      icon: 'pills.fill',
      color: 'rgb(168, 85, 247)',
      backgroundColor: 'rgba(168, 85, 247, 0.1)',
      onPress: () => {/* Coming soon */},
    },
    {
      id: 'reports',
      title: 'Health Reports',
      subtitle: 'View medical history',
      icon: 'doc.text.fill',
      color: 'rgb(251, 204, 21)',
      backgroundColor: 'rgba(251, 204, 21, 0.1)',
      onPress: () => {/* Coming soon */},
    },
    {
      id: 'education',
      title: 'Medical Education',
      subtitle: 'Learn about medical conditions',
      icon: 'book.closed.fill',
      color: 'rgb(132, 204, 22)',
      backgroundColor: 'rgba(132, 204, 22, 0.1)',
      onPress: () => router.push('/medical-education'),
    },
    {
      id: 'profile',
      title: 'Health Profile',
      subtitle: 'Manage your health information',
      icon: 'person.crop.circle.fill',
      color: 'rgb(100, 112, 103)',
      backgroundColor: 'rgba(100, 112, 103, 0.1)',
      onPress: () => router.push('/profile'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Animated.View style={styles.header} entering={FadeIn}>
          <Text style={styles.headerTitle}>Health Hub</Text>
          <Text style={styles.headerSubtitle}>
            Manage your health journey with AI-powered tools
          </Text>
        </Animated.View>

        {/* Health Actions Grid */}
        <Animated.View style={styles.section} entering={FadeInDown.delay(200)}>
          <Text style={styles.sectionTitle}>Health Services</Text>
          <View style={styles.actionsGrid}>
            {healthActions.map((action, index) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.actionCard, { backgroundColor: action.backgroundColor }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  action.onPress();
                }}
                activeOpacity={0.8}
              >
                <View style={styles.actionIcon}>
                  <IconSymbol name={action.icon} size={32} color={action.color} />
                </View>
                <Text style={[styles.actionTitle, { color: action.color }]}>
                  {action.title}
                </Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Health Tips */}
        <Animated.View style={styles.section} entering={FadeInDown.delay(400)}>
          <Text style={styles.sectionTitle}>Health Tips</Text>
          <View style={styles.tipsContainer}>
            <View style={styles.tipCard}>
              <IconSymbol name="drop.fill" size={24} color="rgb(59, 130, 246)" />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Stay Hydrated</Text>
                <Text style={styles.tipText}>
                  Drink at least 8 glasses of water daily for optimal health.
                </Text>
              </View>
            </View>
            
            <View style={styles.tipCard}>
              <IconSymbol name="figure.walk" size={24} color="rgb(16, 185, 129)" />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Daily Exercise</Text>
                <Text style={styles.tipText}>
                  30 minutes of moderate exercise can boost your energy and mood.
                </Text>
              </View>
            </View>

            <View style={styles.tipCard}>
              <IconSymbol name="moon.fill" size={24} color="rgb(168, 85, 247)" />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Quality Sleep</Text>
                <Text style={styles.tipText}>
                  Aim for 7-9 hours of sleep for better recovery and focus.
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(245, 246, 245)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'rgb(49, 58, 52)',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgb(100, 112, 103)',
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgb(49, 58, 52)',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
  },
  actionIcon: {
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    color: 'rgb(100, 112, 103)',
    textAlign: 'center',
    lineHeight: 16,
  },
  tipsContainer: {
    gap: 12,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
    shadowColor: 'rgba(47, 60, 51, 0.05)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  tipContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgb(49, 58, 52)',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
    lineHeight: 20,
  },
}); 