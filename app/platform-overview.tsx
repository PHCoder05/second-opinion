import { Button, Card, IconSymbol, Typography } from '@/components/ui';
import { useResponsiveDesign } from '@/hooks/useResponsiveDesign';
import { useTheme } from '@/hooks/useThemeContext';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  Extrapolation,
  FadeIn,
  FadeInDown,
  FadeInUp,
  interpolate,
  SlideInRight,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PlatformFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  stats?: string;
  comingSoon?: boolean;
}

interface PlatformMetric {
  label: string;
  value: string;
  icon: string;
  color: string;
  trend?: 'up' | 'down' | 'stable';
}

export default function PlatformOverview() {
  const router = useRouter();
  const { colors } = useTheme();
  const responsive = useResponsiveDesign();
  const scrollY = useSharedValue(0);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 100],
      [1, 0.9],
      Extrapolation.CLAMP
    );
    
    const translateY = interpolate(
      scrollY.value,
      [0, 100],
      [0, -20],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const PLATFORM_STATS = [
    {
      id: 'doctors',
      title: 'Expert Doctors',
      value: '50+',
      icon: 'group',
      color: colors.primary,
    },
    {
      id: 'response',
      title: 'Response Time',
      value: '24-48h',
      icon: 'schedule',
      color: colors.secondary,
    },
    {
      id: 'satisfaction',
      title: 'Patient Satisfaction',
      value: '4.9/5',
      icon: 'favorite',
      color: colors.success,
    },
    {
      id: 'quality',
      title: 'Quality Score',
      value: '99.8%',
      icon: 'verified',
      color: colors.info,
    },
  ];

  const PLATFORM_FEATURES = [
    {
      id: 'consultations',
      title: 'Expert Consultations',
      description: 'Get second opinions from specialists',
      icon: 'medical-services',
      color: colors.primary,
    },
    {
      id: 'ai',
      title: 'AI Analysis',
      description: 'Advanced symptom analysis',
      icon: 'psychology',
      color: colors.secondary,
    },
    {
      id: 'security',
      title: 'Data Security',
      description: 'HIPAA compliant platform',
      icon: 'security',
      color: colors.success,
    },
    {
      id: 'protocols',
      title: 'Medical Protocols',
      description: 'Evidence-based approach',
      icon: 'assignment',
      color: colors.info,
    },
    {
      id: 'medications',
      title: 'Medication Review',
      description: 'Expert medication analysis',
      icon: 'medication',
      color: colors.warning,
    },
    {
      id: 'monitoring',
      title: 'Health Monitoring',
      description: 'Track vital signs and progress',
      icon: 'monitor-heart',
      color: colors.error,
    },
  ];

  const serviceTypes = [
    {
      id: 'self-service',
      title: 'Self-Service',
      price: '$29',
      description: 'AI-guided health assessment with instant results',
      features: ['AI Symptom Analysis', 'Health Recommendations', 'Educational Resources', 'Basic Support'],
      color: colors.success,
      popular: false,
    },
    {
      id: 'assisted',
      title: 'Expert Consultation',
      price: '$49',
      description: 'Complete consultation with certified medical professionals',
      features: ['Doctor Consultation', 'Second Opinion', 'Treatment Plan', 'Follow-up Support', 'Priority Access'],
      color: colors.primary,
      popular: true,
    },
    {
      id: 'premium',
      title: 'Premium Care',
      price: '$79',
      description: 'Comprehensive care with specialist consultations',
      features: ['Specialist Access', 'Advanced Diagnostics', 'Care Coordination', '24/7 Support', 'Health Coaching'],
      color: colors.accent,
      popular: false,
    },
  ];

  const renderHeader = () => (
    <Animated.View style={[styles.headerContainer, headerAnimatedStyle]}>
      <LinearGradient
        colors={[colors.primary + '20', colors.secondary + '10', 'transparent']}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Typography variant="largeTitle" color={colors.text} style={styles.headerTitle}>
              Second Opinion Platform
            </Typography>
            <Typography variant="subheading" color={colors.textSecondary} style={styles.headerSubtitle}>
              Your trusted partner in healthcare decisions
            </Typography>
          </View>
          
          <View style={styles.headerIcon}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              style={styles.headerIconGradient}
            >
              <IconSymbol name="medical_services" size={32} color="#FFFFFF" />
            </LinearGradient>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const renderMetrics = () => (
    <Animated.View 
      style={styles.metricsContainer}
      entering={FadeInDown.delay(200)}
    >
      <Typography variant="heading" color={colors.text} style={styles.sectionTitle}>
        Platform Statistics
      </Typography>
      
      <View style={styles.metricsGrid}>
        {PLATFORM_STATS.map((metric, index) => (
          <Animated.View
            key={metric.id}
            entering={FadeIn.delay(300 + index * 100)}
          >
            <Card style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <View style={[styles.metricIcon, { backgroundColor: metric.color + '20' }]}>
                  <IconSymbol name={metric.icon} size={20} color={metric.color} />
                </View>
                {/* Removed trend indicator as per new PLATFORM_STATS */}
              </View>
              <Typography variant="title" color={metric.color} style={styles.metricValue}>
                {metric.value}
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                {metric.title}
              </Typography>
            </Card>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );

  const renderCoreFeatures = () => (
    <Animated.View 
      style={styles.featuresContainer}
      entering={FadeInDown.delay(400)}
    >
      <Typography variant="heading" color={colors.text} style={styles.sectionTitle}>
        Core Features
      </Typography>
      
      <View style={styles.featuresGrid}>
        {PLATFORM_FEATURES.map((feature, index) => (
          <Animated.View
            key={feature.id}
            entering={SlideInRight.delay(500 + index * 100)}
          >
            <TouchableOpacity
              style={styles.featureCard}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                // Navigate to specific feature if not coming soon
                if (!feature.comingSoon) {
                  // router.push(`/${feature.id}`);
                }
              }}
              activeOpacity={0.8}
            >
              <Card style={[styles.featureCardContent, feature.comingSoon && styles.comingSoonCard]}>
                <View style={styles.featureHeader}>
                  <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
                    <IconSymbol name={feature.icon} size={24} color={feature.color} />
                  </View>
                  {feature.comingSoon && (
                    <View style={styles.comingSoonBadge}>
                      <Typography variant="small" color="#FFFFFF">
                        Coming Soon
                      </Typography>
                    </View>
                  )}
                </View>
                
                <Typography variant="subheading" color={colors.text} style={styles.featureTitle}>
                  {feature.title}
                </Typography>
                
                <Typography variant="body" color={colors.textSecondary} style={styles.featureDescription}>
                  {feature.description}
                </Typography>
                
                {feature.stats && (
                  <View style={styles.featureStats}>
                    <IconSymbol name="checkmark.circle.fill" size={16} color={colors.success} />
                    <Typography variant="caption" color={colors.success} style={styles.featureStatsText}>
                      {feature.stats}
                    </Typography>
                  </View>
                )}
              </Card>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );

  const renderServiceTiers = () => (
    <Animated.View 
      style={styles.serviceTiersContainer}
      entering={FadeInDown.delay(600)}
    >
      <Typography variant="heading" color={colors.text} style={styles.sectionTitle}>
        Service Tiers
      </Typography>
      
      <View style={styles.serviceTiersGrid}>
        {serviceTypes.map((service, index) => (
          <Animated.View
            key={service.id}
            entering={FadeInUp.delay(700 + index * 150)}
          >
            <TouchableOpacity
              style={styles.serviceTierCard}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push('/consultation-flow');
              }}
              activeOpacity={0.9}
            >
              <Card style={[styles.serviceTierContent, service.popular && styles.popularService]}>
                {service.popular && (
                  <View style={styles.popularBadge}>
                    <Typography variant="small" color="#FFFFFF">
                      Most Popular
                    </Typography>
                  </View>
                )}
                
                <View style={styles.serviceTierHeader}>
                  <Typography variant="subheading" color={colors.text}>
                    {service.title}
                  </Typography>
                  <Typography variant="largeTitle" color={service.color} style={styles.servicePrice}>
                    {service.price}
                  </Typography>
                </View>
                
                <Typography variant="body" color={colors.textSecondary} style={styles.serviceDescription}>
                  {service.description}
                </Typography>
                
                <View style={styles.serviceFeatures}>
                  {service.features.map((feature, featureIndex) => (
                    <View key={featureIndex} style={styles.serviceFeature}>
                      <IconSymbol name="checkmark" size={16} color={service.color} />
                      <Typography variant="body" color={colors.textSecondary} style={styles.serviceFeatureText}>
                        {feature}
                      </Typography>
                    </View>
                  ))}
                </View>
                
                <Button
                  title={`Choose ${service.title}`}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    router.push('/consultation-flow');
                  }}
                  variant={service.popular ? 'primary' : 'outline'}
                  style={styles.serviceTierButton}
                />
              </Card>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );

  const renderCallToAction = () => (
    <Animated.View 
      style={styles.ctaContainer}
      entering={FadeInUp.delay(800)}
    >
      <Card style={styles.ctaCard}>
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={styles.ctaGradient}
        >
          <View style={styles.ctaContent}>
            <IconSymbol name="favorite" size={48} color="#FFFFFF" />
            <Typography variant="heading" color="#FFFFFF" style={styles.ctaTitle}>
              Ready to Get Started?
            </Typography>
            <Typography variant="body" color="rgba(255,255,255,0.9)" style={styles.ctaDescription}>
              Join thousands of patients who trust Second Opinion for their healthcare decisions
            </Typography>
            
            <View style={styles.ctaButtons}>
              <Button
                title="Start Consultation"
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                  router.push('/consultation-flow');
                }}
                variant="secondary"
                style={styles.ctaButton}
              />
              <Button
                title="Learn More"
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/app-flow-guide');
                }}
                variant="outline"
                style={[styles.ctaButton, styles.ctaButtonOutline]}
              />
            </View>
          </View>
        </LinearGradient>
      </Card>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            style={styles.backButton}
          >
            <IconSymbol name="chevron.left" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Typography variant="heading" color={colors.text}>
            Platform Overview
          </Typography>
          <View style={styles.headerSpacer} />
        </View>

        <Animated.ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        >
          {renderHeader()}
          {renderMetrics()}
          {renderCoreFeatures()}
          {renderServiceTiers()}
          {renderCallToAction()}
        </Animated.ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(132, 204, 22, 0.1)',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  headerContainer: {
    marginBottom: 24,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
    marginRight: 16,
  },
  headerTitle: {
    marginBottom: 8,
  },
  headerSubtitle: {
    opacity: 0.8,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
  },
  headerIconGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  metricsContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: (SCREEN_WIDTH - 60) / 2,
    marginBottom: 16,
    padding: 16,
    alignItems: 'center',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  trendIndicator: {
    marginLeft: 'auto',
  },
  metricValue: {
    marginBottom: 4,
    textAlign: 'center',
  },
  featuresContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (SCREEN_WIDTH - 60) / 2,
    marginBottom: 16,
  },
  featureCardContent: {
    padding: 16,
    height: 220,
  },
  comingSoonCard: {
    opacity: 0.7,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoonBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featureTitle: {
    marginBottom: 8,
    fontSize: 16,
  },
  featureDescription: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  featureStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  featureStatsText: {
    marginLeft: 6,
  },
  serviceTiersContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  serviceTiersGrid: {
    gap: 16,
  },
  serviceTierCard: {
    marginBottom: 16,
  },
  serviceTierContent: {
    padding: 20,
    position: 'relative',
  },
  popularService: {
    borderWidth: 2,
    borderColor: '#007BFF',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: 20,
    backgroundColor: '#007BFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  serviceTierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  servicePrice: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  serviceDescription: {
    marginBottom: 16,
    fontSize: 14,
  },
  serviceFeatures: {
    marginBottom: 20,
  },
  serviceFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceFeatureText: {
    marginLeft: 8,
    fontSize: 14,
  },
  serviceTierButton: {
    marginTop: 'auto',
  },
  ctaContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  ctaCard: {
    overflow: 'hidden',
  },
  ctaGradient: {
    padding: 32,
    alignItems: 'center',
  },
  ctaContent: {
    alignItems: 'center',
  },
  ctaTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaDescription: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 16,
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  ctaButton: {
    flex: 1,
  },
  ctaButtonOutline: {
    borderColor: 'rgba(255,255,255,0.3)',
  },
}); 