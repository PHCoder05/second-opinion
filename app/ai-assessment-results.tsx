import { IconSymbol } from '@/components/ui/IconSymbol';
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

interface AssessmentResult {
  id: string;
  condition: string;
  confidence: number;
  explanation: string;
  symptoms: string[];
  recommendations: string[];
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  nextSteps: string[];
}

interface Investigation {
  id: string;
  type: string;
  name: string;
  reason: string;
  urgency: string;
  estimated_cost: string;
}

const AIAssessmentResultsScreen = () => {
  const router = useRouter();
  const [selectedResult, setSelectedResult] = useState<AssessmentResult | null>(null);
  const [explanationModalVisible, setExplanationModalVisible] = useState(false);
  const [investigationModalVisible, setInvestigationModalVisible] = useState(false);

  // Simulated AI assessment results
  const assessmentResults: AssessmentResult[] = [
    {
      id: '1',
      condition: 'Gastroesophageal Reflux Disease (GERD)',
      confidence: 87,
      explanation: 'Based on your symptoms of heartburn, chest pain after meals, and difficulty swallowing, along with the pattern of symptoms worsening when lying down, the clinical presentation is highly consistent with GERD. This is a common condition where stomach acid flows back into the esophagus.',
      symptoms: ['Heartburn after meals', 'Chest pain', 'Difficulty swallowing', 'Symptoms worse when lying down'],
      recommendations: [
        'Elevate head of bed 6-8 inches',
        'Avoid trigger foods (spicy, fatty, acidic)',
        'Eat smaller, more frequent meals',
        'Avoid eating 2-3 hours before bedtime',
        'Consider over-the-counter antacids'
      ],
      urgency: 'medium',
      nextSteps: [
        'Consult with gastroenterologist',
        'Consider upper endoscopy if symptoms persist',
        'Lifestyle modifications as first-line treatment'
      ]
    },
    {
      id: '2',
      condition: 'Anxiety-Related Chest Pain',
      confidence: 65,
      explanation: 'Your chest pain episodes, especially when associated with stress, rapid heartbeat, and shortness of breath, could be related to anxiety. However, cardiac causes should be ruled out first given the chest pain presentation.',
      symptoms: ['Chest pain during stress', 'Rapid heartbeat', 'Shortness of breath', 'Sweating'],
      recommendations: [
        'Practice deep breathing exercises',
        'Regular physical exercise',
        'Stress management techniques',
        'Consider counseling or therapy'
      ],
      urgency: 'medium',
      nextSteps: [
        'Rule out cardiac causes first',
        'EKG and basic cardiac workup',
        'Consider mental health evaluation'
      ]
    }
  ];

  const recommendedInvestigations: Investigation[] = [
    {
      id: '1',
      type: 'Imaging',
      name: 'Upper GI Endoscopy',
      reason: 'To visualize the esophagus and stomach lining, check for inflammation, ulcers, or other abnormalities',
      urgency: 'Within 2-4 weeks',
      estimated_cost: '$800-1200'
    },
    {
      id: '2',
      type: 'Laboratory',
      name: 'H. pylori Test',
      reason: 'To check for bacterial infection that can cause stomach ulcers and gastritis',
      urgency: 'Within 1 week',
      estimated_cost: '$50-100'
    },
    {
      id: '3',
      type: 'Imaging',
      name: 'Barium Swallow Study',
      reason: 'To evaluate swallowing function and check for structural abnormalities',
      urgency: 'Within 2 weeks',
      estimated_cost: '$300-500'
    }
  ];

  const handleExplainCondition = (result: AssessmentResult) => {
    setSelectedResult(result);
    setExplanationModalVisible(true);
  };

  const handleRequestSecondOpinion = () => {
    Alert.alert(
      'Request Human Review',
      'Would you like a medical doctor to review these AI results and provide additional insights?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes, Request Review ($49)', onPress: () => router.push('/doctor-review-request') }
      ]
    );
  };

  const handleScheduleInvestigation = (investigation: Investigation) => {
    Alert.alert(
      'Schedule Investigation',
      `Would you like help scheduling ${investigation.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Find Providers', onPress: () => router.push('/find-providers') },
        { text: 'Get More Info', onPress: () => setInvestigationModalVisible(true) }
      ]
    );
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'rgb(34, 197, 94)';
      case 'medium': return 'rgb(251, 204, 21)';
      case 'high': return 'rgb(249, 115, 22)';
      case 'urgent': return 'rgb(239, 68, 68)';
      default: return 'rgb(100, 112, 103)';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'rgb(34, 197, 94)';
    if (confidence >= 60) return 'rgb(251, 204, 21)';
    return 'rgb(249, 115, 22)';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color="rgb(49, 58, 52)" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>AI Assessment Results</Text>
          <Text style={styles.headerSubtitle}>Standardized Medical Analysis</Text>
        </View>
        
        <TouchableOpacity style={styles.shareButton} onPress={() => {}}>
          <IconSymbol name="square.and.arrow.up" size={24} color="rgb(132, 204, 22)" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* AI Analysis Summary */}
        <Animated.View style={styles.summaryContainer} entering={FadeIn}>
          <View style={styles.summaryHeader}>
            <IconSymbol name="brain.head.profile" size={32} color="rgb(132, 204, 22)" />
            <View style={styles.summaryHeaderText}>
              <Text style={styles.summaryTitle}>AI Medical Analysis Complete</Text>
              <Text style={styles.summarySubtitle}>
                Based on standardized medical protocols and evidence-based guidelines
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Assessment Results */}
        <View style={styles.resultsContainer}>
          <Text style={styles.sectionTitle}>Possible Conditions</Text>
          <Text style={styles.sectionSubtitle}>
            Ranked by likelihood based on your symptoms and medical history
          </Text>
          
          {assessmentResults.map((result, index) => (
            <Animated.View
              key={result.id}
              style={styles.resultCard}
              entering={FadeInDown.delay(200 + index * 100)}
            >
              <View style={styles.resultHeader}>
                <View style={styles.resultTitleContainer}>
                  <Text style={styles.resultCondition}>{result.condition}</Text>
                  <View style={styles.confidenceContainer}>
                    <View style={[
                      styles.confidenceBar,
                      { backgroundColor: getConfidenceColor(result.confidence) }
                    ]}>
                      <View style={[
                        styles.confidenceFill,
                        { width: `${result.confidence}%` }
                      ]} />
                    </View>
                    <Text style={[
                      styles.confidenceText,
                      { color: getConfidenceColor(result.confidence) }
                    ]}>
                      {result.confidence}% confidence
                    </Text>
                  </View>
                </View>
                
                <View style={[
                  styles.urgencyBadge,
                  { backgroundColor: getUrgencyColor(result.urgency) }
                ]}>
                  <Text style={styles.urgencyText}>{result.urgency.toUpperCase()}</Text>
                </View>
              </View>

              <Text style={styles.resultExplanation}>{result.explanation}</Text>

              <View style={styles.resultActions}>
                <TouchableOpacity
                  style={styles.explainButton}
                  onPress={() => handleExplainCondition(result)}
                >
                  <IconSymbol name="info.circle" size={20} color="rgb(59, 130, 246)" />
                  <Text style={styles.explainButtonText}>Explain This</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.symptomMatchButton}
                  onPress={() => {}}
                >
                  <IconSymbol name="checkmark.circle" size={20} color="rgb(34, 197, 94)" />
                  <Text style={styles.symptomMatchButtonText}>View Symptom Match</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* Recommended Investigations */}
        <View style={styles.investigationsContainer}>
          <Text style={styles.sectionTitle}>Recommended Investigations</Text>
          <Text style={styles.sectionSubtitle}>
            Based on medical protocols for your symptoms
          </Text>
          
          {recommendedInvestigations.map((investigation, index) => (
            <Animated.View
              key={investigation.id}
              style={styles.investigationCard}
              entering={FadeInDown.delay(400 + index * 100)}
            >
              <View style={styles.investigationHeader}>
                <View style={styles.investigationIcon}>
                  <IconSymbol 
                    name={investigation.type === 'Imaging' ? 'camera.fill' : 'testtube.2'} 
                    size={24} 
                    color="rgb(168, 85, 247)" 
                  />
                </View>
                <View style={styles.investigationInfo}>
                  <Text style={styles.investigationName}>{investigation.name}</Text>
                  <Text style={styles.investigationUrgency}>{investigation.urgency}</Text>
                </View>
                <Text style={styles.investigationCost}>{investigation.estimated_cost}</Text>
              </View>
              
              <Text style={styles.investigationReason}>{investigation.reason}</Text>
              
              <TouchableOpacity
                style={styles.scheduleButton}
                onPress={() => handleScheduleInvestigation(investigation)}
              >
                <Text style={styles.scheduleButtonText}>Schedule Investigation</Text>
                <IconSymbol name="calendar.badge.plus" size={16} color="white" />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Trust and Verification */}
        <View style={styles.trustContainer}>
          <Text style={styles.trustTitle}>How We Ensure Accuracy</Text>
          <View style={styles.trustItems}>
            <View style={styles.trustItem}>
              <IconSymbol name="checkmark.seal" size={24} color="rgb(34, 197, 94)" />
              <Text style={styles.trustText}>Evidence-based medical protocols</Text>
            </View>
            <View style={styles.trustItem}>
              <IconSymbol name="doc.text.magnifyingglass" size={24} color="rgb(34, 197, 94)" />
              <Text style={styles.trustText}>Cross-referenced with medical literature</Text>
            </View>
            <View style={styles.trustItem}>
              <IconSymbol name="brain.head.profile" size={24} color="rgb(34, 197, 94)" />
              <Text style={styles.trustText}>AI trained on millions of medical cases</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.secondOpinionButton}
            onPress={handleRequestSecondOpinion}
          >
            <IconSymbol name="person.2.fill" size={20} color="white" />
            <Text style={styles.secondOpinionButtonText}>Get Doctor Review</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => router.push('/medical-records')}
          >
            <IconSymbol name="square.and.arrow.down" size={20} color="rgb(132, 204, 22)" />
            <Text style={styles.saveButtonText}>Save to Records</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Explanation Modal */}
      <Modal
        visible={explanationModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setExplanationModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Medical Explanation</Text>
            <TouchableOpacity onPress={() => setExplanationModalVisible(false)}>
              <IconSymbol name="xmark" size={24} color="rgb(100, 112, 103)" />
            </TouchableOpacity>
          </View>
          
          {selectedResult && (
            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalConditionTitle}>{selectedResult.condition}</Text>
              
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>What is this condition?</Text>
                <Text style={styles.modalSectionText}>{selectedResult.explanation}</Text>
              </View>
              
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Your symptoms that match:</Text>
                {selectedResult.symptoms.map((symptom, index) => (
                  <View key={index} style={styles.symptomItem}>
                    <IconSymbol name="checkmark.circle.fill" size={16} color="rgb(34, 197, 94)" />
                    <Text style={styles.symptomText}>{symptom}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Recommended actions:</Text>
                {selectedResult.recommendations.map((rec, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <Text style={styles.recommendationNumber}>{index + 1}.</Text>
                    <Text style={styles.recommendationText}>{rec}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Next steps:</Text>
                {selectedResult.nextSteps.map((step, index) => (
                  <View key={index} style={styles.nextStepItem}>
                    <IconSymbol name="arrow.right.circle" size={16} color="rgb(132, 204, 22)" />
                    <Text style={styles.nextStepText}>{step}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
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
  shareButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  summaryContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(132, 204, 22, 0.1)',
    borderRadius: 16,
  },
  summaryHeaderText: {
    flex: 1,
    marginLeft: 15,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'rgb(49, 58, 52)',
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
  },
  resultsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: 'rgb(49, 58, 52)',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: 'rgb(100, 112, 103)',
    marginBottom: 20,
  },
  resultCard: {
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
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  resultTitleContainer: {
    flex: 1,
  },
  resultCondition: {
    fontSize: 18,
    fontWeight: '700',
    color: 'rgb(49, 58, 52)',
    marginBottom: 8,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceBar: {
    width: 60,
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 2,
    marginRight: 8,
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 2,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
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
  resultExplanation: {
    fontSize: 16,
    color: 'rgb(100, 112, 103)',
    lineHeight: 24,
    marginBottom: 15,
  },
  resultActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  explainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 20,
    gap: 6,
  },
  explainButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgb(59, 130, 246)',
  },
  symptomMatchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 20,
    gap: 6,
  },
  symptomMatchButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgb(34, 197, 94)',
  },
  investigationsContainer: {
    marginBottom: 30,
  },
  investigationCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  investigationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  investigationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  investigationInfo: {
    flex: 1,
  },
  investigationName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgb(49, 58, 52)',
  },
  investigationUrgency: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
  },
  investigationCost: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgb(168, 85, 247)',
  },
  investigationReason: {
    fontSize: 14,
    color: 'rgb(100, 112, 103)',
    lineHeight: 20,
    marginBottom: 15,
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: 'rgb(168, 85, 247)',
    borderRadius: 12,
    gap: 8,
  },
  scheduleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  trustContainer: {
    padding: 20,
    backgroundColor: 'rgba(34, 197, 94, 0.05)',
    borderRadius: 16,
    marginBottom: 30,
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
  actionContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  secondOpinionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: 'rgb(132, 204, 22)',
    borderRadius: 12,
    gap: 8,
  },
  secondOpinionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: 'rgba(132, 204, 22, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgb(132, 204, 22)',
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgb(132, 204, 22)',
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
  modalConditionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'rgb(49, 58, 52)',
    marginVertical: 20,
  },
  modalSection: {
    marginBottom: 25,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgb(49, 58, 52)',
    marginBottom: 12,
  },
  modalSectionText: {
    fontSize: 16,
    color: 'rgb(100, 112, 103)',
    lineHeight: 24,
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
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recommendationNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgb(132, 204, 22)',
    marginRight: 8,
    marginTop: 2,
  },
  recommendationText: {
    fontSize: 16,
    color: 'rgb(49, 58, 52)',
    flex: 1,
  },
  nextStepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  nextStepText: {
    fontSize: 16,
    color: 'rgb(49, 58, 52)',
  },
});

export default AIAssessmentResultsScreen; 