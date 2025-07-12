import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
    SafeAreaView,
    TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol, Card, Button } from '@/components/ui';
import { MedicalColors, MedicalGradients } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function ConsultationFlow() {
  const router = useRouter();
  const [selectedPath, setSelectedPath] = useState<'self-service' | 'assisted' | null>(null);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  const handlePaymentAndStart = async () => {
    setIsPaymentProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsPaymentProcessing(false);
      Alert.alert(
        'Payment Successful',
        'Your consultation has been activated. How would you like to proceed?',
        [{ text: 'Continue', style: 'default' }]
      );
    }, 2000);
  };

  const handlePathSelection = (path: 'self-service' | 'assisted') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedPath(path);
    
    if (path === 'self-service') {
      router.push('/self-service-flow');
    } else {
      router.push('/assisted-help-flow');
    }
  };

  const consultationFeatures = [
    {
      icon: 'checkmark.shield',
      title: 'Standardized Process',
      description: 'Following medical textbook protocols for accurate diagnosis'
    },
    {
      icon: 'doc.text.magnifyingglass',
      title: 'Complete Data Review',
      description: 'Thorough analysis of your medical history and symptoms'
    },
    {
      icon: 'person.2.badge.plus',
      title: 'Expert Support Team',
      description: 'Trained professionals guide you through each step'
    },
    {
      icon: 'lightbulb',
      title: 'Clear Explanations',
      description: 'Understand your diagnosis and treatment options'
    }
  ];

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
        showsVerticalScrollIndicator={false}
      >
          {/* Header */}
          <Animated.View style={styles.header} entering={FadeInUp.duration(800)}>
            <View style={styles.headerIcon}>
              <LinearGradient
                colors={MedicalGradients.primary}
                style={styles.headerIconGradient}
              >
                <IconSymbol name="stethoscope" size={32} color="#FFFFFF" />
              </LinearGradient>
            </View>
            <Text style={styles.headerTitle}>Get Your Second Opinion</Text>
            <Text style={styles.headerSubtitle}>
              Professional medical consultation with clear explanations and standardized care
          </Text>
        </Animated.View>

          {/* Payment Section */}
          <Animated.View entering={FadeInDown.delay(200).duration(800)}>
            <Card variant="elevated" padding="large" style={styles.paymentCard}>
              <View style={styles.paymentHeader}>
                <Text style={styles.paymentTitle}>Consultation Fee</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.currency}>$</Text>
                  <Text style={styles.price}>49</Text>
                  <Text style={styles.period}>per consultation</Text>
                </View>
              </View>

                <View style={styles.featuresContainer}>
                {consultationFeatures.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <IconSymbol name={feature.icon} size={20} color={MedicalColors.primary[600]} />
                    <View style={styles.featureContent}>
                      <Text style={styles.featureTitle}>{feature.title}</Text>
                      <Text style={styles.featureDescription}>{feature.description}</Text>
                    </View>
                    </View>
                  ))}
                </View>

              <Button
                title={isPaymentProcessing ? 'Processing Payment...' : 'Pay & Start Consultation'}
                onPress={handlePaymentAndStart}
                variant="primary"
                size="large"
                icon={isPaymentProcessing ? undefined : "creditcard"}
                iconPosition="left"
                loading={isPaymentProcessing}
                disabled={isPaymentProcessing}
                fullWidth
                style={styles.paymentButton}
              />
            </Card>
          </Animated.View>

          {/* Path Selection */}
          {!isPaymentProcessing && (
            <Animated.View entering={FadeInDown.delay(400).duration(800)}>
              <View style={styles.pathSection}>
                <Text style={styles.pathTitle}>Choose Your Consultation Path</Text>
                <Text style={styles.pathSubtitle}>
                  How would you like to proceed with your consultation?
                </Text>

                <View style={styles.pathOptions}>
                  {/* Self-Service Path */}
                  <TouchableOpacity
                    style={styles.pathOption}
                    onPress={() => handlePathSelection('self-service')}
                    activeOpacity={0.8}
                  >
                    <Card variant="outlined" padding="large" style={styles.pathCard}>
                      <View style={styles.pathIcon}>
                        <IconSymbol name="person" size={32} color={MedicalColors.primary[600]} />
                      </View>
                      <Text style={styles.pathOptionTitle}>Self-Service</Text>
                      <Text style={styles.pathOptionDescription}>
                        Upload your medical information and symptoms independently. 
                        Great if you have your medical records ready.
                      </Text>
                      <View style={styles.pathFeatures}>
                        <View style={styles.pathFeature}>
                          <IconSymbol name="clock" size={16} color={MedicalColors.secondary[600]} />
                          <Text style={styles.pathFeatureText}>Faster process</Text>
                        </View>
                        <View style={styles.pathFeature}>
                          <IconSymbol name="doc.text" size={16} color={MedicalColors.secondary[600]} />
                          <Text style={styles.pathFeatureText}>Upload documents</Text>
                        </View>
                        <View style={styles.pathFeature}>
                          <IconSymbol name="checkmark" size={16} color={MedicalColors.secondary[600]} />
                          <Text style={styles.pathFeatureText}>Direct submission</Text>
                        </View>
                      </View>
                    </Card>
                  </TouchableOpacity>

                  {/* Assisted Path */}
                  <TouchableOpacity
                    style={styles.pathOption}
                    onPress={() => handlePathSelection('assisted')}
                    activeOpacity={0.8}
                  >
                    <Card variant="outlined" padding="large" style={styles.pathCard}>
                      <View style={styles.pathIcon}>
                        <IconSymbol name="person.2" size={32} color={MedicalColors.accent[600]} />
                      </View>
                      <Text style={styles.pathOptionTitle}>Assisted Help</Text>
                      <Text style={styles.pathOptionDescription}>
                        Our support team will guide you through the process, 
                        asking the right questions and helping collect your data.
                      </Text>
                      <View style={styles.pathFeatures}>
                        <View style={styles.pathFeature}>
                          <IconSymbol name="phone" size={16} color={MedicalColors.secondary[600]} />
                          <Text style={styles.pathFeatureText}>Personal guidance</Text>
                        </View>
                        <View style={styles.pathFeature}>
                          <IconSymbol name="questionmark.circle" size={16} color={MedicalColors.secondary[600]} />
                          <Text style={styles.pathFeatureText}>Expert questions</Text>
                        </View>
                        <View style={styles.pathFeature}>
                          <IconSymbol name="heart" size={16} color={MedicalColors.secondary[600]} />
                          <Text style={styles.pathFeatureText}>Personalized care</Text>
                        </View>
                  </View>
                    </Card>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          )}

          {/* Trust Building Section */}
          <Animated.View entering={FadeInDown.delay(600).duration(800)}>
            <Card variant="health" padding="large" style={styles.trustCard}>
              <View style={styles.trustHeader}>
                <IconSymbol name="shield.checkered" size={24} color={MedicalColors.secondary[600]} />
                <Text style={styles.trustTitle}>Why Trust Our Process?</Text>
        </View>
              <Text style={styles.trustDescription}>
                Our platform follows the same standard protocols taught in medical textbooks. 
                We believe in transparency, clear communication, and involving you in every step 
                of your healthcare journey.
              </Text>
              <View style={styles.trustPoints}>
                <View style={styles.trustPoint}>
                  <IconSymbol name="book.closed" size={16} color={MedicalColors.secondary[600]} />
                  <Text style={styles.trustPointText}>Textbook-based protocols</Text>
            </View>
                <View style={styles.trustPoint}>
                  <IconSymbol name="eye" size={16} color={MedicalColors.secondary[600]} />
                  <Text style={styles.trustPointText}>Complete transparency</Text>
            </View>
                <View style={styles.trustPoint}>
                  <IconSymbol name="person.badge.plus" size={16} color={MedicalColors.secondary[600]} />
                  <Text style={styles.trustPointText}>Patient involvement</Text>
            </View>
          </View>
            </Card>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerIcon: {
    marginBottom: 16,
  },
  headerIconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: MedicalColors.primary[500],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: MedicalColors.neutral[600],
    textAlign: 'center',
    lineHeight: 24,
  },
  paymentCard: {
    marginBottom: 32,
  },
  paymentHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  paymentTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  currency: {
    fontSize: 24,
    fontWeight: '600',
    color: MedicalColors.primary[600],
  },
  price: {
    fontSize: 48,
    fontWeight: '700',
    color: MedicalColors.primary[600],
  },
  period: {
    fontSize: 16,
    color: MedicalColors.neutral[600],
  },
  featuresContainer: {
    gap: 16,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    lineHeight: 20,
  },
  paymentButton: {
    shadowColor: MedicalColors.primary[500],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  pathSection: {
    marginBottom: 32,
  },
  pathTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
    textAlign: 'center',
    marginBottom: 8,
  },
  pathSubtitle: {
    fontSize: 16,
    color: MedicalColors.neutral[600],
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  pathOptions: {
    gap: 16,
  },
  pathOption: {
    width: '100%',
  },
  pathCard: {
    borderWidth: 2,
    borderColor: MedicalColors.neutral[200],
  },
  pathIcon: {
    alignItems: 'center',
    marginBottom: 16,
  },
  pathOptionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
    textAlign: 'center',
    marginBottom: 8,
  },
  pathOptionDescription: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  pathFeatures: {
    gap: 8,
  },
  pathFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pathFeatureText: {
    fontSize: 14,
    color: MedicalColors.neutral[700],
    fontWeight: '500',
  },
  trustCard: {
    marginBottom: 20,
  },
  trustHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  trustTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
  },
  trustDescription: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    lineHeight: 20,
    marginBottom: 16,
  },
  trustPoints: {
    gap: 8,
  },
  trustPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trustPointText: {
    fontSize: 14,
    color: MedicalColors.neutral[700],
    fontWeight: '500',
  },
});