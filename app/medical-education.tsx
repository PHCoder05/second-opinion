import { IconSymbol } from '@/components/ui/IconSymbol';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

interface MedicalCondition {
  id: string;
  name: string;
  category: string;
  overview: string;
  causes: string[];
  symptoms: string[];
  diagnosis: {
    criteria: string[];
    tests: string[];
    differentialDiagnosis: string[];
  };
  treatment: {
    firstLine: string[];
    alternatives: string[];
    lifestyle: string[];
  };
  prognosis: string;
  prevention: string[];
  textbookReference: string;
  crossVerification: string[];
}

const MedicalEducationScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCondition, setSelectedCondition] = useState<MedicalCondition | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  // Example medical conditions with standardized textbook knowledge
  const medicalConditions: MedicalCondition[] = [
    {
      id: 'malaria',
      name: 'Malaria',
      category: 'Infectious Disease',
      overview: 'Malaria is a life-threatening disease caused by parasites that are transmitted to people through the bites of infected female Anopheles mosquitoes. It is preventable and curable.',
      causes: [
        'Plasmodium falciparum (most severe)',
        'Plasmodium vivax',
        'Plasmodium ovale',
        'Plasmodium malariae',
        'Plasmodium knowlesi'
      ],
      symptoms: [
        'Fever (often cyclical)',
        'Chills and sweats',
        'Headache',
        'Nausea and vomiting',
        'Muscle aches',
        'Fatigue',
        'Anemia (in severe cases)',
        'Jaundice (in severe cases)'
      ],
      diagnosis: {
        criteria: [
          'Clinical symptoms consistent with malaria',
          'History of travel to endemic area',
          'Microscopic confirmation of parasites',
          'Rapid diagnostic test (RDT) positive'
        ],
        tests: [
          'Blood smear microscopy (gold standard)',
          'Rapid diagnostic tests (RDTs)',
          'PCR (for species identification)',
          'Complete blood count',
          'Liver function tests'
        ],
        differentialDiagnosis: [
          'Typhoid fever',
          'Dengue fever',
          'Viral hepatitis',
          'Bacterial sepsis',
          'Influenza'
        ]
      },
      treatment: {
        firstLine: [
          'Artemisinin-based combination therapy (ACT) for uncomplicated P. falciparum',
          'Chloroquine for P. vivax (if sensitive)',
          'Primaquine for P. vivax/ovale (liver stages)'
        ],
        alternatives: [
          'Quinine + doxycycline for severe cases',
          'Artesunate for severe malaria',
          'Mefloquine (where appropriate)'
        ],
        lifestyle: [
          'Complete the full course of medication',
          'Rest and adequate hydration',
          'Paracetamol for fever management',
          'Avoid alcohol during treatment'
        ]
      },
      prognosis: 'Excellent with prompt diagnosis and appropriate treatment. Untreated P. falciparum malaria can be fatal within 24-48 hours.',
      prevention: [
        'Use insecticide-treated bed nets',
        'Apply insect repellent',
        'Wear long-sleeved clothing',
        'Chemoprophylaxis for travelers',
        'Indoor residual spraying'
      ],
      textbookReference: 'Harrison\'s Principles of Internal Medicine, 21st Edition, Chapter 229',
      crossVerification: [
        'WHO Guidelines for Malaria Treatment',
        'CDC Malaria Treatment Guidelines',
        'Cochrane Reviews on Antimalarial Drugs'
      ]
    },
    {
      id: 'hypertension',
      name: 'Hypertension',
      category: 'Cardiovascular Disease',
      overview: 'Hypertension is a chronic medical condition in which blood pressure in the arteries is persistently elevated. It is a major risk factor for cardiovascular disease.',
      causes: [
        'Primary (essential) hypertension - unknown cause (90-95%)',
        'Secondary hypertension - kidney disease, endocrine disorders',
        'Genetic factors',
        'Lifestyle factors (diet, exercise, stress)',
        'Age-related vascular changes'
      ],
      symptoms: [
        'Often asymptomatic ("silent killer")',
        'Headaches (severe cases)',
        'Shortness of breath',
        'Chest pain',
        'Visual changes',
        'Nosebleeds (rare)',
        'Dizziness'
      ],
      diagnosis: {
        criteria: [
          'Systolic BP ≥140 mmHg or Diastolic BP ≥90 mmHg',
          'Confirmed on multiple occasions',
          'Proper measurement technique',
          'Rule out white coat hypertension'
        ],
        tests: [
          'Blood pressure measurement (multiple readings)',
          'Ambulatory blood pressure monitoring',
          'Electrocardiogram (ECG)',
          'Echocardiogram',
          'Blood tests (kidney function, electrolytes)',
          'Urinalysis'
        ],
        differentialDiagnosis: [
          'White coat hypertension',
          'Masked hypertension',
          'Secondary causes of hypertension',
          'Measurement errors'
        ]
      },
      treatment: {
        firstLine: [
          'ACE inhibitors or ARBs',
          'Calcium channel blockers',
          'Thiazide diuretics',
          'Beta-blockers (specific indications)'
        ],
        alternatives: [
          'Combination therapy',
          'Aldosterone antagonists',
          'Alpha-blockers',
          'Central-acting agents'
        ],
        lifestyle: [
          'DASH diet (low sodium, high potassium)',
          'Regular aerobic exercise',
          'Weight management',
          'Limit alcohol consumption',
          'Stress management',
          'Smoking cessation'
        ]
      },
      prognosis: 'Excellent with proper management. Reduces risk of stroke, heart attack, and kidney disease by 20-40%.',
      prevention: [
        'Maintain healthy weight',
        'Regular physical activity',
        'Healthy diet (low sodium)',
        'Limit alcohol',
        'Don\'t smoke',
        'Manage stress'
      ],
      textbookReference: 'Braunwald\'s Heart Disease, 12th Edition, Chapter 26',
      crossVerification: [
        'AHA/ACC Hypertension Guidelines',
        'ESC/ESH Hypertension Guidelines',
        'JNC 8 Guidelines'
      ]
    }
  ];

  const filteredConditions = medicalConditions.filter(condition =>
    condition.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    condition.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConditionSelect = (condition: MedicalCondition) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedCondition(condition);
    setModalVisible(true);
    setActiveSection('overview');
  };

  const renderConditionCard = (condition: MedicalCondition) => (
    <TouchableOpacity
      key={condition.id}
      style={styles.conditionCard}
      onPress={() => handleConditionSelect(condition)}
    >
      <View style={styles.conditionHeader}>
        <Text style={styles.conditionName}>{condition.name}</Text>
        <Text style={styles.conditionCategory}>{condition.category}</Text>
      </View>
      <Text style={styles.conditionOverview} numberOfLines={3}>
        {condition.overview}
      </Text>
      <View style={styles.conditionFooter}>
        <View style={styles.verificationBadge}>
          <IconSymbol name="checkmark.seal" size={16} color="rgb(34, 197, 94)" />
          <Text style={styles.verificationText}>Textbook Verified</Text>
        </View>
        <IconSymbol name="chevron.right" size={20} color="rgb(132, 204, 22)" />
      </View>
    </TouchableOpacity>
  );

  const renderSectionContent = () => {
    if (!selectedCondition) return null;

    switch (activeSection) {
      case 'overview':
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionText}>{selectedCondition.overview}</Text>
            <View style={styles.causesContainer}>
              <Text style={styles.subSectionTitle}>Causes:</Text>
              {selectedCondition.causes.map((cause, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.listBullet}>•</Text>
                  <Text style={styles.listText}>{cause}</Text>
                </View>
              ))}
            </View>
          </View>
        );
      
      case 'symptoms':
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.subSectionTitle}>Clinical Presentation:</Text>
            {selectedCondition.symptoms.map((symptom, index) => (
              <View key={index} style={styles.symptomItem}>
                <IconSymbol name="checkmark.circle" size={16} color="rgb(132, 204, 22)" />
                <Text style={styles.symptomText}>{symptom}</Text>
              </View>
            ))}
          </View>
        );
      
      case 'diagnosis':
        return (
          <View style={styles.sectionContent}>
            <View style={styles.diagnosisSection}>
              <Text style={styles.subSectionTitle}>Diagnostic Criteria:</Text>
              {selectedCondition.diagnosis.criteria.map((criteria, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.listNumber}>{index + 1}.</Text>
                  <Text style={styles.listText}>{criteria}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.diagnosisSection}>
              <Text style={styles.subSectionTitle}>Diagnostic Tests:</Text>
              {selectedCondition.diagnosis.tests.map((test, index) => (
                <View key={index} style={styles.testItem}>
                  <IconSymbol name="testtube.2" size={16} color="rgb(59, 130, 246)" />
                  <Text style={styles.testText}>{test}</Text>
                </View>
              ))}
            </View>
          </View>
        );
      
      case 'treatment':
        return (
          <View style={styles.sectionContent}>
            <View style={styles.treatmentSection}>
              <Text style={styles.subSectionTitle}>First-Line Treatment:</Text>
              {selectedCondition.treatment.firstLine.map((treatment, index) => (
                <View key={index} style={styles.treatmentItem}>
                  <IconSymbol name="pills" size={16} color="rgb(132, 204, 22)" />
                  <Text style={styles.treatmentText}>{treatment}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.treatmentSection}>
              <Text style={styles.subSectionTitle}>Lifestyle Modifications:</Text>
              {selectedCondition.treatment.lifestyle.map((lifestyle, index) => (
                <View key={index} style={styles.lifestyleItem}>
                  <IconSymbol name="heart" size={16} color="rgb(239, 68, 68)" />
                  <Text style={styles.lifestyleText}>{lifestyle}</Text>
                </View>
              ))}
            </View>
          </View>
        );
      
      case 'verification':
        return (
          <View style={styles.sectionContent}>
            <View style={styles.verificationSection}>
              <Text style={styles.subSectionTitle}>Textbook Reference:</Text>
              <Text style={styles.referenceText}>{selectedCondition.textbookReference}</Text>
            </View>
            
            <View style={styles.verificationSection}>
              <Text style={styles.subSectionTitle}>Cross-Verification Sources:</Text>
              {selectedCondition.crossVerification.map((source, index) => (
                <View key={index} style={styles.verificationItem}>
                  <IconSymbol name="doc.text.magnifyingglass" size={16} color="rgb(168, 85, 247)" />
                  <Text style={styles.verificationSourceText}>{source}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.trustNote}>
              <IconSymbol name="info.circle" size={20} color="rgb(59, 130, 246)" />
              <Text style={styles.trustNoteText}>
                This information is based on standardized medical textbooks and evidence-based guidelines, 
                ensuring consistency and reliability in medical education.
              </Text>
            </View>
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
          <Text style={styles.headerTitle}>Medical Education</Text>
          <Text style={styles.headerSubtitle}>Standardized Medical Knowledge</Text>
        </View>
        
        <TouchableOpacity style={styles.searchButton} onPress={() => {}}>
          <IconSymbol name="magnifyingglass" size={24} color="rgb(132, 204, 22)" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <IconSymbol name="magnifyingglass" size={20} color="rgb(100, 112, 103)" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search medical conditions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Introduction */}
        <Animated.View style={styles.introContainer} entering={FadeIn}>
          <Text style={styles.introTitle}>Understanding Medical Conditions</Text>
          <Text style={styles.introDescription}>
            Access standardized medical knowledge from trusted textbooks and guidelines. 
            Each condition is explained using evidence-based information that healthcare 
            professionals rely on worldwide.
          </Text>
        </Animated.View>

        {/* Conditions List */}
        <View style={styles.conditionsContainer}>
          {filteredConditions.map((condition, index) => (
            <Animated.View
              key={condition.id}
              entering={FadeInDown.delay(100 + index * 50)}
            >
              {renderConditionCard(condition)}
            </Animated.View>
          ))}
        </View>

        {/* Trust Indicators */}
        <View style={styles.trustContainer}>
          <Text style={styles.trustTitle}>Why Trust This Information?</Text>
          <View style={styles.trustItems}>
            <View style={styles.trustItem}>
              <IconSymbol name="book.closed" size={24} color="rgb(132, 204, 22)" />
              <Text style={styles.trustText}>Based on medical textbooks</Text>
            </View>
            <View style={styles.trustItem}>
              <IconSymbol name="checkmark.seal" size={24} color="rgb(132, 204, 22)" />
              <Text style={styles.trustText}>Cross-verified with guidelines</Text>
            </View>
            <View style={styles.trustItem}>
              <IconSymbol name="graduationcap" size={24} color="rgb(132, 204, 22)" />
              <Text style={styles.trustText}>Used in medical education</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Condition Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedCondition?.name}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <IconSymbol name="xmark" size={24} color="rgb(100, 112, 103)" />
            </TouchableOpacity>
          </View>
          
          {/* Section Tabs */}
          <View style={styles.tabsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'symptoms', label: 'Symptoms' },
                { id: 'diagnosis', label: 'Diagnosis' },
                { id: 'treatment', label: 'Treatment' },
                { id: 'verification', label: 'Sources' }
              ].map((tab) => (
                <TouchableOpacity
                  key={tab.id}
                  style={[
                    styles.tab,
                    activeSection === tab.id && styles.activeTab
                  ]}
                  onPress={() => setActiveSection(tab.id)}
                >
                  <Text style={[
                    styles.tabText,
                    activeSection === tab.id && styles.activeTabText
                  ]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          {/* Section Content */}
          <ScrollView style={styles.modalContent}>
            {renderSectionContent()}
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
  searchButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(132, 204, 22, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: 'rgb(49, 58, 52)',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  introContainer: {
    marginBottom: 30,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'rgb(49, 58, 52)',
    marginBottom: 10,
  },
  introDescription: {
    fontSize: 16,
    color: 'rgb(100, 112, 103)',
    lineHeight: 24,
  },
  conditionsContainer: {
    marginBottom: 30,
  },
  conditionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(132, 204, 22, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  conditionHeader: {
    marginBottom: 10,
  },
  conditionName: {
    fontSize: 18,
    fontWeight: '700',
    color: 'rgb(49, 58, 52)',
  },
  conditionCategory: {
    fontSize: 14,
    color: 'rgb(132, 204, 22)',
    fontWeight: '500',
    marginTop: 2,
  },
  conditionOverview: {
    fontSize: 16,
    color: 'rgb(100, 112, 103)',
    lineHeight: 24,
    marginBottom: 15,
  },
  conditionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verificationText: {
    fontSize: 12,
    color: 'rgb(34, 197, 94)',
    fontWeight: '500',
  },
  trustContainer: {
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
    marginBottom: 15,
  },
  trustItems: {
    gap: 12,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trustText: {
    fontSize: 16,
    color: 'rgb(49, 58, 52)',
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
    fontSize: 20,
    fontWeight: '700',
    color: 'rgb(49, 58, 52)',
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginHorizontal: 5,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: 'rgb(132, 204, 22)',
  },
  tabText: {
    fontSize: 16,
    color: 'rgb(100, 112, 103)',
  },
  activeTabText: {
    color: 'rgb(132, 204, 22)',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionContent: {
    paddingVertical: 20,
  },
  sectionText: {
    fontSize: 16,
    color: 'rgb(49, 58, 52)',
    lineHeight: 24,
    marginBottom: 20,
  },
  subSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgb(49, 58, 52)',
    marginBottom: 12,
  },
  causesContainer: {
    marginTop: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  listBullet: {
    fontSize: 16,
    color: 'rgb(132, 204, 22)',
    marginRight: 8,
    marginTop: 2,
  },
  listNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgb(132, 204, 22)',
    marginRight: 8,
    marginTop: 2,
  },
  listText: {
    fontSize: 16,
    color: 'rgb(49, 58, 52)',
    flex: 1,
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  symptomText: {
    fontSize: 16,
    color: 'rgb(49, 58, 52)',
  },
  diagnosisSection: {
    marginBottom: 25,
  },
  testItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  testText: {
    fontSize: 16,
    color: 'rgb(49, 58, 52)',
  },
  treatmentSection: {
    marginBottom: 25,
  },
  treatmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  treatmentText: {
    fontSize: 16,
    color: 'rgb(49, 58, 52)',
  },
  lifestyleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  lifestyleText: {
    fontSize: 16,
    color: 'rgb(49, 58, 52)',
  },
  verificationSection: {
    marginBottom: 25,
  },
  referenceText: {
    fontSize: 16,
    color: 'rgb(59, 130, 246)',
    fontStyle: 'italic',
  },
  verificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  verificationSourceText: {
    fontSize: 16,
    color: 'rgb(49, 58, 52)',
  },
  trustNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 15,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    gap: 10,
  },
  trustNoteText: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
    flex: 1,
    lineHeight: 20,
  },
});

export default MedicalEducationScreen; 