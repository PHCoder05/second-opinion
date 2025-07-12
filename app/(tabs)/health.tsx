import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol, Card, Button } from '@/components/ui';
import { MedicalColors, MedicalGradients } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  FadeInUp,
  SlideInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2; // 48 = 16 padding + 16 gap
const IS_SMALL_DEVICE = SCREEN_WIDTH < 375;

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
  const scrollY = useSharedValue(0);

  const healthActions: HealthAction[] = [
    {
      id: 'health-assessment',
      title: 'Health Assessment',
      subtitle: 'Complete AI-powered health evaluation',
      icon: 'heart.text.square.fill',
      color: MedicalColors.accent[600],
      backgroundColor: MedicalColors.accent[100],
      onPress: () => router.push('/comprehensive-health-assessment'),
    },
    {
      id: 'symptoms',
      title: 'Symptom Checker',
      subtitle: 'AI-powered symptom analysis',
      icon: 'stethoscope',
      color: MedicalColors.primary[600],
      backgroundColor: MedicalColors.primary[100],
      onPress: () => router.push('/symptom-checker'),
    },
    {
      id: 'vitals',
      title: 'Track Vitals',
      subtitle: 'Monitor health metrics',
      icon: 'waveform.path.ecg',
      color: MedicalColors.secondary[600],
      backgroundColor: MedicalColors.secondary[100],
      onPress: () => {/* Coming soon */},
    },
    {
      id: 'medications',
      title: 'Medications',
      subtitle: 'Manage prescriptions',
      icon: 'pills.fill',
      color: MedicalColors.primary[700],
      backgroundColor: MedicalColors.primary[50],
      onPress: () => {/* Coming soon */},
    },
    {
      id: 'reports',
      title: 'Health Reports',
      subtitle: 'View medical history',
      icon: 'doc.text.fill',
      color: MedicalColors.accent[600],
      backgroundColor: MedicalColors.accent[100],
      onPress: () => {/* Coming soon */},
    },
    {
      id: 'education',
      title: 'Medical Education',
      subtitle: 'Learn about conditions',
      icon: 'book.closed.fill',
      color: MedicalColors.secondary[600],
      backgroundColor: MedicalColors.secondary[100],
      onPress: () => router.push('/medical-education'),
    },
  ];

  const healthTips = [
    {
      id: 'hydration',
      icon: 'drop.fill',
      color: '#3B82F6',
      title: 'Stay Hydrated',
      description: 'Drink 8-10 glasses of water daily for optimal health and energy.',
    },
    {
      id: 'exercise',
      icon: 'figure.walk',
      color: '#10B981',
      title: 'Daily Movement',
      description: '30 minutes of moderate exercise boosts mood and cardiovascular health.',
    },
    {
      id: 'sleep',
      icon: 'moon.fill',
      color: '#8B5CF6',
      title: 'Quality Sleep',
      description: '7-9 hours of sleep improves recovery, focus, and immune function.',
    },
    {
      id: 'nutrition',
      icon: 'leaf.fill',
      color: '#F59E0B',
      title: 'Balanced Nutrition',
      description: 'Include fruits, vegetables, and whole grains in your daily meals.',
    },
  ];

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 100],
      [1, 0.8],
      Extrapolate.CLAMP
    );
    
    const translateY = interpolate(
      scrollY.value,
      [0, 100],
      [0, -20],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const handleScroll = (event: any) => {
    scrollY.value = event.nativeEvent.contentOffset.y;
  };

  const renderHealthAction = (action: HealthAction, index: number) => (
    <Animated.View
      key={action.id}
      entering={FadeInUp.delay(index * 100).springify()}
      style={styles.actionContainer}
    >
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          action.onPress();
        }}
        activeOpacity={0.85}
        style={styles.actionTouchable}
      >
        <Card 
          variant="default"
          padding="medium"
          style={[styles.actionCard, { backgroundColor: action.backgroundColor }] as any}
        >
          <View style={styles.actionIconContainer}>
            <View style={[styles.actionIconBg, { backgroundColor: action.color + '20' }]}>
              <IconSymbol name={action.icon as any} size={28} color={action.color} />
            </View>
          </View>
          <Text style={[styles.actionTitle, { color: action.color }]} numberOfLines={2}>
            {action.title}
          </Text>
          <Text style={styles.actionSubtitle} numberOfLines={2}>
            {action.subtitle}
          </Text>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderHealthTip = (tip: any, index: number) => (
    <Animated.View
      key={tip.id}
      entering={SlideInRight.delay(index * 150).springify()}
      style={styles.tipContainer}
    >
      <TouchableOpacity
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        activeOpacity={0.9}
        style={styles.tipCard}
      >
        <View style={[styles.tipIconContainer, { backgroundColor: tip.color + '15' }]}>
          <IconSymbol name={tip.icon as any} size={24} color={tip.color} />
        </View>
        <View style={styles.tipContent}>
          <Text style={styles.tipTitle}>{tip.title}</Text>
          <Text style={styles.tipDescription} numberOfLines={2}>
            {tip.description}
          </Text>
        </View>
        <View style={styles.tipArrow}>
          <IconSymbol name="chevron.right" size={16} color="#9CA3AF" />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[MedicalColors.primary[50], MedicalColors.secondary[50], '#FFFFFF']}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <Animated.ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* Header */}
          <Animated.View style={[styles.header, headerAnimatedStyle]}>
            <Animated.View entering={FadeIn.delay(200)}>
              <Text style={styles.headerTitle}>Health Hub</Text>
              <Text style={styles.headerSubtitle}>
                Your AI-powered health companion for better wellness
              </Text>
            </Animated.View>
          </Animated.View>

          {/* Health Actions Grid */}
          <Animated.View 
            style={styles.section}
            entering={FadeInDown.delay(400)}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Health Services</Text>
              <Text style={styles.sectionSubtitle}>
                Comprehensive health management tools
              </Text>
            </View>
            <View style={styles.actionsGrid}>
              {healthActions.map((action, index) => renderHealthAction(action, index))}
            </View>
          </Animated.View>

          {/* Health Tips */}
          <Animated.View 
            style={styles.section}
            entering={FadeInDown.delay(600)}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Daily Health Tips</Text>
              <Text style={styles.sectionSubtitle}>
                Simple habits for better health
              </Text>
            </View>
            <View style={styles.tipsContainer}>
              {healthTips.map((tip, index) => renderHealthTip(tip, index))}
            </View>
          </Animated.View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </Animated.ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 32,
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: IS_SMALL_DEVICE ? 28 : 32,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: IS_SMALL_DEVICE ? 15 : 16,
    color: '#6B7280',
    lineHeight: 24,
    fontWeight: '400',
  },
  section: {
    marginBottom: 40,
  },
  sectionHeader: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: IS_SMALL_DEVICE ? 20 : 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '400',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionContainer: {
    width: CARD_WIDTH,
    marginBottom: 16,
  },
  actionTouchable: {
    width: '100%',
  },
  actionCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    minHeight: IS_SMALL_DEVICE ? 140 : 160,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  actionIconContainer: {
    marginBottom: 12,
  },
  actionIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: IS_SMALL_DEVICE ? 14 : 16,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionSubtitle: {
    fontSize: IS_SMALL_DEVICE ? 11 : 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
    fontWeight: '500',
  },
  tipsContainer: {
    paddingHorizontal: 4,
  },
  tipContainer: {
    marginBottom: 12,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  tipIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
    paddingRight: 12,
  },
  tipTitle: {
    fontSize: IS_SMALL_DEVICE ? 15 : 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  tipDescription: {
    fontSize: IS_SMALL_DEVICE ? 13 : 14,
    color: '#6B7280',
    lineHeight: 20,
    fontWeight: '400',
  },
  tipArrow: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSpacing: {
    height: 20,
  },
}); 