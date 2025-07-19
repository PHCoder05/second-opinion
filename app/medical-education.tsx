import { Button, Card, IconSymbol } from '@/components/ui';
import { MedicalColors } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

// Educational content categories
const EDUCATION_CATEGORIES = [
  {
    id: 'understanding_diagnosis',
    title: 'Understanding Your Diagnosis',
    icon: 'psychology',
    color: MedicalColors.primary[600],
    description: 'Learn about your condition in simple terms',
    topics: [
      'What is your condition?',
      'How it affects your body',
      'Why it developed',
      'Common symptoms explained',
      'Progression and outlook'
    ]
  },
  {
    id: 'treatment_options',
    title: 'Treatment Options',
    icon: 'medication',
    color: MedicalColors.secondary[600],
    description: 'Comprehensive overview of available treatments',
    topics: [
      'First-line treatments',
      'Alternative approaches',
      'How treatments work',
      'Expected outcomes',
      'Potential side effects'
    ]
  },
  {
    id: 'test_results',
    title: 'Understanding Test Results',
    icon: 'chart.line.uptrend.xyaxis',
    color: MedicalColors.accent[600],
    description: 'Decode your medical test results',
    topics: [
      'Lab values explained',
      'Imaging findings',
      'Normal vs abnormal ranges',
      'What results mean for you',
      'Follow-up testing needs'
    ]
  },
  {
    id: 'lifestyle_management',
    title: 'Lifestyle & Self-Care',
    icon: 'figure.walk',
    color: MedicalColors.success[600],
    description: 'Practical tips for managing your health',
    topics: [
      'Diet and nutrition',
      'Exercise recommendations',
      'Stress management',
      'Sleep hygiene',
      'Preventive measures'
        ]
      },
  {
    id: 'medication_guide',
    title: 'Medication Guide',
    icon: 'medical_services',
    color: MedicalColors.warning[600],
    description: 'Everything you need to know about your medications',
    topics: [
      'How medications work',
      'Proper dosing and timing',
      'Side effects to watch for',
      'Drug interactions',
      'Adherence strategies'
        ]
      },
  {
    id: 'when_to_seek_help',
    title: 'When to Seek Help',
    icon: 'exclamationmark.triangle',
    color: MedicalColors.error[600],
    description: 'Know when to contact your healthcare provider',
    topics: [
      'Warning signs to watch for',
      'Emergency situations',
      'When to call your doctor',
      'Follow-up schedule',
      'Emergency contacts'
    ]
  }
];

// Sample educational content for a specific condition
const SAMPLE_CONTENT = {
  condition: 'Hypertension (High Blood Pressure)',
  overview: 'High blood pressure is a common condition where the blood pushes against your artery walls with too much force. Think of it like water flowing through a garden hose - when the pressure is too high, it can damage the hose over time.',
      causes: [
    'Family history of high blood pressure',
    'Being overweight or obese',
    'Lack of physical activity',
    'Too much salt in your diet',
    'Drinking too much alcohol',
    'Smoking',
    'Stress',
    'Age (risk increases as you get older)'
      ],
      symptoms: [
    'Often called "silent killer" - many people have no symptoms',
    'Headaches (especially in the morning)',
    'Dizziness or lightheadedness',
    'Chest pain',
        'Shortness of breath',
        'Nosebleeds (rare)',
    'Blurred vision'
      ],
  treatment: {
    lifestyle: [
      'Reduce sodium intake to less than 2,300mg per day',
      'Exercise for at least 30 minutes most days',
      'Maintain a healthy weight',
      'Limit alcohol consumption',
      'Quit smoking',
      'Manage stress through relaxation techniques'
    ],
    medications: [
      {
        name: 'ACE Inhibitors',
        how_it_works: 'Relax blood vessels by blocking a hormone that narrows them',
        examples: 'Lisinopril, Enalapril',
        side_effects: 'Dry cough, dizziness, high potassium levels'
      },
      {
        name: 'Beta Blockers',
        how_it_works: 'Reduce heart rate and the force of heart contractions',
        examples: 'Metoprolol, Atenolol',
        side_effects: 'Fatigue, cold hands/feet, slow heart rate'
      },
      {
        name: 'Diuretics',
        how_it_works: 'Help kidneys remove excess salt and water',
        examples: 'Hydrochlorothiazide, Furosemide',
        side_effects: 'Increased urination, dizziness, low potassium'
      }
    ]
  },
  monitoring: {
    home_monitoring: 'Check blood pressure at home 2-3 times per week',
    target_values: 'Goal: Less than 130/80 mmHg for most adults',
    when_to_call: 'Contact doctor if readings consistently above 140/90 or below 90/60'
  }
};

