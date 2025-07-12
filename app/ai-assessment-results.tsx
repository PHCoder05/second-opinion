import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol, Card, Button } from '@/components/ui';
import { MedicalColors } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

// Mock assessment data - in real app this would come from the AI analysis
const ASSESSMENT_DATA = {
  confidence: 85,
  primaryConditions: [
    {
      id: 'hypertension',
      name: 'Essential Hypertension',
      probability: 78,
      severity: 'Moderate',
      description: 'High blood pressure without an identifiable cause',
      symptoms: ['Headache', 'Dizziness', 'Chest Pain'],
      recommendations: [
        'Blood pressure monitoring',
        'Lifestyle modifications',
        'Dietary changes (low sodium)',
        'Regular exercise program'
      ],
      urgency: 'routine'
    },
    {
      id: 'migraine',
      name: 'Migraine Headache',
      probability: 65,
      severity: 'Moderate',
      description: 'Recurring headaches with associated symptoms',
      symptoms: ['Severe Headache', 'Nausea', 'Light Sensitivity'],
      recommendations: [
        'Keep headache diary',
        'Identify and avoid triggers',
        'Stress management techniques',
        'Consider preventive medication'
      ],
      urgency: 'routine'
    },
    {
      id: 'tension',
      name: 'Tension-Type Headache',
      probability: 52,
      severity: 'Mild',
      description: 'Common headache often related to stress or muscle tension',
      symptoms: ['Mild to Moderate Headache', 'Muscle Tension', 'Stress'],
      recommendations: [
        'Stress reduction techniques',
        'Regular sleep schedule',
        'Relaxation exercises',
        'Over-the-counter pain relievers as needed'
      ],
      urgency: 'routine'
    }
  ],
  redFlags: [
    {
      id: 'sudden_onset',
      description: 'Sudden onset of severe symptoms',
      present: false
    },
    {
      id: 'neurological',
      description: 'Neurological symptoms (weakness, numbness, speech changes)',
      present: false
    },
    {
      id: 'chest_pain',
      description: 'Chest pain with shortness of breath',
      present: true
    }
  ],
  recommendations: {
    immediate: [
      'Monitor blood pressure regularly',
      'Maintain headache diary',
      'Avoid known triggers'
    ],
    followUp: [
      'Schedule appointment with primary care physician',
      'Consider cardiology consultation',
      'Blood work including lipid panel'
    ],
    lifestyle: [
      'Reduce sodium intake',
      'Increase physical activity',
      'Manage stress levels',
      'Maintain regular sleep schedule'
    ]
  },
  nextSteps: [
    {
      id: 'consultation',
      title: 'Professional Medical Consultation',
      description: 'Get a comprehensive second opinion from our medical team',
      priority: 'high',
      timeframe: '24-48 hours'
    },
    {
      id: 'monitoring',
      title: 'Symptom Monitoring',
      description: 'Track your symptoms for better diagnosis',
      priority: 'medium',
      timeframe: 'Ongoing'
    },
    {
      id: 'tests',
      title: 'Diagnostic Tests',
      description: 'Additional tests may be recommended',
      priority: 'medium',
      timeframe: '1-2 weeks'
    }
  ]
};

const { width: screenWidth } = Dimensions.get('window');

