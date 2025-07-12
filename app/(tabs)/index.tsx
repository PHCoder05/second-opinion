import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol, Card, Button } from '@/components/ui';
import { MedicalColors, MedicalGradients } from '@/constants/Colors';
import { authService } from '@/src/services/authService';
import { profileService, UserProfile, UserActivity } from '@/src/services/profileService';
import { medicalRecordsService } from '@/src/services/medicalRecordsService';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

interface DashboardStats {
  totalSessions: number;
  totalActivities: number;
  averageSessionDuration: number;
  lastLogin: string;
}

interface MedicalStats {
  totalMedicalRecords: number;
  totalSecondOpinionRequests: number;
  completedConsultations: number;
  pendingRequests: number;
}

interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  backgroundColor: string;
  onPress: () => void;
}

export default function DashboardScreen() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recentActivities, setRecentActivities] = useState<UserActivity[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [medicalStats, setMedicalStats] = useState<MedicalStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const quickActions: QuickAction[] = [
    {
      id: 'second-opinion',
      title: 'Second Opinion',
      subtitle: 'Get expert advice',
      icon: 'stethoscope',
      color: MedicalColors.primary[600],
      backgroundColor: MedicalColors.primary[100],
      onPress: () => router.push('/consultation-flow'),
    },
    {
      id: 'medical-records',
      title: 'Medical Records',
      subtitle: 'Manage documents',
      icon: 'doc.text.fill',
      color: MedicalColors.secondary[600],
      backgroundColor: MedicalColors.secondary[100],
      onPress: () => router.push('/medical-records'),
    },
    {
      id: 'health-assessment',
      title: 'Health Check',
      subtitle: 'Quick assessment',
      icon: 'heart.fill',
      color: MedicalColors.accent[600],
      backgroundColor: MedicalColors.accent[100],
      onPress: () => router.push('/comprehensive-health-assessment'),
    },
    {
      id: 'find-doctors',
      title: 'Find Doctors',
      subtitle: 'Browse specialists',
      icon: 'person.3.fill',
      color: MedicalColors.primary[700],
      backgroundColor: MedicalColors.primary[50],
      onPress: () => Alert.alert('Coming Soon', 'Doctor directory coming soon!'),
    },
  ];

  const loadDashboardData = async () => {
    try {
      const { user } = await authService.getCurrentUser();
      if (!user) {
        router.replace('/signin');
        return;
      }

      // Load user profile
      const { data: profile, error: profileError } = await profileService.getUserProfile(user.id);
      if (profile) {
        setUserProfile(profile);
      }

      // Load recent activities
      const { data: activities, error: activitiesError } = await profileService.getUserActivities(user.id, 5);
      if (activities) {
        setRecentActivities(activities);
      }

      // Load user stats
      const { data: userStats, error: statsError } = await profileService.getUserStats(user.id);
      if (userStats) {
        setStats(userStats);
      }

      // Load medical statistics
      const { data: medStats } = await medicalRecordsService.getUserMedicalStats(user.id);
      if (medStats) {
        setMedicalStats(medStats);
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onRefresh = () => {
    setIsRefreshing(true);
    loadDashboardData();
  };

  const formatLastLogin = (lastLogin: string) => {
    const date = new Date(lastLogin);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return `${diffDays} days ago`;
    }
  };

  const formatActivityType = (activityType: string) => {
    return activityType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'login': return 'arrow.right.circle.fill';
      case 'logout': return 'arrow.left.circle.fill';
      case 'profile_update': return 'person.crop.circle.fill';
      case 'health_assessment': return 'heart.fill';
      case 'appointment_scheduled': return 'calendar.badge.plus';
      default: return 'circle.fill';
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[MedicalColors.primary[50], MedicalColors.secondary[50], '#FFFFFF']}
        locations={[0, 0.3, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View style={styles.header} entering={FadeInUp.duration(800)}>
            <View style={styles.headerText}>
              <Text style={styles.greeting}>
                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}
              </Text>
              <Text style={styles.userName}>
                {userProfile?.first_name || 'User'}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/profile');
              }}
            >
              <LinearGradient
                colors={MedicalGradients.primary}
                style={styles.profileButtonGradient}
              >
                <IconSymbol name="person.crop.circle.fill" size={24} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Health Goal Card */}
          {userProfile?.health_goal && (
            <Animated.View entering={FadeInDown.delay(200).duration(800)}>
              <Card variant="health" padding="medium" style={styles.healthGoalCard}>
                <View style={styles.healthGoalHeader}>
                  <IconSymbol name="target" size={24} color={MedicalColors.secondary[600]} />
                  <Text style={styles.healthGoalTitle}>Your Health Goal</Text>
                </View>
                <Text style={styles.healthGoalText}>{userProfile.health_goal}</Text>
              </Card>
            </Animated.View>
          )}

          {/* Medical Stats Cards */}
          {medicalStats && (
            <Animated.View style={styles.section} entering={FadeInDown.delay(300).duration(800)}>
              <Text style={styles.sectionTitle}>Your Medical Overview</Text>
              <View style={styles.statsContainer}>
                <Card variant="default" padding="medium" style={styles.statCard}>
                  <IconSymbol name="doc.text.fill" size={24} color={MedicalColors.secondary[600]} />
                  <Text style={styles.statNumber}>{medicalStats.totalMedicalRecords}</Text>
                  <Text style={styles.statLabel}>Medical Records</Text>
                </Card>
                <Card variant="default" padding="medium" style={styles.statCard}>
                  <IconSymbol name="stethoscope" size={24} color={MedicalColors.primary[600]} />
                  <Text style={styles.statNumber}>{medicalStats.totalSecondOpinionRequests}</Text>
                  <Text style={styles.statLabel}>Second Opinions</Text>
                </Card>
                <Card variant="default" padding="medium" style={styles.statCard}>
                  <IconSymbol name="checkmark.circle.fill" size={24} color={MedicalColors.secondary[600]} />
                  <Text style={styles.statNumber}>{medicalStats.completedConsultations}</Text>
                  <Text style={styles.statLabel}>Completed</Text>
                </Card>
                <Card variant="default" padding="medium" style={styles.statCard}>
                  <IconSymbol name="clock.fill" size={24} color={MedicalColors.accent[600]} />
                  <Text style={styles.statNumber}>{medicalStats.pendingRequests}</Text>
                  <Text style={styles.statLabel}>Pending</Text>
                </Card>
              </View>
            </Animated.View>
          )}

        {/* App Stats Cards */}
        {stats && (
          <Animated.View style={styles.section} entering={FadeInDown.delay(350)}>
            <Text style={styles.sectionTitle}>Activity Overview</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <IconSymbol name="chart.line.uptrend.xyaxis" size={20} color="rgb(59, 130, 246)" />
                <Text style={styles.statNumber}>{stats.totalSessions}</Text>
                <Text style={styles.statLabel}>Total Sessions</Text>
              </View>
              <View style={styles.statCard}>
                <IconSymbol name="clock.fill" size={20} color="rgb(16, 185, 129)" />
                <Text style={styles.statNumber}>{stats.averageSessionDuration}m</Text>
                <Text style={styles.statLabel}>Avg Session</Text>
              </View>
              <View style={styles.statCard}>
                <IconSymbol name="calendar" size={20} color="rgb(168, 85, 247)" />
                <Text style={styles.statNumber}>
                  {stats.lastLogin ? formatLastLogin(stats.lastLogin) : 'N/A'}
                </Text>
                <Text style={styles.statLabel}>Last Login</Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Quick Actions */}
        <Animated.View style={styles.section} entering={FadeInDown.delay(400)}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.quickActionCard, { backgroundColor: action.backgroundColor }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  action.onPress();
                }}
                activeOpacity={0.8}
              >
                <View style={styles.quickActionIcon}>
                  <IconSymbol name={action.icon} size={24} color={action.color} />
                </View>
                <Text style={[styles.quickActionTitle, { color: action.color }]}>
                  {action.title}
                </Text>
                <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Recent Activities */}
        {recentActivities.length > 0 && (
          <Animated.View style={styles.section} entering={FadeInDown.delay(500)}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activitiesContainer}>
              {recentActivities.map((activity, index) => (
                <View key={activity.id} style={styles.activityItem}>
                  <View style={styles.activityIcon}>
                    <IconSymbol 
                      name={getActivityIcon(activity.activity_type)} 
                      size={16} 
                      color="rgb(100, 112, 103)" 
                    />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>
                      {formatActivityType(activity.activity_type)}
                    </Text>
                    <Text style={styles.activityTime}>
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Second Opinion Insights */}
        <Animated.View style={styles.section} entering={FadeInDown.delay(600)}>
          <Text style={styles.sectionTitle}>Second Opinion Insights</Text>
          <View style={styles.insightsContainer}>
            <View style={styles.insightCard}>
              <IconSymbol name="lightbulb.fill" size={24} color="rgb(251, 204, 21)" />
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Expert Medical Opinions</Text>
                <Text style={styles.insightText}>
                  Getting a second opinion can provide clarity and confidence in your medical decisions.
                </Text>
              </View>
            </View>
            <View style={styles.insightCard}>
              <IconSymbol name="doc.text.fill" size={24} color="rgb(59, 130, 246)" />
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Organize Your Records</Text>
                <Text style={styles.insightText}>
                  Keep your medical records organized for faster and more accurate consultations.
                </Text>
              </View>
            </View>
            <View style={styles.insightCard}>
              <IconSymbol name="person.3.fill" size={24} color="rgb(132, 204, 22)" />
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Network of Specialists</Text>
                <Text style={styles.insightText}>
                  Our network provides expert opinions across all medical specialties and conditions.
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: MedicalColors.neutral[600],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: MedicalColors.neutral[600],
    marginBottom: 4,
    fontWeight: '500',
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: MedicalColors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  healthGoalCard: {
    marginBottom: 24,
  },
  healthGoalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  healthGoalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
  },
  healthGoalText: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: MedicalColors.neutral[600],
    textAlign: 'center',
    fontWeight: '500',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: '48%',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  quickActionIcon: {
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: 'rgb(100, 112, 103)',
    textAlign: 'center',
  },
  activitiesContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: 'rgba(47, 60, 51, 0.05)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(100, 112, 103, 0.1)',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(100, 112, 103, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgb(49, 58, 52)',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: 'rgb(100, 112, 103)',
  },
  insightsContainer: {
    gap: 12,
  },
  insightCard: {
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
  insightContent: {
    flex: 1,
    marginLeft: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgb(49, 58, 52)',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
    lineHeight: 20,
  },
}); 