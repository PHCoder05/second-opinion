import { IconSymbol } from '@/components/ui/IconSymbol';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
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
import Svg, { Circle, Path } from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface PainPoint {
  id: string;
  x: number;
  y: number;
  intensity: number;
  type: string;
  description: string;
}

interface SymptomData {
  painPoints: PainPoint[];
  symptoms: string[];
  duration: string;
  severity: string;
  triggers: string[];
  alleviatingFactors: string[];
  associatedSymptoms: string[];
  medicalHistory: string[];
}

const SymptomCheckerScreen = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [symptomData, setSymptomData] = useState<SymptomData>({
    painPoints: [],
    symptoms: [],
    duration: '',
    severity: '',
    triggers: [],
    alleviatingFactors: [],
    associatedSymptoms: [],
    medicalHistory: []
  });
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>('');
  const [painModalVisible, setPainModalVisible] = useState(false);
  const [tempPainPoint, setTempPainPoint] = useState<Partial<PainPoint>>({});

  const steps = [
    { id: 'pain-mapping', title: 'Pain Mapping', subtitle: 'Show us where it hurts' },
    { id: 'symptom-details', title: 'Symptom Details', subtitle: 'Describe your symptoms' },
    { id: 'duration-severity', title: 'Duration & Severity', subtitle: 'When did it start?' },
    { id: 'triggers-factors', title: 'Triggers & Relief', subtitle: 'What makes it better/worse?' },
    { id: 'associated-symptoms', title: 'Associated Symptoms', subtitle: 'Any other symptoms?' },
    { id: 'medical-history', title: 'Medical History', subtitle: 'Relevant medical background' },
    { id: 'review-submit', title: 'Review & Submit', subtitle: 'Confirm your information' }
  ];

  const painTypes = [
    { id: 'sharp', label: 'Sharp/Stabbing', color: '#ef4444' },
    { id: 'dull', label: 'Dull/Aching', color: '#f97316' },
    { id: 'burning', label: 'Burning', color: '#dc2626' },
    { id: 'throbbing', label: 'Throbbing', color: '#7c3aed' },
    { id: 'cramping', label: 'Cramping', color: '#059669' },
    { id: 'tingling', label: 'Tingling/Numbness', color: '#0ea5e9' }
  ];

  const severityLevels = [
    { id: 'mild', label: 'Mild (1-3)', description: 'Barely noticeable, doesn\'t interfere with activities', color: '#22c55e' },
    { id: 'moderate', label: 'Moderate (4-6)', description: 'Noticeable, some interference with activities', color: '#eab308' },
    { id: 'severe', label: 'Severe (7-8)', description: 'Significant pain, difficult to ignore', color: '#f97316' },
    { id: 'extreme', label: 'Extreme (9-10)', description: 'Unbearable, unable to function', color: '#ef4444' }
  ];

  const durationOptions = [
    { id: 'minutes', label: 'Minutes', description: 'Just started, less than an hour' },
    { id: 'hours', label: 'Hours', description: 'A few hours to less than a day' },
    { id: 'days', label: 'Days', description: '1-7 days' },
    { id: 'weeks', label: 'Weeks', description: '1-4 weeks' },
    { id: 'months', label: 'Months', description: 'More than a month' },
    { id: 'chronic', label: 'Chronic', description: 'Ongoing for months/years' }
  ];

  const commonSymptoms = [
    'Headache', 'Fever', 'Nausea', 'Vomiting', 'Dizziness', 'Fatigue',
    'Shortness of breath', 'Chest pain', 'Abdominal pain', 'Back pain',
    'Joint pain', 'Muscle pain', 'Cough', 'Sore throat', 'Runny nose',
    'Constipation', 'Diarrhea', 'Loss of appetite', 'Sleep problems'
  ];

  const handleBodyPartPress = (x: number, y: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTempPainPoint({ x, y, intensity: 5, type: 'dull', description: '' });
    setPainModalVisible(true);
  };

  const addPainPoint = () => {
    if (tempPainPoint.x && tempPainPoint.y) {
      const newPainPoint: PainPoint = {
        id: Date.now().toString(),
        x: tempPainPoint.x,
        y: tempPainPoint.y,
        intensity: tempPainPoint.intensity || 5,
        type: tempPainPoint.type || 'dull',
        description: tempPainPoint.description || ''
      };
      
      setSymptomData(prev => ({
        ...prev,
        painPoints: [...prev.painPoints, newPainPoint]
      }));
      
      setPainModalVisible(false);
      setTempPainPoint({});
    }
  };

  const removePainPoint = (pointId: string) => {
    setSymptomData(prev => ({
      ...prev,
      painPoints: prev.painPoints.filter(point => point.id !== pointId)
    }));
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

  const handleSubmit = () => {
    Alert.alert(
      'Assessment Complete',
      'Your symptom assessment has been recorded. Our medical team will review your information and provide guidance.',
      [
        { text: 'View Results', onPress: () => router.push('/consultation-results') },
        { text: 'Back to Dashboard', onPress: () => router.push('/(tabs)') }
      ]
    );
  };

  const renderBodyDiagram = () => (
    <View style={styles.bodyDiagramContainer}>
      <Text style={styles.instructionText}>Tap on the body diagram to mark pain locations</Text>
      <View style={styles.bodyDiagram}>
        <Svg width={250} height={400} viewBox="0 0 250 400">
          {/* Simple body outline */}
          <Path
            d="M125 20 C110 20 100 30 100 50 L100 120 L90 130 L90 180 L100 190 L100 320 L90 330 L90 380 L110 380 L110 330 L125 320 L140 330 L140 380 L160 380 L160 330 L150 320 L150 190 L160 180 L160 130 L150 120 L150 50 C150 30 140 20 125 20 Z"
            fill="#f3f4f6"
            stroke="#d1d5db"
            strokeWidth="2"
            onPress={(e) => {
              const { locationX, locationY } = e.nativeEvent;
              handleBodyPartPress(locationX, locationY);
            }}
          />
          
          {/* Head */}
          <Circle
            cx="125"
            cy="35"
            r="15"
            fill="#f3f4f6"
            stroke="#d1d5db"
            strokeWidth="2"
            onPress={(e) => {
              const { locationX, locationY } = e.nativeEvent;
              handleBodyPartPress(locationX, locationY);
            }}
          />
          
          {/* Pain points */}
          {symptomData.painPoints.map((point) => (
            <Circle
              key={point.id}
              cx={point.x}
              cy={point.y}
              r={Math.max(5, point.intensity)}
              fill={painTypes.find(p => p.id === point.type)?.color || '#ef4444'}
              opacity={0.7}
              onPress={() => removePainPoint(point.id)}
            />
          ))}
        </Svg>
      </View>
      
      {/* Pain Legend */}
      <View style={styles.painLegend}>
        <Text style={styles.legendTitle}>Pain Types:</Text>
        <View style={styles.legendItems}>
          {painTypes.map((type) => (
            <View key={type.id} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: type.color }]} />
              <Text style={styles.legendText}>{type.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderSymptomDetails = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Select Your Symptoms</Text>
      <Text style={styles.stepSubtitle}>Choose all symptoms you're experiencing</Text>
      
      <View style={styles.symptomsGrid}>
        {commonSymptoms.map((symptom) => (
          <TouchableOpacity
            key={symptom}
            style={[
              styles.symptomChip,
              symptomData.symptoms.includes(symptom) && styles.symptomChipSelected
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSymptomData(prev => ({
                ...prev,
                symptoms: prev.symptoms.includes(symptom)
                  ? prev.symptoms.filter(s => s !== symptom)
                  : [...prev.symptoms, symptom]
              }));
            }}
          >
            <Text style={[
              styles.symptomChipText,
              symptomData.symptoms.includes(symptom) && styles.symptomChipTextSelected
            ]}>
              {symptom}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.customSymptomContainer}>
        <Text style={styles.customSymptomLabel}>Other symptoms:</Text>
        <TextInput
          style={styles.customSymptomInput}
          placeholder="Describe any other symptoms..."
          multiline
          numberOfLines={3}
          value={symptomData.symptoms.find(s => !commonSymptoms.includes(s)) || ''}
          onChangeText={(text) => {
            if (text.trim()) {
              setSymptomData(prev => ({
                ...prev,
                symptoms: [...commonSymptoms.filter(s => prev.symptoms.includes(s)), text.trim()]
              }));
            }
          }}
        />
      </View>
    </View>
  );

  const renderDurationSeverity = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Duration & Severity</Text>
      <Text style={styles.stepSubtitle}>Help us understand the timeline and intensity</Text>
      
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>How long have you had these symptoms?</Text>
        <View style={styles.optionsContainer}>
          {durationOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                symptomData.duration === option.id && styles.optionCardSelected
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSymptomData(prev => ({ ...prev, duration: option.id }));
              }}
            >
              <Text style={[
                styles.optionTitle,
                symptomData.duration === option.id && styles.optionTitleSelected
              ]}>
                {option.label}
              </Text>
              <Text style={[
                styles.optionDescription,
                symptomData.duration === option.id && styles.optionDescriptionSelected
              ]}>
                {option.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>How severe are your symptoms?</Text>
        <View style={styles.optionsContainer}>
          {severityLevels.map((level) => (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.optionCard,
                symptomData.severity === level.id && styles.optionCardSelected
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSymptomData(prev => ({ ...prev, severity: level.id }));
              }}
            >
              <View style={styles.severityHeader}>
                <View style={[styles.severityIndicator, { backgroundColor: level.color }]} />
                <Text style={[
                  styles.optionTitle,
                  symptomData.severity === level.id && styles.optionTitleSelected
                ]}>
                  {level.label}
                </Text>
              </View>
              <Text style={[
                styles.optionDescription,
                symptomData.severity === level.id && styles.optionDescriptionSelected
              ]}>
                {level.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderBodyDiagram();
      case 1:
        return renderSymptomDetails();
      case 2:
        return renderDurationSeverity();
      default:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Step {currentStep + 1}</Text>
            <Text style={styles.stepSubtitle}>This step is under development</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <IconSymbol name="chevron.left" size={24} color="rgb(49, 58, 52)" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Symptom Checker</Text>
          <Text style={styles.headerSubtitle}>
            Step {currentStep + 1} of {steps.length}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.skipText}>Skip</Text>
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

      {/* Pain Point Modal */}
      <Modal
        visible={painModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPainModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Describe Your Pain</Text>
            
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Pain Type:</Text>
              <View style={styles.painTypeContainer}>
                {painTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.painTypeButton,
                      tempPainPoint.type === type.id && styles.painTypeButtonSelected
                    ]}
                    onPress={() => setTempPainPoint(prev => ({ ...prev, type: type.id }))}
                  >
                    <View style={[styles.painTypeColor, { backgroundColor: type.color }]} />
                    <Text style={[
                      styles.painTypeText,
                      tempPainPoint.type === type.id && styles.painTypeTextSelected
                    ]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Intensity (1-10):</Text>
              <View style={styles.intensityContainer}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((intensity) => (
                  <TouchableOpacity
                    key={intensity}
                    style={[
                      styles.intensityButton,
                      tempPainPoint.intensity === intensity && styles.intensityButtonSelected
                    ]}
                    onPress={() => setTempPainPoint(prev => ({ ...prev, intensity }))}
                  >
                    <Text style={[
                      styles.intensityText,
                      tempPainPoint.intensity === intensity && styles.intensityTextSelected
                    ]}>
                      {intensity}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Description (optional):</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="Describe the pain..."
                multiline
                numberOfLines={3}
                value={tempPainPoint.description}
                onChangeText={(text) => setTempPainPoint(prev => ({ ...prev, description: text }))}
              />
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setPainModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalAddButton}
                onPress={addPainPoint}
              >
                <Text style={styles.modalAddText}>Add Pain Point</Text>
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
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    color: 'rgb(132, 204, 22)',
    fontWeight: '500',
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
  },
  bodyDiagramContainer: {
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: 'rgb(100, 112, 103)',
    textAlign: 'center',
    marginBottom: 20,
  },
  bodyDiagram: {
    alignItems: 'center',
    marginBottom: 30,
  },
  painLegend: {
    width: '100%',
    backgroundColor: 'rgba(132, 204, 22, 0.05)',
    borderRadius: 12,
    padding: 15,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgb(49, 58, 52)',
    marginBottom: 10,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 5,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: 'rgb(100, 112, 103)',
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 30,
  },
  symptomChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(132, 204, 22, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(132, 204, 22, 0.3)',
  },
  symptomChipSelected: {
    backgroundColor: 'rgb(132, 204, 22)',
    borderColor: 'rgb(132, 204, 22)',
  },
  symptomChipText: {
    fontSize: 14,
    color: 'rgb(132, 204, 22)',
    fontWeight: '500',
  },
  symptomChipTextSelected: {
    color: 'white',
  },
  customSymptomContainer: {
    marginTop: 20,
  },
  customSymptomLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgb(49, 58, 52)',
    marginBottom: 10,
  },
  customSymptomInput: {
    borderWidth: 1,
    borderColor: 'rgba(132, 204, 22, 0.3)',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: 'rgb(49, 58, 52)',
    textAlignVertical: 'top',
  },
  sectionContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgb(49, 58, 52)',
    marginBottom: 15,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    padding: 16,
    backgroundColor: 'rgba(132, 204, 22, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(132, 204, 22, 0.2)',
  },
  optionCardSelected: {
    backgroundColor: 'rgba(132, 204, 22, 0.1)',
    borderColor: 'rgb(132, 204, 22)',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgb(49, 58, 52)',
    marginBottom: 4,
  },
  optionTitleSelected: {
    color: 'rgb(132, 204, 22)',
  },
  optionDescription: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
  },
  optionDescriptionSelected: {
    color: 'rgb(49, 58, 52)',
  },
  severityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  severityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: screenWidth - 40,
    maxHeight: screenHeight * 0.8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'rgb(49, 58, 52)',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgb(49, 58, 52)',
    marginBottom: 10,
  },
  painTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  painTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(132, 204, 22, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(132, 204, 22, 0.3)',
  },
  painTypeButtonSelected: {
    backgroundColor: 'rgba(132, 204, 22, 0.2)',
    borderColor: 'rgb(132, 204, 22)',
  },
  painTypeColor: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  painTypeText: {
    fontSize: 12,
    color: 'rgb(100, 112, 103)',
  },
  painTypeTextSelected: {
    color: 'rgb(49, 58, 52)',
    fontWeight: '500',
  },
  intensityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  intensityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(132, 204, 22, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(132, 204, 22, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  intensityButtonSelected: {
    backgroundColor: 'rgb(132, 204, 22)',
    borderColor: 'rgb(132, 204, 22)',
  },
  intensityText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgb(132, 204, 22)',
  },
  intensityTextSelected: {
    color: 'white',
  },
  modalTextInput: {
    borderWidth: 1,
    borderColor: 'rgba(132, 204, 22, 0.3)',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: 'rgb(49, 58, 52)',
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 10,
    backgroundColor: 'rgba(132, 204, 22, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
  },
  modalAddButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 10,
    backgroundColor: 'rgb(132, 204, 22)',
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgb(132, 204, 22)',
  },
  modalAddText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default SymptomCheckerScreen; 