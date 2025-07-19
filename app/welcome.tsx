import { Button, Card, IconSymbol } from '@/components/ui';
import { MedicalColors, MedicalGradients } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
    Dimensions,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    Extrapolate,
    FadeIn,
    FadeInDown,
    FadeInLeft,
    FadeInUp,
    SlideInDown,
    SlideInUp,
    ZoomIn,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const FEATURES = [
  {
    icon: 'videocam',
    title: 'Video Consultations',
    description: 'Connect with licensed doctors instantly',
    color: MedicalColors.primary[600],
    gradient: MedicalGradients?.primary || ['#007BFF', '#0056D3'],
  },
  {
    icon: 'psychology',
    title: 'AI Health Assistant',
    description: 'Get personalized health insights',
    color: MedicalColors.secondary[600],
    gradient: MedicalGradients?.secondary || ['#6C757D', '#495057'],
  },
  {
    icon: 'description',
    title: 'Medical Records',
    description: 'Secure digital health records',
    color: MedicalColors.accent[600],
    gradient: MedicalGradients?.accent || ['#17A2B8', '#00ACC1'],
  },
  {
    icon: 'verified_user',
    title: 'Expert Care',
    description: 'Board-certified specialists',
    color: MedicalColors.success[600],
    gradient: MedicalGradients?.success || ['#28A745', '#16A34A'],
  },
];

const TRUST_INDICATORS = [
  { icon: 'verified', text: 'HIPAA Compliant', color: MedicalColors.success[600] },
  { icon: 'verified_user', text: 'Secure & Private', color: MedicalColors.info[600] },
  { icon: 'star', text: '4.8★ Rating', color: MedicalColors.warning[500] },
  { icon: 'local_hospital', text: 'Medical Licensed', color: MedicalColors.primary[600] },
];

export default function Welcome() {
  const router = useRouter();
  const pulseAnimation = useSharedValue(0);
  const floatingAnimation = useSharedValue(0);

  useEffect(() => {
    // Pulse animation for the main icon
    pulseAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(0, { duration: 2000 })
      ),
      -1,
      true
    );

    // Floating animation for feature cards
    floatingAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000 }),
        withTiming(0, { duration: 3000 })
      ),
      -1,
      true
    );
  }, []);

  const handleGetStarted = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/onboarding');
  };

  const handleSignIn = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/signin');
  };

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          pulseAnimation.value,
          [0, 1],
          [1, 1.1],
          Extrapolate.CLAMP
        ),
      },
    ],
    opacity: interpolate(
      pulseAnimation.value,
      [0, 1],
      [0.8, 1],
      Extrapolate.CLAMP
    ),
  }));

  const floatingStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          floatingAnimation.value,
          [0, 1],
          [0, -10],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={MedicalColors.primary[600]} />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={MedicalGradients?.primary || ['#007BFF', '#0056D3']}
        style={styles.backgroundGradient}
      />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Hero Section */}
        <Animated.View 
          style={styles.heroSection}
          entering={FadeInUp.duration(800).delay(200)}
        >
          <Animated.View style={[styles.heroIconContainer, pulseStyle]}>
            <LinearGradient
              colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
              style={styles.heroIconGradient}
            >
              <IconSymbol 
                name="favorite" 
                size={64} 
                color="#FFFFFF" 
              />
            </LinearGradient>
          </Animated.View>

          <Animated.Text 
            style={styles.heroTitle}
            entering={FadeInUp.duration(800).delay(400)}
          >
            Your Health,{'\n'}Our Priority
          </Animated.Text>

          <Animated.Text 
            style={styles.heroSubtitle}
            entering={FadeInUp.duration(800).delay(600)}
          >
            Get expert medical opinions from board-certified doctors,
            wherever you are, whenever you need them.
          </Animated.Text>
        </Animated.View>

        {/* Floating Medical Icons */}
        <Animated.View 
          style={[styles.floatingIcons, floatingStyle]}
          entering={FadeIn.duration(1000).delay(800)}
        >
          <View style={styles.floatingIconsContainer}>
            <Animated.View
              style={[styles.floatingIcon, { backgroundColor: MedicalColors.secondary[100] }]}
              entering={FadeIn.duration(1000).delay(1000)}
            >
              <IconSymbol name="medication" size={20} color={MedicalColors.secondary[600]} />
            </Animated.View>
            
            <Animated.View
              style={[styles.floatingIcon, { backgroundColor: MedicalColors.accent[100] }]}
              entering={FadeIn.duration(1000).delay(1200)}
            >
              <IconSymbol name="favorite" size={20} color={MedicalColors.accent[600]} />
            </Animated.View>
            
            <Animated.View
              style={[styles.floatingIcon, { backgroundColor: MedicalColors.warning[100] }]}
              entering={FadeIn.duration(1000).delay(1400)}
            >
              <IconSymbol name="local_hospital" size={20} color={MedicalColors.warning[600]} />
            </Animated.View>
          </View>
        </Animated.View>

        {/* Features Grid */}
        <Animated.View 
          style={styles.featuresSection}
          entering={SlideInUp.duration(800).delay(1000)}
        >
          <Text style={styles.sectionTitle}>Why Choose Us?</Text>
          
          <View style={styles.featuresGrid}>
            {FEATURES.map((feature, index) => (
              <Animated.View
                key={feature.title}
                style={styles.featureCardContainer}
                entering={FadeInLeft.duration(600).delay(1200 + index * 150)}
              >
                <Card variant="elevated" style={styles.featureCard}>
                  <LinearGradient
                    colors={feature.gradient}
                    style={styles.featureIconContainer}
                  >
                    <IconSymbol 
                      name={feature.icon} 
                      size={24} 
                      color="#FFFFFF" 
                    />
                  </LinearGradient>
                  
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                  </View>
                </Card>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Trust Indicators */}
        <Animated.View 
          style={styles.trustSection}
          entering={FadeInDown.duration(800).delay(1800)}
        >
          <Text style={styles.trustTitle}>Trusted by Thousands</Text>
          
          <View style={styles.trustGrid}>
            {TRUST_INDICATORS.map((indicator, index) => (
              <Animated.View
                key={indicator.text}
                style={styles.trustItem}
                entering={ZoomIn.duration(500).delay(2000 + index * 100)}
              >
                <View style={[styles.trustIcon, { backgroundColor: `${indicator.color}15` }]}>
                  <IconSymbol name={indicator.icon} size={16} color={indicator.color} />
                </View>
                <Text style={styles.trustText}>{indicator.text}</Text>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View 
          style={styles.actionSection}
          entering={SlideInDown.duration(800).delay(2200)}
        >
          <Button
            variant="primary"
            size="large"
            icon="arrow_forward"
            iconPosition="right"
            fullWidth
            onPress={handleGetStarted}
            style={styles.primaryButton}
          >
            Get Started Now
          </Button>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleSignIn}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>
              Already have an account? <Text style={styles.signInText}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MedicalColors.primary[600],
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  
  // Hero Section
  heroSection: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
  },
  heroIconContainer: {
    marginBottom: 32,
  },
  heroIconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 42,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 20,
    fontWeight: '400',
  },

  // Floating Icons
  floatingIcons: {
    marginBottom: 40,
  },
  floatingIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  floatingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },

  // Features Section
  featuresSection: {
    marginBottom: 48,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: -0.3,
  },
  featuresGrid: {
    gap: 16,
  },
  featureCardContainer: {
    marginBottom: 8,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: MedicalColors.neutral[800],
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  featureDescription: {
    fontSize: 15,
    color: MedicalColors.neutral[600],
    lineHeight: 20,
    fontWeight: '400',
  },

  // Trust Section
  trustSection: {
    marginBottom: 48,
  },
  trustTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: -0.3,
  },
  trustGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  trustItem: {
    alignItems: 'center',
    width: (screenWidth - 72) / 2, // Account for padding and gap
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  trustIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  trustText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontWeight: '600',
  },

  // Action Section
  actionSection: {
    marginBottom: 24,
  },
  primaryButton: {
    marginBottom: 20,
    height: 56,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  secondaryButtonText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    fontWeight: '400',
  },
  signInText: {
    color: '#FFFFFF',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  bottomSpacing: {
    height: 40,
  },
}); 