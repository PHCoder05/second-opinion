import { IconSymbol } from '@/components/ui/IconSymbol';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

interface FlowStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  backgroundColor: string;
  route?: string;
  action?: () => void;
  substeps?: FlowStep[];
}

interface FlowCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  steps: FlowStep[];
}

export default function AppFlowGuideScreen() {
  const router = useRouter();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const handleNavigation = (route?: string, action?: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (action) {
      action();
    } else if (route) {
      router.push(route as any);
    }
  };

  const toggleCategory = (categoryId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const toggleStep = (stepId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const appFlowCategories: FlowCategory[] = [
    {
      id: 'onboarding',
      title: 'Getting Started',
      description: 'New user onboarding and account setup',
      icon: 'person.badge.plus',
      color: 'rgb(132, 204, 22)',
      steps: [
        {
          id: 'welcome',
          title: 'Welcome Screen',
          description: 'Introduction to the Second Opinion app',
          icon: 'hand.wave.fill',
          color: 'rgb(132, 204, 22)',
          backgroundColor: 'rgba(132, 204, 22, 0.1)',
          route: '/welcome',
        },
        {
          id: 'onboarding-flow',
          title: 'Onboarding Flow (6 Steps)',
          description: 'Learn about app features and benefits',
          icon: 'list.number',
          color: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          route: '/onboarding',
          substeps: [
            {
              id: 'step1',
              title: 'Step 1: Smart Scheduling',
              description: 'Learn about appointment scheduling',
              icon: 'calendar',
              color: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              route: '/onboarding',
            },
            {
              id: 'step2',
              title: 'Step 2: Virtual Consultations',
              description: 'Discover telemedicine features',
              icon: 'video',
              color: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              route: '/onboarding-step2',
            },
            {
              id: 'step3',
              title: 'Step 3: AI Health Assistant',
              description: 'Meet your AI health companion',
              icon: 'brain.head.profile',
              color: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              route: '/onboarding-step3',
            },
            {
              id: 'step4',
              title: 'Step 4: Secure Medical Records',
              description: 'Manage your health data securely',
              icon: 'shield.checkmark.fill',
              color: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              route: '/onboarding-step4',
            },
            {
              id: 'step5',
              title: 'Step 5: Appointment Booking',
              description: 'Book appointments with specialists',
              icon: 'calendar.badge.plus',
              color: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              route: '/onboarding-step5',
            },
            {
              id: 'step6',
              title: 'Step 6: Health Assessment',
              description: 'Complete your health profile',
              icon: 'heart.text.square.fill',
              color: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              route: '/onboarding-step6',
            },
          ],
        },
        {
          id: 'auth',
          title: 'Authentication',
          description: 'Sign up or sign in to your account',
          icon: 'lock.shield',
          color: 'rgb(168, 85, 247)',
          backgroundColor: 'rgba(168, 85, 247, 0.1)',
          route: '/signin',
        },
        {
          id: 'health-assessment',
          title: 'Initial Health Assessment',
          description: 'Set up your health goals and preferences',
          icon: 'heart.text.square.fill',
          color: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          route: '/comprehensive-health-assessment',
        },
      ],
    },
    {
      id: 'consultation',
      title: 'Second Opinion Consultation',
      description: 'Get expert medical opinions through our platform',
      icon: 'stethoscope',
      color: 'rgb(132, 204, 22)',
      steps: [
        {
          id: 'consultation-choice',
          title: 'Choose Consultation Path',
          description: 'Select between Self-Service ($29) or Assisted Help ($79)',
          icon: 'arrow.triangle.branch',
          color: 'rgb(132, 204, 22)',
          backgroundColor: 'rgba(132, 204, 22, 0.1)',
          route: '/consultation-flow',
        },
        {
          id: 'self-service',
          title: 'Self-Service Path ($29)',
          description: 'AI-guided consultation with optional human support',
          icon: 'person.fill',
          color: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          route: '/self-service-flow',
          substeps: [
            {
              id: 'upload-docs',
              title: 'Upload Medical Documents',
              description: 'Share your medical records and test results',
              icon: 'doc.badge.plus',
              color: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
            },
            {
              id: 'chief-complaint',
              title: 'Chief Complaint',
              description: 'Describe your main health concern',
              icon: 'text.bubble',
              color: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
            },
            {
              id: 'symptom-analysis',
              title: 'AI Symptom Analysis',
              description: 'Interactive symptom checker and pain mapping',
              icon: 'magnifyingglass.circle.fill',
              color: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              route: '/symptom-checker',
            },
            {
              id: 'current-treatment',
              title: 'Current Treatment',
              description: 'Share what treatments you are currently receiving',
              icon: 'pills.fill',
              color: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
            },
            {
              id: 'questions',
              title: 'Questions for Doctor',
              description: 'Specify what you want to know from the expert',
              icon: 'questionmark.circle',
              color: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
            },
            {
              id: 'ai-results',
              title: 'AI Assessment Results',
              description: 'Get preliminary AI analysis and recommendations',
              icon: 'brain.head.profile',
              color: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              route: '/ai-assessment-results',
            },
          ],
        },
        {
          id: 'assisted-help',
          title: 'Assisted Help Path ($79)',
          description: 'Direct medical team support with personalized guidance',
          icon: 'person.3.fill',
          color: 'rgb(168, 85, 247)',
          backgroundColor: 'rgba(168, 85, 247, 0.1)',
          route: '/assisted-help-flow',
          substeps: [
            {
              id: 'sop-patient-id',
              title: 'Patient Identification',
              description: 'Verify identity and establish secure communication',
              icon: 'person.crop.circle.badge.checkmark',
              color: 'rgb(168, 85, 247)',
              backgroundColor: 'rgba(168, 85, 247, 0.1)',
            },
            {
              id: 'sop-complaint',
              title: 'Chief Complaint Assessment',
              description: 'Expert-guided discussion of your main concern',
              icon: 'text.bubble.fill',
              color: 'rgb(168, 85, 247)',
              backgroundColor: 'rgba(168, 85, 247, 0.1)',
            },
            {
              id: 'sop-symptoms',
              title: 'Comprehensive Symptom Analysis',
              description: 'Detailed symptom mapping using medical protocols',
              icon: 'list.bullet.clipboard.fill',
              color: 'rgb(168, 85, 247)',
              backgroundColor: 'rgba(168, 85, 247, 0.1)',
            },
            {
              id: 'sop-history',
              title: 'Medical History Collection',
              description: 'Structured collection of relevant medical history',
              icon: 'doc.text.fill',
              color: 'rgb(168, 85, 247)',
              backgroundColor: 'rgba(168, 85, 247, 0.1)',
            },
            {
              id: 'sop-treatment',
              title: 'Current Treatment Evaluation',
              description: 'Review and assess current treatments',
              icon: 'pills.fill',
              color: 'rgb(168, 85, 247)',
              backgroundColor: 'rgba(168, 85, 247, 0.1)',
            },
            {
              id: 'sop-investigations',
              title: 'Investigations Review',
              description: 'Analyze existing tests and recommend new ones',
              icon: 'doc.text.magnifyingglass',
              color: 'rgb(168, 85, 247)',
              backgroundColor: 'rgba(168, 85, 247, 0.1)',
            },
            {
              id: 'sop-chat',
              title: 'Live Chat Support',
              description: 'Real-time communication with medical experts',
              icon: 'bubble.left.and.bubble.right.fill',
              color: 'rgb(168, 85, 247)',
              backgroundColor: 'rgba(168, 85, 247, 0.1)',
            },
          ],
        },
      ],
    },
    {
      id: 'health-tools',
      title: 'Health Assessment Tools',
      description: 'Comprehensive health evaluation and monitoring tools',
      icon: 'heart.fill',
      color: 'rgb(239, 68, 68)',
      steps: [
        {
          id: 'symptom-checker-tool',
          title: 'Symptom Checker',
          description: 'AI-powered symptom analysis with visual pain mapping',
          icon: 'magnifyingglass.circle.fill',
          color: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          route: '/symptom-checker',
          substeps: [
            {
              id: 'pain-mapping',
              title: 'Visual Pain Mapping',
              description: 'Interactive body diagram to mark pain locations',
              icon: 'figure.walk',
              color: 'rgb(239, 68, 68)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
            },
            {
              id: 'pain-types',
              title: 'Pain Type Classification',
              description: 'Classify pain as sharp, dull, burning, throbbing, etc.',
              icon: 'list.bullet',
              color: 'rgb(239, 68, 68)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
            },
            {
              id: 'symptom-details',
              title: 'Detailed Symptom Analysis',
              description: 'Duration, severity, triggers, and associated symptoms',
              icon: 'text.alignleft',
              color: 'rgb(239, 68, 68)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
            },
          ],
        },
        {
          id: 'health-assessment-tool',
          title: 'Comprehensive Health Assessment',
          description: 'Complete health evaluation and goal setting',
          icon: 'heart.text.square.fill',
          color: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          route: '/comprehensive-health-assessment',
        },
      ],
    },
    {
      id: 'medical-protocol',
      title: 'Medical Protocol Flow',
      description: 'Evidence-based medical decision making process',
      icon: 'list.bullet.clipboard.fill',
      color: 'rgb(16, 185, 129)',
      steps: [
        {
          id: 'protocol-step1',
          title: 'Review Existing Investigations',
          description: 'Analyze current test results and medical reports',
          icon: 'doc.text.magnifyingglass',
          color: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          route: '/medical-protocol-flow',
        },
        {
          id: 'protocol-step2',
          title: 'Order New Investigations',
          description: 'Recommend additional tests if needed',
          icon: 'plus.circle.fill',
          color: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          route: '/medical-protocol-flow',
        },
        {
          id: 'protocol-step3',
          title: 'Deliver Treatment Plan',
          description: 'Provide comprehensive treatment recommendations',
          icon: 'pills.fill',
          color: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          route: '/medical-protocol-flow',
        },
      ],
    },
    {
      id: 'education',
      title: 'Medical Education',
      description: 'Learn about medical conditions and treatments',
      icon: 'book.closed.fill',
      color: 'rgb(132, 204, 22)',
      steps: [
        {
          id: 'condition-library',
          title: 'Medical Condition Library',
          description: 'Comprehensive database of medical conditions',
          icon: 'book.closed.fill',
          color: 'rgb(132, 204, 22)',
          backgroundColor: 'rgba(132, 204, 22, 0.1)',
          route: '/medical-education',
        },
        {
          id: 'diagnosis-process',
          title: 'Diagnosis Process Explanation',
          description: 'Learn how medical diagnoses are made',
          icon: 'list.bullet.clipboard.fill',
          color: 'rgb(132, 204, 22)',
          backgroundColor: 'rgba(132, 204, 22, 0.1)',
          route: '/medical-education',
        },
        {
          id: 'treatment-options',
          title: 'Treatment Options',
          description: 'Understand different treatment approaches',
          icon: 'pills.fill',
          color: 'rgb(132, 204, 22)',
          backgroundColor: 'rgba(132, 204, 22, 0.1)',
          route: '/medical-education',
        },
        {
          id: 'evidence-sources',
          title: 'Evidence-Based Sources',
          description: 'Verify information with authoritative medical sources',
          icon: 'checkmark.seal.fill',
          color: 'rgb(132, 204, 22)',
          backgroundColor: 'rgba(132, 204, 22, 0.1)',
          route: '/medical-education',
        },
      ],
    },
    {
      id: 'records',
      title: 'Medical Records Management',
      description: 'Secure storage and management of health information',
      icon: 'doc.text.fill',
      color: 'rgb(59, 130, 246)',
      steps: [
        {
          id: 'upload-records',
          title: 'Upload Medical Documents',
          description: 'Securely upload and store medical records',
          icon: 'doc.badge.plus',
          color: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          route: '/medical-records',
        },
        {
          id: 'view-records',
          title: 'View Medical Records',
          description: 'Access and organize your health documents',
          icon: 'doc.text.fill',
          color: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          route: '/medical-records',
        },
        {
          id: 'share-records',
          title: 'Share with Healthcare Providers',
          description: 'Securely share records with doctors and specialists',
          icon: 'square.and.arrow.up',
          color: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          route: '/medical-records',
        },
        {
          id: 'health-profile',
          title: 'Health Profile Management',
          description: 'Manage personal health information and preferences',
          icon: 'person.crop.circle.fill',
          color: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          route: '/profile',
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Animated.View style={styles.header} entering={FadeIn}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color="rgb(49, 58, 52)" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>App Flow Guide</Text>
          <View style={styles.placeholder} />
        </Animated.View>

        <Animated.View style={styles.intro} entering={FadeIn.delay(200)}>
          <Text style={styles.introTitle}>Complete User Journey</Text>
          <Text style={styles.introDescription}>
            Explore the complete flow of the Second Opinion app. Each section shows the step-by-step process and allows you to navigate directly to any feature.
          </Text>
        </Animated.View>

        {/* Flow Categories */}
        {appFlowCategories.map((category, categoryIndex) => (
          <Animated.View
            key={category.id}
            style={styles.categorySection}
            entering={FadeInDown.delay(categoryIndex * 100)}
          >
            {/* Category Header */}
            <TouchableOpacity
              style={styles.categoryHeader}
              onPress={() => toggleCategory(category.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
                <IconSymbol name={category.icon} size={24} color={category.color} />
              </View>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
              </View>
              <IconSymbol 
                name={expandedCategory === category.id ? "chevron.up" : "chevron.down"} 
                size={20} 
                color="rgb(100, 112, 103)" 
              />
            </TouchableOpacity>

            {/* Category Steps */}
            {expandedCategory === category.id && (
              <Animated.View style={styles.categorySteps} entering={FadeInDown.delay(100)}>
                {category.steps.map((step, stepIndex) => (
                  <View key={step.id} style={styles.stepContainer}>
                    <TouchableOpacity
                      style={[styles.stepItem, { backgroundColor: step.backgroundColor }]}
                      onPress={() => step.substeps ? toggleStep(step.id) : handleNavigation(step.route, step.action)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.stepNumber}>
                        <Text style={[styles.stepNumberText, { color: step.color }]}>
                          {stepIndex + 1}
                        </Text>
                      </View>
                      <View style={styles.stepIcon}>
                        <IconSymbol name={step.icon} size={20} color={step.color} />
                      </View>
                      <View style={styles.stepInfo}>
                        <Text style={[styles.stepTitle, { color: step.color }]}>
                          {step.title}
                        </Text>
                        <Text style={styles.stepDescription}>{step.description}</Text>
                      </View>
                      {step.substeps && (
                        <IconSymbol 
                          name={expandedStep === step.id ? "chevron.up" : "chevron.down"} 
                          size={16} 
                          color="rgb(100, 112, 103)" 
                        />
                      )}
                      {step.route && !step.substeps && (
                        <IconSymbol name="chevron.right" size={16} color="rgb(100, 112, 103)" />
                      )}
                    </TouchableOpacity>

                    {/* Substeps */}
                    {step.substeps && expandedStep === step.id && (
                      <Animated.View style={styles.substeps} entering={FadeInDown.delay(100)}>
                        {step.substeps.map((substep, substepIndex) => (
                          <TouchableOpacity
                            key={substep.id}
                            style={[styles.substepItem, { backgroundColor: substep.backgroundColor }]}
                            onPress={() => handleNavigation(substep.route, substep.action)}
                            activeOpacity={0.8}
                          >
                            <View style={styles.substepNumber}>
                              <Text style={[styles.substepNumberText, { color: substep.color }]}>
                                {stepIndex + 1}.{substepIndex + 1}
                              </Text>
                            </View>
                            <View style={styles.substepIcon}>
                              <IconSymbol name={substep.icon} size={16} color={substep.color} />
                            </View>
                            <View style={styles.substepInfo}>
                              <Text style={[styles.substepTitle, { color: substep.color }]}>
                                {substep.title}
                              </Text>
                              <Text style={styles.substepDescription}>{substep.description}</Text>
                            </View>
                            {substep.route && (
                              <IconSymbol name="chevron.right" size={14} color="rgb(100, 112, 103)" />
                            )}
                          </TouchableOpacity>
                        ))}
                      </Animated.View>
                    )}
                  </View>
                ))}
              </Animated.View>
            )}
          </Animated.View>
        ))}

        {/* Footer */}
        <Animated.View style={styles.footer} entering={FadeInDown.delay(800)}>
          <Text style={styles.footerText}>
            This guide shows the complete user journey through the Second Opinion app. Each step is designed to provide maximum value while maintaining medical accuracy and user trust.
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(245, 246, 245)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(100, 112, 103, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgb(49, 58, 52)',
  },
  placeholder: {
    width: 40,
  },
  intro: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  introTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'rgb(49, 58, 52)',
    marginBottom: 8,
  },
  introDescription: {
    fontSize: 16,
    color: 'rgb(100, 112, 103)',
    lineHeight: 24,
  },
  categorySection: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(100, 112, 103, 0.1)',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgb(49, 58, 52)',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
    lineHeight: 20,
  },
  categorySteps: {
    marginTop: 16,
    gap: 12,
  },
  stepContainer: {
    marginLeft: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(100, 112, 103, 0.1)',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
    lineHeight: 20,
  },
  substeps: {
    marginTop: 12,
    marginLeft: 16,
    gap: 8,
  },
  substepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(100, 112, 103, 0.1)',
  },
  substepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  substepNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  substepIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  substepInfo: {
    flex: 1,
  },
  substepTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  substepDescription: {
    fontSize: 12,
    color: 'rgb(100, 112, 103)',
    lineHeight: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
    textAlign: 'center',
    lineHeight: 20,
  },
}); 