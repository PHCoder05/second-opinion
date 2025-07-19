import { Button, Card, IconSymbol, Input } from '@/components/ui';
import { MedicalColors } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

// Medical History Categories following standard protocols
const MEDICAL_HISTORY_CATEGORIES = [
  {
    id: 'cardiovascular',
    name: 'Cardiovascular',
    icon: 'favorite',
    conditions: [
      'Hypertension', 'Heart Disease', 'Arrhythmia', 'Heart Attack', 'Stroke', 
      'High Cholesterol', 'Heart Murmur', 'Peripheral Artery Disease'
    ]
  },
  {
    id: 'respiratory',
    name: 'Respiratory',
    icon: 'air',
    conditions: [
      'Asthma', 'COPD', 'Pneumonia', 'Bronchitis', 'Sleep Apnea', 
      'Tuberculosis', 'Pulmonary Embolism', 'Lung Cancer'
    ]
  },
  {
    id: 'endocrine',
    name: 'Endocrine',
    icon: 'water_drop',
    conditions: [
      'Diabetes Type 1', 'Diabetes Type 2', 'Thyroid Disease', 'Hypothyroidism', 
      'Hyperthyroidism', 'Adrenal Disorders', 'Hormone Disorders'
    ]
  },
  {
    id: 'gastrointestinal',
    name: 'Gastrointestinal',
    icon: 'stomach',
    conditions: [
      'GERD', 'Peptic Ulcers', 'IBD', 'IBS', 'Crohn\'s Disease', 
      'Ulcerative Colitis', 'Hepatitis', 'Gallbladder Disease'
    ]
  },
  {
    id: 'neurological',
    name: 'Neurological',
    icon: 'psychology',
    conditions: [
      'Migraine', 'Epilepsy', 'Parkinson\'s Disease', 'Multiple Sclerosis', 
      'Alzheimer\'s', 'Neuropathy', 'Seizure Disorders'
    ]
  },
  {
    id: 'musculoskeletal',
    name: 'Musculoskeletal',
    icon: 'figure.walk',
    conditions: [
      'Arthritis', 'Osteoporosis', 'Back Pain', 'Joint Pain', 'Fibromyalgia', 
      'Tendonitis', 'Fractures', 'Muscle Disorders'
    ]
  },
  {
    id: 'mental_health',
    name: 'Mental Health',
    icon: 'brain',
    conditions: [
      'Depression', 'Anxiety', 'Bipolar Disorder', 'PTSD', 'OCD', 
      'Panic Disorder', 'ADHD', 'Eating Disorders'
    ]
  },
  {
    id: 'reproductive',
    name: 'Reproductive',
    icon: 'person.fill',
    conditions: [
      'PCOS', 'Endometriosis', 'Infertility', 'Menstrual Disorders', 
      'Prostate Issues', 'Erectile Dysfunction', 'Sexually Transmitted Infections'
    ]
  }
];

// System Review Questions (Review of Systems - ROS)
const SYSTEM_REVIEW_QUESTIONS = [
  {
    system: 'General',
    questions: [
      'Recent weight loss or gain',
      'Fever or chills',
      'Night sweats',
      'Fatigue or weakness',
      'Loss of appetite'
    ]
  },
  {
    system: 'Cardiovascular',
    questions: [
      'Chest pain or pressure',
      'Shortness of breath',
      'Palpitations',
      'Leg swelling',
      'Dizziness or fainting'
    ]
  },
  {
    system: 'Respiratory',
    questions: [
      'Cough',
      'Sputum production',
      'Wheezing',
      'Difficulty breathing',
      'Chest tightness'
    ]
  },
  {
    system: 'Neurological',
    questions: [
      'Headaches',
      'Seizures',
      'Numbness or tingling',
      'Memory problems',
      'Vision changes'
    ]
  },
  {
    system: 'Gastrointestinal',
    questions: [
      'Nausea or vomiting',
      'Abdominal pain',
      'Changes in bowel habits',
      'Blood in stool',
      'Heartburn'
    ]
  },
  {
    system: 'Genitourinary',
    questions: [
      'Urinary frequency',
      'Burning with urination',
      'Blood in urine',
      'Difficulty urinating',
      'Urinary incontinence'
    ]
  }
];

interface MedicalCondition {
  id: string;
  name: string;
  selected: boolean;
  year?: string;
  notes?: string;
}

interface SystemReviewItem {
  system: string;
  question: string;
  answer: 'yes' | 'no' | 'unknown';
  details?: string;
}

