import { IconSymbol } from '@/components/ui/IconSymbol';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

interface Investigation {
  id: string;
  name: string;
  type: 'lab' | 'imaging' | 'procedure' | 'specialist';
  date: string;
  status: 'completed' | 'pending' | 'scheduled';
  results: string;
  interpretation: string;
  normalRange?: string;
  significance: 'normal' | 'abnormal' | 'critical';
  followUpRequired: boolean;
}

interface NewInvestigation {
  id: string;
  name: string;
  type: 'lab' | 'imaging' | 'procedure' | 'specialist';
  reason: string;
  urgency: 'routine' | 'urgent' | 'stat';
  estimatedCost: string;
  estimatedTime: string;
  preparation: string[];
  expectedResults: string;
}

interface TreatmentPlan {
  id: string;
  diagnosis: string;
  confidence: number;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    purpose: string;
    sideEffects: string[];
  }[];
  lifestyle: string[];
  followUp: {
    timeframe: string;
    purpose: string;
    tests: string[];
  };
  redFlags: string[];
  prognosis: string;
  alternatives: string[];
}

const MedicalProtocolFlowScreen = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedInvestigation, setSelectedInvestigation] = useState<Investigation | null>(null);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [treatmentModalVisible, setTreatmentModalVisible] = useState(false);

  const protocolSteps = [
    { id: 'review', title: 'Review Existing Investigations', icon: 'doc.text.magnifyingglass' },
    { id: 'order', title: 'Order New Investigations', icon: 'plus.circle' },
    { id: 'treatment', title: 'Deliver Treatment Plan', icon: 'pills' }
  ];

  // Sample existing investigations
  const existingInvestigations: Investigation[] = [
    {
      id: '1',
      name: 'Complete Blood Count (CBC)',
      type: 'lab',
      date: '2024-01-15',
      status: 'completed',
      results: 'WBC: 8.2 K/μL, RBC: 4.5 M/μL, Hgb: 14.2 g/dL, Hct: 42.1%, Plt: 280 K/μL',
      interpretation: 'All values within normal limits. No evidence of anemia or infection.',
      normalRange: 'WBC: 4.5-11.0 K/μL, RBC: 4.2-5.4 M/μL, Hgb: 12.0-16.0 g/dL',
      significance: 'normal',
      followUpRequired: false
    },
    {
      id: '2',
      name: 'Chest X-Ray',
      type: 'imaging',
      date: '2024-01-10',
      status: 'completed',
      results: 'Clear lung fields bilaterally. Normal cardiac silhouette. No acute findings.',
      interpretation: 'Normal chest X-ray. No evidence of pneumonia, pneumothorax, or other pathology.',
      significance: 'normal',
      followUpRequired: false
    },
    {
      id: '3',
      name: 'Lipid Panel',
      type: 'lab',
      date: '2024-01-12',
      status: 'completed',
      results: 'Total Cholesterol: 245 mg/dL, LDL: 160 mg/dL, HDL: 38 mg/dL, Triglycerides: 235 mg/dL',
      interpretation: 'Elevated cholesterol and triglycerides. Low HDL. Consistent with dyslipidemia.',
      normalRange: 'Total: <200 mg/dL, LDL: <100 mg/dL, HDL: >40 mg/dL, TG: <150 mg/dL',
      significance: 'abnormal',
      followUpRequired: true
    }
  ];

  // Sample new investigations to order
  const newInvestigations: NewInvestigation[] = [
    {
      id: '1',
      name: 'HbA1c (Glycated Hemoglobin)',
      type: 'lab',
      reason: 'Screen for diabetes given dyslipidemia and cardiovascular risk factors',
      urgency: 'routine',
      estimatedCost: '$45-65',
      estimatedTime: '1-2 days',
      preparation: ['No fasting required', 'Continue regular medications'],
      expectedResults: 'Assess average blood sugar over past 2-3 months'
    },
    {
      id: '2',
      name: 'Thyroid Function Tests (TSH, Free T4)',
      type: 'lab',
      reason: 'Rule out thyroid dysfunction as cause of dyslipidemia',
      urgency: 'routine',
      estimatedCost: '$85-120',
      estimatedTime: '1-2 days',
      preparation: ['No special preparation needed', 'Take medications as usual'],
      expectedResults: 'Evaluate thyroid function and metabolism'
    },
    {
      id: '3',
      name: 'Echocardiogram',
      type: 'imaging',
      reason: 'Assess cardiac function and structure given cardiovascular risk',
      urgency: 'routine',
      estimatedCost: '$300-500',
      estimatedTime: '30-45 minutes',
      preparation: ['No fasting required', 'Wear comfortable clothing', 'Avoid caffeine 2 hours prior'],
      expectedResults: 'Evaluate heart structure, function, and valve competency'
    }
  ];

  // Sample treatment plan
  const treatmentPlan: TreatmentPlan = {
    id: '1',
    diagnosis: 'Dyslipidemia (Mixed Hyperlipidemia)',
    confidence: 95,
    medications: [
      {
        name: 'Atorvastatin',
        dosage: '20 mg',
        frequency: 'Once daily',
        duration: 'Long-term',
        purpose: 'Lower cholesterol and reduce cardiovascular risk',
        sideEffects: ['Muscle pain', 'Liver enzyme elevation', 'Digestive issues']
      },
      {
        name: 'Omega-3 Fatty Acids',
        dosage: '1000 mg',
        frequency: 'Twice daily',
        duration: '3-6 months initially',
        purpose: 'Lower triglycerides and reduce inflammation',
        sideEffects: ['Fishy aftertaste', 'Digestive upset', 'Blood thinning']
      }
    ],
    lifestyle: [
      'Mediterranean diet with emphasis on fruits, vegetables, whole grains',
      'Limit saturated fats to <7% of total calories',
      'Increase soluble fiber intake (oats, beans, apples)',
      'Regular aerobic exercise 150 minutes/week',
      'Weight loss of 5-10% if overweight',
      'Limit alcohol consumption',
      'Smoking cessation if applicable'
    ],
    followUp: {
      timeframe: '6-8 weeks',
      purpose: 'Monitor response to treatment and check for side effects',
      tests: ['Lipid panel', 'Liver function tests', 'CK (if muscle symptoms)']
    },
    redFlags: [
      'Severe muscle pain or weakness',
      'Dark urine or yellowing of skin/eyes',
      'Persistent nausea or vomiting',
      'Chest pain or shortness of breath',
      'Unusual fatigue or weakness'
    ],
    prognosis: 'Excellent with treatment adherence. 20-30% reduction in cardiovascular events expected.',
    alternatives: [
      'Bile acid sequestrants (if statin intolerant)',
      'PCSK9 inhibitors (if high-risk and statin insufficient)',
      'Lifestyle modifications alone (if mild elevation)'
    ]
  };

  const handleInvestigationReview = (investigation: Investigation) => {
    setSelectedInvestigation(investigation);
    setReviewModalVisible(true);
  };

  const handleOrderInvestigation = (investigation: NewInvestigation) => {
    Alert.alert(
      'Order Investigation',
      `Order ${investigation.name}?\n\nEstimated cost: ${investigation.estimatedCost}\nResults in: ${investigation.estimatedTime}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Order', onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          Alert.alert('Investigation Ordered', 'You will receive scheduling instructions shortly.');
        }}
      ]
    );
  };

  const handleTreatmentExplanation = () => {
    setTreatmentModalVisible(true);
  };

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case 'normal': return 'rgb(34, 197, 94)';
      case 'abnormal': return 'rgb(251, 204, 21)';
      case 'critical': return 'rgb(239, 68, 68)';
      default: return 'rgb(100, 112, 103)';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'routine': return 'rgb(34, 197, 94)';
      case 'urgent': return 'rgb(251, 204, 21)';
      case 'stat': return 'rgb(239, 68, 68)';
      default: return 'rgb(100, 112, 103)';
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Review Existing Investigations</Text>
            <Text style={styles.stepDescription}>
              Let's review your recent test results and understand what they tell us about your health.
            </Text>
            
            <View style={styles.protocolNote}>
              <IconSymbol name="info.circle" size={20} color="rgb(59, 130, 246)" />
              <Text style={styles.protocolNoteText}>
                Following standard medical protocol: We always review existing data before ordering new tests.
              </Text>
            </View>

            <View style={styles.investigationsContainer}>
              {existingInvestigations.map((investigation, index) => (
                <Animated.View
                  key={investigation.id}
                  entering={FadeInDown.delay(100 + index * 50)}
                  style={styles.investigationCard}
                >
                  <View style={styles.investigationHeader}>
                    <View style={styles.investigationInfo}>
                      <Text style={styles.investigationName}>{investigation.name}</Text>
                      <Text style={styles.investigationDate}>{investigation.date}</Text>
                    </View>
                    <View style={[
                      styles.significanceBadge,
                      { backgroundColor: getSignificanceColor(investigation.significance) }
                    ]}>
                      <Text style={styles.significanceText}>
                        {investigation.significance.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.investigationResults} numberOfLines={2}>
                    {investigation.results}
                  </Text>
                  
                  <TouchableOpacity
                    style={styles.reviewButton}
                    onPress={() => handleInvestigationReview(investigation)}
                  >
                    <Text style={styles.reviewButtonText}>Review & Explain</Text>
                    <IconSymbol name="arrow.right" size={16} color="rgb(132, 204, 22)" />
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </View>
        );
      
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Order New Investigations</Text>
            <Text style={styles.stepDescription}>
              Based on your existing results, these additional tests are recommended to complete your assessment.
            </Text>
            
            <View style={styles.protocolNote}>
              <IconSymbol name="checkmark.shield" size={20} color="rgb(132, 204, 22)" />
              <Text style={styles.protocolNoteText}>
                Each test is ordered based on evidence-based guidelines and your specific clinical picture.
              </Text>
            </View>

            <View style={styles.investigationsContainer}>
              {newInvestigations.map((investigation, index) => (
                <Animated.View
                  key={investigation.id}
                  entering={FadeInDown.delay(100 + index * 50)}
                  style={styles.newInvestigationCard}
                >
                  <View style={styles.investigationHeader}>
                    <View style={styles.investigationInfo}>
                      <Text style={styles.investigationName}>{investigation.name}</Text>
                      <Text style={styles.investigationCost}>{investigation.estimatedCost}</Text>
                    </View>
                    <View style={[
                      styles.urgencyBadge,
                      { backgroundColor: getUrgencyColor(investigation.urgency) }
                    ]}>
                      <Text style={styles.urgencyText}>
                        {investigation.urgency.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.investigationReason}>{investigation.reason}</Text>
                  
                  <View style={styles.investigationDetails}>
                    <View style={styles.detailItem}>
                      <IconSymbol name="clock" size={16} color="rgb(100, 112, 103)" />
                      <Text style={styles.detailText}>Results in {investigation.estimatedTime}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <IconSymbol name="list.bullet" size={16} color="rgb(100, 112, 103)" />
                      <Text style={styles.detailText}>{investigation.preparation.length} preparation steps</Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity
                    style={styles.orderButton}
                    onPress={() => handleOrderInvestigation(investigation)}
                  >
                    <Text style={styles.orderButtonText}>Order Investigation</Text>
                    <IconSymbol name="plus.circle" size={16} color="white" />
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </View>
        );
      
      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Treatment Plan</Text>
            <Text style={styles.stepDescription}>
              Based on your investigations, here's your personalized treatment plan with clear explanations.
            </Text>
            
            <View style={styles.protocolNote}>
              <IconSymbol name="brain.head.profile" size={20} color="rgb(168, 85, 247)" />
              <Text style={styles.protocolNoteText}>
                Treatment follows evidence-based guidelines and is tailored to your specific condition and needs.
              </Text>
            </View>

            <Animated.View entering={FadeIn} style={styles.treatmentCard}>
              <View style={styles.treatmentHeader}>
                <Text style={styles.diagnosisTitle}>{treatmentPlan.diagnosis}</Text>
                <View style={styles.confidenceContainer}>
                  <Text style={styles.confidenceText}>{treatmentPlan.confidence}% confidence</Text>
                </View>
              </View>
              
              <View style={styles.treatmentSection}>
                <Text style={styles.treatmentSectionTitle}>Medications</Text>
                {treatmentPlan.medications.map((med, index) => (
                  <View key={index} style={styles.medicationItem}>
                    <Text style={styles.medicationName}>{med.name} {med.dosage}</Text>
                    <Text style={styles.medicationDetails}>{med.frequency} - {med.purpose}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.treatmentSection}>
                <Text style={styles.treatmentSectionTitle}>Lifestyle Changes</Text>
                {treatmentPlan.lifestyle.slice(0, 3).map((lifestyle, index) => (
                  <View key={index} style={styles.lifestyleItem}>
                    <IconSymbol name="checkmark.circle" size={16} color="rgb(132, 204, 22)" />
                    <Text style={styles.lifestyleText}>{lifestyle}</Text>
                  </View>
                ))}
                {treatmentPlan.lifestyle.length > 3 && (
                  <Text style={styles.moreText}>+{treatmentPlan.lifestyle.length - 3} more recommendations</Text>
                )}
              </View>
              
              <TouchableOpacity
                style={styles.explainButton}
                onPress={handleTreatmentExplanation}
              >
                <Text style={styles.explainButtonText}>Get Detailed Explanation</Text>
                <IconSymbol name="arrow.right" size={16} color="white" />
              </TouchableOpacity>
            </Animated.View>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color="rgb(49, 58, 52)" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Medical Protocol</Text>
          <Text style={styles.headerSubtitle}>Standardized Care Process</Text>
        </View>
        
        <TouchableOpacity style={styles.helpButton} onPress={() => {}}>
          <IconSymbol name="questionmark.circle" size={24} color="rgb(132, 204, 22)" />
        </TouchableOpacity>
      </View>

      {/* Progress Steps */}
      <View style={styles.progressContainer}>
        <View style={styles.stepsContainer}>
          {protocolSteps.map((step, index) => (
            <View key={step.id} style={styles.stepItem}>
              <View style={[
                styles.stepIndicator,
                index < currentStep ? styles.stepCompleted :
                index === currentStep ? styles.stepCurrent : styles.stepPending
              ]}>
                {index < currentStep ? (
                  <IconSymbol name="checkmark" size={16} color="white" />
                ) : (
                  <IconSymbol name={step.icon} size={16} color={
                    index === currentStep ? 'white' : 'rgb(100, 112, 103)'
                  } />
                )}
              </View>
              <Text style={[
                styles.stepLabel,
                index === currentStep && styles.stepLabelCurrent
              ]}>
                {step.title}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderStepContent()}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navButton, styles.backNavButton]}
          onPress={() => {
            if (currentStep > 0) {
              setCurrentStep(currentStep - 1);
            } else {
              router.back();
            }
          }}
        >
          <IconSymbol name="chevron.left" size={20} color="rgb(132, 204, 22)" />
          <Text style={styles.backNavText}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.navButton, styles.nextNavButton]}
          onPress={() => {
            if (currentStep < protocolSteps.length - 1) {
              setCurrentStep(currentStep + 1);
            } else {
              router.push('/(tabs)');
            }
          }}
        >
          <Text style={styles.nextNavText}>
            {currentStep === protocolSteps.length - 1 ? 'Complete' : 'Next'}
          </Text>
          <IconSymbol name="chevron.right" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Investigation Review Modal */}
      <Modal
        visible={reviewModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setReviewModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Investigation Review</Text>
            <TouchableOpacity onPress={() => setReviewModalVisible(false)}>
              <IconSymbol name="xmark" size={24} color="rgb(100, 112, 103)" />
            </TouchableOpacity>
          </View>
          
          {selectedInvestigation && (
            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalInvestigationName}>{selectedInvestigation.name}</Text>
              
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Results:</Text>
                <Text style={styles.modalSectionText}>{selectedInvestigation.results}</Text>
              </View>
              
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Medical Interpretation:</Text>
                <Text style={styles.modalSectionText}>{selectedInvestigation.interpretation}</Text>
              </View>
              
              {selectedInvestigation.normalRange && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Normal Range:</Text>
                  <Text style={styles.modalSectionText}>{selectedInvestigation.normalRange}</Text>
                </View>
              )}
              
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Clinical Significance:</Text>
                <View style={styles.significanceContainer}>
                  <View style={[
                    styles.significanceIndicator,
                    { backgroundColor: getSignificanceColor(selectedInvestigation.significance) }
                  ]} />
                  <Text style={styles.significanceLabel}>
                    {selectedInvestigation.significance.charAt(0).toUpperCase() + selectedInvestigation.significance.slice(1)}
                  </Text>
                </View>
              </View>
              
              {selectedInvestigation.followUpRequired && (
                <View style={styles.followUpNote}>
                  <IconSymbol name="exclamationmark.triangle" size={20} color="rgb(251, 204, 21)" />
                  <Text style={styles.followUpText}>Follow-up required based on these results</Text>
                </View>
              )}
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>

      {/* Treatment Explanation Modal */}
      <Modal
        visible={treatmentModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setTreatmentModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Treatment Explanation</Text>
            <TouchableOpacity onPress={() => setTreatmentModalVisible(false)}>
              <IconSymbol name="xmark" size={24} color="rgb(100, 112, 103)" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalDiagnosisTitle}>{treatmentPlan.diagnosis}</Text>
            
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Why This Treatment?</Text>
              <Text style={styles.modalSectionText}>
                This treatment plan is based on evidence-based guidelines for managing {treatmentPlan.diagnosis.toLowerCase()}. 
                The medications and lifestyle changes have been proven effective in clinical trials.
              </Text>
            </View>
            
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Expected Outcomes:</Text>
              <Text style={styles.modalSectionText}>{treatmentPlan.prognosis}</Text>
            </View>
            
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Warning Signs (Red Flags):</Text>
              {treatmentPlan.redFlags.map((flag, index) => (
                <View key={index} style={styles.redFlagItem}>
                  <IconSymbol name="exclamationmark.triangle.fill" size={16} color="rgb(239, 68, 68)" />
                  <Text style={styles.redFlagText}>{flag}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Follow-up Plan:</Text>
              <Text style={styles.modalSectionText}>
                Return in {treatmentPlan.followUp.timeframe} for {treatmentPlan.followUp.purpose}
              </Text>
              <Text style={styles.modalSubText}>
                Tests needed: {treatmentPlan.followUp.tests.join(', ')}
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
    fontSize: 18,
    fontWeight: '600',
    color: 'rgb(49, 58, 52)',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
    marginTop: 2,
  },
  helpButton: {
    padding: 8,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'rgba(132, 204, 22, 0.02)',
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
  },
  stepIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCompleted: {
    backgroundColor: 'rgb(34, 197, 94)',
  },
  stepCurrent: {
    backgroundColor: 'rgb(132, 204, 22)',
  },
  stepPending: {
    backgroundColor: 'rgba(132, 204, 22, 0.2)',
  },
  stepLabel: {
    fontSize: 12,
    color: 'rgb(100, 112, 103)',
    textAlign: 'center',
  },
  stepLabelCurrent: {
    color: 'rgb(49, 58, 52)',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'rgb(49, 58, 52)',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: 'rgb(100, 112, 103)',
    lineHeight: 24,
    marginBottom: 20,
  },
  protocolNote: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(132, 204, 22, 0.1)',
    borderRadius: 12,
    marginBottom: 25,
    gap: 10,
  },
  protocolNoteText: {
    fontSize: 14,
    color: 'rgb(49, 58, 52)',
    flex: 1,
  },
  investigationsContainer: {
    gap: 15,
  },
  investigationCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(132, 204, 22, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  newInvestigationCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  investigationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  investigationInfo: {
    flex: 1,
  },
  investigationName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgb(49, 58, 52)',
  },
  investigationDate: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
    marginTop: 2,
  },
  investigationCost: {
    fontSize: 14,
    color: 'rgb(59, 130, 246)',
    fontWeight: '600',
    marginTop: 2,
  },
  significanceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  significanceText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  urgencyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  investigationResults: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
    marginBottom: 15,
  },
  investigationReason: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
    marginBottom: 15,
  },
  investigationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: 'rgb(100, 112, 103)',
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: 'rgba(132, 204, 22, 0.1)',
    borderRadius: 12,
    gap: 8,
  },
  reviewButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgb(132, 204, 22)',
  },
  orderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: 'rgb(59, 130, 246)',
    borderRadius: 12,
    gap: 8,
  },
  orderButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  treatmentCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(132, 204, 22, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  treatmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  diagnosisTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'rgb(49, 58, 52)',
  },
  confidenceContainer: {
    backgroundColor: 'rgba(132, 204, 22, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgb(132, 204, 22)',
  },
  treatmentSection: {
    marginBottom: 20,
  },
  treatmentSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgb(49, 58, 52)',
    marginBottom: 10,
  },
  medicationItem: {
    marginBottom: 8,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgb(49, 58, 52)',
  },
  medicationDetails: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
  },
  lifestyleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  lifestyleText: {
    fontSize: 14,
    color: 'rgb(49, 58, 52)',
    flex: 1,
  },
  moreText: {
    fontSize: 14,
    color: 'rgb(132, 204, 22)',
    fontWeight: '500',
    marginTop: 5,
  },
  explainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: 'rgb(132, 204, 22)',
    borderRadius: 12,
    gap: 8,
  },
  explainButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 100,
    justifyContent: 'center',
  },
  backNavButton: {
    backgroundColor: 'rgba(132, 204, 22, 0.1)',
    borderWidth: 1,
    borderColor: 'rgb(132, 204, 22)',
  },
  nextNavButton: {
    backgroundColor: 'rgb(132, 204, 22)',
  },
  backNavText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgb(132, 204, 22)',
    marginLeft: 4,
  },
  nextNavText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginRight: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgb(49, 58, 52)',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalInvestigationName: {
    fontSize: 22,
    fontWeight: '700',
    color: 'rgb(49, 58, 52)',
    marginVertical: 20,
  },
  modalDiagnosisTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: 'rgb(49, 58, 52)',
    marginVertical: 20,
  },
  modalSection: {
    marginBottom: 25,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgb(49, 58, 52)',
    marginBottom: 8,
  },
  modalSectionText: {
    fontSize: 16,
    color: 'rgb(100, 112, 103)',
    lineHeight: 24,
  },
  modalSubText: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
    marginTop: 5,
  },
  significanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  significanceIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  significanceLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgb(49, 58, 52)',
  },
  followUpNote: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(251, 204, 21, 0.1)',
    borderRadius: 12,
    gap: 10,
  },
  followUpText: {
    fontSize: 14,
    color: 'rgb(49, 58, 52)',
    flex: 1,
  },
  redFlagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  redFlagText: {
    fontSize: 14,
    color: 'rgb(49, 58, 52)',
    flex: 1,
  },
});

export default MedicalProtocolFlowScreen; 