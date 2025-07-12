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
    TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol, Card, Button, Input } from '@/components/ui';
import { MedicalColors, MedicalGradients } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

// Comprehensive symptom categories following medical protocols
const SYMPTOM_CATEGORIES = [
  {
    id: 'general',
    name: 'General',
    icon: 'person.fill',
    color: MedicalColors.primary[600],
    symptoms: [
      'Fever', 'Fatigue', 'Weight Loss', 'Weight Gain', 'Chills', 'Night Sweats',
      'Loss of Appetite', 'Weakness', 'Malaise', 'Swollen Lymph Nodes'
    ]
  },
  {
    id: 'pain',
    name: 'Pain & Discomfort',
    icon: 'heart.text.square',
    color: MedicalColors.accent[600],
    symptoms: [
      'Headache', 'Chest Pain', 'Abdominal Pain', 'Back Pain', 'Joint Pain',
      'Muscle Pain', 'Neck Pain', 'Pelvic Pain', 'Throat Pain'
    ]
  },
  {
    id: 'respiratory',
    name: 'Respiratory',
    icon: 'lungs.fill',
    color: MedicalColors.secondary[600],
    symptoms: [
      'Cough', 'Shortness of Breath', 'Wheezing', 'Chest Tightness',
      'Sputum Production', 'Blood in Sputum', 'Difficulty Breathing', 'Rapid Breathing'
    ]
  },
  {
    id: 'cardiovascular',
    name: 'Heart & Circulation',
    icon: 'heart.fill',
    color: MedicalColors.primary[700],
    symptoms: [
      'Palpitations', 'Chest Pressure', 'Dizziness', 'Fainting', 'Leg Swelling',
      'Cold Extremities', 'Rapid Heartbeat', 'Irregular Heartbeat'
    ]
  },
  {
    id: 'neurological',
    name: 'Neurological',
    icon: 'brain.head.profile',
    color: MedicalColors.tertiary[600],
    symptoms: [
      'Confusion', 'Memory Loss', 'Seizures', 'Numbness', 'Tingling',
      'Tremors', 'Balance Problems', 'Speech Difficulties', 'Vision Changes'
    ]
  },
  {
    id: 'gastrointestinal',
    name: 'Digestive',
    icon: 'stomach',
    color: MedicalColors.warning[600],
    symptoms: [
      'Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Heartburn',
      'Bloating', 'Gas', 'Blood in Stool', 'Changes in Bowel Habits'
    ]
  },
  {
    id: 'skin',
    name: 'Skin & Hair',
    icon: 'hand.raised.fill',
    color: MedicalColors.success[600],
    symptoms: [
      'Rash', 'Itching', 'Bruising', 'Hair Loss', 'Skin Changes',
      'Nail Changes', 'Dry Skin', 'Excessive Sweating', 'Skin Lesions'
    ]
  },
  {
    id: 'urinary',
    name: 'Urinary',
    icon: 'drop.fill',
    color: MedicalColors.info[600],
    symptoms: [
      'Frequent Urination', 'Burning with Urination', 'Blood in Urine',
      'Difficulty Urinating', 'Urgency', 'Incontinence', 'Cloudy Urine'
    ]
  }
];

// Symptom severity and timing questions
const SYMPTOM_QUESTIONS = [
  {
    id: 'onset',
    question: 'When did this symptom start?',
    type: 'single_choice',
    options: ['Today', 'Yesterday', 'This week', 'This month', 'Longer than a month']
  },
  {
    id: 'severity',
    question: 'How severe is this symptom?',
    type: 'scale',
    min: 1,
    max: 10,
    labels: ['Mild', 'Moderate', 'Severe']
  },
  {
    id: 'pattern',
    question: 'How would you describe the pattern?',
    type: 'single_choice',
    options: ['Constant', 'Comes and goes', 'Getting worse', 'Getting better', 'Varies throughout day']
  },
  {
    id: 'triggers',
    question: 'What makes it worse?',
    type: 'multiple_choice',
    options: ['Activity', 'Rest', 'Eating', 'Stress', 'Weather changes', 'Nothing specific']
  },
  {
    id: 'relief',
    question: 'What makes it better?',
    type: 'multiple_choice',
    options: ['Rest', 'Medication', 'Heat', 'Cold', 'Movement', 'Nothing helps']
  }
];

