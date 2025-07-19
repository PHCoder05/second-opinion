import {
    Body,
    Caption,
    Heading,
    IconSymbol,
    Subheading,
    Title
} from '@/components/ui';
import {
    Spacing
} from '@/constants/Colors';
import { useResponsiveDesign } from '@/hooks/useResponsiveDesign';
import { ThemeProvider, useThemeColors } from '@/hooks/useThemeContext';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ColorValue,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    Extrapolate,
    FadeIn,
    FadeInUp,
    interpolate,
    SlideInDown,
    SlideInLeft,
    SlideInRight,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ConsultationFlowContent: React.FC = () => {
  const router = useRouter();
  const colors = useThemeColors();
  const { isMobile } = useResponsiveDesign();
  
  const [selectedPath, setSelectedPath] = useState<'self-service' | 'assisted' | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const animatedValue = useSharedValue(0);
  const progressValue = useSharedValue(0);

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handlePathSelection = (path: 'self-service' | 'assisted') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedPath(path);
    setShowDetails(true);
    animatedValue.value = withSpring(1, { damping: 15, stiffness: 150 });
    progressValue.value = withTiming(0.5, { duration: 800 });
    
    setTimeout(() => {
      progressValue.value = withTiming(1, { duration: 500 });
      setTimeout(() => {
        if (path === 'self-service') {
          router.push('/self-service-flow');
        } else {
          router.push('/assisted-help-flow');
        }
      }, 300);
    }, 1000);
  };

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      animatedValue.value,
      [0, 1],
      [1, 0.98],
      Extrapolate.CLAMP
    );
    
    const opacity = interpolate(
      animatedValue.value,
      [0, 1],
      [1, 0.8],
      Extrapolate.CLAMP
    );
    
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const progressAnimatedStyle = useAnimatedStyle(() => {
    const width = interpolate(
      progressValue.value,
      [0, 1],
      [0, screenWidth - 60],
      Extrapolate.CLAMP
    );
    
    return {
      width,
    };
  });

  const renderProgressBar = () => (
    <Animated.View 
      style={styles.progressContainer}
      entering={FadeIn.delay(200).duration(600)}
    >
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, progressAnimatedStyle]} />
      </View>
      <View style={styles.progressSteps}>
        <View style={[styles.step, styles.activeStep]}>
          <IconSymbol name="checkmark" size={14} color="#FFFFFF" />
        </View>
        <View style={[styles.step, selectedPath && styles.activeStep]}>
          <IconSymbol name="person.fill" size={14} color={selectedPath ? "#FFFFFF" : "#8B5CF6"} />
        </View>
        <View style={styles.step}>
          <IconSymbol name="doc.fill" size={14} color="#8B5CF6" />
        </View>
      </View>
    </Animated.View>
  );

  const renderHeader = () => (
    <Animated.View style={styles.header} entering={FadeInUp.duration(800).springify()}>
      {/* Custom Navigation Header */}
      <View style={styles.navHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <IconSymbol name="chevron.left" size={20} color="#6366F1" />
        </TouchableOpacity>
        <View style={styles.navTitle}>
          <Caption style={styles.navTitleText}>Medical Consultation</Caption>
        </View>
        <TouchableOpacity style={styles.helpButton} activeOpacity={0.7}>
          <IconSymbol name="questionmark.circle" size={20} color="#6366F1" />
        </TouchableOpacity>
      </View>

      {renderProgressBar()}

      <View style={styles.heroSection}>
        <View style={styles.heroContent}>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['#6366F1', '#8B5CF6', '#A855F7'] as readonly [ColorValue, ColorValue, ColorValue]}
              style={styles.iconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <IconSymbol name="heart.fill" size={32} color="#FFFFFF" />
            </LinearGradient>
          </View>
          
          <View style={styles.titleSection}>
            <Title style={styles.mainTitle}>
              Get Your Medical Second Opinion
            </Title>
            <Body style={styles.subtitle}>
              Connect with certified doctors for professional medical consultation and peace of mind
            </Body>
          </View>

          <View style={styles.trustIndicators}>
            <View style={styles.trustItem}>
              <View style={[styles.trustIcon, { backgroundColor: '#ECFDF5' }]}>
                <IconSymbol name="shield.fill" size={16} color="#10B981" />
              </View>
              <Caption style={styles.trustText}>HIPAA Compliant</Caption>
            </View>
            <View style={styles.trustItem}>
              <View style={[styles.trustIcon, { backgroundColor: '#EFF6FF' }]}>
                <IconSymbol name="clock.fill" size={16} color="#3B82F6" />
              </View>
              <Caption style={styles.trustText}>24-48h Response</Caption>
            </View>
            <View style={styles.trustItem}>
              <View style={[styles.trustIcon, { backgroundColor: '#F3E8FF' }]}>
                <IconSymbol name="person.fill" size={16} color="#8B5CF6" />
              </View>
              <Caption style={styles.trustText}>Board Certified</Caption>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const renderPathSelection = () => (
    <Animated.View entering={SlideInUp.delay(400).duration(700).springify()}>
      <View style={styles.pathSelectionContainer}>
        <View style={styles.pathHeader}>
          <Heading style={styles.pathTitle}>Choose Your Consultation Path</Heading>
          <Caption style={styles.pathSubtitle}>Select the option that best fits your needs</Caption>
        </View>
        
        <View style={styles.pathOptionsContainer}>
          {/* Self-Service Path */}
          <Animated.View 
            entering={SlideInLeft.delay(600).duration(600).springify()}
            style={[animatedStyle]}
          >
            <TouchableOpacity
              style={[styles.pathOption, selectedPath === 'self-service' && styles.selectedPath]}
              onPress={() => handlePathSelection('self-service')}
              activeOpacity={0.9}
              disabled={!!selectedPath}
            >
              <LinearGradient
                colors={['#6366F1', '#8B5CF6'] as readonly [ColorValue, ColorValue]}
                style={styles.pathHeader_}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.pathIconContainer}>
                  <IconSymbol name="person.fill" size={28} color="#FFFFFF" />
                </View>
                <View style={styles.pathBadge}>
                  <IconSymbol name="star.fill" size={12} color="#FBBF24" />
                  <Caption style={styles.badgeText}>Popular</Caption>
                </View>
              </LinearGradient>
              
              <View style={styles.pathContent}>
                <Subheading style={styles.pathOptionTitle}>Self-Service</Subheading>
                <Body style={styles.pathDescription}>
                  Complete your consultation independently with AI-guided assistance and comprehensive medical analysis
                </Body>

                <View style={styles.pathFeatures}>
                  <View style={styles.featureRow}>
                    <View style={[styles.featureIcon, { backgroundColor: '#EFF6FF' }]}>
                      <IconSymbol name="clock" size={14} color="#3B82F6" />
                    </View>
                    <Caption style={styles.featureText}>Quick 15-30 minute process</Caption>
                  </View>
                  <View style={styles.featureRow}>
                    <View style={[styles.featureIcon, { backgroundColor: '#F3E8FF' }]}>
                      <IconSymbol name="cpu" size={14} color="#8B5CF6" />
                    </View>
                    <Caption style={styles.featureText}>AI-guided smart questionnaire</Caption>
                  </View>
                  <View style={styles.featureRow}>
                    <View style={[styles.featureIcon, { backgroundColor: '#ECFDF5' }]}>
                      <IconSymbol name="checkmark.circle.fill" size={14} color="#10B981" />
                    </View>
                    <Caption style={styles.featureText}>Instant preliminary assessment</Caption>
                  </View>
                </View>

                <View style={styles.pathValueProps}>
                  <Caption style={styles.valueText}>✓ Cost-effective solution</Caption>
                  <Caption style={styles.valueText}>✓ Immediate availability</Caption>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Assisted Path */}
          <Animated.View 
            entering={SlideInRight.delay(700).duration(600).springify()}
            style={[animatedStyle]}
          >
            <TouchableOpacity
              style={[styles.pathOption, selectedPath === 'assisted' && styles.selectedPath]}
              onPress={() => handlePathSelection('assisted')}
              activeOpacity={0.9}
              disabled={!!selectedPath}
            >
              <LinearGradient
                colors={['#EC4899', '#F97316'] as readonly [ColorValue, ColorValue]}
                style={styles.pathHeader_}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.pathIconContainer}>
                  <IconSymbol name="person.2.fill" size={28} color="#FFFFFF" />
                </View>
                <View style={[styles.pathBadge, styles.premiumBadge]}>
                  <IconSymbol name="crown.fill" size={12} color="#F59E0B" />
                  <Caption style={[styles.badgeText, styles.premiumText]}>Premium</Caption>
                </View>
              </LinearGradient>
              
              <View style={styles.pathContent}>
                <Subheading style={styles.pathOptionTitle}>Assisted Service</Subheading>
                <Body style={styles.pathDescription}>
                  Get personalized help from our medical coordinators with dedicated support throughout your consultation journey
                </Body>

                <View style={styles.pathFeatures}>
                  <View style={styles.featureRow}>
                    <View style={[styles.featureIcon, { backgroundColor: '#FDF2F8' }]}>
                      <IconSymbol name="person.badge.plus" size={14} color="#EC4899" />
                    </View>
                    <Caption style={styles.featureText}>Dedicated personal coordinator</Caption>
                  </View>
                  <View style={styles.featureRow}>
                    <View style={[styles.featureIcon, { backgroundColor: '#FEF3C7' }]}>
                      <IconSymbol name="phone.fill" size={14} color="#F59E0B" />
                    </View>
                    <Caption style={styles.featureText}>Phone & chat support included</Caption>
                  </View>
                  <View style={styles.featureRow}>
                    <View style={[styles.featureIcon, { backgroundColor: '#EFF6FF' }]}>
                      <IconSymbol name="bolt.fill" size={14} color="#3B82F6" />
                    </View>
                    <Caption style={styles.featureText}>Priority processing & review</Caption>
                  </View>
                </View>

                <View style={styles.pathValueProps}>
                  <Caption style={styles.valueText}>✓ White-glove service</Caption>
                  <Caption style={styles.valueText}>✓ Faster turnaround</Caption>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {selectedPath && (
          <Animated.View 
            entering={SlideInDown.delay(200).duration(500)}
            style={styles.nextStepContainer}
          >
            <View style={styles.nextStepContent}>
              <View style={styles.nextStepIcon}>
                <IconSymbol name="arrow.right" size={24} color="#6366F1" />
              </View>
              <View style={styles.nextStepTextContainer}>
                <Body style={styles.nextStepText}>
                  Preparing your {selectedPath === 'self-service' ? 'self-service' : 'assisted'} consultation...
                </Body>
                <Caption style={styles.nextStepSubtext}>
                  You'll be redirected shortly to begin your medical consultation process
                </Caption>
              </View>
            </View>
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );

  const renderBottomInfo = () => (
    <Animated.View entering={FadeIn.delay(1000).duration(600)}>
      <View style={styles.bottomInfo}>
        <View style={styles.securityBadge}>
          <IconSymbol name="lock.fill" size={16} color="#10B981" />
          <Caption style={styles.securityText}>Your data is encrypted and secure</Caption>
        </View>
        
        <View style={styles.supportInfo}>
          <Caption style={styles.supportText}>
            Need help? Contact our support team at support@medicalapp.com
          </Caption>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          {renderHeader()}
          {renderPathSelection()}
          {renderBottomInfo()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const SlideInUp = SlideInDown;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    padding: Spacing.lg,
    gap: Spacing.xl,
    backgroundColor: '#FFFFFF',
    minHeight: '100%',
  },
  
  // Progress Bar Styles
  progressContainer: {
    marginVertical: Spacing.lg,
    alignItems: 'center',
  },
  progressTrack: {
    width: screenWidth - 60,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: Spacing.md,
  },
  progressFill: {
    height: 4,
    backgroundColor: '#6366F1',
    borderRadius: 2,
  },
  progressSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: screenWidth - 60,
    paddingHorizontal: Spacing.sm,
  },
  step: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeStep: {
    backgroundColor: '#6366F1',
  },
  
  // Header Styles
  header: {
    gap: Spacing.md,
  },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  helpButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  navTitle: {
    flex: 1,
    alignItems: 'center',
  },
  navTitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  
  heroSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  heroContent: {
    alignItems: 'center',
    maxWidth: 350,
  },
  iconContainer: {
    marginBottom: Spacing.lg,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: Spacing.sm,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  trustIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: Spacing.md,
  },
  trustItem: {
    alignItems: 'center',
    gap: 6,
  },
  trustIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  trustText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },

  // Path Selection Styles
  pathSelectionContainer: {
    gap: Spacing.xl,
  },
  pathHeader: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  pathTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111827',
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  pathSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  pathOptionsContainer: {
    gap: Spacing.lg,
  },
  pathOption: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  selectedPath: {
    borderColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    transform: [{ scale: 1.02 }],
  },
  pathHeader_: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
  },
  pathIconContainer: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pathBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  badgeText: {
    fontSize: 11,
    color: '#FBBF24',
    fontWeight: '600',
  },
  premiumText: {
    color: '#F59E0B',
  },
  pathContent: {
    padding: Spacing.lg,
  },
  pathOptionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  pathDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  pathFeatures: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 4,
  },
  featureIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  pathValueProps: {
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: Spacing.md,
  },
  valueText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },

  // Next Step Styles
  nextStepContainer: {
    backgroundColor: '#F8FAFC',
    padding: Spacing.lg,
    borderRadius: 16,
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  nextStepContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  nextStepIcon: {
    marginTop: 2,
  },
  nextStepTextContainer: {
    flex: 1,
    gap: 4,
  },
  nextStepText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  nextStepSubtext: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },

  // Bottom Info Styles
  bottomInfo: {
    alignItems: 'center',
    gap: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  securityText: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '600',
  },
  supportInfo: {
    paddingHorizontal: Spacing.lg,
  },
  supportText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 16,
  },
});

// Default export for Expo Router
export default function ConsultationFlowScreen() {
  return (
    <ThemeProvider>
      <ConsultationFlowContent />
    </ThemeProvider>
  );
}