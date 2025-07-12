import { IconSymbol } from '@/components/ui/IconSymbol';
import * as DocumentPicker from 'expo-document-picker';
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
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uri: string;
}

interface AssessmentData {
  documents: UploadedDocument[];
  chiefComplaint: string;
  symptoms: string[];
  currentTreatment: string;
  questionsForDoctor: string[];
  urgency: 'low' | 'medium' | 'high' | 'urgent';
}

const SelfServiceFlowScreen = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    documents: [],
    chiefComplaint: '',
    symptoms: [],
    currentTreatment: '',
    questionsForDoctor: [],
    urgency: 'medium'
  });
  const [supportModalVisible, setSupportModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    { id: 'upload', title: 'Upload Information', subtitle: 'Share your medical documents' },
    { id: 'complaint', title: 'Chief Complaint', subtitle: 'What brings you here today?' },
    { id: 'symptoms', title: 'Symptom Analysis', subtitle: 'AI-powered symptom checker' },
    { id: 'treatment', title: 'Current Treatment', subtitle: 'What are you currently doing?' },
    { id: 'questions', title: 'Your Questions', subtitle: 'What would you like to know?' },
    { id: 'review', title: 'Review & Submit', subtitle: 'Confirm your information' }
  ];

  const handleDocumentUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
        multiple: true
      });

      if (!result.canceled && result.assets) {
        const newDocuments = result.assets.map((asset, index) => ({
          id: `${Date.now()}_${index}`,
          name: asset.name || 'Unknown',
          type: asset.mimeType || 'unknown',
          size: asset.size || 0,
          uri: asset.uri
        }));

        setAssessmentData(prev => ({
          ...prev,
          documents: [...prev.documents, ...newDocuments]
        }));

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Alert.alert('Success', `${newDocuments.length} document(s) uploaded successfully`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload document. Please try again.');
    }
  };

  const removeDocument = (documentId: string) => {
    setAssessmentData(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.id !== documentId)
    }));
  };

  const requestSupport = () => {
    setSupportModalVisible(true);
  };

  const handleSupportRequest = () => {
    setSupportModalVisible(false);
    Alert.alert(
      'Support Requested',
      'A medical support specialist will contact you within 15 minutes to assist with your assessment.',
      [
        { text: 'Continue Self-Service', style: 'cancel' },
        { text: 'Switch to Assisted Help', onPress: () => router.push('/assisted-help-flow') }
      ]
    );
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false);
      router.push('/ai-assessment-results');
    }, 3000);
  };

  const renderUploadStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Upload Your Medical Information</Text>
      <Text style={styles.stepSubtitle}>
        Share any relevant medical documents, test results, or images to help us understand your situation better.
      </Text>

      <View style={styles.uploadContainer}>
        <TouchableOpacity style={styles.uploadButton} onPress={handleDocumentUpload}>
          <IconSymbol name="plus.circle.fill" size={48} color="rgb(132, 204, 22)" />
          <Text style={styles.uploadButtonText}>Upload Documents</Text>
          <Text style={styles.uploadButtonSubtext}>PDF, Images, Lab Results</Text>
        </TouchableOpacity>
      </View>

      {assessmentData.documents.length > 0 && (
        <View style={styles.documentsContainer}>
          <Text style={styles.documentsTitle}>Uploaded Documents ({assessmentData.documents.length})</Text>
          {assessmentData.documents.map((doc) => (
            <View key={doc.id} style={styles.documentItem}>
              <IconSymbol name="doc.fill" size={24} color="rgb(59, 130, 246)" />
              <View style={styles.documentInfo}>
                <Text style={styles.documentName}>{doc.name}</Text>
                <Text style={styles.documentSize}>{(doc.size / 1024).toFixed(1)} KB</Text>
              </View>
              <TouchableOpacity onPress={() => removeDocument(doc.id)}>
                <IconSymbol name="trash" size={20} color="rgb(239, 68, 68)" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.supportHint}>
        <IconSymbol name="lightbulb" size={20} color="rgb(251, 204, 21)" />
        <Text style={styles.supportHintText}>
          Not sure what to upload? Request support for personalized guidance.
        </Text>
      </View>
    </View>
  );

  const renderComplaintStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What Brings You Here Today?</Text>
      <Text style={styles.stepSubtitle}>
        Describe your main concern or the reason you're seeking a second opinion.
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textArea}
          placeholder="Describe your main health concern, symptoms, or the reason you're seeking a second opinion..."
          multiline
          numberOfLines={6}
          value={assessmentData.chiefComplaint}
          onChangeText={(text) => setAssessmentData(prev => ({ ...prev, chiefComplaint: text }))}
        />
      </View>

      <View style={styles.exampleContainer}>
        <Text style={styles.exampleTitle}>Examples:</Text>
        <View style={styles.exampleItem}>
          <Text style={styles.exampleText}>• "I've been experiencing chest pain for 2 weeks..."</Text>
        </View>
        <View style={styles.exampleItem}>
          <Text style={styles.exampleText}>• "My doctor recommended surgery, but I want another opinion..."</Text>
        </View>
        <View style={styles.exampleItem}>
          <Text style={styles.exampleText}>• "I'm not sure about my current treatment plan..."</Text>
        </View>
      </View>
    </View>
  );

  const renderSymptomStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>AI-Powered Symptom Analysis</Text>
      <Text style={styles.stepSubtitle}>
        Let our AI help you identify and classify your symptoms systematically.
      </Text>

      <View style={styles.aiContainer}>
        <TouchableOpacity 
          style={styles.aiButton}
          onPress={() => router.push('/symptom-checker')}
        >
          <IconSymbol name="brain.head.profile" size={48} color="rgb(168, 85, 247)" />
          <Text style={styles.aiButtonText}>Start AI Symptom Checker</Text>
          <Text style={styles.aiButtonSubtext}>Visual pain mapping & structured analysis</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.alternativeContainer}>
        <Text style={styles.alternativeTitle}>Or describe symptoms manually:</Text>
        <TextInput
          style={styles.textArea}
          placeholder="List your symptoms, when they started, severity, etc..."
          multiline
          numberOfLines={4}
          value={assessmentData.symptoms.join('\n')}
          onChangeText={(text) => setAssessmentData(prev => ({ 
            ...prev, 
            symptoms: text.split('\n').filter(s => s.trim()) 
          }))}
        />
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderUploadStep();
      case 1:
        return renderComplaintStep();
      case 2:
        return renderSymptomStep();
      default:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Step {currentStep + 1}</Text>
            <Text style={styles.stepSubtitle}>This step is under development</Text>
          </View>
        );
    }
  };

  if (isProcessing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.processingContainer}>
          <Animated.View entering={FadeIn} style={styles.processingContent}>
            <IconSymbol name="brain.head.profile" size={64} color="rgb(132, 204, 22)" />
            <Text style={styles.processingTitle}>AI Analysis in Progress</Text>
            <Text style={styles.processingSubtitle}>
              Our AI is analyzing your information using standardized medical protocols...
            </Text>
            <View style={styles.processingSteps}>
              <Text style={styles.processingStep}>✓ Reviewing uploaded documents</Text>
              <Text style={styles.processingStep}>✓ Analyzing symptoms</Text>
              <Text style={styles.processingStep}>⏳ Generating assessment</Text>
              <Text style={styles.processingStep}>⏳ Preparing recommendations</Text>
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <IconSymbol name="chevron.left" size={24} color="rgb(49, 58, 52)" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Self-Service Assessment</Text>
          <Text style={styles.headerSubtitle}>
            Step {currentStep + 1} of {steps.length}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.supportButton} onPress={requestSupport}>
          <IconSymbol name="questionmark.circle" size={24} color="rgb(132, 204, 22)" />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View 
            style={[
              styles.progressFill,
              { width: `${((currentStep + 1) / steps.length) * 100}%` }
            ]}
            entering={SlideInRight}
          />
        </View>
        <Text style={styles.progressText}>
          {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
        </Text>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn} key={currentStep}>
          {renderCurrentStep()}
        </Animated.View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navButton, styles.backNavButton]}
          onPress={handleBack}
        >
          <IconSymbol name="chevron.left" size={20} color="rgb(132, 204, 22)" />
          <Text style={styles.backNavText}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.navButton, styles.nextNavButton]}
          onPress={handleNext}
        >
          <Text style={styles.nextNavText}>
            {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
          </Text>
          <IconSymbol name="chevron.right" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Support Modal */}
      <Modal
        visible={supportModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSupportModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Request Support</Text>
            <Text style={styles.modalText}>
              Our medical support team can help guide you through the assessment process. 
              They'll ensure you're providing the right information and answer any questions you have.
            </Text>
            
            <View style={styles.supportOptions}>
              <TouchableOpacity style={styles.supportOption} onPress={handleSupportRequest}>
                <IconSymbol name="phone.fill" size={24} color="rgb(132, 204, 22)" />
                <Text style={styles.supportOptionText}>Call Me Now</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.supportOption} onPress={handleSupportRequest}>
                <IconSymbol name="message.fill" size={24} color="rgb(59, 130, 246)" />
                <Text style={styles.supportOptionText}>Chat Support</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setSupportModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Continue Alone</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
  supportButton: {
    padding: 8,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
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
  progressText: {
    fontSize: 12,
    color: 'rgb(100, 112, 103)',
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'rgb(49, 58, 52)',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: 'rgb(100, 112, 103)',
    marginBottom: 30,
    lineHeight: 24,
  },
  uploadContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  uploadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 150,
    borderWidth: 2,
    borderColor: 'rgb(132, 204, 22)',
    borderStyle: 'dashed',
    borderRadius: 16,
    backgroundColor: 'rgba(132, 204, 22, 0.05)',
  },
  uploadButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgb(132, 204, 22)',
    marginTop: 10,
  },
  uploadButtonSubtext: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
    marginTop: 4,
  },
  documentsContainer: {
    marginBottom: 30,
  },
  documentsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgb(49, 58, 52)',
    marginBottom: 15,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderRadius: 12,
    marginBottom: 10,
  },
  documentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgb(49, 58, 52)',
  },
  documentSize: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
    marginTop: 2,
  },
  supportHint: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(251, 204, 21, 0.1)',
    borderRadius: 12,
    gap: 10,
  },
  supportHintText: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
    flex: 1,
  },
  inputContainer: {
    marginBottom: 30,
  },
  textArea: {
    borderWidth: 1,
    borderColor: 'rgba(132, 204, 22, 0.3)',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: 'rgb(49, 58, 52)',
    textAlignVertical: 'top',
    minHeight: 120,
  },
  exampleContainer: {
    padding: 15,
    backgroundColor: 'rgba(132, 204, 22, 0.05)',
    borderRadius: 12,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgb(49, 58, 52)',
    marginBottom: 10,
  },
  exampleItem: {
    marginBottom: 5,
  },
  exampleText: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
  },
  aiContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  aiButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 30,
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(168, 85, 247, 0.3)',
  },
  aiButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgb(168, 85, 247)',
    marginTop: 10,
  },
  aiButtonSubtext: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
    marginTop: 4,
  },
  alternativeContainer: {
    marginTop: 20,
  },
  alternativeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgb(49, 58, 52)',
    marginBottom: 10,
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
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  processingContent: {
    alignItems: 'center',
  },
  processingTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'rgb(49, 58, 52)',
    marginTop: 20,
    marginBottom: 10,
  },
  processingSubtitle: {
    fontSize: 16,
    color: 'rgb(100, 112, 103)',
    textAlign: 'center',
    marginBottom: 30,
  },
  processingSteps: {
    alignItems: 'flex-start',
  },
  processingStep: {
    fontSize: 16,
    color: 'rgb(100, 112, 103)',
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'rgb(49, 58, 52)',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    color: 'rgb(100, 112, 103)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  supportOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  supportOption: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(132, 204, 22, 0.1)',
    borderRadius: 16,
    flex: 1,
    marginHorizontal: 5,
  },
  supportOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgb(49, 58, 52)',
    marginTop: 8,
  },
  modalButtons: {
    alignItems: 'center',
  },
  modalCancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  modalCancelText: {
    fontSize: 16,
    color: 'rgb(100, 112, 103)',
  },
});

export default SelfServiceFlowScreen; 