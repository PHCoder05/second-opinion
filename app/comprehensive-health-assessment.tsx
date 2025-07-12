import React, { useState } from 'react';
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
import { authService } from '@/src/services/authService';
import { profileService } from '@/src/services/profileService';
import HealthGoalCard from '@/components/HealthGoalCard';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn } from 'react-native-reanimated';

interface HealthGoal {
  id: string;
  title: string;
  icon: string;
  iconColor: string;
  backgroundColor: string;
}

const healthGoals: HealthGoal[] = [
  {
    id: 'healthy',
    title: 'I want to be healthy',
    icon: 'plus.circle.fill',
    iconColor: 'rgb(132, 204, 22)',
    backgroundColor: 'rgba(149, 251, 204, 0.3)',
  },
  {
    id: 'weight',
    title: 'I want to manage my weight',
    icon: 'scalemass.fill',
    iconColor: 'rgb(96, 165, 250)',
    backgroundColor: 'rgba(239, 246, 255, 0.8)',
  },
  {
    id: 'mental',
    title: 'I want to improve my mental health',
    icon: 'heart.circle.fill',
    iconColor: 'rgb(139, 92, 246)',
    backgroundColor: 'rgba(237, 233, 254, 0.8)',
  },
  {
    id: 'chronic',
    title: 'I have a chronic condition',
    icon: 'stethoscope',
    iconColor: 'rgb(100, 112, 103)',
    backgroundColor: 'rgba(245, 245, 244, 0.8)',
  },
  {
    id: 'checkup',
    title: 'I need a routine checkup',
    icon: 'phone.fill',
    iconColor: 'rgb(251, 204, 21)',
    backgroundColor: 'rgba(254, 249, 195, 0.8)',
  },
];

const ComprehensiveHealthAssessmentScreen = () => {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState<string>('checkup');

  const handleGoalSelect = (goalId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedGoal(goalId);
  };

  const handleContinue = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      // Get current user
      const { user } = await authService.getCurrentUser();
      if (user) {
        // Save health goal to profile
        const selectedGoalText = healthGoals.find(goal => goal.id === selectedGoal)?.title;
        if (selectedGoalText) {
          await profileService.updateUserProfile(user.id, {
            health_goal: selectedGoalText
          });
        }
        
        // Log the health assessment activity
        await profileService.logActivity(user.id, 'health_assessment', {
          goal: selectedGoalText
        });
      }
    } catch (error) {
      console.error('Error saving health assessment:', error);
    }
    
    // Navigate to main app
    router.push('/(tabs)');
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={styles.content} entering={FadeIn}>
        {/* Top Navigation */}
        <View style={styles.topNav}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <IconSymbol name="chevron.left" size={24} color="rgb(49, 58, 52)" />
          </TouchableOpacity>
          
          <Text style={styles.navTitle}>Profile Setup</Text>
          
          <TouchableOpacity 
            style={styles.skipButton} 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/(tabs)');
            }}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <Text style={styles.title}>Select Your Goal</Text>

          {/* Health Goal Cards */}
          <View style={styles.goalsContainer}>
            {healthGoals.map((goal) => (
              <HealthGoalCard
                key={goal.id}
                id={goal.id}
                title={goal.title}
                icon={goal.icon}
                iconColor={goal.iconColor}
                backgroundColor={goal.backgroundColor}
                isSelected={selectedGoal === goal.id}
                onPress={handleGoalSelect}
              />
            ))}
          </View>

          {/* Continue Button */}
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Continue</Text>
            <IconSymbol name="chevron.right" size={24} color="white" />
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(245, 246, 245)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 24,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(49, 58, 52, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'rgb(49, 58, 52)',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  pricingTag: {
    backgroundColor: 'rgba(226, 232, 226, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pricingText: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'rgb(49, 58, 52)',
    marginBottom: 32,
    textAlign: 'left',
  },
  goalsContainer: {
    gap: 8,
    marginBottom: 32,
  },
  skipButton: {
    backgroundColor: 'rgba(226, 232, 226, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  skipText: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
    fontWeight: '500',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(132, 204, 22)',
    borderRadius: 21,
    paddingVertical: 16,
    marginTop: 24,
    gap: 8,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ComprehensiveHealthAssessmentScreen; 