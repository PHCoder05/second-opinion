import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Button } from '@/components/ui/Button';
import { MedicalColors, MedicalGradients } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = () => {
  const router = useRouter();

  const handleGetStartedPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/onboarding');
  };

  const handleSignInPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/signin');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[MedicalColors.primary[50], MedicalColors.secondary[50], '#FFFFFF']}
        locations={[0, 0.6, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header with Logo */}
          <Animated.View style={styles.header} entering={FadeInUp.duration(1000)}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={MedicalGradients.primary}
                style={styles.logoGradient}
              >
                <IconSymbol name="stethoscope" size={32} color="#FFFFFF" />
              </LinearGradient>
            </View>
            
            <Text style={styles.brandName}>Second Opinion</Text>
            <Text style={styles.brandTagline}>Expert Medical Care at Your Fingertips</Text>
          </Animated.View>

          {/* Hero Section */}
          <Animated.View style={styles.heroSection} entering={FadeIn.duration(1000).delay(300)}>
            <View style={styles.heroImageContainer}>
              <LinearGradient
                colors={['rgba(14, 165, 233, 0.1)', 'rgba(16, 185, 129, 0.1)']}
                style={styles.heroImageGradient}
              >
                <IconSymbol name="heart.text.square" size={80} color={MedicalColors.primary[500]} />
              </LinearGradient>
              
              {/* Floating elements */}
              <Animated.View 
                style={[styles.floatingElement, styles.floatingElement1]} 
                entering={FadeIn.duration(1000).delay(600)}
              >
                <IconSymbol name="pills" size={24} color={MedicalColors.secondary[500]} />
              </Animated.View>
              
              <Animated.View 
                style={[styles.floatingElement, styles.floatingElement2]} 
                entering={FadeIn.duration(1000).delay(800)}
              >
                <IconSymbol name="waveform.path.ecg" size={24} color={MedicalColors.accent[500]} />
              </Animated.View>
              
              <Animated.View 
                style={[styles.floatingElement, styles.floatingElement3]} 
                entering={FadeIn.duration(1000).delay(1000)}
              >
                <IconSymbol name="cross.case" size={24} color={MedicalColors.primary[600]} />
              </Animated.View>
            </View>

            <Text style={styles.heroTitle}>
              Your Health, <Text style={styles.heroTitleAccent}>Our Priority</Text>
            </Text>
            
            <Text style={styles.heroDescription}>
              Get expert medical opinions from certified healthcare professionals. 
              Access 24/7 telehealth services, AI-powered health assessments, and 
              personalized care plans tailored to your needs.
            </Text>
          </Animated.View>

          {/* Features Preview */}
          <Animated.View style={styles.featuresSection} entering={FadeInDown.duration(1000).delay(500)}>
            <View style={styles.featureRow}>
              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: MedicalColors.primary[100] }]}>
                  <IconSymbol name="video" size={20} color={MedicalColors.primary[600]} />
                </View>
                <Text style={styles.featureText}>Video Consultations</Text>
              </View>
              
              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: MedicalColors.secondary[100] }]}>
                  <IconSymbol name="brain.head.profile" size={20} color={MedicalColors.secondary[600]} />
                </View>
                <Text style={styles.featureText}>AI Health Assistant</Text>
              </View>
              
              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: MedicalColors.accent[100] }]}>
                  <IconSymbol name="doc.text" size={20} color={MedicalColors.accent[600]} />
                </View>
                <Text style={styles.featureText}>Medical Records</Text>
              </View>
            </View>
          </Animated.View>

          {/* Call to Action */}
          <Animated.View style={styles.ctaSection} entering={FadeInUp.duration(1000).delay(700)}>
            <Button
              title="Get Started"
              onPress={handleGetStartedPress}
              variant="primary"
              size="large"
              icon="arrow.right"
              iconPosition="right"
              fullWidth
              style={styles.primaryButton}
            />
            
            <Button
              title="I already have an account"
              onPress={handleSignInPress}
              variant="ghost"
              size="medium"
              style={styles.secondaryButton}
            />
          </Animated.View>

          {/* Trust Indicators */}
          <Animated.View style={styles.trustSection} entering={FadeIn.duration(1000).delay(900)}>
            <View style={styles.trustRow}>
              <View style={styles.trustItem}>
                <IconSymbol name="checkmark.seal" size={16} color={MedicalColors.secondary[600]} />
                <Text style={styles.trustText}>HIPAA Compliant</Text>
              </View>
              <View style={styles.trustItem}>
                <IconSymbol name="shield.checkered" size={16} color={MedicalColors.secondary[600]} />
                <Text style={styles.trustText}>Secure & Private</Text>
              </View>
              <View style={styles.trustItem}>
                <IconSymbol name="star.fill" size={16} color={MedicalColors.accent[500]} />
                <Text style={styles.trustText}>4.8★ Rating</Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: MedicalColors.primary[500],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
    marginBottom: 8,
    textAlign: 'center',
  },
  brandTagline: {
    fontSize: 16,
    color: MedicalColors.neutral[600],
    textAlign: 'center',
    fontWeight: '500',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  heroImageContainer: {
    position: 'relative',
    marginBottom: 32,
  },
  heroImageGradient: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: MedicalColors.primary[300],
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 10,
  },
  floatingElement: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: MedicalColors.neutral[400],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 5,
  },
  floatingElement1: {
    top: 20,
    right: 10,
  },
  floatingElement2: {
    bottom: 30,
    left: 5,
  },
  floatingElement3: {
    top: 80,
    left: -10,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  heroTitleAccent: {
    color: MedicalColors.primary[600],
  },
  heroDescription: {
    fontSize: 16,
    color: MedicalColors.neutral[600],
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  featuresSection: {
    marginBottom: 40,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '600',
    color: MedicalColors.neutral[700],
    textAlign: 'center',
  },
  ctaSection: {
    gap: 16,
    marginBottom: 32,
  },
  primaryButton: {
    shadowColor: MedicalColors.primary[500],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  secondaryButton: {
    marginTop: 8,
  },
  trustSection: {
    alignItems: 'center',
  },
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trustText: {
    fontSize: 12,
    color: MedicalColors.neutral[600],
    fontWeight: '500',
  },
}); 