function ComprehensiveHealthAssessment() {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(0);
  const [medicalConditions, setMedicalConditions] = useState<MedicalCondition[]>([]);
  const [systemReview, setSystemReview] = useState<SystemReviewItem[]>([]);
  const [familyHistory, setFamilyHistory] = useState('');
  const [surgicalHistory, setSurgicalHistory] = useState('');
  const [socialHistory, setSocialHistory] = useState({
    smoking: false,
    smokingDetails: '',
    alcohol: false,
    alcoholDetails: '',
    drugs: false,
    drugDetails: '',
    occupation: '',
    exercise: '',
    diet: ''
  });
  const [currentMedications, setCurrentMedications] = useState('');
  const [allergies, setAllergies] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sections = ['Medical History', 'System Review', 'Family History', 'Social History', 'Medications & Allergies'];

  useEffect(() => {
    // Initialize medical conditions
    const conditions: MedicalCondition[] = [];
    MEDICAL_HISTORY_CATEGORIES.forEach(category => {
      category.conditions.forEach(condition => {
        conditions.push({
          id: `${category.id}-${condition}`,
          name: condition,
          selected: false
        });
      });
    });
    setMedicalConditions(conditions);

    // Initialize system review
    const reviewItems: SystemReviewItem[] = [];
    SYSTEM_REVIEW_QUESTIONS.forEach(system => {
      system.questions.forEach(question => {
        reviewItems.push({
          system: system.system,
          question,
          answer: 'unknown'
        });
      });
    });
    setSystemReview(reviewItems);
  }, []);

  const toggleMedicalCondition = (id: string) => {
    setMedicalConditions(prev =>
      prev.map(condition =>
        condition.id === id
          ? { ...condition, selected: !condition.selected }
          : condition
      )
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const updateSystemReview = (system: string, question: string, answer: 'yes' | 'no' | 'unknown') => {
    setSystemReview(prev =>
      prev.map(item =>
        item.system === system && item.question === question
          ? { ...item, answer }
          : item
      )
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Assessment Complete',
        'Your comprehensive health assessment has been submitted. This detailed information will help our medical team provide you with the most accurate second opinion.',
        [
          { 
            text: 'Continue to App', 
            onPress: () => router.push('/(tabs)')
          }
        ]
      );
    }, 2000);
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${((currentSection + 1) / sections.length) * 100}%` }
          ]} 
        />
      </View>
      <Text style={styles.progressText}>
        {sections[currentSection]} ({currentSection + 1} of {sections.length})
      </Text>
    </View>
  );

  const renderMedicalHistory = () => (
    <Animated.View entering={FadeIn.duration(500)}>
      <Card variant="default" padding="large" style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <IconSymbol name="favorite" size={32} color={MedicalColors.primary[600]} />
          <Text style={styles.sectionTitle}>Medical History</Text>
          <Text style={styles.sectionDescription}>
            Select any medical conditions you have been diagnosed with
          </Text>
        </View>

        {MEDICAL_HISTORY_CATEGORIES.map(category => (
          <View key={category.id} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <IconSymbol name={category.icon} size={24} color={MedicalColors.primary[600]} />
              <Text style={styles.categoryTitle}>{category.name}</Text>
            </View>
            <View style={styles.conditionsGrid}>
              {category.conditions.map(condition => {
                const conditionId = `${category.id}-${condition}`;
                const isSelected = medicalConditions.find(c => c.id === conditionId)?.selected || false;
                
                return (
                  <TouchableOpacity
                    key={conditionId}
                    style={[
                      styles.conditionItem,
                      isSelected && styles.conditionItemSelected
                    ]}
                    onPress={() => toggleMedicalCondition(conditionId)}
                  >
                    <Text style={[
                      styles.conditionText,
                      isSelected && styles.conditionTextSelected
                    ]}>
                      {condition}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </Card>
    </Animated.View>
  );

  const renderSystemReview = () => (
    <Animated.View entering={FadeIn.duration(500)}>
      <Card variant="default" padding="large" style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <IconSymbol name="list.bullet.clipboard" size={32} color={MedicalColors.primary[600]} />
          <Text style={styles.sectionTitle}>System Review</Text>
          <Text style={styles.sectionDescription}>
            Review of systems - Please indicate if you have experienced any of these symptoms
          </Text>
        </View>

        {SYSTEM_REVIEW_QUESTIONS.map(systemGroup => (
          <View key={systemGroup.system} style={styles.systemGroup}>
            <Text style={styles.systemTitle}>{systemGroup.system}</Text>
            {systemGroup.questions.map(question => {
              const item = systemReview.find(
                r => r.system === systemGroup.system && r.question === question
              );
              
              return (
                <View key={question} style={styles.questionRow}>
                  <Text style={styles.questionText}>{question}</Text>
                  <View style={styles.answerButtons}>
                    {['yes', 'no', 'unknown'].map(answer => (
                      <TouchableOpacity
                        key={answer}
                        style={[
                          styles.answerButton,
                          item?.answer === answer && styles.answerButtonSelected
                        ]}
                        onPress={() => updateSystemReview(systemGroup.system, question, answer as any)}
                      >
                        <Text style={[
                          styles.answerButtonText,
                          item?.answer === answer && styles.answerButtonTextSelected
                        ]}>
                          {answer.charAt(0).toUpperCase() + answer.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        ))}
      </Card>
    </Animated.View>
  );

  const renderFamilyHistory = () => (
    <Animated.View entering={FadeIn.duration(500)}>
      <Card variant="default" padding="large" style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <IconSymbol name="person.3.fill" size={32} color={MedicalColors.primary[600]} />
          <Text style={styles.sectionTitle}>Family History</Text>
          <Text style={styles.sectionDescription}>
            Tell us about your family's medical history
          </Text>
        </View>

        <Input
          label="Family Medical History"
          placeholder="List any significant medical conditions in your family (parents, siblings, grandparents)..."
          value={familyHistory}
          onChangeText={setFamilyHistory}
          multiline
          style={styles.textArea}
        />

        <Input
          label="Surgical History"
          placeholder="List any surgeries or procedures you've had..."
          value={surgicalHistory}
          onChangeText={setSurgicalHistory}
          multiline
          style={styles.textArea}
        />
      </Card>
    </Animated.View>
  );

  const renderSocialHistory = () => (
    <Animated.View entering={FadeIn.duration(500)}>
      <Card variant="default" padding="large" style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <IconSymbol name="person.fill" size={32} color={MedicalColors.primary[600]} />
          <Text style={styles.sectionTitle}>Social History</Text>
          <Text style={styles.sectionDescription}>
            Information about your lifestyle and habits
          </Text>
        </View>

        <View style={styles.socialSection}>
          <View style={styles.socialItem}>
            <View style={styles.socialItemHeader}>
              <Text style={styles.socialItemTitle}>Smoking</Text>
              <Switch
                value={socialHistory.smoking}
                onValueChange={(value) => setSocialHistory(prev => ({ ...prev, smoking: value }))}
                trackColor={{ false: MedicalColors.neutral[200], true: MedicalColors.primary[200] }}
                thumbColor={socialHistory.smoking ? MedicalColors.primary[600] : MedicalColors.neutral[400]}
              />
            </View>
            {socialHistory.smoking && (
              <Input
                placeholder="Details about smoking (packs per day, duration, etc.)"
                value={socialHistory.smokingDetails}
                onChangeText={(text) => setSocialHistory(prev => ({ ...prev, smokingDetails: text }))}
                style={styles.detailsInput}
              />
            )}
          </View>

          <View style={styles.socialItem}>
            <View style={styles.socialItemHeader}>
              <Text style={styles.socialItemTitle}>Alcohol</Text>
              <Switch
                value={socialHistory.alcohol}
                onValueChange={(value) => setSocialHistory(prev => ({ ...prev, alcohol: value }))}
                trackColor={{ false: MedicalColors.neutral[200], true: MedicalColors.primary[200] }}
                thumbColor={socialHistory.alcohol ? MedicalColors.primary[600] : MedicalColors.neutral[400]}
              />
            </View>
            {socialHistory.alcohol && (
              <Input
                placeholder="Details about alcohol consumption (drinks per week, type, etc.)"
                value={socialHistory.alcoholDetails}
                onChangeText={(text) => setSocialHistory(prev => ({ ...prev, alcoholDetails: text }))}
                style={styles.detailsInput}
              />
            )}
          </View>

          <Input
            label="Occupation"
            placeholder="What is your current occupation?"
            value={socialHistory.occupation}
            onChangeText={(text) => setSocialHistory(prev => ({ ...prev, occupation: text }))}
          />

          <Input
            label="Exercise & Physical Activity"
            placeholder="Describe your exercise routine and activity level..."
            value={socialHistory.exercise}
            onChangeText={(text) => setSocialHistory(prev => ({ ...prev, exercise: text }))}
            multiline
            style={styles.textArea}
          />
        </View>
      </Card>
    </Animated.View>
  );

  const renderMedicationsAndAllergies = () => (
    <Animated.View entering={FadeIn.duration(500)}>
      <Card variant="default" padding="large" style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <IconSymbol name="medication" size={32} color={MedicalColors.primary[600]} />
          <Text style={styles.sectionTitle}>Medications & Allergies</Text>
          <Text style={styles.sectionDescription}>
            Complete medication list and allergy information
          </Text>
        </View>

        <Input
          label="Current Medications"
          placeholder="List all medications you're currently taking (include dosage and frequency)..."
          value={currentMedications}
          onChangeText={setCurrentMedications}
          multiline
          style={styles.textArea}
        />

        <Input
          label="Allergies & Reactions"
          placeholder="List any drug allergies, food allergies, or environmental allergies..."
          value={allergies}
          onChangeText={setAllergies}
          multiline
          style={styles.textArea}
        />

        <Button
          title={isSubmitting ? 'Submitting Assessment...' : 'Submit Health Assessment'}
          onPress={handleSubmit}
          variant="primary"
          size="large"
          icon={isSubmitting ? undefined : "checkmark.circle.fill"}
          iconPosition="right"
          loading={isSubmitting}
          disabled={isSubmitting}
          fullWidth
          style={styles.submitButton}
        />
      </Card>
    </Animated.View>
  );

  const renderSectionContent = () => {
    switch (currentSection) {
      case 0:
        return renderMedicalHistory();
      case 1:
        return renderSystemReview();
      case 2:
        return renderFamilyHistory();
      case 3:
        return renderSocialHistory();
      case 4:
        return renderMedicationsAndAllergies();
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
          <Text style={styles.headerTitle}>Health Assessment</Text>
          <View style={styles.headerSpacer} />
        </View>

        {renderProgressBar()}

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {renderSectionContent()}
        </ScrollView>

        {currentSection < sections.length - 1 && (
          <View style={styles.navigationButtons}>
            {currentSection > 0 && (
              <Button
                title="Previous"
                onPress={prevSection}
                variant="outline"
                size="medium"
                icon="chevron.left"
                iconPosition="left"
                style={styles.navButton}
              />
            )}
            <Button
              title="Next Section"
              onPress={nextSection}
              variant="primary"
              size="medium"
              icon="chevron.right"
              iconPosition="right"
              style={[styles.navButton, { marginLeft: 'auto' }]}
            />
          </View>
        )}
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
  sectionCard: {
    marginBottom: 20,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionDescription: {
    fontSize: 16,
    color: MedicalColors.neutral[600],
    textAlign: 'center',
    lineHeight: 24,
  },
  categorySection: {
    marginBottom: 24,
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
  conditionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  conditionItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: MedicalColors.neutral[100],
    borderWidth: 1,
    borderColor: MedicalColors.neutral[200],
    borderRadius: 16,
    marginBottom: 4,
  },
  conditionItemSelected: {
    backgroundColor: MedicalColors.primary[600],
    borderColor: MedicalColors.primary[600],
  },
  conditionText: {
    fontSize: 14,
    fontWeight: '500',
    color: MedicalColors.neutral[700],
  },
  conditionTextSelected: {
    color: '#FFFFFF',
  },
  systemGroup: {
    marginBottom: 24,
  },
  systemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
    marginBottom: 12,
  },
  questionRow: {
    marginBottom: 16,
  },
  questionText: {
    fontSize: 16,
    color: MedicalColors.neutral[800],
    marginBottom: 8,
    lineHeight: 22,
  },
  answerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  answerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: MedicalColors.neutral[100],
    borderWidth: 1,
    borderColor: MedicalColors.neutral[200],
    borderRadius: 12,
  },
  answerButtonSelected: {
    backgroundColor: MedicalColors.primary[600],
    borderColor: MedicalColors.primary[600],
  },
  answerButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: MedicalColors.neutral[700],
  },
  answerButtonTextSelected: {
    color: '#FFFFFF',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  socialSection: {
    gap: 20,
  },
  socialItem: {
    marginBottom: 16,
  },
  socialItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  socialItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
  },
  detailsInput: {
    marginTop: 8,
  },
  submitButton: {
    marginTop: 24,
    shadowColor: MedicalColors.primary[500],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
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
});

// Default export for Expo Router
export default function ComprehensiveHealthAssessmentScreen() {
  return (
    <ComprehensiveHealthAssessment />
  );
}