import { HomeScreenLayout } from '@/components/layout/HomeScreenLayout';
import { Card, IconSymbol } from '@/components/ui';
import { MedicalColors, MedicalGradients } from '@/constants/Colors';
import { authService } from '@/src/services/authService';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  Extrapolate,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  SlideInDown,
  ZoomIn,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

// Mock user data (in real app, this would come from API/state management)
const USER_DATA = {
  name: 'Sarah',
  avatar: null,
  healthScore: 87,
  nextAppointment: {
    doctor: 'Dr. Michael Chen',
    specialty: 'Cardiologist',
    date: 'Today',
    time: '2:30 PM',
  },
  vitals: {
    heartRate: { value: 72, unit: 'bpm', status: 'normal', trend: 'stable' },
    bloodPressure: { value: '120/80', unit: 'mmHg', status: 'normal', trend: 'improving' },
    weight: { value: 65.5, unit: 'kg', status: 'normal', trend: 'stable' },
    temperature: { value: 36.8, unit: '°C', status: 'normal', trend: 'stable' },
  },
  healthGoals: [
    { id: 1, title: 'Daily Steps', current: 8450, target: 10000, unit: 'steps', progress: 84.5 },
    { id: 2, title: 'Water Intake', current: 6, target: 8, unit: 'glasses', progress: 75 },
    { id: 3, title: 'Sleep Hours', current: 7.5, target: 8, unit: 'hours', progress: 93.8 },
  ],
  recentActivity: [
    { id: 1, type: 'consultation', title: 'Video call with Dr. Smith', time: '2 hours ago', icon: 'videocam' },
    { id: 2, type: 'vitals', title: 'Blood pressure recorded', time: '5 hours ago', icon: 'favorite' },
    { id: 3, type: 'medication', title: 'Medication reminder completed', time: '8 hours ago', icon: 'medication' },
    { id: 4, type: 'appointment', title: 'Appointment scheduled', time: '1 day ago', icon: 'schedule' },
  ],
};

const QUICK_ACTIONS = [
  { 
    id: 1, 
    title: 'Book Appointment', 
    subtitle: 'Schedule with specialists',
    icon: 'schedule', 
    color: MedicalColors.primary[600], 
    gradient: MedicalGradients?.primary || ['#007BFF', '#0056D3'],
    route: '/appointments' 
  },
  { 
    id: 2, 
    title: 'Start Consultation', 
    subtitle: 'Video call with doctors',
    icon: 'videocam', 
    color: MedicalColors.success[600], 
    gradient: MedicalGradients?.success || ['#28A745', '#16A34A'],
    route: '/consultation-flow' 
  },
  { 
    id: 3, 
    title: 'Health Records', 
    subtitle: 'View medical history',
    icon: 'description', 
    color: MedicalColors.info[600], 
    gradient: MedicalGradients?.info || ['#17A2B8', '#00ACC1'],
    route: '/medical-records' 
  },
  { 
    id: 4, 
    title: 'Symptom Checker', 
    subtitle: 'AI-powered diagnosis',
    icon: 'search', 
    color: MedicalColors.warning[600], 
    gradient: MedicalGradients?.warning || ['#FFC107', '#FF9800'],
    route: '/symptom-checker' 
  },
];

