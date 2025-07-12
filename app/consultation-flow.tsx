import { IconSymbol } from '@/components/ui/IconSymbol';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

interface ConsultationPath {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  backgroundColor: string;
  features: string[];
  price: string;
  duration: string;
  onPress: () => void;
}

const ConsultationFlowScreen = () => {
  const router = useRouter();
  const [selectedPath, setSelectedPath] = useState<string>('');

  const consultationPaths: ConsultationPath[] = [
    {
      id: 'self-service',
      title: 'Self-Service',
      subtitle: 'Independent Assessment',
      description: 'Upload your information and get AI-guided assistance with optional human support',
      icon: 'person.fill',
      color: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      features: [
        'Upload medical documents',
        'AI-powered symptom analysis',
        'Structured health questionnaire',
        'Instant preliminary assessment',
        'Request human support anytime',
        'Cost-effective option'
      ],
      price: '$29',
      duration: '15-30 minutes',
      onPress: () => handlePathSelection('self-service')
    },
    {
      id: 'assisted-help',
      title: 'Assisted Help',
      subtitle: 'Expert Guidance',
      description: 'Direct connection with our medical support team for personalized guidance',
      icon: 'person.2.fill',
      color: 'rgb(132, 204, 22)',
      backgroundColor: 'rgba(132, 204, 22, 0.1)',
      features: [
        'Direct medical team support',
        'Personalized data collection',
        'Expert symptom evaluation',
        'Guided through each step',
        'Immediate clarifications',
        'Comprehensive assessment'
      ],
      price: '$79',
      duration: '45-60 minutes',
      onPress: () => handlePathSelection('assisted-help')
    }
  ];

  const handlePathSelection = (pathId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedPath(pathId);
    
    // Show confirmation modal
    Alert.alert(
      'Confirm Your Choice',
      `You've selected ${pathId === 'self-service' ? 'Self-Service' : 'Assisted Help'}. Would you like to proceed?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Proceed', 
          onPress: () => proceedWithPath(pathId)
        }
      ]
    );
  };

  const proceedWithPath = (pathId: string) => {
    if (pathId === 'self-service') {
      // Navigate to self-service flow
      router.push('/self-service-flow');
    } else {
      // Navigate to assisted help flow
      router.push('/assisted-help-flow');
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View style={styles.header} entering={FadeIn}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <IconSymbol name="chevron.left" size={24} color="rgb(49, 58, 52)" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>How Can We Help You?</Text>
          <Text style={styles.headerSubtitle}>Choose your consultation path</Text>
        </View>
        
        <View style={styles.headerSpacer} />
      </Animated.View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Introduction */}
        <Animated.View style={styles.introContainer} entering={FadeInDown.delay(200)}>
          <Text style={styles.introTitle}>Welcome to Second Opinion</Text>
          <Text style={styles.introDescription}>
            We understand you're seeking clarity about your health. Choose the path that best fits your needs - 
            whether you prefer to explore independently or want expert guidance every step of the way.
          </Text>
        </Animated.View>

        {/* Consultation Paths */}
        <View style={styles.pathsContainer}>
          {consultationPaths.map((path, index) => (
            <Animated.View
              key={path.id}
              entering={FadeInDown.delay(300 + index * 100)}
              style={styles.pathCard}
            >
              <TouchableOpacity
                style={[
                  styles.pathButton,
                  selectedPath === path.id && styles.pathButtonSelected
                ]}
                onPress={path.onPress}
                activeOpacity={0.7}
              >
                {/* Header */}
                <View style={styles.pathHeader}>
                  <View style={[styles.pathIcon, { backgroundColor: path.backgroundColor }]}>
                    <IconSymbol name={path.icon} size={32} color={path.color} />
                  </View>
                  <View style={styles.pathHeaderText}>
                    <Text style={styles.pathTitle}>{path.title}</Text>
                    <Text style={styles.pathSubtitle}>{path.subtitle}</Text>
                  </View>
                  <View style={styles.pathPricing}>
                    <Text style={styles.pathPrice}>{path.price}</Text>
                    <Text style={styles.pathDuration}>{path.duration}</Text>
                  </View>
                </View>

                {/* Description */}
                <Text style={styles.pathDescription}>{path.description}</Text>

                {/* Features */}
                <View style={styles.featuresContainer}>
                  {path.features.map((feature, featureIndex) => (
                    <View key={featureIndex} style={styles.featureItem}>
                      <View style={[styles.featureBullet, { backgroundColor: path.color }]} />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>

                {/* Action Button */}
                <View style={styles.pathActionContainer}>
                  <View style={[styles.pathActionButton, { backgroundColor: path.color }]}>
                    <Text style={styles.pathActionText}>Choose This Path</Text>
                    <IconSymbol name="arrow.right" size={20} color="white" />
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Trust Indicators */}
        <Animated.View style={styles.trustContainer} entering={FadeInDown.delay(600)}>
          <Text style={styles.trustTitle}>Why Choose Second Opinion?</Text>
          <View style={styles.trustIndicators}>
            <View style={styles.trustItem}>
              <IconSymbol name="shield.checkered" size={24} color="rgb(34, 197, 94)" />
              <Text style={styles.trustText}>Verified Medical Experts</Text>
            </View>
            <View style={styles.trustItem}>
              <IconSymbol name="lock.shield" size={24} color="rgb(34, 197, 94)" />
              <Text style={styles.trustText}>HIPAA Compliant</Text>
            </View>
            <View style={styles.trustItem}>
              <IconSymbol name="checkmark.seal" size={24} color="rgb(34, 197, 94)" />
              <Text style={styles.trustText}>Standardized Process</Text>
            </View>
          </View>
        </Animated.View>

        {/* Emergency Notice */}
        <Animated.View style={styles.emergencyNotice} entering={FadeInDown.delay(700)}>
          <IconSymbol name="exclamationmark.triangle.fill" size={24} color="rgb(239, 68, 68)" />
          <View style={styles.emergencyText}>
            <Text style={styles.emergencyTitle}>Emergency Situations</Text>
            <Text style={styles.emergencyDescription}>
              If you're experiencing a medical emergency, please call 911 or go to your nearest emergency room immediately.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'rgb(49, 58, 52)',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
    marginTop: 2,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  introContainer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  introTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'rgb(49, 58, 52)',
    textAlign: 'center',
    marginBottom: 15,
  },
  introDescription: {
    fontSize: 16,
    color: 'rgb(100, 112, 103)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  pathsContainer: {
    gap: 20,
  },
  pathCard: {
    marginBottom: 10,
  },
  pathButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(132, 204, 22, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  pathButtonSelected: {
    borderColor: 'rgb(132, 204, 22)',
    backgroundColor: 'rgba(132, 204, 22, 0.02)',
  },
  pathHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  pathIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  pathHeaderText: {
    flex: 1,
  },
  pathTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'rgb(49, 58, 52)',
    marginBottom: 4,
  },
  pathSubtitle: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
  },
  pathPricing: {
    alignItems: 'flex-end',
  },
  pathPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: 'rgb(132, 204, 22)',
  },
  pathDuration: {
    fontSize: 12,
    color: 'rgb(100, 112, 103)',
    marginTop: 2,
  },
  pathDescription: {
    fontSize: 16,
    color: 'rgb(100, 112, 103)',
    lineHeight: 22,
    marginBottom: 20,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: 'rgb(49, 58, 52)',
    flex: 1,
  },
  pathActionContainer: {
    alignItems: 'center',
  },
  pathActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    gap: 8,
  },
  pathActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  trustContainer: {
    marginTop: 40,
    padding: 20,
    backgroundColor: 'rgba(132, 204, 22, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(132, 204, 22, 0.2)',
  },
  trustTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'rgb(49, 58, 52)',
    textAlign: 'center',
    marginBottom: 20,
  },
  trustIndicators: {
    gap: 15,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trustText: {
    fontSize: 16,
    color: 'rgb(49, 58, 52)',
    fontWeight: '500',
  },
  emergencyNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 30,
    padding: 20,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    gap: 12,
  },
  emergencyText: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgb(239, 68, 68)',
    marginBottom: 5,
  },
  emergencyDescription: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
    lineHeight: 20,
  },
});

export default ConsultationFlowScreen; 