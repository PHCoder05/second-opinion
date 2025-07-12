import React, { useState, useEffect } from 'react';
import {
  View,
    Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
    TouchableOpacity,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol, Card, Button } from '@/components/ui';
import { MedicalColors } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

// Medical Protocol Steps following standard textbook approach
const PROTOCOL_STEPS = [
  {
    id: 'history',
    title: 'Medical History Review',
    description: 'Systematic review of patient history and presenting symptoms',
      status: 'completed',
    duration: '5-10 minutes',
    icon: 'doc.text',
    details: [
      'Chief complaint analysis',
      'History of present illness (HPI)',
      'Past medical history (PMH)',
      'Family history',
      'Social history',
      'Review of systems (ROS)'
    ],
    textbookRef: 'Harrison\'s Principles of Internal Medicine, Ch. 1-2'
  },
  {
    id: 'examination',
    title: 'Physical Examination',
    description: 'Comprehensive physical assessment following standard protocols',
    status: 'in_progress',
    duration: '10-15 minutes',
    icon: 'stethoscope',
    details: [
      'Vital signs assessment',
      'General appearance',
      'Systematic examination by systems',
      'Focused examination based on symptoms',
      'Neurological assessment if indicated'
    ],
    textbookRef: 'Bates\' Guide to Physical Examination, Ch. 3-4'
  },
  {
    id: 'differential',
    title: 'Differential Diagnosis',
    description: 'Systematic approach to developing differential diagnosis',
    status: 'pending',
    duration: '10-15 minutes',
    icon: 'brain.head.profile',
    details: [
      'Pattern recognition',
      'Epidemiological considerations',
      'Pathophysiological reasoning',
      'Risk stratification',
      'Probability assessment'
    ],
    textbookRef: 'Clinical Problem Solving, NEJM Approach'
  },
  {
    id: 'investigations',
    title: 'Diagnostic Investigations',
    description: 'Evidence-based selection of diagnostic tests',
    status: 'pending',
    duration: 'Review + ordering',
    icon: 'testtube.2',
    details: [
      'Laboratory tests selection',
      'Imaging studies if indicated',
      'Specialized tests based on differential',
      'Cost-benefit analysis',
      'Patient safety considerations'
    ],
    textbookRef: 'Textbook of Diagnostic Medicine, Ch. 5-6'
  },
  {
    id: 'analysis',
    title: 'Results Analysis',
    description: 'Systematic interpretation of diagnostic findings',
    status: 'pending',
    duration: '10-20 minutes',
    icon: 'chart.line.uptrend.xyaxis',
    details: [
      'Laboratory values interpretation',
      'Imaging findings correlation',
      'Clinical correlation',
      'Diagnostic accuracy assessment',
      'Further testing needs'
    ],
    textbookRef: 'Clinical Laboratory Medicine, Ch. 7-8'
  },
  {
    id: 'diagnosis',
    title: 'Final Diagnosis',
    description: 'Evidence-based diagnostic conclusion',
    status: 'pending',
    duration: '5-10 minutes',
    icon: 'checkmark.seal',
    details: [
      'Primary diagnosis establishment',
      'Secondary diagnoses if applicable',
      'Confidence level assessment',
      'Diagnostic criteria verification',
      'ICD-10 coding'
    ],
    textbookRef: 'Diagnostic and Statistical Manual'
  },
  {
    id: 'treatment',
    title: 'Treatment Plan',
    description: 'Evidence-based treatment recommendations',
    status: 'pending',
    duration: '15-20 minutes',
    icon: 'pills',
    details: [
      'First-line treatment selection',
      'Alternative options consideration',
      'Contraindications review',
      'Drug interactions check',
      'Monitoring parameters'
    ],
    textbookRef: 'Clinical Pharmacology & Therapeutics'
  },
  {
    id: 'explanation',
    title: 'Patient Education',
    description: 'Clear explanation of diagnosis and treatment',
    status: 'pending',
    duration: '10-15 minutes',
    icon: 'person.2.fill',
    details: [
      'Diagnosis explanation in lay terms',
      'Treatment rationale',
      'Expected outcomes',
      'Side effects discussion',
      'Follow-up instructions'
    ],
    textbookRef: 'Patient Communication Guidelines'
  }
];