interface SelectedSymptom {
  id: string;
  name: string;
  category: string;
  severity: number;
  onset: string;
  pattern: string;
  triggers: string[];
  relief: string[];
  notes: string;
}

interface SymptomDetail {
  symptom: SelectedSymptom;
  currentQuestion: number;
  answers: any;
}

export default function SymptomChecker() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSymptoms, setSelectedSymptoms] = useState<SelectedSymptom[]>([]);
  const [showSymptomDetail, setShowSymptomDetail] = useState(false);
  const [currentSymptomDetail, setCurrentSymptomDetail] = useState<SymptomDetail | null>(null);
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const steps = ['Chief Complaint', 'Select Symptoms', 'Symptom Details', 'Additional Information', 'Analysis'];

  const handleSymptomSelect = (symptom: string, category: string) => {
    const newSymptom: SelectedSymptom = {
      id: `${category}-${symptom}`,
      name: symptom,
      category,
      severity: 5,
      onset: '',
      pattern: '',
      triggers: [],
      relief: [],
      notes: ''
    };

    setCurrentSymptomDetail({
      symptom: newSymptom,
      currentQuestion: 0,
      answers: {}
    });
    setShowSymptomDetail(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSymptomDetailComplete = (symptomDetail: SelectedSymptom) => {
    setSelectedSymptoms(prev => [...prev, symptomDetail]);
    setShowSymptomDetail(false);
    setCurrentSymptomDetail(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const removeSymptom = (symptomId: string) => {
    setSelectedSymptoms(prev => prev.filter(s => s.id !== symptomId));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis process
    setTimeout(() => {
      setIsAnalyzing(false);
    Alert.alert(
        'Initial Analysis Complete',
        'Based on your symptoms, our AI has identified several possible conditions. For a comprehensive second opinion, please continue with our medical consultation process.',
      [
          { 
            text: 'Continue to Consultation', 
            onPress: () => router.push('/consultation-flow')
          },
          {
            text: 'View Results',
            onPress: () => router.push('/ai-assessment-results')
          }
      ]
    );
    }, 3000);
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${((currentStep + 1) / steps.length) * 100}%` }
          ]} 
        />
      </View>
      <Text style={styles.progressText}>
        {steps[currentStep]} ({currentStep + 1} of {steps.length})
      </Text>
    </View>
  );

  const renderChiefComplaint = () => (
    <Animated.View entering={FadeIn.duration(500)}>
      <Card variant="default" padding="large" style={styles.stepCard}>
        <View style={styles.stepHeader}>
          <IconSymbol name="heart.text.square" size={32} color={MedicalColors.primary[600]} />
          <Text style={styles.stepTitle}>What brings you here today?</Text>
          <Text style={styles.stepDescription}>
            Describe your main concern or the primary symptom that's troubling you
          </Text>
        </View>

        <Input
          label="Chief Complaint"
          placeholder="In your own words, what's the main reason you're seeking a second opinion?"
          value={chiefComplaint}
          onChangeText={setChiefComplaint}
          multiline
          style={styles.textArea}
          required
        />

        <View style={styles.exampleSection}>
          <Text style={styles.exampleTitle}>Examples:</Text>
          <Text style={styles.exampleText}>• "I've been having chest pain for 3 days"</Text>
          <Text style={styles.exampleText}>• "Persistent headaches that don't respond to medication"</Text>
          <Text style={styles.exampleText}>• "Unexplained weight loss over the past month"</Text>
      </View>
      </Card>
    </Animated.View>
  );

  const renderSymptomSelection = () => (
    <Animated.View entering={FadeIn.duration(500)}>
      <Card variant="default" padding="large" style={styles.stepCard}>
        <View style={styles.stepHeader}>
          <IconSymbol name="checklist" size={32} color={MedicalColors.primary[600]} />
          <Text style={styles.stepTitle}>Select Your Symptoms</Text>
          <Text style={styles.stepDescription}>
            Choose all symptoms you're currently experiencing
          </Text>
        </View>

        {selectedSymptoms.length > 0 && (
          <View style={styles.selectedSymptomsContainer}>
            <Text style={styles.selectedSymptomsTitle}>Selected Symptoms:</Text>
            <View style={styles.selectedSymptomsList}>
              {selectedSymptoms.map(symptom => (
                <View key={symptom.id} style={styles.selectedSymptomItem}>
                  <Text style={styles.selectedSymptomText}>{symptom.name}</Text>
                  <TouchableOpacity
                    onPress={() => removeSymptom(symptom.id)}
                    style={styles.removeSymptomButton}
                  >
                    <IconSymbol name="xmark" size={16} color={MedicalColors.accent[600]} />
                  </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
        )}

        <ScrollView style={styles.symptomCategoriesContainer}>
          {SYMPTOM_CATEGORIES.map(category => (
            <View key={category.id} style={styles.categoryContainer}>
              <View style={styles.categoryHeader}>
                <IconSymbol name={category.icon} size={24} color={category.color} />
                <Text style={styles.categoryTitle}>{category.name}</Text>
              </View>
      <View style={styles.symptomsGrid}>
                {category.symptoms.map(symptom => {
                  const isSelected = selectedSymptoms.some(s => s.name === symptom);
                  return (
          <TouchableOpacity
            key={symptom}
            style={[
                        styles.symptomButton,
                        isSelected && styles.symptomButtonSelected
            ]}
                      onPress={() => !isSelected && handleSymptomSelect(symptom, category.id)}
                      disabled={isSelected}
          >
            <Text style={[
                        styles.symptomButtonText,
                        isSelected && styles.symptomButtonTextSelected
            ]}>
              {symptom}
            </Text>
                      {isSelected && (
                        <IconSymbol name="checkmark" size={16} color="#FFFFFF" />
                      )}
          </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>
      </Card>
    </Animated.View>
  );

  const renderSymptomDetails = () => (
    <Animated.View entering={FadeIn.duration(500)}>
      <Card variant="default" padding="large" style={styles.stepCard}>
        <View style={styles.stepHeader}>
          <IconSymbol name="doc.text.magnifyingglass" size={32} color={MedicalColors.primary[600]} />
          <Text style={styles.stepTitle}>Symptom Details</Text>
          <Text style={styles.stepDescription}>
            Review and add details about your symptoms
          </Text>
      </View>
      
        {selectedSymptoms.length === 0 ? (
          <View style={styles.noSymptomsContainer}>
            <Text style={styles.noSymptomsText}>No symptoms selected yet</Text>
            <Button
              title="Go Back to Select Symptoms"
              onPress={() => setCurrentStep(1)}
              variant="outline"
              size="medium"
              icon="arrow.left"
              iconPosition="left"
        />
      </View>
        ) : (
          <ScrollView style={styles.symptomDetailsContainer}>
            {selectedSymptoms.map((symptom, index) => (
              <View key={symptom.id} style={styles.symptomDetailCard}>
                <View style={styles.symptomDetailHeader}>
                  <Text style={styles.symptomDetailTitle}>{symptom.name}</Text>
                  <View style={styles.symptomDetailBadge}>
                    <Text style={styles.symptomDetailBadgeText}>
                      {SYMPTOM_CATEGORIES.find(c => c.id === symptom.category)?.name}
                    </Text>
    </View>
                </View>
                
                <View style={styles.symptomDetailContent}>
                  <View style={styles.severityContainer}>
                    <Text style={styles.severityLabel}>Severity: {symptom.severity}/10</Text>
                    <View style={styles.severityBar}>
                      <View 
              style={[
                          styles.severityFill, 
                          { 
                            width: `${(symptom.severity / 10) * 100}%`,
                            backgroundColor: symptom.severity <= 3 ? MedicalColors.success[500] :
                                           symptom.severity <= 7 ? MedicalColors.warning[500] :
                                           MedicalColors.error[500]
                          }
                        ]} 
                      />
        </View>
      </View>
      
                  <Text style={styles.symptomDetailInfo}>
                    <Text style={styles.symptomDetailLabel}>Onset: </Text>
                    {symptom.onset || 'Not specified'}
                </Text>
                  
                  <Text style={styles.symptomDetailInfo}>
                    <Text style={styles.symptomDetailLabel}>Pattern: </Text>
                    {symptom.pattern || 'Not specified'}
              </Text>
                  
                  {symptom.triggers.length > 0 && (
                    <Text style={styles.symptomDetailInfo}>
                      <Text style={styles.symptomDetailLabel}>Triggers: </Text>
                      {symptom.triggers.join(', ')}
                    </Text>
                  )}
                  
                  {symptom.relief.length > 0 && (
                    <Text style={styles.symptomDetailInfo}>
                      <Text style={styles.symptomDetailLabel}>Relief: </Text>
                      {symptom.relief.join(', ')}
                    </Text>
                  )}
        </View>
      </View>
            ))}
          </ScrollView>
        )}
      </Card>
    </Animated.View>
  );

  const renderAdditionalInfo = () => (
    <Animated.View entering={FadeIn.duration(500)}>
      <Card variant="default" padding="large" style={styles.stepCard}>
        <View style={styles.stepHeader}>
          <IconSymbol name="note.text" size={32} color={MedicalColors.primary[600]} />
          <Text style={styles.stepTitle}>Additional Information</Text>
          <Text style={styles.stepDescription}>
            Any other relevant details about your symptoms or concerns
          </Text>
          </View>

        <Input
          label="Additional Notes"
          placeholder="Share any other details that might be relevant to your condition..."
          value={additionalInfo}
          onChangeText={setAdditionalInfo}
          multiline
          style={styles.textArea}
        />
      </Card>
    </Animated.View>
  );

  const renderAnalysis = () => (
    <Animated.View entering={FadeIn.duration(500)}>
      <Card variant="default" padding="large" style={styles.stepCard}>
        <View style={styles.stepHeader}>
          <IconSymbol name="brain.head.profile" size={32} color={MedicalColors.primary[600]} />
          <Text style={styles.stepTitle}>AI Analysis</Text>
          <Text style={styles.stepDescription}>
            Our AI will analyze your symptoms and provide preliminary insights
          </Text>
        </View>
        
        <View style={styles.analysisContainer}>
          <View style={styles.analysisStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{selectedSymptoms.length}</Text>
              <Text style={styles.statLabel}>Symptoms</Text>
      </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {selectedSymptoms.length > 0 ? Math.round(selectedSymptoms.reduce((sum, s) => sum + s.severity, 0) / selectedSymptoms.length) : 0}
              </Text>
              <Text style={styles.statLabel}>Avg Severity</Text>
        </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {new Set(selectedSymptoms.map(s => s.category)).size}
        </Text>
              <Text style={styles.statLabel}>Body Systems</Text>
            </View>
      </View>

          <Button
            title={isAnalyzing ? 'Analyzing Symptoms...' : 'Start AI Analysis'}
            onPress={handleAnalyze}
            variant="primary"
            size="large"
            icon={isAnalyzing ? undefined : "brain.head.profile"}
            iconPosition="right"
            loading={isAnalyzing}
            disabled={isAnalyzing || selectedSymptoms.length === 0}
            fullWidth
            style={styles.analyzeButton}
          />

          {selectedSymptoms.length === 0 && (
            <Text style={styles.warningText}>Please select at least one symptom to analyze</Text>
          )}
        </View>
      </Card>
        </Animated.View>
  );

  const renderSymptomDetailModal = () => {
    if (!currentSymptomDetail) return null;

    const { symptom, currentQuestion, answers } = currentSymptomDetail;
    const question = SYMPTOM_QUESTIONS[currentQuestion];

    return (
      <Modal
        visible={showSymptomDetail}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowSymptomDetail(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{symptom.name}</Text>
        <TouchableOpacity
              onPress={() => setShowSymptomDetail(false)}
              style={styles.modalCloseButton}
        >
              <IconSymbol name="xmark" size={24} color={MedicalColors.neutral[600]} />
        </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.questionText}>{question.question}</Text>
            
            {question.type === 'single_choice' && (
              <View style={styles.optionsContainer}>
                {question.options?.map(option => (
        <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      answers[question.id] === option && styles.optionButtonSelected
                    ]}
                    onPress={() => {
                      const newAnswers = { ...answers, [question.id]: option };
                      setCurrentSymptomDetail({ ...currentSymptomDetail, answers: newAnswers });
                    }}
        >
                    <Text style={[
                      styles.optionText,
                      answers[question.id] === option && styles.optionTextSelected
                    ]}>
                      {option}
          </Text>
        </TouchableOpacity>
                ))}
      </View>
            )}

            {question.type === 'scale' && (
              <View style={styles.scaleContainer}>
                <View style={styles.scaleLabels}>
                  <Text style={styles.scaleLabel}>Mild</Text>
                  <Text style={styles.scaleLabel}>Moderate</Text>
                  <Text style={styles.scaleLabel}>Severe</Text>
                </View>
                <View style={styles.scaleButtons}>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(value => (
                  <TouchableOpacity
                      key={value}
                    style={[
                        styles.scaleButton,
                        answers[question.id] === value && styles.scaleButtonSelected
                    ]}
                      onPress={() => {
                        const newAnswers = { ...answers, [question.id]: value };
                        setCurrentSymptomDetail({ ...currentSymptomDetail, answers: newAnswers });
                      }}
                  >
                    <Text style={[
                        styles.scaleButtonText,
                        answers[question.id] === value && styles.scaleButtonTextSelected
                    ]}>
                        {value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            )}

            {question.type === 'multiple_choice' && (
              <View style={styles.optionsContainer}>
                {question.options?.map(option => {
                  const isSelected = answers[question.id]?.includes(option);
                  return (
                  <TouchableOpacity
                      key={option}
                    style={[
                        styles.optionButton,
                        isSelected && styles.optionButtonSelected
                    ]}
                      onPress={() => {
                        const currentSelected = answers[question.id] || [];
                        const newSelected = isSelected
                          ? currentSelected.filter((item: string) => item !== option)
                          : [...currentSelected, option];
                        const newAnswers = { ...answers, [question.id]: newSelected };
                        setCurrentSymptomDetail({ ...currentSymptomDetail, answers: newAnswers });
                      }}
                  >
                    <Text style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected
                    ]}>
                        {option}
                    </Text>
                  </TouchableOpacity>
                  );
                })}
              </View>
            )}
            </View>
            
          <View style={styles.modalFooter}>
            {currentQuestion > 0 && (
              <Button
                title="Previous"
                onPress={() => {
                  setCurrentSymptomDetail({
                    ...currentSymptomDetail,
                    currentQuestion: currentQuestion - 1
                  });
                }}
                variant="outline"
                size="medium"
                icon="chevron.left"
                iconPosition="left"
              />
            )}
            
            <Button
              title={currentQuestion === SYMPTOM_QUESTIONS.length - 1 ? 'Complete' : 'Next'}
              onPress={() => {
                if (currentQuestion === SYMPTOM_QUESTIONS.length - 1) {
                  // Complete symptom detail
                  const completedSymptom: SelectedSymptom = {
                    ...symptom,
                    severity: answers.severity || 5,
                    onset: answers.onset || '',
                    pattern: answers.pattern || '',
                    triggers: answers.triggers || [],
                    relief: answers.relief || []
                  };
                  handleSymptomDetailComplete(completedSymptom);
                } else {
                  setCurrentSymptomDetail({
                    ...currentSymptomDetail,
                    currentQuestion: currentQuestion + 1
                  });
                }
              }}
              variant="primary"
              size="medium"
              icon={currentQuestion === SYMPTOM_QUESTIONS.length - 1 ? "checkmark" : "chevron.right"}
              iconPosition="right"
              style={{ marginLeft: 'auto' }}
              />
            </View>
        </View>
      </Modal>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderChiefComplaint();
      case 1:
        return renderSymptomSelection();
      case 2:
        return renderSymptomDetails();
      case 3:
        return renderAdditionalInfo();
      case 4:
        return renderAnalysis();
      default:
        return null;
    }
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
          <Text style={styles.headerTitle}>AI Symptom Checker</Text>
          <View style={styles.headerSpacer} />
        </View>

        {renderProgressBar()}

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
              >
          {renderStepContent()}
        </ScrollView>

        {currentStep < steps.length - 1 && (
          <View style={styles.navigationButtons}>
            {currentStep > 0 && (
              <Button
                title="Previous"
                onPress={prevStep}
                variant="outline"
                size="medium"
                icon="chevron.left"
                iconPosition="left"
                style={styles.navButton}
              />
            )}
            <Button
              title="Next"
              onPress={nextStep}
              variant="primary"
              size="medium"
              icon="chevron.right"
              iconPosition="right"
              style={[styles.navButton, { marginLeft: 'auto' }]}
              disabled={currentStep === 0 && !chiefComplaint.trim()}
            />
            </View>
        )}
    </SafeAreaView>

      {renderSymptomDetailModal()}
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
  progressContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: MedicalColors.neutral[200],
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: MedicalColors.primary[600],
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  stepCard: {
    marginBottom: 20,
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    color: MedicalColors.neutral[600],
    textAlign: 'center',
    lineHeight: 24,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  exampleSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: MedicalColors.neutral[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: MedicalColors.neutral[200],
  },
  exampleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: MedicalColors.neutral[700],
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    lineHeight: 20,
    marginBottom: 4,
  },
  selectedSymptomsContainer: {
    marginBottom: 20,
  },
  selectedSymptomsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
    marginBottom: 12,
  },
  selectedSymptomsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedSymptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: MedicalColors.primary[600],
    borderRadius: 16,
    gap: 6,
  },
  selectedSymptomText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  removeSymptomButton: {
    padding: 2,
  },
  symptomCategoriesContainer: {
    maxHeight: 400,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  symptomButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: MedicalColors.neutral[100],
    borderWidth: 1,
    borderColor: MedicalColors.neutral[200],
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  symptomButtonSelected: {
    backgroundColor: MedicalColors.primary[600],
    borderColor: MedicalColors.primary[600],
  },
  symptomButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: MedicalColors.neutral[700],
  },
  symptomButtonTextSelected: {
    color: '#FFFFFF',
  },
  noSymptomsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 16,
  },
  noSymptomsText: {
    fontSize: 16,
    color: MedicalColors.neutral[600],
    textAlign: 'center',
  },
  symptomDetailsContainer: {
    maxHeight: 400,
  },
  symptomDetailCard: {
    backgroundColor: MedicalColors.neutral[50],
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: MedicalColors.neutral[200],
  },
  symptomDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  symptomDetailTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
  },
  symptomDetailBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: MedicalColors.primary[600],
    borderRadius: 8,
  },
  symptomDetailBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  symptomDetailContent: {
    gap: 8,
  },
  severityContainer: {
    marginBottom: 8,
  },
  severityLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: MedicalColors.neutral[700],
    marginBottom: 4,
  },
  severityBar: {
    height: 6,
    backgroundColor: MedicalColors.neutral[200],
    borderRadius: 3,
    overflow: 'hidden',
  },
  severityFill: {
    height: '100%',
    borderRadius: 3,
  },
  symptomDetailInfo: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    lineHeight: 20,
  },
  symptomDetailLabel: {
    fontWeight: '600',
    color: MedicalColors.neutral[700],
  },
  analysisContainer: {
    gap: 24,
  },
  analysisStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: MedicalColors.neutral[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: MedicalColors.neutral[200],
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: MedicalColors.primary[600],
  },
  statLabel: {
    fontSize: 12,
    color: MedicalColors.neutral[600],
    marginTop: 4,
  },
  analyzeButton: {
    shadowColor: MedicalColors.primary[500],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  warningText: {
    fontSize: 14,
    color: MedicalColors.warning[600],
    textAlign: 'center',
    fontStyle: 'italic',
  },
  navigationButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: MedicalColors.neutral[200],
  },
  navButton: {
    minWidth: 100,
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
    paddingTop: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
    marginBottom: 20,
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: MedicalColors.neutral[100],
    borderWidth: 1,
    borderColor: MedicalColors.neutral[200],
    borderRadius: 12,
  },
  optionButtonSelected: {
    backgroundColor: MedicalColors.primary[600],
    borderColor: MedicalColors.primary[600],
  },
  optionText: {
    fontSize: 16,
    color: MedicalColors.neutral[700],
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#FFFFFF',
  },
  scaleContainer: {
    gap: 16,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  scaleLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: MedicalColors.neutral[600],
  },
  scaleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  scaleButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: MedicalColors.neutral[100],
    borderWidth: 1,
    borderColor: MedicalColors.neutral[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  scaleButtonSelected: {
    backgroundColor: MedicalColors.primary[600],
    borderColor: MedicalColors.primary[600],
  },
  scaleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: MedicalColors.neutral[700],
  },
  scaleButtonTextSelected: {
    color: '#FFFFFF',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: MedicalColors.neutral[200],
  },
});