const { width: screenWidth } = Dimensions.get('window');

function MedicalEducation() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showContentModal, setShowContentModal] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleCategoryPress = (category: any) => {
    setSelectedCategory(category.id);
    setShowContentModal(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const renderHeader = () => (
    <View style={styles.headerSection}>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Medical Education</Text>
        <Text style={styles.headerSubtitle}>
          Understanding your health empowers you to make informed decisions
        </Text>
      </View>
      
      <View style={styles.trustIndicators}>
        <View style={styles.trustIndicator}>
          <IconSymbol name="verified" size={24} color={MedicalColors.success[600]} />
          <Text style={styles.trustIndicatorText}>Evidence-Based</Text>
        </View>
        
        <View style={styles.trustIndicator}>
          <IconSymbol name="search" size={24} color={MedicalColors.info[600]} />
          <Text style={styles.trustIndicatorText}>Peer-Reviewed</Text>
        </View>
        
        <View style={styles.trustIndicator}>
          <IconSymbol name="person.2.fill" size={24} color={MedicalColors.primary[600]} />
          <Text style={styles.trustIndicatorText}>Doctor-Approved</Text>
        </View>
      </View>
    </View>
  );

  const renderEducationCategories = () => (
    <Card variant="default" padding="large" style={styles.categoriesCard}>
      <Text style={styles.sectionTitle}>Educational Topics</Text>
      <Text style={styles.sectionDescription}>
        Choose a topic to learn more about your health condition
      </Text>
      
      <View style={styles.categoriesGrid}>
        {EDUCATION_CATEGORIES.map((category, index) => (
          <Animated.View 
            key={category.id}
            entering={FadeInDown.delay(index * 100)}
            style={styles.categoryItem}
          >
            <TouchableOpacity
              style={styles.categoryButton}
              onPress={() => handleCategoryPress(category)}
            >
              <View style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
                <IconSymbol name={category.icon} size={32} color={category.color} />
              </View>
              
              <View style={styles.categoryContent}>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
                </View>
              
              <IconSymbol name="chevron.right" size={20} color={MedicalColors.neutral[400]} />
            </TouchableOpacity>
          </Animated.View>
              ))}
            </View>
    </Card>
  );

  const renderConditionOverview = () => (
    <Card variant="default" padding="large" style={styles.conditionCard}>
      <View style={styles.conditionHeader}>
        <IconSymbol name="favorite" size={32} color={MedicalColors.primary[600]} />
        <Text style={styles.conditionTitle}>Your Condition Explained</Text>
          </View>
      
      <Text style={styles.conditionName}>{SAMPLE_CONTENT.condition}</Text>
      <Text style={styles.conditionOverview}>{SAMPLE_CONTENT.overview}</Text>
      
      {/* Expandable sections */}
      <View style={styles.expandableSections}>
        {/* Causes Section */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('causes')}
        >
          <Text style={styles.sectionHeaderText}>Common Causes</Text>
          <IconSymbol 
            name={expandedSection === 'causes' ? 'chevron.up' : 'chevron.down'} 
            size={20} 
            color={MedicalColors.primary[600]} 
          />
        </TouchableOpacity>
        
        {expandedSection === 'causes' && (
          <Animated.View entering={FadeIn.duration(300)} style={styles.sectionContent}>
            {SAMPLE_CONTENT.causes.map((cause, index) => (
              <View key={index} style={styles.listItem}>
                <IconSymbol name="circle.fill" size={6} color={MedicalColors.primary[600]} />
                <Text style={styles.listItemText}>{cause}</Text>
              </View>
            ))}
          </Animated.View>
        )}
        
        {/* Symptoms Section */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('symptoms')}
        >
          <Text style={styles.sectionHeaderText}>Signs & Symptoms</Text>
          <IconSymbol 
            name={expandedSection === 'symptoms' ? 'chevron.up' : 'chevron.down'} 
            size={20} 
            color={MedicalColors.primary[600]} 
          />
        </TouchableOpacity>
        
        {expandedSection === 'symptoms' && (
          <Animated.View entering={FadeIn.duration(300)} style={styles.sectionContent}>
            {SAMPLE_CONTENT.symptoms.map((symptom, index) => (
              <View key={index} style={styles.listItem}>
                <IconSymbol name="circle.fill" size={6} color={MedicalColors.warning[600]} />
                <Text style={styles.listItemText}>{symptom}</Text>
          </View>
            ))}
          </Animated.View>
        )}
        
        {/* Treatment Section */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('treatment')}
        >
          <Text style={styles.sectionHeaderText}>Treatment Options</Text>
          <IconSymbol 
            name={expandedSection === 'treatment' ? 'chevron.up' : 'chevron.down'} 
            size={20} 
            color={MedicalColors.primary[600]} 
          />
        </TouchableOpacity>
        
        {expandedSection === 'treatment' && (
          <Animated.View entering={FadeIn.duration(300)} style={styles.sectionContent}>
            <Text style={styles.subsectionTitle}>Lifestyle Changes</Text>
            {SAMPLE_CONTENT.treatment.lifestyle.map((item, index) => (
                <View key={index} style={styles.listItem}>
                <IconSymbol name="checkmark.circle" size={16} color={MedicalColors.success[600]} />
                <Text style={styles.listItemText}>{item}</Text>
                </View>
              ))}
            
            <Text style={styles.subsectionTitle}>Medications</Text>
            {SAMPLE_CONTENT.treatment.medications.map((med, index) => (
              <View key={index} style={styles.medicationItem}>
                <Text style={styles.medicationName}>{med.name}</Text>
                <Text style={styles.medicationDescription}>{med.how_it_works}</Text>
                <Text style={styles.medicationExamples}>Examples: {med.examples}</Text>
                <Text style={styles.medicationSideEffects}>Side effects: {med.side_effects}</Text>
                </View>
              ))}
          </Animated.View>
        )}
            </View>
    </Card>
        );
      
  const renderActionButtons = () => (
    <View style={styles.actionButtonsContainer}>
      <Button
        title="Ask a Question"
        onPress={() => router.push('/assisted-help-flow')}
        variant="primary"
        size="large"
        icon="bubble.left.and.bubble.right"
        iconPosition="left"
        fullWidth
        style={styles.primaryActionButton}
      />
      
      <View style={styles.secondaryActions}>
        <Button
          title="Print Guide"
          onPress={() => {}}
          variant="outline"
          size="medium"
          icon="printer"
          iconPosition="left"
          style={styles.secondaryActionButton}
        />
        
        <Button
          title="Share Info"
          onPress={() => {}}
          variant="outline"
          size="medium"
          icon="square.and.arrow.up"
          iconPosition="left"
          style={styles.secondaryActionButton}
        />
            </View>
          </View>
        );
      
  const renderContentModal = () => {
    const category = EDUCATION_CATEGORIES.find(c => c.id === selectedCategory);
    if (!category) return null;

        return (
      <Modal
        visible={showContentModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowContentModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{category.title}</Text>
            <TouchableOpacity
              onPress={() => setShowContentModal(false)}
              style={styles.modalCloseButton}
            >
              <IconSymbol name="xmark" size={24} color={MedicalColors.neutral[600]} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>What You'll Learn</Text>
              <Text style={styles.modalSectionText}>{category.description}</Text>
            </View>
            
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Topics Covered</Text>
              {category.topics.map((topic, index) => (
                <View key={index} style={styles.topicItem}>
                  <IconSymbol name="checkmark.circle" size={16} color={category.color} />
                  <Text style={styles.topicText}>{topic}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Why This Matters</Text>
              <Text style={styles.modalSectionText}>
                Understanding your condition helps you make informed decisions about your health, 
                follow treatment plans more effectively, and recognize when to seek medical attention.
              </Text>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button
              title="Start Learning"
              onPress={() => {
                setShowContentModal(false);
                // Navigate to detailed content for this category
              }}
              variant="primary"
              size="large"
              icon="book.fill"
              iconPosition="right"
              fullWidth
            />
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
          <Text style={styles.headerTitle}>Medical Education</Text>
          <View style={styles.headerSpacer} />
        </View>
        
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
          <Animated.View entering={FadeInUp.duration(500)}>
            {renderHeader()}
        </Animated.View>

          {renderEducationCategories()}
          {renderConditionOverview()}
          {renderActionButtons()}

          <View style={styles.trustSection}>
            <Text style={styles.trustSectionTitle}>Our Commitment to Accuracy</Text>
            <Text style={styles.trustSectionText}>
              All educational content is reviewed by board-certified physicians and based on 
              current medical literature and established clinical guidelines.
            </Text>
            
            <View style={styles.sources}>
              <Text style={styles.sourcesTitle}>Sources:</Text>
              <Text style={styles.sourcesText}>• American Heart Association Guidelines</Text>
              <Text style={styles.sourcesText}>• Harrison's Principles of Internal Medicine</Text>
              <Text style={styles.sourcesText}>• UpToDate Clinical Decision Support</Text>
              <Text style={styles.sourcesText}>• Peer-reviewed medical journals</Text>
            </View>
          </View>
          </ScrollView>
        </SafeAreaView>

      {renderContentModal()}
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
  headerSection: {
    marginBottom: 24,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: MedicalColors.neutral[600],
    textAlign: 'center',
    lineHeight: 24,
  },
  trustIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  trustIndicator: {
    alignItems: 'center',
    gap: 8,
  },
  trustIndicatorText: {
    fontSize: 12,
    fontWeight: '600',
    color: MedicalColors.neutral[700],
  },
  categoriesCard: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 16,
    color: MedicalColors.neutral[600],
    marginBottom: 20,
    lineHeight: 24,
  },
  categoriesGrid: {
    gap: 16,
  },
  categoryItem: {
    marginBottom: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: MedicalColors.neutral[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: MedicalColors.neutral[200],
    gap: 16,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    lineHeight: 20,
  },
  conditionCard: {
    marginBottom: 20,
  },
  conditionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  conditionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
  },
  conditionName: {
    fontSize: 18,
    fontWeight: '600',
    color: MedicalColors.primary[600],
    marginBottom: 12,
  },
  conditionOverview: {
    fontSize: 16,
    color: MedicalColors.neutral[600],
    lineHeight: 24,
    marginBottom: 20,
  },
  expandableSections: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: MedicalColors.neutral[200],
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
  },
  sectionContent: {
    paddingVertical: 12,
    gap: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  listItemText: {
    fontSize: 14,
    color: MedicalColors.neutral[700],
    flex: 1,
    lineHeight: 20,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
    marginTop: 16,
    marginBottom: 8,
  },
  medicationItem: {
    backgroundColor: MedicalColors.neutral[50],
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.primary[600],
    marginBottom: 4,
  },
  medicationDescription: {
    fontSize: 14,
    color: MedicalColors.neutral[700],
    marginBottom: 4,
  },
  medicationExamples: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    marginBottom: 4,
  },
  medicationSideEffects: {
    fontSize: 14,
    color: MedicalColors.warning[600],
    fontStyle: 'italic',
  },
  actionButtonsContainer: {
    marginBottom: 20,
    gap: 16,
  },
  primaryActionButton: {
    shadowColor: MedicalColors.primary[500],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryActionButton: {
    flex: 1,
  },
  trustSection: {
    padding: 16,
    backgroundColor: MedicalColors.success[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: MedicalColors.success[200],
  },
  trustSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: MedicalColors.success[900],
    marginBottom: 8,
  },
  trustSectionText: {
    fontSize: 14,
    color: MedicalColors.success[700],
    lineHeight: 20,
    marginBottom: 16,
  },
  sources: {
    gap: 4,
  },
  sourcesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: MedicalColors.success[800],
    marginBottom: 8,
  },
  sourcesText: {
    fontSize: 12,
    color: MedicalColors.success[700],
    lineHeight: 18,
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
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  topicText: {
    fontSize: 14,
    color: MedicalColors.neutral[700],
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: MedicalColors.neutral[200],
  },
});

// Default export for Expo Router
export default function MedicalEducationScreen() {
  return (
      <MedicalEducation />
  );
}