// Sample case for demonstration
const SAMPLE_CASE = {
  id: 'case_001',
  patientId: 'PT-12345',
  chiefComplaint: 'Chest pain and shortness of breath',
  currentStep: 'examination',
  assignedDoctor: 'Dr. Sarah Johnson, MD',
  specialty: 'Internal Medicine',
  startTime: '2024-01-15T09:00:00Z',
  estimatedCompletion: '2024-01-15T11:00:00Z',
  priority: 'moderate',
  protocolUsed: 'Chest Pain Evaluation Protocol',
  evidenceLevel: 'Level A (Strong Evidence)',
  findings: {
    history: {
      hpi: 'Sudden onset chest pain, radiating to left arm, associated with shortness of breath',
      pmh: 'Hypertension, diabetes mellitus',
      familyHistory: 'Father had MI at age 55',
      socialHistory: 'Non-smoker, occasional alcohol use'
    },
    examination: {
      vitals: 'BP: 150/90, HR: 95, RR: 22, O2 Sat: 95%',
      cardiovascular: 'Regular rate and rhythm, no murmurs',
      respiratory: 'Clear to auscultation bilaterally',
      general: 'Anxious appearing, mild diaphoresis'
    }
  }
};

const { width: screenWidth } = Dimensions.get('window');

export default function MedicalProtocolFlow() {
  const router = useRouter();
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [showProtocolModal, setShowProtocolModal] = useState(false);
  const [currentCase, setCurrentCase] = useState(SAMPLE_CASE);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return MedicalColors.success[600];
      case 'in_progress':
        return MedicalColors.warning[600];
      case 'pending':
        return MedicalColors.neutral[400];
      default:
        return MedicalColors.neutral[400];
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'checkmark.circle.fill';
      case 'in_progress':
        return 'clock.fill';
      case 'pending':
        return 'circle';
      default:
        return 'circle';
    }
  };

  const handleStepPress = (step: any) => {
    setSelectedStep(step.id);
    setShowProtocolModal(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleProceedToNextStep = () => {
    const currentStepIndex = PROTOCOL_STEPS.findIndex(step => step.id === currentCase.currentStep);
    if (currentStepIndex < PROTOCOL_STEPS.length - 1) {
      const nextStep = PROTOCOL_STEPS[currentStepIndex + 1];
      setCurrentCase(prev => ({
        ...prev,
        currentStep: nextStep.id
      }));
      // Update the current step status to completed and next to in_progress
      PROTOCOL_STEPS[currentStepIndex].status = 'completed';
      PROTOCOL_STEPS[currentStepIndex + 1].status = 'in_progress';
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const renderCaseOverview = () => (
    <Card variant="default" padding="large" style={styles.caseCard}>
      <View style={styles.caseHeader}>
        <View style={styles.caseInfo}>
          <Text style={styles.caseTitle}>Current Case</Text>
          <Text style={styles.caseSubtitle}>Patient ID: {currentCase.patientId}</Text>
        </View>
        <View style={styles.priorityBadge}>
          <Text style={styles.priorityText}>{currentCase.priority.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.caseDetails}>
        <View style={styles.caseDetailItem}>
          <IconSymbol name="heart.text.square" size={20} color={MedicalColors.primary[600]} />
          <Text style={styles.caseDetailText}>{currentCase.chiefComplaint}</Text>
            </View>

        <View style={styles.caseDetailItem}>
          <IconSymbol name="person.fill" size={20} color={MedicalColors.secondary[600]} />
          <Text style={styles.caseDetailText}>{currentCase.assignedDoctor}</Text>
                    </View>
        
        <View style={styles.caseDetailItem}>
          <IconSymbol name="doc.text" size={20} color={MedicalColors.accent[600]} />
          <Text style={styles.caseDetailText}>{currentCase.protocolUsed}</Text>
                    </View>
                  </View>
                  
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Protocol Progress</Text>
          <Text style={styles.progressSubtitle}>
            {PROTOCOL_STEPS.filter(step => step.status === 'completed').length} of {PROTOCOL_STEPS.length} steps completed
                  </Text>
        </View>
        
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(PROTOCOL_STEPS.filter(step => step.status === 'completed').length / PROTOCOL_STEPS.length) * 100}%` }
            ]} 
          />
            </View>
          </View>
    </Card>
  );

  const renderProtocolSteps = () => (
    <Card variant="default" padding="large" style={styles.protocolCard}>
      <View style={styles.protocolHeader}>
        <IconSymbol name="list.bullet.clipboard" size={32} color={MedicalColors.primary[600]} />
        <Text style={styles.protocolTitle}>Medical Protocol Steps</Text>
            </View>

      <View style={styles.stepsContainer}>
        {PROTOCOL_STEPS.map((step, index) => (
                <Animated.View
            key={step.id} 
            entering={FadeInDown.delay(index * 100)}
            style={styles.stepItem}
          >
            <TouchableOpacity
              style={styles.stepButton}
              onPress={() => handleStepPress(step)}
            >
              <View style={styles.stepLeft}>
                <View style={styles.stepIndicator}>
                  <View style={[styles.stepNumber, { backgroundColor: getStatusColor(step.status) }]}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                  {index < PROTOCOL_STEPS.length - 1 && (
                    <View style={styles.stepConnector} />
                  )}
                </View>
                
                <View style={styles.stepContent}>
                  <View style={styles.stepHeader}>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    <View style={styles.stepMeta}>
                      <IconSymbol 
                        name={getStatusIcon(step.status)} 
                        size={16} 
                        color={getStatusColor(step.status)} 
                      />
                      <Text style={[styles.stepStatus, { color: getStatusColor(step.status) }]}>
                        {step.status.replace('_', ' ').toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.stepDescription}>{step.description}</Text>
                  
                  <View style={styles.stepFooter}>
                    <Text style={styles.stepDuration}>{step.duration}</Text>
                    <IconSymbol name="chevron.right" size={16} color={MedicalColors.neutral[400]} />
                    </View>
                    </View>
                  </View>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
    </Card>
  );

  const renderEvidenceSection = () => (
    <Card variant="default" padding="large" style={styles.evidenceCard}>
      <View style={styles.evidenceHeader}>
        <IconSymbol name="book.fill" size={32} color={MedicalColors.secondary[600]} />
        <Text style={styles.evidenceTitle}>Evidence-Based Medicine</Text>
            </View>

      <View style={styles.evidenceContent}>
        <View style={styles.evidenceItem}>
          <Text style={styles.evidenceLabel}>Protocol Classification:</Text>
          <Text style={styles.evidenceValue}>{currentCase.evidenceLevel}</Text>
              </View>
              
        <View style={styles.evidenceItem}>
          <Text style={styles.evidenceLabel}>Based on:</Text>
          <Text style={styles.evidenceValue}>Randomized controlled trials and meta-analyses</Text>
              </View>
              
        <View style={styles.evidenceItem}>
          <Text style={styles.evidenceLabel}>Last Updated:</Text>
          <Text style={styles.evidenceValue}>December 2023</Text>
                  </View>
              </View>
              
      <View style={styles.qualityBadges}>
        <View style={styles.qualityBadge}>
          <IconSymbol name="checkmark.seal" size={16} color={MedicalColors.success[600]} />
          <Text style={styles.qualityBadgeText}>Peer Reviewed</Text>
          </View>
        
        <View style={styles.qualityBadge}>
          <IconSymbol name="doc.text.magnifyingglass" size={16} color={MedicalColors.info[600]} />
          <Text style={styles.qualityBadgeText}>Evidence-Based</Text>
        </View>
        
        <View style={styles.qualityBadge}>
          <IconSymbol name="building.2" size={16} color={MedicalColors.tertiary[600]} />
          <Text style={styles.qualityBadgeText}>Institutional</Text>
      </View>
              </View>
    </Card>
  );

  const renderProtocolModal = () => {
    const step = PROTOCOL_STEPS.find(s => s.id === selectedStep);
    if (!step) return null;

    return (
      <Modal
        visible={showProtocolModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowProtocolModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{step.title}</Text>
            <TouchableOpacity
              onPress={() => setShowProtocolModal(false)}
              style={styles.modalCloseButton}
            >
              <IconSymbol name="xmark" size={24} color={MedicalColors.neutral[600]} />
            </TouchableOpacity>
          </View>
          
            <ScrollView style={styles.modalContent}>
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Description</Text>
              <Text style={styles.modalSectionText}>{step.description}</Text>
            </View>
              
              <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Protocol Steps</Text>
              {step.details.map((detail, index) => (
                <View key={index} style={styles.protocolDetailItem}>
                  <IconSymbol name="checkmark.circle" size={16} color={MedicalColors.success[600]} />
                  <Text style={styles.protocolDetailText}>{detail}</Text>
                </View>
              ))}
              </View>
              
              <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Textbook Reference</Text>
              <Text style={styles.modalSectionText}>{step.textbookRef}</Text>
              </View>
              
                <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Expected Duration</Text>
              <Text style={styles.modalSectionText}>{step.duration}</Text>
                </View>
              
            {step.id === currentCase.currentStep && (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Current Findings</Text>
                {step.id === 'history' && currentCase.findings.history && (
                  <View style={styles.findingsContainer}>
                    <Text style={styles.findingItem}>
                      <Text style={styles.findingLabel}>HPI: </Text>
                      {currentCase.findings.history.hpi}
                    </Text>
                    <Text style={styles.findingItem}>
                      <Text style={styles.findingLabel}>PMH: </Text>
                      {currentCase.findings.history.pmh}
                    </Text>
                    <Text style={styles.findingItem}>
                      <Text style={styles.findingLabel}>Family History: </Text>
                      {currentCase.findings.history.familyHistory}
                  </Text>
                </View>
                )}
                
                {step.id === 'examination' && currentCase.findings.examination && (
                  <View style={styles.findingsContainer}>
                    <Text style={styles.findingItem}>
                      <Text style={styles.findingLabel}>Vitals: </Text>
                      {currentCase.findings.examination.vitals}
                    </Text>
                    <Text style={styles.findingItem}>
                      <Text style={styles.findingLabel}>CV: </Text>
                      {currentCase.findings.examination.cardiovascular}
                    </Text>
                    <Text style={styles.findingItem}>
                      <Text style={styles.findingLabel}>Respiratory: </Text>
                      {currentCase.findings.examination.respiratory}
                    </Text>
                  </View>
                )}
                </View>
              )}
            </ScrollView>

          <View style={styles.modalFooter}>
            {step.id === currentCase.currentStep && (
              <Button
                title="Complete This Step"
                onPress={() => {
                  handleProceedToNextStep();
                  setShowProtocolModal(false);
                }}
                variant="primary"
                size="large"
                icon="checkmark.circle"
                iconPosition="right"
                fullWidth
              />
            )}
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[MedicalColors.primary[50], MedicalColors.secondary[50], '#FFFFFF']}
        locations={[0, 0.3, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <IconSymbol name="chevron.left" size={24} color={MedicalColors.primary[600]} />
            </TouchableOpacity>
          <Text style={styles.headerTitle}>Medical Protocol</Text>
          <View style={styles.headerSpacer} />
          </View>
          
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInUp.duration(500)}>
            <View style={styles.introSection}>
              <Text style={styles.introTitle}>Standardized Medical Protocol</Text>
              <Text style={styles.introDescription}>
                Following evidence-based textbook protocols to ensure comprehensive, 
                standardized care for every patient case.
              </Text>
            </View>
          </Animated.View>

          {renderCaseOverview()}
          {renderProtocolSteps()}
          {renderEvidenceSection()}

          <View style={styles.actionButtons}>
            <Button
              title="View Patient Summary"
              onPress={() => router.push('/medical-records')}
              variant="outline"
              size="medium"
              icon="doc.text"
              iconPosition="left"
              style={styles.actionButton}
            />
            
            <Button
              title="Continue to Consultation"
              onPress={() => router.push('/consultation-flow')}
              variant="primary"
              size="medium"
              icon="arrow.right.circle"
              iconPosition="right"
              style={styles.actionButton}
            />
            </View>
            
          <View style={styles.trustSection}>
            <Text style={styles.trustTitle}>Why This Matters</Text>
            <Text style={styles.trustDescription}>
              Our standardized protocols ensure every patient receives the same high-quality, 
              evidence-based care that follows established medical guidelines and best practices.
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>

      {renderProtocolModal()}
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  introSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  introTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
    marginBottom: 8,
    textAlign: 'center',
  },
  introDescription: {
    fontSize: 16,
    color: MedicalColors.neutral[600],
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  caseCard: {
    marginBottom: 20,
  },
  caseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  caseInfo: {
    flex: 1,
  },
  caseTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
  },
  caseSubtitle: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    marginTop: 2,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: MedicalColors.warning[100],
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: MedicalColors.warning[700],
  },
  caseDetails: {
    gap: 12,
    marginBottom: 16,
  },
  caseDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  caseDetailText: {
    fontSize: 14,
    color: MedicalColors.neutral[700],
    flex: 1,
  },
  progressContainer: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
  },
  progressSubtitle: {
    fontSize: 12,
    color: MedicalColors.neutral[600],
  },
  progressBar: {
    height: 8,
    backgroundColor: MedicalColors.neutral[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: MedicalColors.primary[600],
    borderRadius: 4,
  },
  protocolCard: {
    marginBottom: 20,
  },
  protocolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  protocolTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
  },
  stepsContainer: {
    gap: 16,
  },
  stepItem: {
    position: 'relative',
  },
  stepButton: {
    flex: 1,
  },
  stepLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  stepIndicator: {
    alignItems: 'center',
    position: 'relative',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  stepConnector: {
    position: 'absolute',
    top: 32,
    left: 15,
    width: 2,
    height: 32,
    backgroundColor: MedicalColors.neutral[300],
  },
  stepContent: {
    flex: 1,
    paddingBottom: 16,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
  },
  stepMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stepStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  stepDescription: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    lineHeight: 20,
    marginBottom: 8,
  },
  stepFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepDuration: {
    fontSize: 12,
    color: MedicalColors.neutral[500],
    fontWeight: '500',
  },
  evidenceCard: {
    marginBottom: 20,
  },
  evidenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  evidenceTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
  },
  evidenceContent: {
    gap: 12,
    marginBottom: 16,
  },
  evidenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  evidenceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: MedicalColors.neutral[700],
  },
  evidenceValue: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    flex: 1,
    textAlign: 'right',
  },
  qualityBadges: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  qualityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: MedicalColors.neutral[100],
    borderRadius: 12,
    gap: 4,
  },
  qualityBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: MedicalColors.neutral[700],
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
  },
  trustSection: {
    padding: 16,
    backgroundColor: MedicalColors.primary[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: MedicalColors.primary[200],
  },
  trustTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: MedicalColors.primary[900],
    marginBottom: 8,
  },
  trustDescription: {
    fontSize: 14,
    color: MedicalColors.primary[700],
    lineHeight: 20,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: MedicalColors.neutral[200],
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
  },
  modalCloseButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
    marginBottom: 8,
  },
  modalSectionText: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    lineHeight: 20,
  },
  protocolDetailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  protocolDetailText: {
    fontSize: 14,
    color: MedicalColors.neutral[700],
    flex: 1,
  },
  findingsContainer: {
    gap: 8,
  },
  findingItem: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    lineHeight: 20,
  },
  findingLabel: {
    fontWeight: '600',
    color: MedicalColors.neutral[700],
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: MedicalColors.neutral[200],
  },
});