export default function Dashboard() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const pulseAnimation = useSharedValue(0);
  const floatingAnimation = useSharedValue(0);

  useEffect(() => {
    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Pulse animation for health score
    pulseAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(0, { duration: 2000 })
      ),
      -1,
      true
    );

    // Floating animation for cards
    floatingAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 4000 }),
        withTiming(0, { duration: 4000 })
      ),
      -1,
      true
    );

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return MedicalColors.success[600];
    if (score >= 60) return MedicalColors.warning[600];
    return MedicalColors.error[600];
  };

  const getVitalStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return MedicalColors.success[600];
      case 'warning': return MedicalColors.warning[600];
      case 'critical': return MedicalColors.error[600];
      default: return MedicalColors.neutral[600];
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return 'trending_up';
      case 'declining': return 'trending_down';
      case 'stable': return 'trending_flat';
      default: return 'remove';
    }
  };

  const handleQuickAction = async (action: typeof QUICK_ACTIONS[0]) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (action.route === '/appointments') {
      router.push('/(tabs)/appointments');
    } else {
      router.push(action.route as any);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              
              // Try the comprehensive logout first
              const { error } = await authService.logout();
              if (error) {
                throw error;
              }
              
              // Navigate to welcome screen
              router.replace('/welcome');
              
            } catch (error) {
              console.error('Logout error:', error);
              
              // Fallback to simple signOut
              try {
                await authService.signOut();
                router.replace('/welcome');
              } catch (fallbackError) {
                console.error('Fallback logout error:', fallbackError);
                Alert.alert(
                  'Logout Error', 
                  'There was an issue signing you out. Please try again.',
                  [
                    { text: 'Try Again', onPress: handleLogout },
                    { text: 'Cancel', style: 'cancel' }
                  ]
                );
              }
            }
          }
        }
      ]
    );
  };

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          pulseAnimation.value,
          [0, 1],
          [1, 1.05],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  const floatingStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          floatingAnimation.value,
          [0, 1],
          [0, -5],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  return (
    <HomeScreenLayout>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Greeting Header */}
        <Animated.View 
          style={styles.greetingSection}
          entering={FadeInUp.duration(800).delay(100)}
        >
          <View style={styles.greetingContent}>
            <View>
              <Text style={styles.greetingTime}>{getGreeting()}</Text>
              <Text style={styles.greetingName}>Hi, {USER_DATA.name}! 👋</Text>
            </View>
            
            <View style={styles.headerActions}>
              <Animated.View style={[styles.healthScoreContainer, pulseStyle]}>
                <LinearGradient
                  colors={[
                    getHealthScoreColor(USER_DATA.healthScore),
                    `${getHealthScoreColor(USER_DATA.healthScore)}80`
                  ]}
                  style={styles.healthScoreGradient}
                >
                  <Text style={styles.healthScoreNumber}>{USER_DATA.healthScore}</Text>
                  <Text style={styles.healthScoreLabel}>Health Score</Text>
                </LinearGradient>
              </Animated.View>
              
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                activeOpacity={0.7}
                accessibilityLabel="Sign out button"
                accessibilityHint="Double tap to sign out of your account"
              >
                <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Next Appointment Card */}
        {USER_DATA.nextAppointment && (
        <Animated.View 
            style={styles.appointmentSection}
            entering={FadeInLeft.duration(800).delay(200)}
          >
            <Card variant="elevated" style={styles.appointmentCard}>
              <LinearGradient
                colors={MedicalGradients?.primary as [string, string] || ['#007BFF', '#0056D3'] as [string, string]}
                style={styles.appointmentGradient}
              >
                <View style={styles.appointmentContent}>
                  <View style={styles.appointmentInfo}>
                    <IconSymbol name="schedule" size={24} color="#FFFFFF" />
                    <View style={styles.appointmentText}>
                      <Text style={styles.appointmentTitle}>Next Appointment</Text>
                      <Text style={styles.appointmentDetails}>
                        {USER_DATA.nextAppointment.doctor} • {USER_DATA.nextAppointment.specialty}
                      </Text>
                      <Text style={styles.appointmentTime}>
                        {USER_DATA.nextAppointment.date} at {USER_DATA.nextAppointment.time}
                      </Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.appointmentAction}
                    onPress={() => router.push('/(tabs)/appointments')}
                  >
                    <IconSymbol name="arrow_forward" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
              </Card>
        </Animated.View>
        )}

        {/* Quick Actions */}
        <Animated.View 
          style={styles.quickActionsSection}
          entering={SlideInDown.duration(800).delay(300)}
        >
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.quickActionsGrid}>
            {QUICK_ACTIONS.map((action, index) => (
              <Animated.View
                key={action.id}
                style={[styles.quickActionContainer, floatingStyle]}
                entering={ZoomIn.duration(600).delay(400 + index * 100)}
              >
                <TouchableOpacity
                  style={styles.quickActionCard}
                  onPress={() => handleQuickAction(action)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={action.gradient as [string, string]}
                    style={styles.quickActionGradient}
                  >
                    <View style={styles.quickActionIconContainer}>
                      <IconSymbol name={action.icon} size={24} color="#FFFFFF" />
                    </View>
                  </LinearGradient>
                  <View style={styles.quickActionContent}>
                    <Text style={styles.quickActionTitle}>{action.title}</Text>
                    <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Health Vitals */}
        <Animated.View
          style={styles.vitalsSection}
          entering={FadeInRight.duration(800).delay(500)}
        >
          <Text style={styles.sectionTitle}>Health Vitals</Text>
          
          <View style={styles.vitalsGrid}>
            {Object.entries(USER_DATA.vitals).map(([key, vital], index) => (
              <Animated.View
                key={key}
                style={styles.vitalCard}
                entering={FadeInUp.duration(600).delay(600 + index * 100)}
              >
                <Card variant="outlined" style={styles.vitalCardInner}>
                  <View style={styles.vitalHeader}>
                    <View style={[styles.vitalStatus, { backgroundColor: `${getVitalStatusColor(vital.status)}15` }]}>
                      <IconSymbol name={getTrendIcon(vital.trend)} size={16} color={getVitalStatusColor(vital.status)} />
                    </View>
                    <Text style={styles.vitalLabel}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Text>
                  </View>
                  
                  <View style={styles.vitalContent}>
                    <Text style={styles.vitalValue}>{vital.value}</Text>
                    <Text style={styles.vitalUnit}>{vital.unit}</Text>
                  </View>
                </Card>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Health Goals */}
        <Animated.View
          style={styles.goalsSection}
          entering={FadeInLeft.duration(800).delay(700)}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Goals</Text>
            <TouchableOpacity onPress={() => router.push('/health')}>
              <Text style={styles.sectionAction}>View All</Text>
              </TouchableOpacity>
          </View>
          
          <View style={styles.goalsContainer}>
            {USER_DATA.healthGoals.map((goal, index) => (
              <Animated.View
                key={goal.id}
                style={styles.goalCard}
                entering={FadeInDown.duration(600).delay(800 + index * 150)}
              >
                <Card variant="default" style={styles.goalCardInner}>
                  <View style={styles.goalHeader}>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    <Text style={styles.goalProgress}>{Math.round(goal.progress)}%</Text>
                  </View>
                  
                  <View style={styles.goalValues}>
                    <Text style={styles.goalCurrent}>{goal.current} / {goal.target} {goal.unit}</Text>
                  </View>
                  
                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarTrack}>
                      <Animated.View
                        style={[
                          styles.progressBarFill,
                          { 
                            width: `${goal.progress}%`,
                            backgroundColor: goal.progress >= 100 ? MedicalColors.success[600] : MedicalColors.primary[600]
                          }
                        ]}
                        entering={FadeInRight.duration(1000).delay(900 + index * 150)}
                      />
                    </View>
                  </View>
                </Card>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Recent Activity */}
        <Animated.View
          style={styles.activitySection}
          entering={FadeInUp.duration(800).delay(900)}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => router.push('/medical-records')}>
              <Text style={styles.sectionAction}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <Card variant="default" style={styles.activityCard}>
            {USER_DATA.recentActivity.map((activity, index) => (
              <Animated.View
                key={activity.id}
                style={[
                  styles.activityItem,
                  index < USER_DATA.recentActivity.length - 1 && styles.activityItemBorder
                ]}
                entering={FadeInLeft.duration(600).delay(1000 + index * 100)}
              >
                <View style={[styles.activityIcon, { backgroundColor: `${MedicalColors.primary[600]}15` }]}>
                  <IconSymbol name={activity.icon} size={20} color={MedicalColors.primary[600]} />
                </View>
                
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
                
                <IconSymbol name="chevron_right" size={20} color={MedicalColors.neutral[400]} />
              </Animated.View>
            ))}
          </Card>
        </Animated.View>

        {/* Emergency Quick Access */}
        <Animated.View 
          style={styles.emergencySection}
          entering={FadeInDown.duration(800).delay(1100)}
        >
          <Card variant="default" style={styles.emergencyCard}>
            <LinearGradient
              colors={[MedicalColors.error[600], MedicalColors.error[500]]}
              style={styles.emergencyGradient}
            >
              <View style={styles.emergencyContent}>
                <IconSymbol name="local_hospital" size={32} color="#FFFFFF" />
                <View style={styles.emergencyText}>
                  <Text style={styles.emergencyTitle}>Emergency Assistance</Text>
                  <Text style={styles.emergencySubtitle}>Get immediate help 24/7</Text>
                </View>
                <TouchableOpacity 
                  style={styles.emergencyButton}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                    // Handle emergency action
                  }}
                >
                  <IconSymbol name="phone" size={24} color={MedicalColors.error[600]} />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Card>
        </Animated.View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </HomeScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 20,
  },

  // Greeting Section
  greetingSection: {
    marginBottom: 24,
  },
  greetingContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  greetingTime: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    fontWeight: '500',
    marginBottom: 4,
  },
  greetingName: {
    fontSize: 24,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
  },
  healthScoreContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  healthScoreGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  healthScoreNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  healthScoreLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
    opacity: 0.9,
  },

  // Appointment Section
  appointmentSection: {
    marginBottom: 24,
  },
  appointmentCard: {
    overflow: 'hidden',
  },
  appointmentGradient: {
    padding: 20,
  },
  appointmentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appointmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  appointmentText: {
    marginLeft: 16,
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  appointmentDetails: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 2,
  },
  appointmentTime: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  appointmentAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Quick Actions
  quickActionsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionAction: {
    fontSize: 14,
    color: MedicalColors.primary[600],
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8, // Add small gap between cards
  },
  quickActionContainer: {
    width: '47%', // Slightly reduce width to ensure 2 columns
    marginBottom: 12,
  },
  quickActionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 140,
  },
  quickActionGradient: {
    width: '100%',
    height: 80,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  quickActionContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: MedicalColors.neutral[600],
    textAlign: 'center',
    lineHeight: 16,
  },

  // Health Vitals
  vitalsSection: {
    marginBottom: 32,
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  vitalCard: {
    width: '48%', // Use percentage for 2-column layout
    marginBottom: 12,
  },
  vitalCardInner: {
    padding: 16,
  },
  vitalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  vitalStatus: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  vitalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: MedicalColors.neutral[600],
    flex: 1,
  },
  vitalContent: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  vitalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
  },
  vitalUnit: {
    fontSize: 12,
    color: MedicalColors.neutral[600],
    marginLeft: 4,
    fontWeight: '500',
  },

  // Health Goals
  goalsSection: {
    marginBottom: 32,
  },
  goalsContainer: {
    gap: 12,
  },
  goalCard: {
    width: '100%',
  },
  goalCardInner: {
    padding: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.neutral[800],
  },
  goalProgress: {
    fontSize: 14,
    fontWeight: '700',
    color: MedicalColors.primary[600],
  },
  goalValues: {
    marginBottom: 12,
  },
  goalCurrent: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 6,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: MedicalColors.neutral[200],
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Recent Activity
  activitySection: {
    marginBottom: 32,
  },
  activityCard: {
    padding: 0,
    overflow: 'hidden',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  activityItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: MedicalColors.neutral[200],
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: MedicalColors.neutral[800],
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: MedicalColors.neutral[600],
  },

  // Emergency Section
  emergencySection: {
    marginBottom: 24,
  },
  emergencyCard: {
    overflow: 'hidden',
  },
  emergencyGradient: {
    padding: 20,
  },
  emergencyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emergencyText: {
    flex: 1,
    marginLeft: 16,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  emergencySubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  emergencyButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomSpacing: {
    height: 20,
  },
}); 