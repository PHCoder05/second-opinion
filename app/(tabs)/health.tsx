import { Card, IconSymbol } from '@/components/ui';
import { MedicalColors } from '@/constants/Colors';
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
    View,
} from 'react-native';
import Animated, {
    Extrapolate,
    FadeInDown,
    FadeInLeft,
    FadeInRight,
    FadeInUp,
    SlideInUp,
    ZoomIn,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

// Enhanced health data with more comprehensive metrics
const HEALTH_DATA = {
  todayOverview: {
    healthScore: 87,
    trend: 'improving', // improving, stable, declining
    lastUpdate: new Date().toLocaleString(),
  },
  vitals: {
    heartRate: {
      current: 72,
      resting: 65,
      max: 185,
      unit: 'bpm',
      status: 'normal',
      trend: 'stable',
      history: [68, 70, 69, 72, 71, 73, 72], // Last 7 days
      optimal: '60-100 bpm',
    },
    bloodPressure: {
      systolic: 120,
      diastolic: 80,
      unit: 'mmHg',
      status: 'normal',
      trend: 'improving',
      history: [
        { systolic: 125, diastolic: 82 },
        { systolic: 122, diastolic: 80 },
        { systolic: 120, diastolic: 78 },
        { systolic: 118, diastolic: 80 },
        { systolic: 120, diastolic: 80 },
        { systolic: 119, diastolic: 79 },
        { systolic: 120, diastolic: 80 },
      ],
      optimal: '<120/80 mmHg',
    },
    weight: {
      current: 65.5,
      target: 65,
      unit: 'kg',
      status: 'normal',
      trend: 'stable',
      history: [66.2, 66.0, 65.8, 65.6, 65.5, 65.4, 65.5],
      optimal: '60-75 kg',
    },
    sleep: {
      lastNight: 7.5,
      average: 7.2,
      target: 8,
      unit: 'hours',
      status: 'good',
      trend: 'improving',
      history: [6.8, 7.0, 7.2, 7.5, 7.8, 7.2, 7.5],
      optimal: '7-9 hours',
    },
  },
  healthGoals: [
    {
      id: 1,
      title: 'Daily Steps',
      current: 8450,
      target: 10000,
      unit: 'steps',
      progress: 84.5,
      icon: 'directions_walk',
      color: MedicalColors.primary[600],
      streak: 5,
      weeklyAverage: 8200,
    },
    {
      id: 2,
      title: 'Water Intake',
      current: 6,
      target: 8,
      unit: 'glasses',
      progress: 75,
      icon: 'water_drop',
      color: MedicalColors.info[600],
      streak: 12,
      weeklyAverage: 7.2,
    },
    {
      id: 3,
      title: 'Active Minutes',
      current: 45,
      target: 60,
      unit: 'minutes',
      progress: 75,
      icon: 'fitness_center',
      color: MedicalColors.success[600],
      streak: 3,
      weeklyAverage: 52,
    },
    {
      id: 4,
      title: 'Meditation',
      current: 15,
      target: 20,
      unit: 'minutes',
      progress: 75,
      icon: 'self_improvement',
      color: MedicalColors.secondary[600],
      streak: 8,
      weeklyAverage: 18,
    },
  ],
  recommendations: [
    {
      id: 1,
      type: 'immediate',
      priority: 'high',
      title: 'Hydration Reminder',
      description: 'You\'re 2 glasses behind your daily water goal. Drink water now to stay hydrated.',
      action: 'Log Water',
      icon: 'water_drop',
      color: MedicalColors.info[600],
    },
    {
      id: 2,
      type: 'daily',
      priority: 'medium',
      title: 'Evening Walk',
      description: 'Take a 15-minute walk to reach your daily step goal and improve circulation.',
      action: 'Start Activity',
      icon: 'directions_walk',
      color: MedicalColors.primary[600],
    },
    {
      id: 3,
      type: 'weekly',
      priority: 'low',
      title: 'Sleep Schedule',
      description: 'Your sleep quality has improved! Maintain your current bedtime routine.',
      action: 'View Tips',
      icon: 'bedtime',
      color: MedicalColors.success[600],
    },
  ],
  insights: [
    {
      id: 1,
      title: 'Heart Rate Trend',
      description: 'Your resting heart rate has decreased by 3 bpm this month, indicating improved cardiovascular fitness.',
      type: 'positive',
      metric: 'cardiovascular',
    },
    {
      id: 2,
      title: 'Sleep Quality',
      description: 'You\'ve achieved your sleep goal 5 out of 7 days this week. Great consistency!',
      type: 'positive',
      metric: 'sleep',
    },
    {
      id: 3,
      title: 'Activity Pattern',
      description: 'Your most active hours are 7-9 AM and 6-8 PM. Consider scheduling workouts during these times.',
      type: 'neutral',
      metric: 'activity',
    },
  ],
};

export default function HealthScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedVital, setSelectedVital] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'vitals' | 'goals' | 'insights'>('overview');

  const pulseAnimation = useSharedValue(0);
  const progressAnimations = [
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
  ];

  useEffect(() => {
    // Pulse animation for health score
    pulseAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(0, { duration: 2000 })
      ),
      -1,
      true
    );

    // Animate progress bars
    progressAnimations.forEach((anim, index) => {
      anim.value = withSpring(HEALTH_DATA.healthGoals[index].progress / 100, {
        damping: 15,
        stiffness: 100,
      });
    });
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return MedicalColors.success[600];
    if (score >= 60) return MedicalColors.warning[600];
    return MedicalColors.error[600];
  };

  const getVitalStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
      case 'good':
        return MedicalColors.success[600];
      case 'warning':
        return MedicalColors.warning[600];
      case 'critical':
        return MedicalColors.error[600];
      default:
        return MedicalColors.neutral[600];
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'trending_up';
      case 'declining':
        return 'trending_down';
      case 'stable':
        return 'trending_flat';
      default:
        return 'remove';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return MedicalColors.error[600];
      case 'medium':
        return MedicalColors.warning[600];
      case 'low':
        return MedicalColors.success[600];
      default:
        return MedicalColors.neutral[600];
    }
  };

  const handleRecommendationAction = async (recommendation: typeof HEALTH_DATA.recommendations[0]) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(recommendation.title, `Action: ${recommendation.action}`);
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
  }), [pulseAnimation]);

  const renderTabBar = () => (
    <Animated.View 
      style={styles.tabBar}
      entering={FadeInDown.duration(800).delay(100)}
    >
      {[
        { key: 'overview', label: 'Overview', icon: 'dashboard' },
        { key: 'vitals', label: 'Vitals', icon: 'favorite' },
        { key: 'goals', label: 'Goals', icon: 'flag' },
        { key: 'insights', label: 'Insights', icon: 'lightbulb' },
      ].map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tabItem,
            activeTab === tab.key && styles.activeTabItem,
          ]}
          onPress={() => {
            setActiveTab(tab.key as any);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <IconSymbol
            name={tab.icon}
            size={20}
            color={activeTab === tab.key ? MedicalColors.primary[600] : MedicalColors.neutral[500]}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === tab.key && styles.activeTabLabel,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );

  const renderHealthScore = () => (
    <Animated.View
      style={styles.healthScoreSection}
      entering={FadeInUp.duration(800).delay(200)}
    >
      <Card variant="elevated" style={styles.healthScoreCard}>
        <LinearGradient
          colors={[
            getHealthScoreColor(HEALTH_DATA.todayOverview.healthScore),
            `${getHealthScoreColor(HEALTH_DATA.todayOverview.healthScore)}80`,
          ]}
          style={styles.healthScoreGradient}
        >
          <View style={styles.healthScoreContent}>
            <Animated.View style={[styles.healthScoreCircle, pulseStyle]}>
              <Text style={styles.healthScoreNumber}>
                {HEALTH_DATA.todayOverview.healthScore}
              </Text>
              <Text style={styles.healthScoreLabel}>Health Score</Text>
        </Animated.View>

            <View style={styles.healthScoreInfo}>
              <View style={styles.trendContainer}>
                <IconSymbol
                  name={getTrendIcon(HEALTH_DATA.todayOverview.trend)}
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.trendText}>
                  {HEALTH_DATA.todayOverview.trend.charAt(0).toUpperCase() + 
                   HEALTH_DATA.todayOverview.trend.slice(1)}
                </Text>
              </View>
              
              <Text style={styles.lastUpdateText}>
                Last updated: {HEALTH_DATA.todayOverview.lastUpdate.split(',')[1]}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </Card>
    </Animated.View>
  );

  const renderVitalsOverview = () => (
    <Animated.View
      style={styles.vitalsSection}
      entering={FadeInLeft.duration(800).delay(300)}
    >
      <Text style={styles.sectionTitle}>Health Vitals</Text>
      
      <View style={styles.vitalsGrid}>
        {Object.entries(HEALTH_DATA.vitals).map(([key, vital], index) => (
          <Animated.View
            key={key}
            style={styles.vitalCard}
            entering={ZoomIn.duration(600).delay(400 + index * 100)}
          >
            <TouchableOpacity
              style={styles.vitalCardInner}
              onPress={() => {
                setSelectedVital(selectedVital === key ? null : key);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              activeOpacity={0.8}
            >
              <Card variant="outlined" style={[
                styles.vitalCardContent,
                selectedVital === key && styles.selectedVitalCard
              ]}>
                <View style={styles.vitalHeader}>
                  <View style={[
                    styles.vitalStatusIndicator,
                    { backgroundColor: `${getVitalStatusColor(vital.status)}15` }
                  ]}>
                    <IconSymbol
                      name={getTrendIcon(vital.trend)}
                      size={16}
                      color={getVitalStatusColor(vital.status)}
                    />
                  </View>
                  <Text style={styles.vitalLabel}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Text>
                </View>
                
                <View style={styles.vitalValue}>
                  <Text style={styles.vitalNumber}>
                    {key === 'bloodPressure' 
                      ? `${vital.systolic}/${vital.diastolic}`
                      : key === 'sleep'
                      ? vital.lastNight || vital.current
                      : vital.current}
                  </Text>
                  <Text style={styles.vitalUnit}>{vital.unit}</Text>
                </View>
                
                <Text style={styles.vitalOptimal}>
                  Optimal: {vital.optimal}
                </Text>
                
                {selectedVital === key && (
                  <Animated.View
                    style={styles.vitalDetails}
                    entering={FadeInDown.duration(300)}
                  >
                    <View style={styles.vitalMiniChart}>
                      <Text style={styles.miniChartLabel}>7-day trend</Text>
                      <View style={styles.miniChartBars}>
                        {(vital.history || []).map((value, idx) => {
                          const height = key === 'bloodPressure' 
                            ? (value.systolic / 140) * 30
                            : ((typeof value === 'number' ? value : 0) / (vital.max || 100)) * 30;
                          return (
                            <View
                              key={idx}
                              style={[
                                styles.miniChartBar,
                                { 
                                  height: Math.max(height, 4),
                                  backgroundColor: getVitalStatusColor(vital.status),
                                }
                              ]}
                            />
                          );
                        })}
                      </View>
                    </View>
                  </Animated.View>
                )}
              </Card>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );

  const renderHealthGoals = () => {
    // Create animated styles for all goals at the top level
    const goalProgressStyles = HEALTH_DATA.healthGoals.map((_, index) => 
      useAnimatedStyle(() => ({
        width: `${progressAnimations[index].value * 100}%`,
      }))
    );

    return (
      <Animated.View 
        style={styles.goalsSection}
        entering={FadeInRight.duration(800).delay(500)}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Goals</Text>
          <TouchableOpacity
            onPress={() => router.push('/health-goals')}
            style={styles.sectionAction}
          >
            <Text style={styles.sectionActionText}>Manage</Text>
            <IconSymbol name="chevron_right" size={16} color={MedicalColors.primary[600]} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.goalsContainer}>
          {HEALTH_DATA.healthGoals.map((goal, index) => (
            <Animated.View
              key={goal.id}
              style={styles.goalCard}
              entering={SlideInUp.duration(600).delay(600 + index * 150)}
            >
              <Card variant="default" style={styles.goalCardInner}>
                <View style={styles.goalHeader}>
                  <View style={styles.goalIconContainer}>
                    <IconSymbol
                      name={goal.icon}
                      size={24}
                      color={goal.color}
                    />
                  </View>
                  
                  <View style={styles.goalInfo}>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    <Text style={styles.goalSubtitle}>
                      {goal.current} / {goal.target} {goal.unit}
                    </Text>
                  </View>
                  
                  <View style={styles.goalStats}>
                    <Text style={styles.goalProgress}>{Math.round(goal.progress)}%</Text>
                    <View style={styles.streakContainer}>
                      <IconSymbol name="local_fire_department" size={12} color={MedicalColors.warning[500]} />
                      <Text style={styles.streakText}>{goal.streak}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.progressContainer}>
                  <View style={styles.progressTrack}>
                    <Animated.View
                      style={[
                        styles.progressFill,
                        { 
                          backgroundColor: goal.progress >= 100 ? MedicalColors.success[600] : goal.color,
                        },
                        goalProgressStyles[index],
                      ]} 
                    />
                  </View>
                </View>
                
                <View style={styles.goalFooter}>
                  <Text style={styles.weeklyAverage}>
                    Weekly avg: {goal.weeklyAverage} {goal.unit}
                  </Text>
                  
                  <TouchableOpacity
                    style={styles.quickLogButton}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      Alert.alert('Quick Log', `Log ${goal.title}?`);
                    }}
                  >
                    <IconSymbol name="add" size={16} color={goal.color} />
                  </TouchableOpacity>
                </View>
              </Card>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    );
  };

  const renderRecommendations = () => (
        <Animated.View 
          style={styles.recommendationsSection}
      entering={FadeInUp.duration(800).delay(700)}
    >
      <Text style={styles.sectionTitle}>Health Recommendations</Text>
      
      <View style={styles.recommendationsContainer}>
        {HEALTH_DATA.recommendations.map((rec, index) => (
          <Animated.View
            key={rec.id}
            style={styles.recommendationCard}
            entering={FadeInLeft.duration(600).delay(800 + index * 150)}
          >
            <Card variant="default" style={styles.recommendationCardInner}>
              <View style={styles.recommendationContent}>
                <View style={styles.recommendationHeader}>
                  <View style={[
                    styles.recommendationIcon,
                    { backgroundColor: `${rec.color}15` }
                  ]}>
                    <IconSymbol name={rec.icon} size={20} color={rec.color} />
                  </View>
                  
                  <View style={styles.recommendationInfo}>
                    <View style={styles.recommendationTitleRow}>
                      <Text style={styles.recommendationTitle}>{rec.title}</Text>
                      <View style={[
                        styles.priorityBadge,
                        { backgroundColor: `${getPriorityColor(rec.priority)}15` }
                      ]}>
                        <Text style={[
                          styles.priorityText,
                          { color: getPriorityColor(rec.priority) }
                        ]}>
                          {rec.priority.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    
                    <Text style={styles.recommendationDescription}>
                      {rec.description}
                    </Text>
                  </View>
                </View>
                
                <TouchableOpacity
                  style={[
                    styles.recommendationActionButton,
                    { backgroundColor: rec.color }
                  ]}
                  onPress={() => handleRecommendationAction(rec)}
                >
                  <Text style={styles.recommendationActionText}>
                    {rec.action}
                  </Text>
                  <IconSymbol name="arrow_forward" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </Card>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );

  const renderHealthInsights = () => (
    <Animated.View
      style={styles.insightsSection}
      entering={FadeInDown.duration(800).delay(900)}
    >
      <Text style={styles.sectionTitle}>Health Insights</Text>
      
      <View style={styles.insightsContainer}>
        {HEALTH_DATA.insights.map((insight, index) => (
          <Animated.View
            key={insight.id}
            style={styles.insightCard}
            entering={FadeInRight.duration(600).delay(1000 + index * 150)}
          >
            <Card variant="outlined" style={styles.insightCardInner}>
              <View style={styles.insightHeader}>
                <IconSymbol 
                  name="lightbulb" 
                  size={20} 
                  color={MedicalColors.warning[500]} 
                />
                <Text style={styles.insightTitle}>{insight.title}</Text>
              </View>
              
              <Text style={styles.insightDescription}>
                {insight.description}
              </Text>
              
              <View style={styles.insightFooter}>
                <Text style={styles.insightMetric}>
                  {insight.metric.charAt(0).toUpperCase() + insight.metric.slice(1)}
                </Text>
                <View style={[
                  styles.insightType,
                  { 
                    backgroundColor: insight.type === 'positive' 
                      ? `${MedicalColors.success[600]}15`
                      : insight.type === 'neutral'
                      ? `${MedicalColors.neutral[600]}15`
                      : `${MedicalColors.warning[600]}15`
                  }
                ]}>
                  <IconSymbol 
                    name={insight.type === 'positive' ? 'thumb_up' : insight.type === 'neutral' ? 'info' : 'warning'} 
                    size={12} 
                    color={
                      insight.type === 'positive' 
                        ? MedicalColors.success[600]
                        : insight.type === 'neutral'
                        ? MedicalColors.neutral[600]
                        : MedicalColors.warning[600]
                    } 
                  />
                </View>
                  </View>
                </Card>
          </Animated.View>
            ))}
          </View>
        </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {renderTabBar()}
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === 'overview' && (
          <>
            {renderHealthScore()}
            {renderVitalsOverview()}
            {renderHealthGoals()}
            {renderRecommendations()}
          </>
        )}
        
        {activeTab === 'vitals' && renderVitalsOverview()}
        {activeTab === 'goals' && renderHealthGoals()}
        {activeTab === 'insights' && renderHealthInsights()}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  
  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: MedicalColors.neutral[200],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  activeTabItem: {
    backgroundColor: `${MedicalColors.primary[600]}10`,
  },
  tabLabel: {
    fontSize: 12,
    color: MedicalColors.neutral[500],
    fontWeight: '500',
    marginTop: 4,
  },
  activeTabLabel: {
    color: MedicalColors.primary[600],
    fontWeight: '600',
  },

  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },

  // Health Score Section
  healthScoreSection: {
    marginBottom: 32,
  },
  healthScoreCard: {
    overflow: 'hidden',
  },
  healthScoreGradient: {
    padding: 24,
  },
  healthScoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthScoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 24,
  },
  healthScoreNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  healthScoreLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    opacity: 0.9,
  },
  healthScoreInfo: {
    flex: 1,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  trendText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  lastUpdateText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },

  // Common Section Styles
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionActionText: {
    fontSize: 14,
    color: MedicalColors.primary[600],
    fontWeight: '600',
    marginRight: 4,
  },

  // Vitals Section
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
    flex: 1,
  },
  vitalCardContent: {
    padding: 16,
    height: '100%',
  },
  selectedVitalCard: {
    borderColor: MedicalColors.primary[600],
    borderWidth: 2,
  },
  vitalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  vitalStatusIndicator: {
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
  vitalValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  vitalNumber: {
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
  vitalOptimal: {
    fontSize: 10,
    color: MedicalColors.neutral[500],
    fontStyle: 'italic',
  },
  vitalDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: MedicalColors.neutral[200],
  },
  vitalMiniChart: {
    alignItems: 'center',
  },
  miniChartLabel: {
    fontSize: 10,
    color: MedicalColors.neutral[500],
    marginBottom: 8,
  },
  miniChartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 30,
  },
  miniChartBar: {
    width: 4,
    borderRadius: 2,
    minHeight: 4,
  },

  // Goals Section
  goalsSection: {
    marginBottom: 32,
  },
  goalsContainer: {
    gap: 16,
  },
  goalCard: {
    width: '100%',
  },
  goalCardInner: {
    padding: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: MedicalColors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.neutral[800],
  },
  goalSubtitle: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    marginTop: 2,
  },
  goalStats: {
    alignItems: 'flex-end',
  },
  goalProgress: {
    fontSize: 18,
    fontWeight: '700',
    color: MedicalColors.primary[600],
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  streakText: {
    fontSize: 12,
    color: MedicalColors.warning[500],
    fontWeight: '600',
    marginLeft: 2,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressTrack: {
    height: 8,
    backgroundColor: MedicalColors.neutral[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weeklyAverage: {
    fontSize: 12,
    color: MedicalColors.neutral[500],
  },
  quickLogButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: MedicalColors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Recommendations Section
  recommendationsSection: {
    marginBottom: 32,
  },
  recommendationsContainer: {
    gap: 12,
  },
  recommendationCard: {
    width: '100%',
  },
  recommendationCardInner: {
    padding: 16,
  },
  recommendationContent: {
    gap: 16,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  recommendationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recommendationInfo: {
    flex: 1,
  },
  recommendationTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.neutral[800],
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  recommendationDescription: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    lineHeight: 20,
  },
  recommendationActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  recommendationActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Insights Section
  insightsSection: {
    marginBottom: 32,
  },
  insightsContainer: {
    gap: 12,
  },
  insightCard: {
    width: '100%',
  },
  insightCardInner: {
    padding: 16,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.neutral[800],
    marginLeft: 8,
  },
  insightDescription: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    lineHeight: 20,
    marginBottom: 12,
  },
  insightFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  insightMetric: {
    fontSize: 12,
    color: MedicalColors.neutral[500],
    fontWeight: '500',
  },
  insightType: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  bottomSpacing: {
    height: 40,
  },
}); 