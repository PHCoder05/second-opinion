import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';

interface SupportAgent {
  id: string;
  name: string;
  title: string;
  specialization: string;
  experience: string;
  avatar: string;
  isOnline: boolean;
}

interface SOPStep {
  id: string;
  title: string;
  description: string;
  questions: string[];
  required: boolean;
  completed: boolean;
}

interface PatientData {
  basicInfo: Record<string, any>;
  symptoms: Record<string, any>;
  medicalHistory: Record<string, any>;
  currentTreatment: Record<string, any>;
  investigations: Record<string, any>;
  concerns: Record<string, any>;
}

const AssistedHelpFlowScreen = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [supportAgent, setSupportAgent] = useState<SupportAgent | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [chatVisible, setChatVisible] = useState(false);
  const [patientData, setPatientData] = useState<PatientData>({
    basicInfo: {},
    symptoms: {},
    medicalHistory: {},
    currentTreatment: {},
    investigations: {},
    concerns: {}
  });

  const sopSteps: SOPStep[] = [
    {
      id: 'patient-identification',
      title: 'Patient Identification & Verification',
      description: 'Verify patient identity and establish secure communication',
      questions: [
        'Can you confirm your full name and date of birth?',
        'What is your primary phone number?',
        'Do you have any medical ID or insurance information?'
      ],
      required: true,
      completed: false
    },
    {
      id: 'chief-complaint',
      title: 'Chief Complaint Assessment',
      description: 'Identify primary reason for seeking second opinion',
      questions: [
        'What is your main health concern today?',
        'When did you first notice this problem?',
        'What prompted you to seek a second opinion?',
        'How is this affecting your daily life?'
      ],
      required: true,
      completed: false
    },
    {
      id: 'symptom-analysis',
      title: 'Comprehensive Symptom Analysis',
      description: 'Detailed symptom mapping using standardized protocols',
      questions: [
        'Can you describe your symptoms in detail?',
        'On a scale of 1-10, how severe are your symptoms?',
        'Do your symptoms come and go, or are they constant?',
        'What makes your symptoms better or worse?',
        'Have you noticed any patterns or triggers?'
      ],
      required: true,
      completed: false
    },
    {
      id: 'medical-history',
      title: 'Medical History Collection',
      description: 'Gather comprehensive medical background',
      questions: [
        'Do you have any chronic medical conditions?',
        'What medications are you currently taking?',
        'Do you have any known allergies?',
        'Any previous surgeries or hospitalizations?',
        'Family history of relevant conditions?'
      ],
      required: true,
      completed: false
    },
    {
      id: 'current-treatment',
      title: 'Current Treatment Evaluation',
      description: 'Review existing treatment plans and effectiveness',
      questions: [
        'What treatment are you currently receiving?',
        'Who is your current healthcare provider?',
        'How long have you been on this treatment?',
        'What has been the response to treatment?',
        'Are you experiencing any side effects?'
      ],
      required: true,
      completed: false
    },
    {
      id: 'investigations-review',
      title: 'Investigations & Test Results',
      description: 'Review all available test results and investigations',
      questions: [
        'What tests have you had done recently?',
        'Do you have copies of your test results?',
        'Have you had any imaging studies (X-rays, CT, MRI)?',
        'Any lab work or blood tests?',
        'Are there any tests your doctor recommended?'
      ],
      required: true,
      completed: false
    },
    {
      id: 'specific-concerns',
      title: 'Specific Concerns & Questions',
      description: 'Address patient-specific questions and concerns',
      questions: [
        'What specific questions do you have about your condition?',
        'Are you concerned about the proposed treatment?',
        'What outcomes are you hoping for?',
        'Are there any alternative treatments you\'ve heard about?',
        'What are your main fears or worries?'
      ],
      required: true,
      completed: false
    }
  ];

  const supportAgents: SupportAgent[] = [
    {
      id: '1',
      name: 'Dr. Sarah Chen',
      title: 'Medical Support Specialist',
      specialization: 'Internal Medicine',
      experience: '8 years',
      avatar: '👩‍⚕️',
      isOnline: true
    },
    {
      id: '2',
      name: 'Dr. Michael Rodriguez',
      title: 'Clinical Assessment Lead',
      specialization: 'Emergency Medicine',
      experience: '12 years',
      avatar: '👨‍⚕️',
      isOnline: true
    },
    {
      id: '3',
      name: 'Dr. Emily Johnson',
      title: 'Patient Care Coordinator',
      specialization: 'Family Medicine',
      experience: '6 years',
      avatar: '👩‍⚕️',
      isOnline: true
    }
  ];

  useEffect(() => {
    // Simulate connecting to support agent
    const timer = setTimeout(() => {
      const availableAgents = supportAgents.filter(agent => agent.isOnline);
      const randomAgent = availableAgents[Math.floor(Math.random() * availableAgents.length)];
      setSupportAgent(randomAgent);
      setIsConnecting(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleStepComplete = (stepId: string) => {
    const updatedSteps = sopSteps.map(step => 
      step.id === stepId ? { ...step, completed: true } : step
    );
    
    const currentStepIndex = sopSteps.findIndex(step => step.id === stepId);
    if (currentStepIndex < sopSteps.length - 1) {
      setCurrentStep(currentStepIndex + 1);
    } else {
      handleAssessmentComplete();
    }
  };

  const handleAssessmentComplete = () => {
    Alert.alert(
      'Assessment Complete',
      'Thank you for providing comprehensive information. Our medical team will now review your case and provide a detailed second opinion within 24 hours.',
      [
        { text: 'View Summary', onPress: () => router.push('/assessment-summary') },
        { text: 'Back to Dashboard', onPress: () => router.push('/(tabs)') }
      ]
    );
  };

  const handleEmergencyEscalation = () => {
    Alert.alert(
      'Emergency Protocol Activated',
      'Based on your symptoms, we recommend immediate medical attention. We\'re connecting you with emergency services.',
      [
        { text: 'Call 911', onPress: () => {} },
        { text: 'Find Nearest ER', onPress: () => {} }
      ]
    );
  };

  if (isConnecting) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.connectingContainer}>
          <Animated.View entering={FadeIn} style={styles.connectingContent}>
            <IconSymbol name="person.2.fill" size={64} color="rgb(132, 204, 22)" />
            <Text style={styles.connectingTitle}>Connecting You to Medical Support</Text>
            <Text style={styles.connectingSubtitle}>
              We're matching you with the best available medical support specialist...
            </Text>
            <View style={styles.connectingSteps}>
              <Text style={styles.connectingStep}>✓ Verifying your consultation</Text>
              <Text style={styles.connectingStep}>✓ Reviewing your initial information</Text>
              <Text style={styles.connectingStep}>⏳ Matching with specialist</Text>
              <Text style={styles.connectingStep}>⏳ Establishing secure connection</Text>
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Support Agent */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color="rgb(49, 58, 52)" />
        </TouchableOpacity>
        
        <View style={styles.agentInfo}>
          <Text style={styles.agentAvatar}>{supportAgent?.avatar}</Text>
          <View style={styles.agentDetails}>
            <Text style={styles.agentName}>{supportAgent?.name}</Text>
            <Text style={styles.agentTitle}>{supportAgent?.title}</Text>
          </View>
          <View style={styles.statusIndicator}>
            <View style={styles.onlineIndicator} />
            <Text style={styles.statusText}>Online</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.chatButton} onPress={() => setChatVisible(true)}>
          <IconSymbol name="message.fill" size={24} color="rgb(132, 204, 22)" />
        </TouchableOpacity>
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Medical Assessment Progress</Text>
          <Text style={styles.progressSubtitle}>
            Step {currentStep + 1} of {sopSteps.length}
          </Text>
        </View>
        <View style={styles.progressBar}>
          <Animated.View 
            style={[
              styles.progressFill,
              { width: `${((currentStep + 1) / sopSteps.length) * 100}%` }
            ]}
            entering={SlideInRight}
          />
        </View>
      </View>

      {/* Current SOP Step */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn} key={currentStep}>
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>{sopSteps[currentStep]?.title}</Text>
              <Text style={styles.stepDescription}>{sopSteps[currentStep]?.description}</Text>
            </View>

            <View style={styles.questionsContainer}>
              <Text style={styles.questionsTitle}>
                {supportAgent?.name} will guide you through these questions:
              </Text>
              
              {sopSteps[currentStep]?.questions.map((question, index) => (
                <View key={index} style={styles.questionItem}>
                  <View style={styles.questionNumber}>
                    <Text style={styles.questionNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.questionText}>{question}</Text>
                </View>
              ))}
            </View>

            <View style={styles.sopGuidance}>
              <IconSymbol name="checkmark.shield" size={24} color="rgb(132, 204, 22)" />
              <View style={styles.sopGuidanceText}>
                <Text style={styles.sopGuidanceTitle}>Standardized Medical Protocol</Text>
                <Text style={styles.sopGuidanceDescription}>
                  Our medical team follows evidence-based protocols to ensure comprehensive 
                  and consistent assessments for all patients.
                </Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.emergencyButton}
                onPress={handleEmergencyEscalation}
              >
                <IconSymbol name="exclamationmark.triangle.fill" size={20} color="rgb(239, 68, 68)" />
                <Text style={styles.emergencyButtonText}>Emergency</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.completeButton}
                onPress={() => handleStepComplete(sopSteps[currentStep].id)}
              >
                <Text style={styles.completeButtonText}>Complete Step</Text>
                <IconSymbol name="checkmark.circle.fill" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* SOP Steps Overview */}
        <View style={styles.stepsOverview}>
          <Text style={styles.overviewTitle}>Assessment Steps</Text>
          {sopSteps.map((step, index) => (
            <View key={step.id} style={styles.stepOverviewItem}>
              <View style={[
                styles.stepOverviewIndicator,
                index < currentStep ? styles.stepCompleted :
                index === currentStep ? styles.stepCurrent : styles.stepPending
              ]}>
                {index < currentStep ? (
                  <IconSymbol name="checkmark" size={16} color="white" />
                ) : (
                  <Text style={styles.stepOverviewNumber}>{index + 1}</Text>
                )}
              </View>
              <View style={styles.stepOverviewContent}>
                <Text style={[
                  styles.stepOverviewTitle,
                  index === currentStep && styles.stepOverviewTitleCurrent
                ]}>
                  {step.title}
                </Text>
                <Text style={styles.stepOverviewDescription}>
                  {step.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Chat Modal */}
      <Modal
        visible={chatVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setChatVisible(false)}
      >
        <SafeAreaView style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatTitle}>Live Chat with {supportAgent?.name}</Text>
            <TouchableOpacity onPress={() => setChatVisible(false)}>
              <IconSymbol name="xmark" size={24} color="rgb(100, 112, 103)" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.chatContent}>
            <View style={styles.chatMessage}>
              <Text style={styles.chatMessageText}>
                Hello! I'm here to help guide you through your medical assessment. 
                I'll ask you structured questions based on our standardized protocols 
                to ensure we capture all the necessary information for your second opinion.
              </Text>
            </View>
            
            <View style={styles.chatMessage}>
              <Text style={styles.chatMessageText}>
                Feel free to ask me any questions or request clarification at any time. 
                Everything we discuss is confidential and HIPAA compliant.
              </Text>
            </View>
          </View>
          
          <View style={styles.chatInput}>
            <TextInput
              style={styles.chatInputField}
              placeholder="Type your message..."
              multiline
            />
            <TouchableOpacity style={styles.chatSendButton}>
              <IconSymbol name="paperplane.fill" size={20} color="white" />
            </TouchableOpacity>
          </View>
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
  connectingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  connectingContent: {
    alignItems: 'center',
  },
  connectingTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'rgb(49, 58, 52)',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  connectingSubtitle: {
    fontSize: 16,
    color: 'rgb(100, 112, 103)',
    textAlign: 'center',
    marginBottom: 30,
  },
  connectingSteps: {
    alignItems: 'flex-start',
  },
  connectingStep: {
    fontSize: 16,
    color: 'rgb(100, 112, 103)',
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: 'rgba(132, 204, 22, 0.05)',
  },
  backButton: {
    padding: 8,
  },
  agentInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  agentAvatar: {
    fontSize: 32,
    marginRight: 12,
  },
  agentDetails: {
    flex: 1,
  },
  agentName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgb(49, 58, 52)',
  },
  agentTitle: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgb(34, 197, 94)',
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    color: 'rgb(34, 197, 94)',
    fontWeight: '500',
  },
  chatButton: {
    padding: 8,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(132, 204, 22, 0.02)',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgb(49, 58, 52)',
  },
  progressSubtitle: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(132, 204, 22, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'rgb(132, 204, 22)',
    borderRadius: 3,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  stepContainer: {
    marginTop: 20,
  },
  stepHeader: {
    marginBottom: 25,
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
  },
  questionsContainer: {
    marginBottom: 30,
  },
  questionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgb(49, 58, 52)',
    marginBottom: 20,
  },
  questionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  questionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgb(132, 204, 22)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  questionNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  questionText: {
    fontSize: 16,
    color: 'rgb(49, 58, 52)',
    flex: 1,
    lineHeight: 24,
  },
  sopGuidance: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 20,
    backgroundColor: 'rgba(132, 204, 22, 0.1)',
    borderRadius: 16,
    marginBottom: 30,
  },
  sopGuidanceText: {
    flex: 1,
    marginLeft: 12,
  },
  sopGuidanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgb(49, 58, 52)',
    marginBottom: 5,
  },
  sopGuidanceDescription: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgb(239, 68, 68)',
    gap: 8,
  },
  emergencyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgb(239, 68, 68)',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 12,
    backgroundColor: 'rgb(132, 204, 22)',
    borderRadius: 25,
    gap: 8,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  stepsOverview: {
    marginTop: 20,
  },
  overviewTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'rgb(49, 58, 52)',
    marginBottom: 20,
  },
  stepOverviewItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  stepOverviewIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
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
  stepOverviewNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgb(100, 112, 103)',
  },
  stepOverviewContent: {
    flex: 1,
  },
  stepOverviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgb(100, 112, 103)',
    marginBottom: 4,
  },
  stepOverviewTitleCurrent: {
    color: 'rgb(49, 58, 52)',
  },
  stepOverviewDescription: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
    lineHeight: 20,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgb(49, 58, 52)',
  },
  chatContent: {
    flex: 1,
    padding: 20,
  },
  chatMessage: {
    backgroundColor: 'rgba(132, 204, 22, 0.1)',
    padding: 15,
    borderRadius: 16,
    marginBottom: 15,
  },
  chatMessageText: {
    fontSize: 16,
    color: 'rgb(49, 58, 52)',
    lineHeight: 24,
  },
  chatInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  chatInputField: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(132, 204, 22, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 10,
  },
  chatSendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgb(132, 204, 22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AssistedHelpFlowScreen; 