export default function AIAssessmentResults() {
  const router = useRouter();
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [showDetailedView, setShowDetailedView] = useState(false);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return MedicalColors.error[600];
      case 'soon':
        return MedicalColors.warning[600];
      case 'routine':
        return MedicalColors.success[600];
      default:
        return MedicalColors.neutral[600];
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return MedicalColors.error[600];
      case 'medium':
        return MedicalColors.warning[600];
      case 'low':
        return MedicalColors.success[600];
      default:
        return MedicalColors.neutral[600];
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return MedicalColors.success[600];
    if (confidence >= 60) return MedicalColors.warning[600];
    return MedicalColors.error[600];
  };

  const handleProceedToConsultation = () => {
    Alert.alert(
      'Proceed to Consultation',
      'Your AI assessment results will be included in your consultation for more comprehensive evaluation.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Continue',
          onPress: () => router.push('/consultation-flow')
        }
      ]
    );
  };

  const renderConfidenceSection = () => (
    <Card variant="default" padding="large" style={styles.confidenceCard}>
      <View style={styles.confidenceHeader}>
        <IconSymbol name="brain.head.profile" size={32} color={MedicalColors.primary[600]} />
        <Text style={styles.confidenceTitle}>AI Analysis Confidence</Text>
      </View>
      
      <View style={styles.confidenceContainer}>
        <View style={styles.confidenceCircle}>
          <View style={[styles.confidenceInner, { backgroundColor: getConfidenceColor(ASSESSMENT_DATA.confidence) }]}>
            <Text style={styles.confidenceValue}>{ASSESSMENT_DATA.confidence}%</Text>
          </View>
        </View>
        
        <View style={styles.confidenceDetails}>
          <Text style={styles.confidenceLabel}>Analysis Quality</Text>
          <Text style={styles.confidenceDescription}>
            {ASSESSMENT_DATA.confidence >= 80 ? 'High confidence in analysis' :
             ASSESSMENT_DATA.confidence >= 60 ? 'Moderate confidence in analysis' :
             'Low confidence - professional review recommended'}
          </Text>
          
          <View style={styles.confidenceBar}>
            <View 
              style={[
                styles.confidenceFill, 
                { 
                  width: `${ASSESSMENT_DATA.confidence}%`,
                  backgroundColor: getConfidenceColor(ASSESSMENT_DATA.confidence)
                }
              ]} 
            />
          </View>
        </View>
      </View>
    </Card>
  );

  const renderConditionCard = (condition: any, index: number) => (
    <Animated.View 
      key={condition.id} 
      entering={FadeInDown.delay(index * 100)}
      style={styles.conditionCard}
    >
      <Card variant="default" padding="large">
        <View style={styles.conditionHeader}>
          <View style={styles.conditionTitleContainer}>
            <Text style={styles.conditionName}>{condition.name}</Text>
            <View style={styles.conditionMeta}>
              <View style={[styles.probabilityBadge, { backgroundColor: `${getUrgencyColor(condition.urgency)}20` }]}>
                <Text style={[styles.probabilityText, { color: getUrgencyColor(condition.urgency) }]}>
                  {condition.probability}% match
                </Text>
              </View>
              <View style={styles.severityBadge}>
                <Text style={styles.severityText}>{condition.severity}</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.conditionDescription}>{condition.description}</Text>

        <View style={styles.symptomsContainer}>
          <Text style={styles.symptomsTitle}>Matching Symptoms:</Text>
          <View style={styles.symptomsGrid}>
            {condition.symptoms.map((symptom: string, idx: number) => (
              <View key={idx} style={styles.symptomChip}>
                <Text style={styles.symptomChipText}>{symptom}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.expandButton}
          onPress={() => setSelectedCondition(selectedCondition === condition.id ? null : condition.id)}
        >
          <Text style={styles.expandButtonText}>
            {selectedCondition === condition.id ? 'Hide Details' : 'View Recommendations'}
          </Text>
          <IconSymbol 
            name={selectedCondition === condition.id ? "chevron.up" : "chevron.down"} 
            size={16} 
            color={MedicalColors.primary[600]} 
          />
        </TouchableOpacity>

        {selectedCondition === condition.id && (
          <Animated.View entering={FadeIn.duration(300)} style={styles.conditionDetails}>
            <View style={styles.recommendationsContainer}>
              <Text style={styles.recommendationsTitle}>Recommendations:</Text>
              {condition.recommendations.map((rec: string, idx: number) => (
                <View key={idx} style={styles.recommendationItem}>
                  <IconSymbol name="checkmark.circle" size={16} color={MedicalColors.success[600]} />
                  <Text style={styles.recommendationText}>{rec}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}
      </Card>
    </Animated.View>
  );

  const renderRedFlags = () => {
    const presentRedFlags = ASSESSMENT_DATA.redFlags.filter(flag => flag.present);
    
    if (presentRedFlags.length === 0) {
      return (
        <Card variant="default" padding="large" style={styles.redFlagsCard}>
          <View style={styles.redFlagsHeader}>
            <IconSymbol name="checkmark.shield" size={32} color={MedicalColors.success[600]} />
            <Text style={styles.redFlagsTitle}>No Immediate Concerns</Text>
          </View>
          <Text style={styles.redFlagsDescription}>
            No urgent warning signs detected in your symptoms.
          </Text>
        </Card>
      );
    }

    return (
      <Card variant="default" padding="large" style={[styles.redFlagsCard, styles.redFlagsWarning]}>
        <View style={styles.redFlagsHeader}>
          <IconSymbol name="exclamationmark.triangle" size={32} color={MedicalColors.warning[600]} />
          <Text style={styles.redFlagsTitle}>Warning Signs Detected</Text>
        </View>
        <Text style={styles.redFlagsDescription}>
          Some symptoms may require immediate attention:
        </Text>
        {presentRedFlags.map((flag, index) => (
          <View key={flag.id} style={styles.redFlagItem}>
            <IconSymbol name="exclamationmark.circle" size={16} color={MedicalColors.warning[600]} />
            <Text style={styles.redFlagText}>{flag.description}</Text>
          </View>
        ))}
        <View style={styles.urgentCallToAction}>
          <Text style={styles.urgentText}>Consider seeking immediate medical attention</Text>
        </View>
      </Card>
    );
  };

  const renderRecommendations = () => (
    <Card variant="default" padding="large" style={styles.recommendationsCard}>
      <View style={styles.recommendationsHeader}>
        <IconSymbol name="list.bullet.clipboard" size={32} color={MedicalColors.primary[600]} />
        <Text style={styles.recommendationsTitle}>Recommendations</Text>
      </View>

      <View style={styles.recommendationSection}>
        <Text style={styles.recommendationSectionTitle}>Immediate Actions:</Text>
        {ASSESSMENT_DATA.recommendations.immediate.map((rec, index) => (
          <View key={index} style={styles.recommendationItem}>
            <IconSymbol name="1.circle" size={16} color={MedicalColors.primary[600]} />
            <Text style={styles.recommendationText}>{rec}</Text>
          </View>
        ))}
      </View>

      <View style={styles.recommendationSection}>
        <Text style={styles.recommendationSectionTitle}>Follow-up Care:</Text>
        {ASSESSMENT_DATA.recommendations.followUp.map((rec, index) => (
          <View key={index} style={styles.recommendationItem}>
            <IconSymbol name="2.circle" size={16} color={MedicalColors.secondary[600]} />
            <Text style={styles.recommendationText}>{rec}</Text>
          </View>
        ))}
      </View>

      <View style={styles.recommendationSection}>
        <Text style={styles.recommendationSectionTitle}>Lifestyle Changes:</Text>
        {ASSESSMENT_DATA.recommendations.lifestyle.map((rec, index) => (
          <View key={index} style={styles.recommendationItem}>
            <IconSymbol name="3.circle" size={16} color={MedicalColors.accent[600]} />
            <Text style={styles.recommendationText}>{rec}</Text>
          </View>
        ))}
      </View>
    </Card>
  );

  const renderNextSteps = () => (
    <Card variant="default" padding="large" style={styles.nextStepsCard}>
      <View style={styles.nextStepsHeader}>
        <IconSymbol name="arrow.right.circle" size={32} color={MedicalColors.primary[600]} />
        <Text style={styles.nextStepsTitle}>Next Steps</Text>
      </View>

      {ASSESSMENT_DATA.nextSteps.map((step, index) => (
        <View key={step.id} style={styles.nextStepItem}>
          <View style={styles.nextStepHeader}>
            <View style={styles.nextStepTitleContainer}>
              <Text style={styles.nextStepTitle}>{step.title}</Text>
              <View style={[styles.priorityBadge, { backgroundColor: `${getPriorityColor(step.priority)}20` }]}>
                <Text style={[styles.priorityText, { color: getPriorityColor(step.priority) }]}>
                  {step.priority.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text style={styles.nextStepTimeframe}>{step.timeframe}</Text>
          </View>
          <Text style={styles.nextStepDescription}>{step.description}</Text>
        </View>
      ))}
    </Card>
  );

  const renderActionButtons = () => (
    <View style={styles.actionButtonsContainer}>
      <Button
        title="Get Professional Second Opinion"
        onPress={handleProceedToConsultation}
        variant="primary"
        size="large"
        icon="stethoscope"
        iconPosition="left"
        fullWidth
        style={styles.primaryActionButton}
      />
      
      <View style={styles.secondaryActions}>
        <Button
          title="Save Results"
          onPress={() => Alert.alert('Results Saved', 'Your assessment results have been saved to your medical records.')}
          variant="outline"
          size="medium"
          icon="square.and.arrow.down"
          iconPosition="left"
          style={styles.secondaryActionButton}
        />
        
        <Button
          title="Share Results"
          onPress={() => Alert.alert('Share Results', 'Share your results with your healthcare provider.')}
          variant="outline"
          size="medium"
          icon="square.and.arrow.up"
          iconPosition="left"
          style={styles.secondaryActionButton}
        />
      </View>
    </View>
  );

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
          <Text style={styles.headerTitle}>AI Assessment Results</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInUp.duration(500)}>
            <View style={styles.introSection}>
              <Text style={styles.introTitle}>Your Symptom Analysis</Text>
              <Text style={styles.introDescription}>
                Based on your symptoms, our AI has identified potential conditions and recommendations. 
                This is a preliminary assessment - professional medical consultation is recommended.
              </Text>
            </View>
          </Animated.View>

          {renderConfidenceSection()}
          {renderRedFlags()}

          <Animated.View entering={FadeInUp.delay(300)}>
            <View style={styles.conditionsSection}>
              <Text style={styles.sectionTitle}>Potential Conditions</Text>
              <Text style={styles.sectionDescription}>
                Conditions are ranked by probability based on your symptoms
              </Text>
              
              {ASSESSMENT_DATA.primaryConditions.map((condition, index) => 
                renderConditionCard(condition, index)
              )}
            </View>
          </Animated.View>

          {renderRecommendations()}
          {renderNextSteps()}
          {renderActionButtons()}

          <View style={styles.disclaimer}>
            <IconSymbol name="exclamationmark.circle" size={20} color={MedicalColors.warning[600]} />
            <Text style={styles.disclaimerText}>
              This AI assessment is for informational purposes only and should not replace professional medical advice. 
              Always consult with a healthcare provider for proper diagnosis and treatment.
            </Text>
          </View>
        </ScrollView>
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
  confidenceCard: {
    marginBottom: 20,
  },
  confidenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  confidenceTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  confidenceCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: MedicalColors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  confidenceInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confidenceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  confidenceDetails: {
    flex: 1,
  },
  confidenceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
    marginBottom: 4,
  },
  confidenceDescription: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    marginBottom: 12,
  },
  confidenceBar: {
    height: 8,
    backgroundColor: MedicalColors.neutral[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 4,
  },
  redFlagsCard: {
    marginBottom: 20,
  },
  redFlagsWarning: {
    borderWidth: 2,
    borderColor: MedicalColors.warning[300],
  },
  redFlagsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  redFlagsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
  },
  redFlagsDescription: {
    fontSize: 16,
    color: MedicalColors.neutral[600],
    marginBottom: 16,
    lineHeight: 24,
  },
  redFlagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  redFlagText: {
    fontSize: 14,
    color: MedicalColors.neutral[700],
    flex: 1,
  },
  urgentCallToAction: {
    backgroundColor: MedicalColors.warning[50],
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  urgentText: {
    fontSize: 14,
    fontWeight: '600',
    color: MedicalColors.warning[700],
    textAlign: 'center',
  },
  conditionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: MedicalColors.neutral[900],
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 16,
    color: MedicalColors.neutral[600],
    marginBottom: 20,
    lineHeight: 24,
  },
  conditionCard: {
    marginBottom: 16,
  },
  conditionHeader: {
    marginBottom: 12,
  },
  conditionTitleContainer: {
    gap: 12,
  },
  conditionName: {
    fontSize: 20,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
  },
  conditionMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  probabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  probabilityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: MedicalColors.neutral[100],
    borderRadius: 12,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
    color: MedicalColors.neutral[700],
  },
  conditionDescription: {
    fontSize: 16,
    color: MedicalColors.neutral[600],
    lineHeight: 24,
    marginBottom: 16,
  },
  symptomsContainer: {
    marginBottom: 16,
  },
  symptomsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
    marginBottom: 8,
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  symptomChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: MedicalColors.primary[100],
    borderRadius: 12,
  },
  symptomChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: MedicalColors.primary[700],
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  expandButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: MedicalColors.primary[600],
  },
  conditionDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: MedicalColors.neutral[200],
  },
  recommendationsContainer: {
    gap: 8,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
    marginBottom: 8,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 14,
    color: MedicalColors.neutral[700],
    flex: 1,
    lineHeight: 20,
  },
  recommendationsCard: {
    marginBottom: 20,
  },
  recommendationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  recommendationSection: {
    marginBottom: 20,
  },
  recommendationSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
    marginBottom: 12,
  },
  nextStepsCard: {
    marginBottom: 20,
  },
  nextStepsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  nextStepsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
  },
  nextStepItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: MedicalColors.neutral[200],
  },
  nextStepHeader: {
    marginBottom: 8,
  },
  nextStepTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  nextStepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: MedicalColors.neutral[900],
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
  },
  nextStepTimeframe: {
    fontSize: 12,
    color: MedicalColors.neutral[500],
    fontWeight: '500',
  },
  nextStepDescription: {
    fontSize: 14,
    color: MedicalColors.neutral[600],
    lineHeight: 20,
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
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 16,
    backgroundColor: MedicalColors.warning[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: MedicalColors.warning[200],
  },
  disclaimerText: {
    fontSize: 12,
    color: MedicalColors.warning[700],
    flex: 1,
    lineHeight: 18,
  },
}); 